const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true},
    lastname: { type: String, required: true },
    otp:{type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true, unique: true },
    city: { type: String, required: true},
    country: { type: String, required: true},
    pincode : { type: Number, required: true},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);