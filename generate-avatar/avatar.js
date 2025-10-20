// generate-avatar/avatar.js
// Minimal, dependency-free SVG avatar/placeholder generator.
// Patterns: 'initials' | 'blocks' | 'circles' | 'random'. Deterministic via seed.

export function generateAvatar(options = {}) {
  const {
    text = 'AA',            // initials or label (used for 'initials' pattern)
    pattern = 'initials',   // 'initials' | 'blocks' | 'circles' | 'random'
    size = 128,             // px (width = height)
    seed = null,            // string for deterministic output
    background = null       // override background color (#hex|rgb|hsl)
  } = options;

  if (!Number.isInteger(size) || size < 32 || size > 1024) {
    throw new Error('size must be an integer in [32, 1024]');
  }

  const R = seed ? seededRNG(String(seed)) : cryptoRNG();
  const patt = pattern === 'random' ? pick(['initials','blocks','circles'], R) : pattern;

  const baseColor = background || pickNiceColor(R);         // base bg
  const fg = idealText(baseColor);                          // text/shape color for contrast
  const acc1 = shiftColor(baseColor, 30);                   // accent colors for patterns
  const acc2 = shiftColor(baseColor, -30);

  let svg;
  if (patt === 'initials') {
    const label = String(text || 'AA').slice(0, 3).toUpperCase();
    const fontSize = Math.round(size * (label.length === 1 ? 0.58 : label.length === 2 ? 0.46 : 0.36));
    svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escapeXML(label)}">
  <rect width="100%" height="100%" fill="${baseColor}"/>
  <text x="50%" y="50%" dy=".35em" fill="${fg}" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial" font-size="${fontSize}" text-anchor="middle">${escapeXML(label)}</text>
</svg>`;
  } else if (patt === 'blocks') {
    const n = 4; // 4x4 grid
    const cell = size / n;
    let rects = '';
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        // symmetric pattern left/right
        const xx = x < n/2 ? x : n - 1 - x;
        const on = ((R() + xx + y) % 3) !== 0; // about 2/3 filled
        if (!on) continue;
        const col = ((x + y) % 2) ? acc1 : acc2;
        rects += `<rect x="${x*cell}" y="${y*cell}" width="${Math.ceil(cell)}" height="${Math.ceil(cell)}" fill="${col}"/>`;
      }
    }
    svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="blocks avatar">
  <rect width="100%" height="100%" fill="${baseColor}"/>
  ${rects}
</svg>`;
  } else if (patt === 'circles') {
    const count = 6;
    let circles = '';
    for (let i = 0; i < count; i++) {
      const r = Math.max(6, (R() % Math.floor(size * 0.25)));
      const cx = 8 + (R() % (size - 16));
      const cy = 8 + (R() % (size - 16));
      const col = i % 2 ? acc1 : acc2;
      const op = 0.35 + ((R() % 50) / 100); // 0.35..0.84
      circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" fill-opacity="${op}"/>`;
    }
    svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="circles avatar">
  <rect width="100%" height="100%" fill="${baseColor}"/>
  ${circles}
</svg>`;
  } else {
    throw new Error("pattern must be 'initials' | 'blocks' | 'circles' | 'random'");
  }

  return svg.trim();
}

// ---- helpers ----

function escapeXML(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])); }

function pick(arr, R){ return arr[R()%arr.length]; }

function idealText(bgHex){
  const {r,g,b} = parseHex(bgHex);
  const yiq = (r*299 + g*587 + b*114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

function pickNiceColor(R){
  // pleasant HSL band, then to HEX
  const h = R() % 360;
  const s = 55 + (R()%35); // 55..89
  const l = 45 + (R()%20); // 45..64
  return rgbToHex(HSLtoRGB({h,s,l}));
}

function shiftColor(hex, deltaH){
  const hsl = RGBtoHSL(parseHex(hex));
  hsl.h = ((hsl.h + deltaH) % 360 + 360) % 360;
  hsl.s = clamp(hsl.s + (deltaH>0? -5 : 5), 35, 95);
  hsl.l = clamp(hsl.l + (deltaH>0? 5 : -5), 25, 85);
  return rgbToHex(HSLtoRGB(hsl));
}

function clamp(x,a,b){ return Math.max(a, Math.min(b, x)); }

function parseHex(s){
  const h = s[0]==='#' ? s.slice(1) : s;
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error('background must be #RRGGBB');
  return { r:parseInt(h.slice(0,2),16), g:parseInt(h.slice(2,4),16), b:parseInt(h.slice(4,6),16) };
}

function rgbToHex({r,g,b}){ const c=n=>n.toString(16).padStart(2,'0'); return `#${c(r)}${c(g)}${c(b)}`; }

function HSLtoRGB({h,s,l}){
  const H = ((h%360)+360)%360 / 360, S = s/100, L = l/100;
  if (S===0){ const v=Math.round(L*255); return {r:v,g:v,b:v}; }
  const q = L < 0.5 ? L*(1+S) : L + S - L*S;
  const p = 2*L - q;
  const r = hue2rgb(p,q,H+1/3), g = hue2rgb(p,q,H), b = hue2rgb(p,q,H-1/3);
  return { r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) };
}
function hue2rgb(p,q,t){ if(t<0) t+=1; if(t>1) t-=1;
  if(t<1/6) return p+(q-p)*6*t;
  if(t<1/2) return q;
  if(t<2/3) return p+(q-p)*(2/3 - t)*6;
  return p;
}
function RGBtoHSL({r,g,b}){
  const R=r/255,G=g/255,B=b/255;
  const max=Math.max(R,G,B), min=Math.min(R,G,B);
  let h=0,s=0,l=(max+min)/2;
  if (max!==min){
    const d=max-min;
    s=l>0.5? d/(2-max-min): d/(max+min);
    switch(max){
      case R: h=(G-B)/d + (G<B?6:0); break;
      case G: h=(B-R)/d + 2; break;
      case B: h=(R-G)/d + 4; break;
    }
    h*=60;
  }
  return { h, s: +(s*100).toFixed(1), l: +(l*100).toFixed(1) };
}

// RNGs
function cryptoRNG(){
  if (globalThis.crypto && typeof globalThis.crypto.getRandomValues==='function'){
    return () => {
      const u32=new Uint32Array(1);
      globalThis.crypto.getRandomValues(u32);
      return u32[0]>>>0;
    };
  }
  let x = 0x9e3779b9 ^ Date.now();
  return () => { x=(x+0x6d2b79f5)|0; x^=x>>>15; x=Math.imul(x,1|x); x^=x>>>7; return (x^(x>>>14))>>>0; };
}
function seededRNG(seed){
  let h=2166136261>>>0;
  for (let i=0;i<seed.length;i++){ h^=seed.charCodeAt(i); h=Math.imul(h,16777619); }
  return () => { h+=0x6d2b79f5; let t=Math.imul(h^(h>>>15),1|h); t^=t+Math.imul(t^(t>>>7),61|t); return (t^(t>>>14))>>>0; };
}

// Example:
// console.log(generateAvatar({ text:'YV', pattern:'initials', size:128, seed:'demo' }));
