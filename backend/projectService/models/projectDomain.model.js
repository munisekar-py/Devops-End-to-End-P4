const { mongoose } = require('../utils/conn');

const projectDomainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    optional: true,
    trim: true
  },
  creationDateTime: {
    type: Date,
    default: Date.now 
  }
});

const ProjectDomain = mongoose.model('ProjectDomain', projectDomainSchema);

module.exports = ProjectDomain;
