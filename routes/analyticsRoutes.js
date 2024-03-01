const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const analyticsProcess = require('../processor/analyticsprocess');



router.use(authMiddleware);

router.get('/counts', analyticsProcess.getAllCounts);

module.exports = router;