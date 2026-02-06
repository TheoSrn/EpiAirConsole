import { createGame, listGames, getGame, updateGame, deleteGame } from "../controllers/gameController.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads", "games");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

router.post("/", upload.single("image"), createGame);
router.get("/", listGames);
router.get("/:id", getGame);
router.put("/:id", upload.single("image"), updateGame);
router.delete("/:id", deleteGame);

export default router;
