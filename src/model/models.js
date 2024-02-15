const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

userSchema.pre('save', function(next) {
  const now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

const canditateSchema = mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  image: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

canditateSchema.pre('save', function(next) {
  const now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  changes: [
    {
      field: {
        type: String,
        required: true
      },
      oldValue: {
        type: String,
        required: true
      },
      newValue: {
        type: String,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});




module.exports = {
  User: mongoose.model("users", userSchema),
  Canditate: mongoose.model("canditate", canditateSchema),
  Logs: mongoose.model("logs", logSchema),
};