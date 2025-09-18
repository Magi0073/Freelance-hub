const express = require('express');
const Project = require('../models/Project');
const Bid = require('../models/Bid');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

// create project (client)
router.post('/', auth, role(['client']), async (req,res) => {
  const { title, description, budgetMin, budgetMax } = req.body;
  const project = await Project.create({ title, description, budgetMin, budgetMax, client: req.user._id });
  res.json(project);
});

// list
router.get('/', auth, async (req,res) => {
  const projects = await Project.find().populate('client','name email').sort('-createdAt');
  res.json(projects);
});

// detail (with bids & milestones)
router.get('/:id', auth, async (req,res) => {
  const project = await Project.findById(req.params.id)
    .populate('client','name email')
    .populate({ path: 'acceptedBid', populate: { path: 'freelancer', select: 'name' } });
  const bids = await Bid.find({ project: req.params.id }).populate('freelancer','name');
  res.json({ ...project.toObject(), bids });
});

module.exports = router;
