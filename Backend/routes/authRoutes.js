const express = require('express');
const router = express.Router();
const {registerNewUser,loginUser,getUserDetails,changeUserInfo} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth-middleware');

router.post('/signup',registerNewUser);
router.post('/login',loginUser)
router.get('/getUserDetails',authMiddleware,getUserDetails);
router.post('/changeUserInfo',authMiddleware,changeUserInfo);

module.exports = router;