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
      return res
        .status(400)
        .send({ success: false, error: 'Já tem esse número na agenda!' });

    const newContact = new Contacts({ ...req.body, author: req.user.id });
    const savedContact = await newContact.save();

    if (savedContact) res.send({ success: true, data: savedContact });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

async function editContact(req, res) {
  try {
    const editedContact = await Contacts.findByIdAndUpdate(
      req.body.id,
      {
        name: req.body.name,
        number: req.body.number,
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
    const removedContact = await Contacts.findByIdAndDelete(req.params.id);
    if (removedContact) res.send({ success: true, removed: removedContact });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

module.exports = { addContact, editContact, removeContact, viewContacts };
