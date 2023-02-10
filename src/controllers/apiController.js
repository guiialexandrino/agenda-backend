const Contacts = require('../models/Contacts');
const Users = require('../models/User');
const bcrypt = require('bcryptjs');

//show Contacts by logged User
async function viewContacts(req, res) {
  try {
    const checkContacts = await Contacts.find({
      author: req.user.id,
    });

    res.send({ success: true, data: checkContacts });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

async function addContact(req, res) {
  try {
    const checkNumber = await Contacts.findOne({
      number: req.body.number,
      author: req.user.id,
    });

    if (checkNumber)
      return res.status(400).send({
        success: false,
        error: 'Já tem um contato com esse número na agenda!',
      });

    const checkEmail = await Contacts.findOne({
      email: req.body.email,
      author: req.user.id,
    });

    if (checkEmail)
      return res.status(400).send({
        success: false,
        error: 'Já tem um contato com esse email na agenda!',
      });

    const newContact = new Contacts({ ...req.body, author: req.user.id });
    const savedContact = await newContact.save();

    if (savedContact) res.send({ success: true, data: savedContact });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

async function editContact(req, res) {
  try {
    const checkOwner = await Contacts.findOne({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!checkOwner)
      return res.send({
        success: false,
        error: 'Você nao pode editar esse contato.',
      });

    const editedContact = await Contacts.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        modifiedAt: Date.now(),
      },
      { new: true }
    );

    if (editedContact) res.send({ success: true, data: editedContact });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

async function removeContact(req, res) {
  try {
    const checkContact = await Contacts.findOne({
      _id: req.params.id,
    });

    if (!checkContact)
      return res.status(404).send({
        success: false,
        error: 'Contato com id não encontrado, não foi possível deletar.',
      });

    const checkOwner = await Contacts.findOne({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!checkOwner)
      return res.status(401).send({
        success: false,
        error: 'Você não ter permissão para deletar esse contato.',
      });

    const removedContact = await Contacts.findByIdAndDelete(req.params.id);
    res.send({ success: true, removed: removedContact });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

async function editProfile(req, res) {
  const expectedBody = ['name', 'password', 'email'];
  for (let i in req.body) {
    if (!expectedBody.includes(i)) {
      return res.status(400).send({
        success: false,
        error: 'Os campos esperados no body são: name, password e email.',
      });
    }
  }

  try {
    const checkEmail = await Users.findOne({
      email: req.body.email,
    });

    if (checkEmail)
      return res.status(400).send({
        success: false,
        error: 'Esse e-mail já está sendo utilizado.',
      });

    if (req.body.password)
      req.body.password = bcrypt.hashSync(req.body.password);

    const editedProfile = await Users.findByIdAndUpdate(
      req.user.id,
      {
        ...req.body,
        profileEditedAt: Date.now(),
      },
      { new: true }
    );

    if (editedProfile) res.send({ success: true, data: editedProfile });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

async function uploadAvatar(req, res) {
  if (req.denied)
    return res.status(400).send({ success: false, message: req.denied });

  try {
    const imagePath = req.file?.filename; //só vai acessar o .filename caso exista
    const editedProfile = await Users.findByIdAndUpdate(
      req.user.id,
      {
        avatar: imagePath,
        profileEditedAt: Date.now(),
      },
      { new: true }
    );

    if (editedProfile) res.send({ success: true, data: editedProfile });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

module.exports = {
  addContact,
  editContact,
  removeContact,
  viewContacts,
  editProfile,
  uploadAvatar,
};
