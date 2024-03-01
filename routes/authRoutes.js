const express = require("express");
const router = express.Router();
const User = require("../models/user")  
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middlewares/authMiddlewares');

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email|| !password) {
      return res.status(400).json({
        errorMessage: "BadRequest",
      });
    }
    const isExcistingUser = await User.findOne({ email: email });
    if (isExcistingUser) {
      return res.status(409).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = new User({
      name,
      email,
      password: hashedPassword,
    });
    const userResponse = await userData.save();
    // console.log(userResponse)

    const token = jwt.sign(
      { userId: userResponse._id },
      process.env.JWT_SECRET
    );
    res.json({
      message: "User registered successfully",
      token: token,
      name: name,
    });
  } catch (error) {
    console.log("error")
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        errorMessage: "BadRequest! Invalid credentials",
      });
    }
    const userDetails = await User.findOne({ email });
    if (!userDetails) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatch= await bcrypt.compare(password,userDetails.password);
    if (!passwordMatch){
      return res.status(401).json({ message: "Invalid credentials",success:false   });
    }
    const token = jwt.sign(
      { userId: userDetails._id },
      process.env.JWT_SECRET
    );
    
    res.json({
      message: "User logged in successfully",
      token: token,
      name: userDetails.name,
      success:true,
    });



  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
});
const updateSettings = async (req, res) => {
  try {
    const { oldPassword, newUsername, newPassword } = req.body;
    const userId = req.user.userId; // Extracting user ID from the token

    // Check if oldPassword, newUsername, and newPassword are provided
    if (!oldPassword || !newUsername || !newPassword) {
      return res.status(400).json({
        errorMessage: 'BadRequest! Please provide all required fields',
      });
    }

    // Find the user by user ID
    const userDetails = await User.findById(userId);

    // If user is not found, return an error
    if (!userDetails) {
      return res.status(401).json({ message: 'Invalid user ID' });
    }

    // Check if the old password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(oldPassword, userDetails.password);

    // If old password doesn't match, return an error
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's username and password
    await User.findByIdAndUpdate(userId, {
      name: newUsername,
      password: hashedPassword,
    });

    // Generate a new token with the updated user information
    const token = jwt.sign(
      { userId: userDetails._id },
      process.env.JWT_SECRET
    );

    res.json({
      message: 'Username and password updated successfully',
      token: token,
      name: newUsername,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Use this route in your express app
router.post('/settings', authMiddleware, updateSettings);



module.exports = router;