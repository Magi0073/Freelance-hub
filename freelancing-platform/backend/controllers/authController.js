const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req,res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!['client','freelancer'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email exists' });
    const user = await User.create({ name, email, password, role });
    res.json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.login = async (req,res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await user.matchPassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};
