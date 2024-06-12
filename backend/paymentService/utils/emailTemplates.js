const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });




async function sendDownloadLinkEmail(email, downloadLink) {
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
                    Data: `Here is your download link: ${downloadLink}`
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
    
    const streamLinks = projectIds.map(projectId => {
        return `${process.env.DOWNLOAD_URL}/api/payment/stream/${projectId}`;
    });

    const streamLinksText = streamLinks.join('\n');

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
                Text: {
                    Data: 'Here are your download links:\n\n' + streamLinksText
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