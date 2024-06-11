const { mongoose } = require('../utils/conn'); 
const Schema = mongoose.Schema;

const subProjectSchema = new Schema({
    projectName: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    toolsUsed: [String], 
    timeToWorkOnProject: {
        type: Number, 
        required: true
    }
});

const projectSchema = new Schema({
    projectTitle: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false 
    },
    pricing: {
        type: Number,
        required: true
    },
    projectDomain: {
        type: Schema.Types.ObjectId,
        ref: 'ProjectDomain',
        required: true
    },
    keyWords: [String], 
    noOfSubProjects: {
        type: Number,
        default: 0
    },
    subProjects: [subProjectSchema] 
}, {
    timestamps: true 
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
