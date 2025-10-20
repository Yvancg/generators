// generate-prompt/prompt.js
// Minimal, dependency-free prompt template generator for text/code/image models.
// Supports {placeholders}, defaults, simple transforms, and optional seeding for repeatable randoms.

export function generatePrompt(
  type = 'text',                      // 'text' | 'code' | 'image'
  template = '{instruction}',
  vars = {},
  options = {}
) {
  const {
    seed = null,                      // string for deterministic extras
    trim = true,                      // trim final output
    fallback = '',                    // fallback when a var is missing
    transforms = defaultTransforms(), // map of transform functions
    allowUnknown = false,             // if false, unknown placeholders throw
  } = options;

  if (!['text','code','image'].includes(type)) {
    throw new Error("type must be 'text' | 'code' | 'image'");
  }
  if (typeof template !== 'string') throw new Error('template must be a string');
  if (typeof vars !== 'object' || vars == null) throw new Error('vars must be an object');

  const rnd = seed ? seededRNG(seed) : null;

  // Expand built-in helpers available in templates via {{helper:arg}}
  const helpers = {
    NOW_ISO: () => new Date().toISOString(),
    RAND_INT: (arg) => {
      const [a,b] = (String(arg||'0,100').split(',').map(n=>parseInt(n.trim(),10)));
      const min = Number.isFinite(a) ? a : 0;
      const max = Number.isFinite(b) ? b : 100;
      const r = rnd ? rnd() : Math.floor(Math.random()*0xffffffff);
      return String(min + (r % (max - min + 1)));
    },
  };

  // First pass: helper expansion {{NAME[:arg]}}
  let out = template.replace(/\{\{([A-Z_]+)(?::([^}]+))?\}\}/g, (_, name, arg) => {
    const fn = helpers[name];
    if (!fn) return allowUnknown ? `{{${name}${arg?':'+arg:''}}}` : '';
    return String(fn(arg));
  });

  // Second pass: placeholder replacement with optional transforms, e.g. {topic|upper}
  out = out.replace(/\{([a-zA-Z0-9_]+)(\|[a-zA-Z0-9_]+)?\}/g, (_, key, t) => {
    const val = prop(vars, key);
    if (val == null) {
      if (allowUnknown) return `{${key}${t||''}}`;
      return fallback;
    }
    const tf = t ? t.slice(1) : null;
    const str = String(val);
    return tf && transforms[tf] ? transforms[tf](str) : str;
  });

  // Optional type-specific wrappers
  if (type === 'code') {
    out = normalizeCodePrompt(out, vars);
  } else if (type === 'image') {
    out = normalizeImagePrompt(out, vars);
  }

  return trim ? out.trim() : out;
}

// ---------- Utilities ----------

function defaultTransforms() {
  return {
    upper: (s) => s.toUpperCase(),
    lower: (s) => s.toLowerCase(),
    title: (s) => s.replace(/\w\S*/g, w => w[0].toUpperCase()+w.slice(1).toLowerCase()),
    snake: (s) => s.trim().toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,''),
    kebab: (s) => s.trim().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''),
    json:  (s) => JSON.stringify(s),
  };
}

function prop(obj, path) {
  if (!path.includes('.')) return obj[path];
  return path.split('.').reduce((acc,k)=> acc && acc[k], obj);
}

function normalizeCodePrompt(prompt, vars) {
  // If user provided language or file, annotate lightly.
  const lang = vars.language || vars.lang || '';
  if (lang) return `You are an expert ${lang} assistant.\n${prompt}`;
  return prompt;
}

function normalizeImagePrompt(prompt, vars) {
  const style = vars.style ? `, style: ${vars.style}` : '';
  const ar = vars.aspect ? `, aspect: ${vars.aspect}` : '';
  return `IMAGE PROMPT: ${prompt}${style}${ar}`;
}

// Simple deterministic RNG for helper RAND_INT
function seededRNG(seed) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return (t ^ (t >>> 14)) >>> 0;
  };
}

// Preset helpers (optional)
export const PromptPresets = Object.freeze({
  text: 'Write a {tone|lower} {length|lower} article about {topic}. Audience: {audience}. {{NOW_ISO}}',
  code: 'Write {language} code that {instruction}. Constraints: {constraints}.',
  image: 'A detailed {subject} in the style of {style}, lighting {lighting}, colors {palette}.'
});

// Example usage:
// generatePrompt('text','Write a {tone} tweet about {topic}', { tone:'funny', topic:'AI startups' });
// generatePrompt('code', PromptPresets.code, { language:'Python', instruction:'parses CSV into JSON', constraints:'no external deps' });
// generatePrompt('image', PromptPresets.image, { subject:'city skyline', style:'cyberpunk', lighting:'neon', palette:'violet/teal' });
