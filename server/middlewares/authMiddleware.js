const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware: Authenticate user using JWT token
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Expect: "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and attach to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password");
    console.log("Authenticated user:", req.user);


    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next(); // Authenticated ✅
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware: Restrict route to specific roles (e.g., Admin, Employer)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }
    next(); // Role authorized ✅
  };
};

module.exports = { protect, authorizeRoles };
