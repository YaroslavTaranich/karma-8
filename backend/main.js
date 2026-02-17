import express from "express";
import fs from "fs";
import path from "path";

const PORT = 3000;
const VIDEO_DIR = path.resolve("./videos");
if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR, { recursive: true });

const app = express();

const DRIVE_LINKS = [
  "https://drive.google.com/uc?export=download&id=1RCRrNq9FbVrqKkK3xr14kAThwHxJVcYa",
  "https://drive.google.com/uc?export=download&id=1u5nPdeWgG3v5Vx99blIjaj0PxAXKVaU5",
  "https://drive.google.com/uc?export=download&id=1XMP4q6s4aWVV9CY_xvJjqN1KamF9LkaX",
  "https://drive.google.com/uc?export=download&id=1KqQvE9OuW-ioJgLcEO1cMUbhoZCOj6lW",
  "https://drive.google.com/uc?export=download&id=19zFKLlX_rBbnoKS_9ohDaxbGFbkBlCDA",
  "https://drive.google.com/uc?export=download&id=1sm5ZF0ZlpTUPdQyEYXipcJFqc3jOqZNG",
  "https://drive.google.com/uc?export=download&id=11rgWHKuyr2_NK1Jdm-a0V7TUSJoaAYNA",
  "https://drive.google.com/uc?export=download&id=1dwFMBesk5f65bv8dQ8YRsNlzQzWup-Cf",
  "https://drive.google.com/uc?export=download&id=1Q-tJAPcRzD1Ac40t3QkiahDCdwSAOkgj",
  "https://drive.google.com/uc?export=download&id=1J7wIYlC797OpEfjVF3v82wFMINh1cc-y",
  "https://drive.google.com/uc?export=download&id=1dv_cdFZoSrjIPALTgvTXaw2PZN1_AG3Y",
  "https://drive.google.com/uc?export=download&id=1Roz8-S0rdsg_YYKjXAaBKsVAeAXeCRnC",
  "https://drive.google.com/uc?export=download&id=1ZWM3r2Qjrs7Cpso1kKzohY-ZhtSoSC2D",
  "https://drive.google.com/uc?export=download&id=1kkFtO3B96NzabUfSwae3VvwexuWDOthv",
  "https://drive.google.com/uc?export=download&id=1vZtTrUH_CsMIdFFICfIilCZy50pvJXr-",
];

async function downloadFiles() {
  for (let i = 0; i < DRIVE_LINKS.length; i++) {
    const url = DRIVE_LINKS[i];
    const filename = `video${i + 1}.mp4`;
    const filePath = path.join(VIDEO_DIR, filename);
    if (fs.existsSync(filePath)) continue;

    console.log(`Downloading ${url} -> ${filename}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to download ${url}: ${res.status}`);
      continue;
    }
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log(`Saved ${filename}`);
  }
}

downloadFiles();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/videos", express.static(VIDEO_DIR));

app.get("/list/", async (req, res) => {
  // скачиваем файлы если их ещё нет
  await downloadFiles();

  const files = fs
    .readdirSync(VIDEO_DIR)
    .filter((f) => f.endsWith(".mp4"))
    .map((f) => `http://localhost:3000/videos/${f}`);

  res.json(files);
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  console.log(`List endpoint: http://localhost:${PORT}/list`);
});
