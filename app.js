const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/getVideo", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes("dood.to")) {
    return res.json({ success: false, message: "Link tidak valid." });
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

    const fullUrl = iframeSrc.startsWith("http")
      ? iframeSrc
      : `https:${iframeSrc}`;

    return res.json({ success: true, videoUrl: fullUrl });
  } catch (err) {
    return res.json({ success: false, message: "Terjadi kesalahan saat mengambil video." });
  }
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
