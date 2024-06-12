require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());
const paymentRoutes = require('./routes/payment.route')

app.use('/api/payment', paymentRoutes);


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
