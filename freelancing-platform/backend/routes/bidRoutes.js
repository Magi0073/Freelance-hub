const express = require('express');
const Bid = require('../models/Bid');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.post('/:projectId', auth, role(['freelancer']), async (req,res) => {
  const { amount, coverLetter } = req.body;
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (String(project.client) === String(req.user._id)) return res.status(400).json({ message: 'Client cannot bid' });
  const bid = await Bid.create({ amount, coverLetter, project: project._id, freelancer: req.user._id });
  res.json(bid);
});

// client accepts bid
router.post('/:bidId/accept', auth, role(['client']), async (req,res) => {
  const bid = await Bid.findById(req.params.bidId).populate('project');
  if (!bid) return res.status(404).json({ message: 'Bid not found' });
  const project = await Project.findById(bid.project._id);
  if (String(project.client) !== String(req.user._id)) return res.status(403).json({ message: 'Not owner' });
  bid.status = 'accepted'; await bid.save();
  project.acceptedBid = bid._id; project.status = 'in_progress'; await project.save();
  res.json({ bid, project });
});

module.exports = router;
