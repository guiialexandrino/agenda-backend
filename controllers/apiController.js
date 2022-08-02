const Contacts = require('../models/Contacts');

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
      { new: true },
    );

    if (editedContact) res.send({ success: true, data: editedContact });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

async function removeContact(req, res) {
  try {
    const checkOwner = await Contacts.findOne({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!checkOwner)
      return res.send({
        success: false,
        error: 'Você não pode deletar esse contato.',
      });

    const removedContact = await Contacts.findByIdAndDelete(req.params.id);
    if (removedContact) res.send({ success: true, removed: removedContact });
    else
      res.send({
        success: false,
        error: 'Contato com id não encontrado, não foi possível deletar.',
      });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

module.exports = { addContact, editContact, removeContact, viewContacts };
