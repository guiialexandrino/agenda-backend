const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  number: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 100 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date },
});

contactSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    number: this.number,
    createdAt: this.createdAt,
    modifiedAt: this.modifiedAt,
  };
};

module.exports = mongoose.model('Contacts', contactSchema);
