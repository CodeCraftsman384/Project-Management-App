const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const { updateTask, createTask, deleteTask, updateTaskChecklist, getTasks, getTaskById, getDashboardData, getMemberDashboardData } = require('../controllers/taskController');
const router = express.Router();

router.post('/createTask',authMiddleware,adminMiddleware,createTask)
router.put('/updateTask/:id',authMiddleware,adminMiddleware,updateTask)
router.delete('/deleteTask/:id',authMiddleware,adminMiddleware,deleteTask)
router.put('/:id/todo',authMiddleware,updateTaskChecklist);
router.get('/getTask',authMiddleware,getTasks);
router.get('/getTask/:id',authMiddleware,getTaskById);
router.get('/getDashboardData',authMiddleware,adminMiddleware,getDashboardData)
router.get('/getMemberDashboardData',authMiddleware,getMemberDashboardData);

module.exports = router