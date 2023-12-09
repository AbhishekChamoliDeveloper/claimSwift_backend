const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Admin = require('../models/AdminModel');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ admin }, process.env.SECRET_JWT_KEY);

    res.status(200).json({
      message: 'Admin logged in successfully',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
