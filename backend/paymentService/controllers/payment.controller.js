const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/payment.model');  

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create an order
exports.createOrder = async (req, res) => {
    try {
        const payment_capture = 1;
        const amount = req.body.amount; 
        const currency = 'INR';

        const options = {
            amount: amount * 100, 
            currency,
            receipt: `rcpt_${Date.now()}`,
            payment_capture
        };

        const response = await razorpay.orders.create(options);
        console.log(response);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating order");
    }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
    console.log('Payment Verification Started: ', req.body)
    const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        user
    } = req.body;

    try {
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: 'Transaction not legit!' });

        const newPayment = await Payment.create({
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone,
            amountPaid: user.amount,
            projectId: user.projectId, 
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            paymentStatus: 'success',
            paymentDateTime: new Date(),
            downloadIPs: [] 
        });

        res.json({
            msg: 'success',
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            paymentRecordId: newPayment._id
        });
    } catch (error) {
        console.error('Payment verification failed:', error);
        res.status(500).send(error);
    }
};
