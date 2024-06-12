const { mongoose } = require('../utils/conn'); 
const Schema = mongoose.Schema;

const projectContentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    downloadLink: {
        type: String,
        required: true
    }
},  { timestamps: true });

const ProjectContent = mongoose.model('ProjectContent', projectContentSchema);

module.exports = ProjectContent;
