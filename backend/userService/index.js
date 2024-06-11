require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userLeadRoutes = require('./routes/userLead.route');

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/userleads', userLeadRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
