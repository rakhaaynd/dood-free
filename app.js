const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Menyajikan index.html dan file statis lainnya

// Route utama (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Proses form POST
app.post('/get-video', async (req, res) => {
  const link = req.body.url;

  if (!link || !link.includes('dood.')) {
    return res.send('<p>Link tidak valid. Harap masukkan link dari Dood.to.</p>');
  }

  const videoUrl = await extractVideoUrl(link);

  if (videoUrl) {
    res.send(`
      <h2>Hasil Video:</h2>
      <video width="640" height="360" controls autoplay>
        <source src="${videoUrl}" type="video/mp4">
        Browser Anda tidak mendukung video.
      </video>
    `);
  } else {
    res.send('<p>Gagal menemukan video. Struktur halaman mungkin telah berubah.</p>');
  }
});

// Fungsi scraping video
async function extractVideoUrl(url) {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Tunggu elemen video muncul
    await page.waitForSelector('video', { timeout: 10000 });

    // Ambil src dari elemen video
    const videoSrc = await page.$eval('video', el => el.src);
    return videoSrc;
  } catch (err) {
    console.error('Scraping error:', err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});