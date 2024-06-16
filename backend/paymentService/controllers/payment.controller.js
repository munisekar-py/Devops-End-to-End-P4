const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/payment.model");
const ProjectContent = require("../models/projectContent.model");
const {
  sendDownloadLinkEmail,
  sendAllDownloadLinksEmail,
} = require("../utils/emailTemplates");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const AWS = require("aws-sdk");
const s3Client = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.streamContent = async (req, res) => {
  const { paymentId } = req.params;
  console.log("Key received: ", paymentId);
  const userEmail = req.query.email;
  const clientIP =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    const paymentDetails = await Payment.findById(paymentId);
    if (paymentDetails.downloadCount > 10) {
      res
        .status(404)
        .send(
          "You have exceeded the download number of 10. You have to repurchase."
        );
    } else {
      console.log("PaymentDetails: ", paymentDetails);
      const projectContent = await ProjectContent.findOne({
        projectId: paymentDetails.projectId,
      });
      console.log("projectContent: ", projectContent);
      if (!projectContent) {
        return res.status(404).send("Project content not found.");
      }

      // Update the Payment model with download count and IP
      const updatedPayment = await Payment.findOneAndUpdate(
        { _id: paymentId },
        {
          $inc: { downloadCount: 1 },
          $push: { downloadIPs: clientIP },
        },
        { new: true }
      );

      if (!updatedPayment) {
        return res
          .status(404)
          .send("Payment record not found or download not authorized.");
      }

      // Set up the parameters to get the object from S3
      const downloadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: extractS3Key(projectContent.downloadLink), // Assuming this is the key in the S3 bucket
      };

      // Set response headers
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + projectContent.downloadLink.split("/").pop()
      );

      // Stream the data from S3 to the response
      const dataStream = s3Client.getObject(downloadParams).createReadStream();
      dataStream.on("error", function (err) {
        console.error("Error streaming file from S3", err);
        res.status(500).send("Failed to download file");
      });

      dataStream.pipe(res);
    }
  } catch (error) {
    console.error("Error in streaming content", error);
    res.status(500).send("Failed to process download");
  }
};

// Create an order
exports.createOrder = async (req, res) => {
  try {
    const payment_capture = 1;
    const amount = req.body.amount;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: `rcpt_${Date.now()}`,
      payment_capture,
    };

    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
};

function extractS3Key(url) {
  const urlObject = new URL(url);
  const path = urlObject.pathname;

  // Remove the leading slash if present
  const key = path.startsWith("/") ? path.substring(1) : path;
  return key;
}

// Verify payment
exports.verifyPayment = async (req, res) => {
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    user,
  } = req.body;

  try {
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    const newPayment = await Payment.create({
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      amountPaid: user.amount,
      projectId: user.projectId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      paymentStatus: "success",
      paymentDateTime: new Date(),
    });

    // Fetch the download link
    const projectContent = await ProjectContent.findOne({
      projectId: user.projectId,
    });
    const paymentId = newPayment._id;
    // const key = extractS3Key(projectContent.downloadLink)
    // const dwnLink = `${req.protocol}://${req.get('host')}/api/payment/stream/${key}`
    const dwnLink = `${req.protocol}://${req.get(
      "host"
    )}/api/payment/stream/${paymentId}`;
    if (projectContent) {
      await sendDownloadLinkEmail(user.email, dwnLink, razorpayPaymentId);
      res.json({
        msg: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        paymentRecordId: newPayment._id,
        downloadLink: dwnLink,
      });
    } else {
      res
        .status(404)
        .send({ message: "Download link not found for this project." });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).send(error);
  }
};

exports.sendAllDownloadLinks = async (req, res) => {
  const userEmail = req.body.email;

  try {
    // Fetch all successful payment entries for the user
    const payments = await Payment.find({
      userEmail: userEmail,
      paymentStatus: "success",
    });

    // Extract project IDs from payments
    // const projectIds = payments.map(payment => payment.projectId.toString());
    const paymentIds = [];
    payments.map((paymentId) => {
      paymentId._id;
      paymentIds.push(paymentId._id.toString());
      console.log("paymentId: ", paymentId._id.toString());
    });
    console.log("paymentIds: ", paymentIds);

    if (paymentIds.length > 0) {
      // Pass the project IDs to the email function
      await sendAllDownloadLinksEmail(userEmail, paymentIds);
      res.json({ message: "Download links sent successfully!" });
    } else {
      res.status(404).json({ message: "No projects found for this user." });
    }
  } catch (error) {
    console.error("Error sending download links:", error);
    res
      .status(500)
      .send({ error: "Error retrieving or sending download links." });
  }
};
