const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const allowedRoles = ["applicant", "employer"]; // ✅ Only valid roles

const registerUser = async (req, res) => {
  let { name, email, password, role } = req.body;

  try {
    // Ensure role is lowercase and valid
    role = role?.toLowerCase() || "applicant"; // default to "applicant" if undefined

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Allowed: applicant, employer' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: err.message || "Registration failed" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role.toLowerCase() }, // ensure lowercase
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase()
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message || "Login failed" });
  }
};

module.exports = { registerUser, loginUser };
