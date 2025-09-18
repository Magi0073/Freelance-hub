const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

// add milestone (client)
router.post('/:projectId', auth, role(['client']), async (req,res) => {
  const { title, description, amount, dueDate } = req.body;
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (String(project.client) !== String(req.user._id)) return res.status(403).json({ message: 'Not owner' });
  project.milestones.push({ title, description, amount, dueDate });
  await project.save();
  res.json(project.milestones);
});

// get milestones
router.get('/:projectId', auth, async (req,res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project.milestones);
});

module.exports = router;
