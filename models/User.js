const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  avatar: { type: String },
  email: { type: String, required: true, minlength: 3, maxlength: 100 },
  password: { type: String, required: true, minlength: 6, maxlength: 100 },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },
  authKey: { type: String },
});

userSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    avatar: this.avatar,
    email: this.email,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
    authKey: this.authKey,
  };
};

module.exports = mongoose.model('User', userSchema);
