import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listUsers = async (req, res) => {
  try {
    console.log("Fetching all users...");
    const users = await User.find().select("-password");
    console.log(`Found ${users.length} users:`, users);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "ID invalide" });

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID invalide" });
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "ID invalide" });
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: "Aucune donnée fournie pour la mise à jour" });
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Conflit: valeur dupliquée" });
    if (err.name === "CastError") return res.status(400).json({ message: "ID invalide" });
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "ID invalide" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID invalide" });
    res.status(500).json({ message: "Erreur serveur" });
  }
};
