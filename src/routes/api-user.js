const express = require('express');
const router = express.Router();
const apiUserController = require('../controllers/apiController');
const auth = require('../controllers/authController');
const upload = require('../utils/multer');

router.get('/verifyAuthToken', auth.auth);
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
router.put('/restoreAvatar', auth.auth, apiUserController.restoreAvatar);

module.exports = router;
