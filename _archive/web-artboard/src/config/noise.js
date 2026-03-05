export const TILE = 80, STEP = 8;

export function hashNoise(x, y) {
  let h = ((x * 374761393 + y * 668265263 + 1274126177) | 0);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}

export const noiseDots = [];
for (let y = 0; y < TILE; y += STEP)
  for (let x = 0; x < TILE; x += STEP) {
    const r = hashNoise(x, y);
    noiseDots.push({ cx: x+1, cy: y+1, r: 0.3+r*0.4, opDark: 0.01+r*0.06, opLight: 0.01+r*0.05 });
  }
