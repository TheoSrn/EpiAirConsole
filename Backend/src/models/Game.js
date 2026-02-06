import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  releaseDate: { type: Date },
  tags: { type: [String], default: [] },
  publisher: { type: String, default: "" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Game = mongoose.model("Game", gameSchema);

export default Game;
