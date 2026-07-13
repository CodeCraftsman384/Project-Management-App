const express = require('express');
const router = express.Router();

router.post('/signup',registerNewUser);
router.post('/login',loginUser)
router.get('/getUserDetails',authMiddleware,getUserDetails);
router.post('/changeUserInfo',authMiddleware,changeUserInfo);

module.exports = router;