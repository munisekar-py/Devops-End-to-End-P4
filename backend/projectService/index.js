require('dotenv').config();
const express = require('express');
const cors = require('cors');
const projectDomainRoutes = require('./routes/projectDomain.route');
const projectRoutes = require('./routes/project.route')
const projectContentRoutes = require('./routes/projectContent.route')

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/projectdomain', projectDomainRoutes);
app.use('/api/projects', projectRoutes)
app.use('/api/projectcontent', projectContentRoutes)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
