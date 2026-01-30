// Connection de Mongo vers le backend

import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/EpiAirConsole";
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connecté !");
  } catch (error) {
    console.error("Erreur de connexion MongoDB :", error);
    throw error;
  }
}
