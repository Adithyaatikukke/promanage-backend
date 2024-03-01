const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
    },
    priority: {
        type: String,
        default: "Low",
        required: true,
    },
    status: {
        type: String,
        default: "BackLog",
        required: true,
    },
    checklists: {
        type: Array,
        required: true,
    },
    userRefId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    shared: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model("Task", taskSchema);