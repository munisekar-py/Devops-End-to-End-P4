const { mongoose } = require('../utils/conn'); 
const Schema = mongoose.Schema;
const paymentSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true
    },
    userPhone: {
        type: String,
        required: true,
        trim: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    paymentDateTime: {
        type: Date,
        default: Date.now
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    downloadIPs: [{
        type: String
    }],
    razorpayPaymentId: {
        type: String,
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpaySignature: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['created', 'attempted', 'failed', 'success'],
        default: 'created'
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
