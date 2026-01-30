// Application express principale

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import multer from "multer";

const app = express();

app.use(cors());
app.use(express.json());

// Servir les fichiers statiques AVANT les routes API
const uploadsPath = path.join(process.cwd(), "uploads");
console.log('Serving static files from:', uploadsPath);
app.use("/uploads", express.static(uploadsPath));

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import gamesRoutes from "./routes/games.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/games", gamesRoutes);

// Try to load a swagger json from `src/swagger/swagger.json`, otherwise use a minimal placeholder
const swaggerPath = path.resolve(process.cwd(), "src", "swagger", "swagger.json");
let swaggerDocument = {
	openapi: "3.0.0",
	info: { title: "API", version: "0.0.0", description: "Documentation API (auto placeholder)" },
	paths: {}
};
if (fs.existsSync(swaggerPath)) {
	try {
		const raw = fs.readFileSync(swaggerPath, "utf8");
		swaggerDocument = JSON.parse(raw);
	} catch (err) {
		console.warn("Could not parse swagger.json, using placeholder doc.", err.message);
	}
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Redirect root to swagger docs
app.get("/", (req, res) => res.redirect("/api-docs"));

app.use((err, req, res, next) => {
	// Multer-specific errors (file too large, invalid file, etc.)
	if (err instanceof multer.MulterError) {
		console.warn("Multer error:", err.message);
		return res.status(400).json({ message: err.message });
	}
	if (err && err.message === "Only image files are allowed") {
		console.warn("File filter error:", err.message);
		return res.status(400).json({ message: err.message });
	}

	console.error(err);
	if (res.headersSent) return next(err);
	res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

export default app;
