const ProjectContent = require('../models/projectContent.model');
const { upload } = require('../utils/s3config');


exports.createProject = (req, res) => {
    upload.single('projectFile')(req, res, function (error) {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const newProjectContent = new ProjectContent({
            projectId: req.body.projectId, 
            downloadLink: req.file.location 
        });

        newProjectContent.save()
            .then(data => res.status(201).json(data))
            .catch(err => res.status(500).json({ message: "Error saving project content to database.", error: err }));
    });
};

exports.getAllProjectLinks = (req, res) => {
    ProjectContent.find({})
        .then(contents => {
            const links = contents.map(content => {
                return { projectId: content.projectId, downloadLink: content.downloadLink };
            });
            res.status(200).json(links);
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to retrieve project contents.", error: err });
        });
};

exports.updateProjectContent = (req, res) => {
    const { id } = req.params; 
    const { downloadLink } = req.body; 

    ProjectContent.findByIdAndUpdate(id, { downloadLink }, { new: true })
        .then(updatedContent => {
            if (!updatedContent) {
                return res.status(404).send({ message: "Project content not found." });
            }
            res.status(200).send(updatedContent);
        })
        .catch(err => {
            console.error("Error updating project content:", err);
            res.status(500).send({ message: "Error updating project content.", error: err });
        });
};

exports.deleteProjectContent = (req, res) => {
    const { id } = req.params;

    ProjectContent.findByIdAndRemove(id)
        .then(result => {
            if (!result) {
                return res.status(404).send({ message: "Project content not found." });
            }
            res.status(200).send({ message: "Project content deleted successfully." });
        })
        .catch(err => {
            console.error("Error deleting project content:", err);
            res.status(500).send({ message: "Error deleting project content.", error: err });
        });
};
