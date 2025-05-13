const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/view', async (req, res) => {
  const doodUrl = req.body.url;

  if (!doodUrl || !doodUrl.includes('dood.to/e/')) {
    return res.send('Link tidak valid.');
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(doodUrl, { waitUntil: 'networkidle2' });

    const videoUrl = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video ? video.src : null;
    });

    await browser.close();

    if (!videoUrl) {
      return res.send('Gagal menemukan video.');
    }

    res.send(`
      <h2>Video dari: ${doodUrl}</h2>
      <video src="${videoUrl}" controls autoplay style="width: 100%; max-width: 600px;"></video>
      <br><a href="/">Kembali</a>
    `);
  } catch (err) {
    console.error(err);
    res.send('Terjadi kesalahan saat memproses link.');
  }
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
