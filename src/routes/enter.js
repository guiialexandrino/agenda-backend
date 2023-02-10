const express = require('express');
const router = express.Router();
const apiEnterController = require('../controllers/enterController');

router.post('/register', apiEnterController.register);
router.post('/login', apiEnterController.login);
router.post('/lostPassword', apiEnterController.lostPassword);
router.get('/checkSecret/:idUser', apiEnterController.checkSecret);
router.post('/validateToken', apiEnterController.validateToken);
router.post(
  '/newPassword',
  apiEnterController.validateToken,
  apiEnterController.newPassword
);

module.exports = router;
