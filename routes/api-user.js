const express = require('express');
const multer = require('multer');
const path = require('node:path');
const router = express.Router();
const apiUserController = require('../controllers/apiController');
const auth = require('../controllers/authController');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, '..', 'uploads'));
    },
    filename(req, file, callback) {
      const extension = file.originalname.split('.');
      const extensionFormat = extension[extension.length - 1];
      callback(null, `${Date.now()}-${req.user.id}.${extensionFormat}`);
    },
  }),
});

router.get('/viewContacts', auth.auth, apiUserController.viewContacts);
router.post('/addContact', auth.auth, apiUserController.addContact);
router.put('/editContact/:id', auth.auth, apiUserController.editContact);
router.delete('/deleteContact/:id', auth.auth, apiUserController.removeContact);
router.put('/editProfile', auth.auth, apiUserController.editProfile);
router.put(
  '/uploadAvatar',
  auth.auth,
  upload.single('avatar'),
  apiUserController.uploadAvatar
);

module.exports = router;
