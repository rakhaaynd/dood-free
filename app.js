const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const supportedDomains = [
  "dood.to",
  "dood.lu",
  "doob.lu",
  "stream.ga",
  "doods.am",
  "pooo.st",
  "poophd.pro",
  "poophd.me",
  "pay4fans.com",
  "lulu.st"
];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/getVideo", async (req, res) => {
  const { url } = req.body;

  if (!url || !supportedDomains.some(domain => url.includes(domain))) {
    return res.json({ success: false, message: "Link tidak valid atau situs belum didukung." });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const iframeSrc = $("iframe").attr("src");

    if (!iframeSrc) {
      return res.json({ success: false, message: "Gagal menemukan video." });
    }

    const fullUrl = iframeSrc.startsWith("http") ? iframeSrc : `https:${iframeSrc}`;
    return res.json({ success: true, videoUrl: fullUrl });

  } catch (err) {
    return res.json({ success: false, message: "Terjadi kesalahan saat mengambil video." });
  }
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
