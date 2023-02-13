const multer = require('multer');
const path = require('node:path');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, '..', 'uploads'));
    },
    filename(req, file, callback) {
      const extension = file.mimetype.split('/');
      const extensionFormat = extension[extension.length - 1];
      req.extension = extensionFormat;
      callback(null, `${Date.now()}-${req.user.id}.${extensionFormat}`);
    },
  }),

  fileFilter(req, file, callback) {
    const extension = file.mimetype.split('/');
    const extensionFormat = extension[extension.length - 1];
    const validFormats = ['png', 'jpg', 'jpeg'];
    if (!validFormats.includes(extensionFormat)) {
      req.denied =
        'Formato de img inválido! O formato deve ser: png ou jpg/jpeg!';
      return callback(null, false);
    }

    callback(null, true);
  },
});

module.exports = upload;
