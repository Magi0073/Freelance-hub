const express = require('express');
const rp = require('../utils/razorpay');
const Project = require('../models/Project');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const crypto = require('crypto');
const router = express.Router();

// create order for a milestone
router.post('/create-order/:projectId/:milestoneIndex', auth, role(['client']), async (req,res) => {
  const { projectId, milestoneIndex } = req.params;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (String(project.client) !== String(req.user._id)) return res.status(403).json({ message: 'Not owner' });
  const milestone = project.milestones[milestoneIndex];
  if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
  const amountPaise = Math.round(milestone.amount * 100);
  const order = await rp.orders.create({ amount: amountPaise, currency: 'INR', receipt: `ms_${projectId}_${Date.now()}` });
  const payment = await Payment.create({ milestoneId: milestone._id, provider: 'razorpay', providerPaymentId: order.id, amount: milestone.amount, status: 'created' });
  res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID, paymentRecordId: payment._id });
});

// verify (client posts response handler data)
router.post('/verify', express.json(), async (req,res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentRecordId } = req.body;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');
  if (expected === razorpay_signature) {
    const payment = await Payment.findById(paymentRecordId);
    if (payment) {
      payment.status = 'succeeded';
      await payment.save();
      // mark milestone as funded
      // find project containing milestone
      const project = await Project.findOne({ 'milestones._id': payment.milestoneId });
      if (project) {
        const ms = project.milestones.id(payment.milestoneId);
        ms.status = 'funded';
        ms.paymentId = payment._id;
        await project.save();
      }
    }
    return res.json({ ok: true });
  } else {
    return res.status(400).json({ ok: false });
  }
});

module.exports = router;
