import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Validation du mot de passe sécurisé
const validatePassword = (password) => {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: "Le mot de passe doit contenir au moins 12 caractères" };
  }
  if (!hasUpperCase) {
    return { valid: false, message: "Le mot de passe doit contenir au moins une majuscule" };
  }
  if (!hasLowerCase) {
    return { valid: false, message: "Le mot de passe doit contenir au moins une minuscule" };
  }
  if (!hasNumber) {
    return { valid: false, message: "Le mot de passe doit contenir au moins un chiffre" };
  }
  if (!hasSpecialChar) {
    return { valid: false, message: "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*, etc.)" };
  }

  return { valid: true };
};

export const register = async (req, res) => {
  try {
    // Support legacy/front payloads: `username` (frontend/tests) or `name`
    const { name, username, email, password } = req.body;
    const resolvedName = username || name;

    if (!resolvedName || !email || !password) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    // Valider la force du mot de passe
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username: resolvedName, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ token, user: userObj });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email déjà utilisé" });
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Champs manquants" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email ou mot de passe invalide" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Email ou mot de passe invalide" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
