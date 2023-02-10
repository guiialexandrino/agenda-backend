const express = require('express');
const router = express.Router();
const apiEnterController = require('../controllers/enterController');

router.post('/register', apiEnterController.register);
router.post('/login', apiEnterController.login);
router.post('/lostPassword', apiEnterController.lostPassword);

module.exports = router;
