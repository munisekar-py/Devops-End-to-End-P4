const UserLead = require('../models/userLead.model');

const createUserLead = async (req, res) => {
  try {
    const { name, countryCode, phoneNo, email } = req.body;
    const newUserLead = new UserLead({ name, countryCode, phoneNo, email });
    await newUserLead.save();
    res.status(201).send(newUserLead);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllUserLeads = async (req, res) => {
  try {
    const userLeads = await UserLead.find({});
    res.status(200).send(userLeads);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUserLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const userLead = await UserLead.findById(id);
    if (!userLead) {
      return res.status(404).send('User lead not found');
    }
    res.status(200).send(userLead);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateUserLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userLead = await UserLead.findByIdAndUpdate(id, updates, { new: true });
    if (!userLead) {
      return res.status(404).send('User lead not found');
    }
    res.status(200).send(userLead);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteUserLead = async (req, res) => {
  try {
    const { id } = req.params;
    const userLead = await UserLead.findByIdAndDelete(id);
    if (!userLead) {
      return res.status(404).send('User lead not found');
    }
    res.status(200).send({ message: 'User lead deleted successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createUserLead,
  getAllUserLeads,
  getUserLeadById,
  updateUserLead,
  deleteUserLead
};
