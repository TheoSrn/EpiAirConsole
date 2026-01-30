// Structure des utilisateurs dans la base de données

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  gamesData: { type: Array, default: [] }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
