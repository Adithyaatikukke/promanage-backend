const express = require("express");
const router = express.Router();
const Task=require("../models/task.model")
const authMiddleware = require('../middlewares/authMiddlewares');
const User = require("../models/user") 

// Create a new task
// Create a new task
router.post("/Tasks", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const assignedUser = req.user.userId; // Extracting the user ID from the token

    const newTask = new Task({
      title,
      description,
      dueDate,
      userRefId: assignedUser, // Set the userRefId field
    });

    const taskResponse = await newTask.save();

    // Update the user's tasks array
    await User.findByIdAndUpdate(assignedUser, {
      $push: { tasks: taskResponse._id },
    });

    res.json({
      message: "Task created successfully",
      task: taskResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all tasks for a specific user
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const assignedUser = req.user.userId; // Ensure that req.user is defined by authMiddleware
    const tasks = await Task.find({ assignedUser });
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a task
router.delete("/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const assignedUser = req.user.userId; // Extracting the user ID from the token

    // Remove the task from the user's tasks array
    await User.findByIdAndUpdate(assignedUser, {
      $pull: { tasks: taskId },
    });

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
