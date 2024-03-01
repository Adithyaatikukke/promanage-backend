const Task = require('../models/tasks.model.js');
const ApiResponse = require('../utils/ApiResponse');


const createTask = async (req, res) => {
    try {
        const { title, priority, dueDate, checklist } = req.body;
        const userId = req.user._id;

        
        const newTask = new Task({ title, priority, dueDate, checklist, column: 'TO-DO', user: userId });
        await newTask.save();
        
        ApiResponse(res, 201, 'Task created successfully', newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};


const getAllTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ user: userId });
        ApiResponse(res, 200, 'Tasks fetched successfully', tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};


const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, priority, dueDate, checklist } = req.body;
        
        
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, priority, dueDate, checklist },
            { new: true }
        );

        if (!updatedTask) {
            return ApiResponse(res, 404, 'Task not found');
        }

        ApiResponse(res, 200, 'Task updated successfully', updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};


const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return ApiResponse(res, 404, 'Task not found');
        }

        ApiResponse(res, 200, 'Task deleted successfully', deletedTask);
    } catch (error) {
        console.error('Error deleting task:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};


const updateTaskColumn = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { column } = req.body;
        const userId = req.user._id;

        
        const task = await Task.findOne({ _id: taskId, user: userId });
        if (!task) {
            return ApiResponse(res, 404, 'Task not found');
        }

    
        task.column = column;
        await task.save();

        ApiResponse(res, 200, 'Task column state updated successfully', task);
    } catch (error) {
        console.error('Error updating task column state:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};


const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        
        const task = await Task.findOne({ _id: taskId, user: userId });

        if (!task) {
            return ApiResponse(res, 404, 'Task not found');
        }

        ApiResponse(res, 200, 'Task fetched successfully', task);
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};



const getTasksByFilter = async (req, res) => {
    try {
        const userId = req.user._id;
        const { filter } = req.params;
        const currentDate = new Date();

        let startDate, endDate;

        
        switch (filter) {
            case 'today':
                startDate = new Date(currentDate);
                startDate.setHours(0, 0, 0, 0); 
                endDate = new Date(currentDate);
                endDate.setHours(23, 59, 59, 999); 
                break;
            case 'thisWeek':
                
                startDate = new Date(currentDate);
                startDate.setDate(startDate.getDate() - startDate.getDay());
                startDate.setHours(0, 0, 0, 0);
                
                endDate = new Date(currentDate);
                endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
                endDate.setHours(23, 59, 59, 999); 
                break;
            case 'thisMonth':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                startDate.setHours(0, 0, 0, 0); 
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999); 
                break;
            default:
                return ApiResponse(res, 400, 'Invalid filter');
        }

        
        const tasks = await Task.find({
            user: userId,
            createdAt: { $gte: startDate, $lte: endDate }
        });

        ApiResponse(res, 200, 'Tasks fetched successfully', tasks);
    } catch (error) {
        console.error('Error fetching tasks by creation date:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};

module.exports = {
    updateTaskColumn,
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByFilter
};