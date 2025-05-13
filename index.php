<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dood.to Viewer</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    form { margin-bottom: 20px; }
    input[type="text"] {
      width: 60%;
      padding: 8px;
    }
    button {
      padding: 8px 12px;
    }
    video {
      width: 100%;
      max-width: 640px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>Dood.to Video Viewer (No Ads)</h1>
  <form id="doodForm">
    <input type="text" name="url" placeholder="Paste Dood.to link here" required />
    <button type="submit">View Video</button>
  </form>

  <div id="videoContainer"></div>

  <script>
    const form = document.getElementById('doodForm');
    const container = document.getElementById('videoContainer');

    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const response = await fetch('/get-video', {
        method: 'POST',
        body: formData
      });

      const html = await response.text();
      container.innerHTML = html;
    };
  </script>
</body>
</html>