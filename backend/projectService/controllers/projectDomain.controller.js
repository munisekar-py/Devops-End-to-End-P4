const ProjectDomain = require('../models/projectDomain.model');

const createProjectDomain = async (req, res) => {
  try {
    const projectDomain = new ProjectDomain({ name: req.body.name, description: req.body.description });
    await projectDomain.save();
    res.status(201).send(projectDomain);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllProjectDomains = async (req, res) => {
  try {
    const projectDomains = await ProjectDomain.find({});
    res.status(200).send(projectDomains);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProjectDomainById = async (req, res) => {
  try {
    const projectDomain = await ProjectDomain.findById(req.params.id);
    if (!projectDomain) {
      return res.status(404).send('Project domain not found.');
    }
    res.status(200).send(projectDomain);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateProjectDomain = async (req, res) => {
  try {
    const projectDomain = await ProjectDomain.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!projectDomain) {
      return res.status(404).send('Project domain not found.');
    }
    res.status(200).send(projectDomain);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteProjectDomain = async (req, res) => {
  try {
    const projectDomain = await ProjectDomain.findByIdAndDelete(req.params.id);
    if (!projectDomain) {
      return res.status(404).send('Project domain not found.');
    }
    res.status(200).send({ message: 'Project domain deleted successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createProjectDomain,
  getAllProjectDomains,
  getProjectDomainById,
  updateProjectDomain,
  deleteProjectDomain
};
