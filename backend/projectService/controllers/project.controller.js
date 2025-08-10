const Project = require('../models/project.model');
const redisClient = require('../utils/redisClient');
const { upload } = require('../utils/s3config');
const { S3 } = require('@aws-sdk/client-s3');

const s3Client = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION
});

// Function to stream image from S3
exports.streamImage = async (req, res) => {
    const { key } = req.params;  

    try {
        const downloadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        };

        const data = await s3Client.getObject(downloadParams);
        data.Body.pipe(res);  
    } catch (error) {
        console.error("Error streaming file from S3", error);
        res.status(500).send("Failed to download image");
    }
};



exports.createProject = async (req, res) => {
  try {
    let subProjects = [];
    if (Array.isArray(req.body.subProjects)) {
      subProjects = req.body.subProjects;
    } else if (typeof req.body.subProjects === 'string' && req.body.subProjects.trim()) {
      try { subProjects = JSON.parse(req.body.subProjects); } catch (e) { }
    }

    let keyWords = [];
    if (Array.isArray(req.body.keyWords)) {
      keyWords = req.body.keyWords;
    } else if (typeof req.body.keyWords === 'string') {
      keyWords = req.body.keyWords.split(',').map(s => s.trim()).filter(Boolean);
    }

    const project = new Project({
      projectTitle: req.body.projectTitle,
      description: req.body.description,
      imageUrl: req.file ? req.file.location : null,
      pricing: req.body.pricing,
      projectDomain: req.body.projectDomain,
      keyWords,
      noOfSubProjects: subProjects.length,
      subProjects
    });

    await project.save();
    return res.status(201).send(project);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};


// Update an existing project
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!project) {
      return res.status(404).send('Project not found.');
    }
    res.status(200).send(project);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).send('Project not found.');
    }
    res.status(200).send({ message: 'Project successfully deleted' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        const modifiedProjects = projects.map(project => {
            if (project.imageUrl) {
                const imageKey = new URL(project.imageUrl).pathname.split('/').pop();
                project.imageUrl = `${req.protocol}://${req.get('host')}/api/projects/images/${imageKey}`;
            }
            return project;
        });
        res.status(200).send(modifiedProjects);
    } catch (error) {
        console.error("Failed to retrieve projects", error);
        res.status(500).send(error.message);
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const {projectId} = req.params
        const project = await Project.findById(projectId);
        console.log('Project: ', project)
        if (project.imageUrl) {
            const imageKey = new URL(project.imageUrl).pathname.split('/').pop();
            project.imageUrl = `${req.protocol}://${req.get('host')}/api/projects/images/${imageKey}`;
        }
        res.status(200).send(project);
    } catch (error) {
        console.error("Failed to retrieve projects", error);
        res.status(500).send(error.message);
    }
};

// Get projects with pagination
exports.getProjectsWithPagination = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const projects = await Project.find()
                                      .limit(Number(limit))
                                      .skip((page - 1) * Number(limit))
                                      .exec();

        const modifiedProjects = projects.map(project => {
            if (project.imageUrl) {
                const imageKey = new URL(project.imageUrl).pathname.split('/').pop();
                project.imageUrl = `${req.protocol}://${req.get('host')}/api/projects/images/${imageKey}`;
            }
            return project;
        });
        res.status(200).send(modifiedProjects);
    } catch (error) {
        console.error("Error retrieving projects with pagination", error);
        res.status(500).send(error.message);
    }
};


// Search projects
exports.searchProjects = async (req, res) => {
    const { query } = req.query;
    try {
        const projects = await Project.find({
            $or: [
                { keyWords: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { projectTitle: { $regex: query, $options: 'i' } }
            ]
        });

        const modifiedProjects = projects.map(project => {
            if (project.imageUrl) {
                const imageKey = new URL(project.imageUrl).pathname.split('/').pop();
                project.imageUrl = `${req.protocol}://${req.get('host')}/api/projects/images/${imageKey}`;
            }
            return project;
        });
        res.status(200).send(modifiedProjects);
    } catch (error) {
        console.error("Error searching projects", error);
        res.status(500).send(error.message);
    }
};
