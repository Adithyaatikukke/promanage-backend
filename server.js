const authRoutes = require('./routes/authRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');
const analyticsRoutes = require('./routes/analyticsRoutes.js'); 
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

 
const cors=require("cors");


const app = express();
app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Db got connected"))
  .catch((error) => console.log("Failed to coonect", error));
  app.use(express.raw({ limit: '16kb' }));
  app.use(express.text({ limit: '16kb' }));



app.get("/health", (req, res) => {
  res.json({
    service: "Pro-manage server",
    status: "active",
    time: new Date(), 
  });
});
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use('/api/v1/analytics', analyticsRoutes);  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});