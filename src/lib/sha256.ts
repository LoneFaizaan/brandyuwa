/**
 * Small synchronous SHA-256 (hex output).
 * Used instead of crypto.subtle because that API is missing on plain-http
 * pages, e.g. when testing the site on a phone over the local network.
 */
const K: number[] = [];
const H0: number[] = [];

(() => {
  const isPrime = (n: number) => {
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  };
  const frac = (x: number) => ((x - Math.floor(x)) * 0x100000000) >>> 0;
  let n = 2;
  while (K.length < 64) {
    if (isPrime(n)) {
      if (H0.length < 8) H0.push(frac(Math.sqrt(n)));
      K.push(frac(Math.cbrt(n)));
    }
    n++;
  }
})();

export function sha256(message: string): string {
  const bytes = new TextEncoder().encode(message);
  const bitLength = bytes.length * 8;
  const withPadding = ((bytes.length + 9 + 63) >> 6) << 6;
  const data = new Uint8Array(withPadding);
  data.set(bytes);
  data[bytes.length] = 0x80;
  const view = new DataView(data.buffer);
  view.setUint32(withPadding - 8, Math.floor(bitLength / 0x100000000));
  view.setUint32(withPadding - 4, bitLength >>> 0);

  const h = H0.slice();
  const w = new Array<number>(64);
  const rotr = (x: number, r: number) => (x >>> r) | (x << (32 - r));

  for (let offset = 0; offset < withPadding; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[i] + w[i]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    h[0] = (h[0] + a) | 0;
    h[1] = (h[1] + b) | 0;
    h[2] = (h[2] + c) | 0;
    h[3] = (h[3] + d) | 0;
    h[4] = (h[4] + e) | 0;
    h[5] = (h[5] + f) | 0;
    h[6] = (h[6] + g) | 0;
    h[7] = (h[7] + hh) | 0;
  }

  return h.map((x) => (x >>> 0).toString(16).padStart(8, '0')).join('');
}
