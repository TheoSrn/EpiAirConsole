import express from "express";
import cors from "cors";
import gamesRoutes from "./routes/games.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://epiairconsole.onrender.com"
  ],
  credentials: true
}));

app.use("/api/games", gamesRoutes);

export default app;
