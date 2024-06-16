const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });




async function sendDownloadLinkEmail(email, downloadLink, razorpayPaymentId) {
    const params = {
        Source: 'noreply@prashantdey.in', 
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Subject: {
                Data: 'Download Link for Your Purchased Project'
            },
            Body: {
                Text: {
                    Data: `Here is your download link: ${downloadLink}. 
                    Remember, you can only download it 10 times. So keep the project carefully.
                    Your Razorpay PaymentId is: ${razorpayPaymentId}.`
                }
            }
        }
    };

    try {
        await ses.sendEmail(params).promise();
        console.log('Email sent successfully');
    } catch (err) {
        console.error('Failed to send email:', err);
    }
}


async function sendAllDownloadLinksEmail(email, projectIds) {
    // Construct streaming URLs
    const baseUrl = process.env.DOWNLOAD_URL || "https://api.yourdomain.com";
    const streamLinks = projectIds.map(projectId => {
        return `<tr><td>${projectId}</td><td><a href="${baseUrl}/api/payment/stream/${projectId}">Download</a></td></tr>`;
    });

    // Join all links into an HTML table
    const streamLinksTable = `
        <table border="1" style="width:100%; border-collapse: collapse;">
            <tr>
                <th>Project</th>
                <th>Link</th>
            </tr>
            ${streamLinks.join('')}
        </table>`;

    const params = {
        Source: 'noreply@prashantdey.in',
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Subject: {
                Data: 'Your Download Links'
            },
            Body: {
                Html: {
                    Data: `
                        <html>
                            <head>
                                <style>
                                    table, th, td {
                                        border: 1px solid black;
                                        border-collapse: collapse;
                                    }
                                    th, td {
                                        padding: 10px;
                                        text-align: left;
                                    }
                                </style>
                            </head>
                            <body>
                                <h4>Here are your download links:</h4>
                                ${streamLinksTable}
                            </body>
                        </html>`
                }
            }
        }
    };

    try {
        await ses.sendEmail(params).promise();
        console.log('Email sent successfully');
    } catch (err) {
        console.error('Failed to send email:', err);
        throw err;
    }
}


module.exports = { sendDownloadLinkEmail, sendAllDownloadLinksEmail }