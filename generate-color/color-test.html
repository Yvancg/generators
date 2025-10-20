<!-- generate-color/color-test.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Color Palette Generator Test</title>
  <style>
    body{font-family:ui-monospace,monospace;background:#fafafa;color:#222;max-width:900px;margin:40px auto;padding:20px}
    h1{font-size:1.4rem;margin-bottom:1rem}
    label{display:block;margin-top:10px}
    input,select{padding:6px}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .row{display:flex;gap:10px;align-items:center;margin-top:16px}
    button{padding:8px 16px;cursor:pointer;font-family:inherit}
    .swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-top:16px}
    .swatch{border-radius:8px;overflow:hidden;border:1px solid #ddd}
    .swatch .chip{height:56px}
    .swatch .meta{padding:8px;font-size:.9rem;display:flex;justify-content:space-between;align-items:center}
    .tag{font-size:.75rem;color:#666}
    pre{background:#eee;padding:12px;border-radius:6px;white-space:pre-wrap;word-break:break-word;margin-top:16px;min-height:56px}
  </style>
</head>
<body>
  <h1>🎨 Color Palette Generator Test</h1>

  <div class="grid">
    <label>
      Base color (optional)
      <input id="base" placeholder="#3366ff or rgb(...)/hsl(...)"/>
    </label>

    <label>
      Scheme
      <select id="scheme">
        <option value="triadic" selected>triadic</option>
        <option value="complementary">complementary</option>
        <option value="tetradic">tetradic</option>
        <option value="analogous">analogous</option>
        <option value="monochrome">monochrome</option>
        <option value="random">random</option>
      </select>
    </label>

    <label>
      Count
      <input id="count" type="number" min="1" max="12" value="6"/>
    </label>

    <label>
      Format
      <select id="format">
        <option value="hex" selected>hex</option>
        <option value="rgb">rgb</option>
        <option value="hsl">hsl</option>
      </select>
    </label>

    <label>
      Seed (optional)
      <input id="seed" placeholder="deterministic seed"/>
    </label>
  </div>

  <div class="row">
    <button id="generate">Generate</button>
    <button id="copy" disabled>Copy</button>
  </div>

  <div id="swatches" class="swatches"></div>
  <pre id="output">Click "Generate"</pre>

  <script type="module">
    import { generatePalette } from './color.js';

    const $ = id => document.getElementById(id);
    const out = $('output');
    const copyBtn = $('copy');
    const swatches = $('swatches');

    $('generate').onclick = () => {
      try {
        const opts = {
          base: $('base').value.trim() || null,
          scheme: $('scheme').value,
          count: Math.max(1, parseInt($('count').value, 10) || 6),
          format: $('format').value,
          seed: $('seed').value || null
        };
        const res = generatePalette(opts);

        // Render chips
        swatches.innerHTML = '';
        res.colors.forEach((c, idx) => {
          const card = document.createElement('div');
          card.className = 'swatch';
          const chip = document.createElement('div');
          chip.className = 'chip';
          chip.style.background = c;
          const meta = document.createElement('div');
          meta.className = 'meta';
          const txt = document.createElement('span');
          txt.textContent = c;
          const tag = document.createElement('span');
          tag.className = 'tag';
          tag.textContent = `#${idx+1}`;
          meta.appendChild(txt);
          meta.appendChild(tag);
          card.appendChild(chip);
          card.appendChild(meta);
          swatches.appendChild(card);
        });

        // Output JSON
        out.textContent = JSON.stringify(res, null, 2);
        copyBtn.disabled = false;
        copyBtn.dataset.payload = res.colors.join(', ');
      } catch (e) {
        console.error(e);
        out.textContent = 'Error: ' + (e?.message || e);
        copyBtn.disabled = true;
        swatches.innerHTML = '';
        copyBtn.dataset.payload = '';
      }
    };

    copyBtn.onclick = async () => {
      try {
        const payload = copyBtn.dataset.payload || out.textContent;
        await navigator.clipboard.writeText(payload);
        copyBtn.textContent = 'Copied!';
        setTimeout(()=> (copyBtn.textContent='Copy'), 1500);
      } catch (e) {
        console.error(e);
        copyBtn.textContent = 'Error';
      }
    };
  </script>
</body>
</html>
