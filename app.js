const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

async function getDirectVideoUrl(pageUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: "networkidle2", timeout: 60000 });

    await page.waitForSelector("iframe", { timeout: 10000 });
    const iframeSrc = await page.$eval("iframe", (iframe) => iframe.src);

    return iframeSrc.startsWith("http") ? iframeSrc : `https:${iframeSrc}`;
  } catch (err) {
    throw new Error("Gagal menemukan iframe.");
  } finally {
    await browser.close();
  }
}

app.post("/getVideo", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes(".")) {
    return res.json({ success: false, message: "Link tidak valid." });
  }

  try {
    const videoUrl = await getDirectVideoUrl(url);
    return res.json({ success: true, videoUrl });
  } catch (err) {
    return res.json({
      success: false,
      message: "Gagal mengambil video: " + err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});
