// generate-hash/hash.js
// Minimal, dependency-free hash generator supporting MD5 and SHA-256.
// Uses native SubtleCrypto when available; deterministic, ESM-safe.

export async function generateHash(input, algorithm = 'sha-256') {
  if (typeof input !== 'string') throw new Error('input must be a string');
  const algo = algorithm.toLowerCase();
  if (!['md5', 'sha-256'].includes(algo)) {
    throw new Error("algorithm must be 'md5' or 'sha-256'");
  }

  if (algo === 'md5') {
    // Pure JS MD5 implementation (RFC 1321)
    return md5(input);
  } else {
    // Use native WebCrypto or Node SubtleCrypto
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

// -------- Internal minimal MD5 --------
// Adapted from RFC 1321, minimal non-streaming form.
function md5(str) {
  const x = toBlocks(str);
  const a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const s = [
    7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
    5,9,14,20, 5,9,14,20, 5,9,14,20, 5,9,14,20,
    4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
    6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21
  ];
  const K = new Array(64).fill(0).map((_,i)=>Math.floor(Math.abs(Math.sin(i+1))*2**32));

  let A=a0,B=b0,C=c0,D=d0;
  for (let i=0;i<x.length;i+=16){
    let a=A,b=B,c=C,d=D;
    for (let j=0;j<64;j++){
      let F,g;
      if (j<16){F=(b&c)|((~b)&d);g=j;}
      else if (j<32){F=(d&b)|((~d)&c);g=(5*j+1)%16;}
      else if (j<48){F=b^c^d;g=(3*j+5)%16;}
      else {F=c^(b|(~d));g=(7*j)%16;}
      const tmp=d;
      d=c;c=b;
      const t=a+F+K[j]+x[i+g];a=d;
      b=(b+rotl(t,s[j]))|0;d=tmp;
    }
    A=(A+a)|0;B=(B+b)|0;C=(C+c)|0;D=(D+d)|0;
  }
  return toHex([A,B,C,D]);
}

function toBlocks(str){
  const msg = new TextEncoder().encode(str);
  const len = msg.length;
  const bitLen = len*8;
  const withOne = new Uint8Array(((len+9+63)>>6)<<6);
  withOne.set(msg);
  withOne[len]=0x80;
  const view = new DataView(withOne.buffer);
  view.setUint32(withOne.length-8, bitLen, true);
  const blocks = [];
  for (let i=0;i<withOne.length;i+=4) blocks.push(view.getUint32(i,true));
  return blocks;
}

function rotl(x,n){return (x<<n)|(x>>> (32-n));}
function toHex(words){
  const buf=new Uint8Array(16);
  const view=new DataView(buf.buffer);
  for (let i=0;i<4;i++) view.setUint32(i*4,words[i],true);
  return [...buf].map(b=>b.toString(16).padStart(2,'0')).join('');
}

// Example usage:
// console.log(await generateHash('hello','sha-256'));
// console.log(await generateHash('hello','md5'));