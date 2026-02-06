import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("MONGO_URI non défini — connexion MongoDB non effectuée");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté !");
  } catch (err) {
    console.error("Erreur MongoDB:", err.message);
    process.exit(1);
  }
};
