const express = require('express');
const router = express.Router();
const apiUserController = require('../controllers/apiController');
const auth = require('../controllers/authController');

router.get('/viewContacts', auth.auth, apiUserController.viewContacts);
router.post('/addContact', auth.auth, apiUserController.addContact);
router.put('/editContact/:id', auth.auth, apiUserController.editContact);
router.delete('/deleteContact/:id', auth.auth, apiUserController.removeContact);
router.put('/editProfile', auth.auth, apiUserController.editProfile);

module.exports = router;
