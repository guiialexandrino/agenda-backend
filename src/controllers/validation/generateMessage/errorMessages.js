module.exports = (label, errors) => {
  const errorCode = errors[0].code;
  const local = errors[0]?.local;

  switch (errorCode) {
    case 'string.empty':
      errors[0].message = `O campo <b>${label}</b> não pode estar vazio!`;
      break;

    case 'string.min':
      errors[0].message = `O campo <b>${label}</b> deve ter ao menos ${local.limit} caracteres!`;
      break;

    case 'string.max':
      errors[0].message = `O campo <b>${label}</b> não pode ter mais que ${local.limit} caracteres!`;
      break;

    case 'string.email':
      errors[0].message = `O campo <b>${label}</b> não é válido!`;
      break;

    default:
      break;
  }

  return errors;
};
