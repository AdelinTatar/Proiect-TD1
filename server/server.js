import express from "express";
import cors from "cors";
import fs from "fs";
import { promises as fsp } from "fs";
import { nanoid } from "nanoid";
import { productSchema } from "./products.schema.js";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFolder = path.join(__dirname, "data");
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);

const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const DB_PATH = path.join(dataFolder, "data.json");
if (!fs.existsSync(DB_PATH)) await fsp.writeFile(DB_PATH, "[]", "utf-8");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(uploadFolder));

async function readDB() {
  if (!fs.existsSync(DB_PATH)) await fsp.writeFile(DB_PATH, "[]", "utf-8");
  return JSON.parse(await fsp.readFile(DB_PATH, "utf-8"));
}

async function writeDB(data) {
  await fsp.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.json({ message: "API is running", endpoints: ["/products"] });
});

app.get("/products", async (req, res) => res.json(await readDB()));

app.get("/products/:id", async (req, res) => {
  const item = (await readDB()).find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

app.post("/products", upload.single("image"), async (req, res) => {
  const payload = req.body; 
  const check = productSchema.validate(payload);
  if (!check.ok) return res.status(400).json({ error: check.reason });

  const items = await readDB();
  const product = { 
    id: `p-${nanoid(6)}`, 
    ...payload, 
    image: req.file ? `/uploads/${req.file.filename}` : "" 
  };
  items.push(product);
  await writeDB(items);
  res.status(201).json(product);
});


app.put("/products/:id", upload.single("image"), async (req, res) => {
  const payload = req.body;
  const items = await readDB();
  const idx = items.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  items[idx] = { 
    ...items[idx], 
    ...payload, 
    image: req.file ? `/uploads/${req.file.filename}` : items[idx].image
  };
  await writeDB(items);
  res.json(items[idx]);
});

app.delete("/products/:id", async (req, res) => {
  const items = await readDB();
  const idx = items.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  const removed = items.splice(idx, 1);
  await writeDB(items);
  res.json(removed[0]);
});

app.listen(PORT, () => console.log(`Serverul rulează pe http://localhost:${PORT}`));
