import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } });

    server.listen(PORT, () => console.log(`Serveur running on port ${PORT}`));
  } catch (err) {
    console.error("Erreur au démarrage du serveur:", err.message);
    process.exit(1);
  }
};

start();
