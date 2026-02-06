import Game from "../models/Game.js";
import mongoose from "mongoose";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const parseTags = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String).map((t) => t.trim()).filter(Boolean);
  if (typeof val === "string") return val.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
};

export const createGame = async (req, res) => {
  try {
    const { name, description, releaseDate, tags, publisher, imageUrl } = req.body;
    if (!name) return res.status(400).json({ message: "Le champ 'name' est requis" });

    let finalImage = imageUrl || "";
    if (req.file) {
      const protocol = req.protocol || 'http';
      const host = req.get("host") || 'localhost:5000';
      finalImage = `${protocol}://${host}/uploads/games/${req.file.filename}`;
      console.log('Created image URL:', finalImage);
    }

    const game = await Game.create({
      name,
      description,
      releaseDate: releaseDate ? new Date(releaseDate) : undefined,
      tags: parseTags(tags),
      publisher,
      imageUrl: finalImage
    });

    console.log('Game created with imageUrl:', game.imageUrl);
    res.status(201).json(game);
  } catch (err) {
    console.error("createGame error:", err);
    if (err.code === 11000) return res.status(400).json({ message: "Conflit: valeur dupliquée" });
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const listGames = async (req, res) => {
  try {
    const { page = 1, limit = 20, tag, q } = req.query;
    const filter = {};
    if (tag) {
      const t = parseTags(tag);
      filter.tags = t.length > 1 ? { $all: t } : t[0];
    }
    if (q) filter.$or = [{ name: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }];

    const games = await Game.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Log pour déboguer les URLs d'images
    if (games.length > 0) {
      console.log('ListGames - First game imageUrl:', games[0].imageUrl);
    }

    res.json(games);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getGame = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "ID invalide" });
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: "Jeu non trouvé" });
    res.json(game);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID invalide" });
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateGame = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "ID invalide" });
    const updates = { ...req.body };
    if (req.file) {
      updates.imageUrl = `${req.protocol}://${req.get("host")}/uploads/games/${req.file.filename}`;
    }
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: "Aucune donnée fournie pour la mise à jour" });

    if (updates.tags) {
      updates.tags = parseTags(updates.tags);
    }

    const game = await Game.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!game) return res.status(404).json({ message: "Jeu non trouvé" });
    res.json(game);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID invalide" });
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const deleteGame = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "ID invalide" });
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ message: "Jeu non trouvé" });
    res.json({ message: "Jeu supprimé" });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "ID invalide" });
    res.status(500).json({ message: "Erreur serveur" });
  }
};
