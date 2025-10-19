// generate-fake-data/fake.js
// Seedable fake data generator. No deps. O(n). Pure ESM. 

const FIRST = ['Liam','Noah','Olivia','Emma','Ava','Mia','Amelia','Sophia','Isabella','James','Lucas','Ethan','Mason','Logan','Elijah','Aiden','Harper','Evelyn','Abigail','Ella'];
const LAST  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee'];
const DOMAINS = ['example.com','mail.test','sample.org','demo.net'];
const STREETS = ['Oak','Maple','Pine','Cedar','Elm','Birch','Willow','Hill','Lake','Sunset','Ridge','Valley','Park','River'];
const CITIES  = ['Austin','Seattle','Denver','Miami','Boston','Chicago','Toronto','London','Berlin','Paris','Tokyo','Bangkok','Singapore'];
const STATES  = ['CA','NY','TX','FL','WA','CO','MA','GA','NC','VA'];
const COUNTRIES = ['US','CA','GB','DE','FR','TH','SG','JP'];

function mulberry32(seed) {
  let t = seed >>> 0;
  return function() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ t >>> 15, 1 | t);
    r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
    return ((r ^ r >>> 14) >>> 0) / 4294967296;
  };
}

export function rng(seed) { return mulberry32(hashSeed(seed)); }
function hashSeed(s) {
  if (typeof s === 'number') return s|0;
  const str = String(s ?? Date.now());
  let h = 2166136261;
  for (let i=0;i<str.length;i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function pick(arr, R) { return arr[(R()*arr.length)|0]; }
function int(min, max, R) { return (R() * (max - min + 1) + min) | 0; }
function pad(n, w=2) { return String(n).padStart(w, '0'); }

export function firstName(R) { return pick(FIRST, R); }
export function lastName(R)  { return pick(LAST, R); }
export function fullName(R)  { return `${firstName(R)} ${lastName(R)}`; }

export function email(name, R, domain) {
  const base = (name || fullName(R)).toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/^\.+|\.+$/g,'');
  return `${base}@${domain || pick(DOMAINS, R)}`;
}

export function phoneE164(R, cc = '+1') {
  let out = cc.replace(/[^\d+]/g,'');
  for (let i=0;i<10;i++) out += int(0,9,R);
  return out;
}

export function street(R) { return `${int(100,9999,R)} ${pick(STREETS,R)} St`; }
export function city(R)   { return pick(CITIES,R); }
export function state(R)  { return pick(STATES,R); }
export function zip(R)    { return String(int(10000,99999,R)); }
export function country(R){ return pick(COUNTRIES,R); }

export function address(R) {
  return { line1: street(R), city: city(R), state: state(R), zip: zip(R), country: country(R) };
}

export function company(R) {
  const adj = ['Acme','Global','Prime','Next','Quantum','Bright','Apex','Nimbus','Vertex','Pioneer'];
  const noun = ['Labs','Systems','Solutions','Industries','Works','Analytics','Dynamics','Holdings'];
  return `${pick(adj,R)} ${pick(noun,R)}`;
}

export function user(R) {
  const name = fullName(R);
  return {
    id: `u_${int(100000,999999,R)}`,
    name,
    email: email(name, R),
    phone: phoneE164(R),
    address: address(R),
    company: company(R)
  };
}

export function rows(count = 10, seed) {
  const R = rng(seed);
  const out = [];
  for (let i=0;i<count;i++) out.push(user(R));
  return out;
}

// convenience default: deterministic by seed or time-based if omitted
export default { rng, rows, user, firstName, lastName, fullName, email, phoneE164, address, company };
