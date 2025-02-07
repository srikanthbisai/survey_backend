const bcrypt = require('bcrypt');
const User = require('../models/User');

const authController = {
  async register(req, res) {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ email, password: hashedPassword });
      res.status(201).json({ message: 'User registered' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      res.json({ message: 'Logged in successfully' });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  async getUserStatus(req, res) {
    try {
      const user = await User.findOne({ email: req.params.email });
      res.json({
        exists: !!user,
        hasSubmittedSurvey: user ? user.hasSubmittedSurvey : false
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = authController;