const Joi = require('joi');
const errorMessage = require('./generateMessage/errorMessages');

function addContact(data) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(3)
      .max(100)
      .error((error) => {
        return errorMessage('Nome', error);
      }),
    email: Joi.string()
      .required()
      .min(3)
      .max(100)
      .email()
      .error((error) => {
        return errorMessage('Email', error);
      }),
    number: Joi.string()
      .required()
      .min(10)
      .max(100)
      .error((error) => {
        return errorMessage('Número', error);
      }),
  });

  return schema.validate(data);
}

function editContact(data) {
  const schema = Joi.object({
    id: Joi.string()
      .required()
      .error((error) => {
        return errorMessage('Id do Contato', error);
      }),
    name: Joi.string()
      .min(3)
      .max(100)
      .error((error) => {
        return errorMessage('Nome', error);
      }),
    email: Joi.string()
      .min(3)
      .max(100)
      .email()
      .error((error) => {
        return errorMessage('Email', error);
      }),
    number: Joi.string()
      .min(10)
      .max(100)
      .error((error) => {
        return errorMessage('Número', error);
      }),
  });

  return schema.validate(data);
}

function editProfile(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .error((error) => {
        return errorMessage('Nome', error);
      }),
    email: Joi.string()
      .min(3)
      .max(100)
      .email()
      .error((error) => {
        return errorMessage('Email', error);
      }),
    password: Joi.string()
      .min(6)
      .max(100)
      .error((error) => {
        return errorMessage('Senha', error);
      }),
  });

  return schema.validate(data);
}

module.exports = { addContact, editContact, editProfile };
