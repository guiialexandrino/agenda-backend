const Joi = require('joi');
const errorMessage = require('./generateMessage/errorMessages');

function register(data) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(3)
      .max(50)
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
    password: Joi.string()
      .required()
      .min(6)
      .max(100)
      .error((error) => {
        return errorMessage('Senha', error);
      }),
  });

  return schema.validate(data);
}

function login(data) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .min(3)
      .max(100)
      .email()
      .error((error) => {
        return errorMessage('Email', error);
      }),
    password: Joi.string()
      .required()
      .min(6)
      .max(100)
      .error((error) => {
        return errorMessage('Senha', error);
      }),
  });

  return schema.validate(data);
}

function lostPassword(data) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .min(3)
      .max(100)
      .email()
      .error((error) => {
        return errorMessage('Email', error);
      }),
  });

  return schema.validate(data);
}

function validateToken(data) {
  const schema = Joi.object({
    id: Joi.string()
      .required()
      .error((error) => {
        return errorMessage('Id Usuário', error);
      }),
    token: Joi.string()
      .required()
      .min(6)
      .max(6)
      .error((error) => {
        return errorMessage('Token', error);
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

function newPassword(data) {
  const schema = Joi.object({
    id: Joi.string()
      .required()
      .error((error) => {
        return errorMessage('Id Usuário', error);
      }),
    token: Joi.string()
      .required()
      .min(6)
      .max(6)
      .error((error) => {
        return errorMessage('Token', error);
      }),
    password: Joi.string()
      .required()
      .min(6)
      .max(100)
      .error((error) => {
        return errorMessage('Senha', error);
      }),
  });

  return schema.validate(data);
}

module.exports = { register, login, lostPassword, validateToken, newPassword };
