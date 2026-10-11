/* =========================================================
   Pixel pet · dot-matrix digits · embroidered patch SVG
   ========================================================= */

/* ---------- Pixel pet ---------- */
const PET_COLORS = {
  k: '#5b4a6b', // outline
  w: '#fffaf0', // egg
  p: '#ffb3c7', // pink
  m: '#a8e6c9', // mint spot
  b: '#c8f0dc', // body
  r: '#ffb3c7', // cheek
  l: '#7cc6a4', // leaf
  g: '#5fa884', // stem
  e: '#ff9fb2', // beret
  E: '#e57f97', // beret band
  y: '#ffe08a', // pencil
  o: '#5b4a6b', // pencil tip
  s: '#fff1a8', // sparkle
  t: '#f7b2c4', // eraser
};

const EGG = [
  '................',
  '......kkkk......',
  '....kkwwwwkk....',
  '...kwwwwwwwwk...',
  '...kwwppwwwwk...',
  '..kwwwppwwmmwk..',
  '..kwwwwwwwmmwk..',
  '..kwwwwwwwwwwk..',
  '..kwmmwwwwppwk..',
  '..kwmmwwwwppwk..',
  '..kwwwwwwwwwwk..',
  '...kwwwwwwwwk...',
  '...kwwwwwwwwk...',
  '....kkwwwwkk....',
  '......kkkk......',
  '................',
];

const BODY = [
  '................',
  '................',
  '................',
  '.....kkkkkk.....',
  '...kkbbbbbbkk...',
  '..kbbbbbbbbbbk..',
  '.kbbbbbbbbbbbbk.',
  '.kbbkbbbbbbkbbk.',
  '.kbbkbbbbbbkbbk.',
  '.kbrrbbbbbbrrbk.',
  '.kbbbbbkkbbbbbk.',
  '.kbbbbbbbbbbbbk.',
  '..kbbbbbbbbbbk..',
  '...kkbbbbbbkk...',
  '.....kkkkkk.....',
  '................',
];

const SPROUT = [
  '.....ll.ll......',
  '......lgl.......',
  '.......g........',
];

const BERET = [
  '................',
  '........E.......',
  '....eeeeeeee....',
  '...eeeeeeeeeee..',
  '....EEEEEEEE....',
];

const PENCIL = { // [x, y, color]
  px: [[14, 6, 't'], [14, 7, 'y'], [13, 8, 'y'], [14, 8, 'y'], [13, 9, 'y'], [13, 10, 'o'], [12, 11, 'o']],
};
const SPARKLES = [[1, 2, 's'], [0, 3, 's'], [2, 3, 's'], [1, 4, 's'], [15, 1, 's'], [14, 12, 's']];

function petGrid(level, mood) {
  if (level <= 1) return EGG.map(r => r.split(''));
  const g = BODY.map(r => r.split(''));
  const overlay = (rows, oy = 0) => rows.forEach((row, y) =>
    row.split('').forEach((c, x) => { if (c !== '.') g[y + oy][x] = c; }));
  if (level === 3) overlay(SPROUT);
  if (level >= 4) overlay(BERET);
  if (level >= 5) {
    PENCIL.px.forEach(([x, y, c]) => (g[y][x] = c));
    SPARKLES.forEach(([x, y, c]) => (g[y][x] = c));
  }
  if (mood === 'blink') { g[7][4] = 'b'; g[7][11] = 'b'; }
  if (mood === 'happy') {
    g[8][4] = 'b'; g[8][11] = 'b';
    g[8][3] = 'k'; g[8][5] = 'k'; g[8][10] = 'k'; g[8][12] = 'k';
  }
  return g;
}

function drawPet(canvas, level, mood = 'idle') {
  const ctx = canvas.getContext('2d');
  const n = 16;
  const s = canvas.width / n;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petGrid(level, mood).forEach((row, y) => row.forEach((c, x) => {
    if (c === '.') return;
    ctx.fillStyle = PET_COLORS[c];
    ctx.fillRect(x * s, y * s, s, s);
  }));
}

/* ---------- Ladybug (easter egg) ---------- */
const BUG = [
  '..kk..kk..',
  '...k..k...',
  '..kkkkkk..',
  '.kRRkkRRk.',
  'kRRRkkRRRk',
  'kRkRkkRkRk',
  'kRRRkkRRRk',
  '.kRRkkRRk.',
  '..kkkkkk..',
];
function drawBug(canvas) {
  const ctx = canvas.getContext('2d');
  const s = canvas.width / 10;
  BUG.forEach((row, y) => row.split('').forEach((c, x) => {
    if (c === '.') return;
    ctx.fillStyle = c === 'k' ? '#4a3f55' : '#ff8fa3';
    ctx.fillRect(x * s, y * s, s, s);
  }));
}

/* ---------- Dot-matrix digits ---------- */
const DIGITS = {
  0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  1: ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  2: ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  3: ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  4: ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  5: ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  6: ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  7: ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  9: ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
};

function drawDigits(canvas, value, color = '#fffaf0') {
  const ctx = canvas.getContext('2d');
  const str = String(Math.max(0, Math.floor(value))).padStart(5, '0').slice(-5);
  const W = canvas.width, H = canvas.height;
  const cols = str.length * 6 - 1;
  const cell = Math.min(W / cols, H / 7);
  const ox = (W - cols * cell) / 2, oy = (H - 7 * cell) / 2;
  ctx.clearRect(0, 0, W, H);
  [...str].forEach((d, i) => {
    DIGITS[d].forEach((row, y) => [...row].forEach((c, x) => {
      const cx = ox + (i * 6 + x) * cell + cell / 2;
      const cy = oy + y * cell + cell / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, cell * (c === '#' ? 0.42 : 0.18), 0, Math.PI * 2);
      ctx.fillStyle = c === '#' ? color : 'rgba(255,255,255,.16)';
      ctx.fill();
    }));
  });
}

/* ---------- Embroidered patch SVG ---------- */
function polarPath(rFn, cx = 100, cy = 100, steps = 160) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const [r, rx] = [].concat(rFn(t));
    const x = cx + Math.sin(t) * (rx ?? r);
    const y = cy - Math.cos(t) * r;
    d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d + 'Z';
}

function superellipse(a, b, n) {
  return t => {
    const c = Math.cos(t), s = Math.sin(t);
    const r = Math.pow(Math.pow(Math.abs(c / b), n) + Math.pow(Math.abs(s / a), n), -1 / n);
    return r;
  };
}

const SHAPES = {
  circle: R => () => R,
  squircle: R => superellipse(R, R, 4),
  badge: R => superellipse(R * 0.92, R * 0.78, 6),
  star: R => t => {
    const k = 12;
    const f = (Math.cos(t * k) + 1) / 2;
    return R * (0.74 + 0.26 * Math.pow(f, 1.6));
  },
  scallop: R => t => R * (0.93 + 0.07 * Math.cos(t * 16)),
  // 아래쪽에만 녹아내리는 drip 이 붙는 말랑한 형태
  blob: R => t => {
    const drip = Math.cos(t) < -0.3 ? 0.09 * Math.max(0, Math.sin(7 * t)) : 0;
    return R * (0.88 + 0.06 * Math.sin(3 * t + 0.6) + 0.04 * Math.cos(5 * t) + drip);
  },
  // 세로로 긴 팔각형 — [세로 반지름, 가로 반지름]
  octagon: R => t => {
    const a = Math.PI / 8;
    const tt = ((t + a) % (2 * a)) - a;
    const r = (R * Math.cos(a)) / Math.cos(tt);
    return [r * 1.08, r * 0.84];
  },
};

const ICONS = {
  cursor: p => `
    <g transform="translate(64 34) rotate(-10)">
      <path d="M0 0 L0 46 L12 35 L21 54 L30 50 L21 31 L37 30 Z" fill="${p.accent}" stroke="${p.ink}" stroke-width="5" stroke-linejoin="round"/>
      <rect x="40" y="2" width="38" height="24" rx="6" fill="${p.ink}"/>
      <text x="59" y="20" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="15" fill="${p.fill}">&lt;/&gt;</text>
    </g>`,
  waves: p => `
    <g fill="#ffffff" opacity=".9">
      <ellipse cx="100" cy="62" rx="32" ry="9" transform="rotate(-12 100 62)"/>
      <ellipse cx="100" cy="80" rx="40" ry="10" transform="rotate(-12 100 80)"/>
      <ellipse cx="100" cy="98" rx="32" ry="9" transform="rotate(-12 100 98)"/>
    </g>`,
  burst: p => {
    let s = '';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const c = [p.accent, '#ffffff', '#c8f0dc', '#ffb3c7'][i % 4];
      s += `<line x1="${100 + Math.cos(a) * 12}" y1="${70 + Math.sin(a) * 12}" x2="${100 + Math.cos(a) * 30}" y2="${70 + Math.sin(a) * 30}" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`;
    }
    return s + `<circle cx="100" cy="70" r="7" fill="${p.accent}"/>`;
  },
  sparkle: p => `
    <path d="M100 38 Q104 58 122 62 Q104 66 100 86 Q96 66 78 62 Q96 58 100 38Z" fill="#fff1a8" stroke="${p.ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M128 34 Q130 42 137 44 Q130 46 128 54 Q126 46 119 44 Q126 42 128 34Z" fill="${p.accent}"/>`,
  cherry: p => `
    <path d="M100 20 Q104 32 98 46" stroke="#5fa884" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="98" cy="52" r="13" fill="#ff6f91" stroke="${p.ink}" stroke-width="3"/>
    <circle cx="93" cy="47" r="4" fill="#fff"/>`,
  shield: p => `
    <path d="M100 30 L134 42 L134 72 Q134 94 100 108 Q66 94 66 72 L66 42 Z" fill="${p.ink}"/>
    <path d="M100 42 L122 50 L122 70 Q122 86 100 96 Q78 86 78 70 L78 50 Z" fill="none" stroke="${p.fill}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M110 60 Q100 54 92 60 Q88 68 92 76 Q100 82 110 76" fill="none" stroke="${p.fill}" stroke-width="6" stroke-linecap="round"/>`,
  laurel: p => {
    let s = '';
    for (let i = 0; i < 6; i++) {
      const y = 132 - i * 13, dx = 40 + i * 2;
      s += `<ellipse cx="${100 - dx}" cy="${y}" rx="5" ry="10" transform="rotate(${-30 + i * 6} ${100 - dx} ${y})" fill="#f7d58b"/>`;
      s += `<ellipse cx="${100 + dx}" cy="${y}" rx="5" ry="10" transform="rotate(${30 - i * 6} ${100 + dx} ${y})" fill="#f7d58b"/>`;
    }
    return s;
  },
};

function arcText(id, r, text, color, size, flip = false) {
  const d = flip
    ? `M ${100 - r} 100 A ${r} ${r} 0 0 0 ${100 + r} 100`
    : `M ${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`;
  return `<path id="${id}" d="${d}" fill="none"/>
    <text font-family="Space Mono" font-weight="700" font-size="${size}" fill="${color}" letter-spacing="1.5">
      <textPath href="#${id}" startOffset="50%" text-anchor="middle">${text}</textPath></text>`;
}

function patchSVG(p) {
  const outer = polarPath(SHAPES[p.shape](92));
  const inner = polarPath(SHAPES[p.shape](80));
  const stitch = polarPath(SHAPES[p.shape](73));
  const uid = 'p-' + p.id;
  const big = (txt, y, size, fill = p.fill) =>
    `<text x="100" y="${y}" text-anchor="middle" font-family="Bagel Fat One" font-size="${size}" fill="${fill}" stroke="${p.ink}" stroke-width="7" paint-order="stroke" stroke-linejoin="round">${txt}</text>`;

  let body = '';
  switch (p.shape) {
    case 'circle':
      body = ICONS[p.icon](p) + big(p.title, 126, 24, '#fffaf0') + arcText(uid + '-a', 64, p.sub, p.ink, 11, true);
      break;
    case 'scallop':
      body = ICONS[p.icon](p) + big(p.title, 118, 76, p.accent) +
        `<rect x="44" y="124" width="112" height="24" rx="5" fill="${p.ink}" transform="rotate(-4 100 136)"/>
         <text x="100" y="142" text-anchor="middle" font-family="Bagel Fat One" font-size="17" fill="${p.accent}" transform="rotate(-4 100 136)">★ ${p.sub} ★</text>
         <text x="100" y="166" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="9" fill="${p.ink}">${p.sub2}</text>`;
      break;
    case 'blob':
      body = ICONS[p.icon](p) + big(p.title, 98, 34, '#fffaf0') + big(p.title2, 134, 32, '#fff1a8') +
        `<path d="M54 146 Q100 156 146 142" stroke="${p.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      break;
    case 'octagon':
      {
        // 긴 부제는 마지막 공백에서 두 줄로
        const i = p.sub.lastIndexOf(' ');
        const [l1, l2] = i > 0 ? [p.sub.slice(0, i), p.sub.slice(i + 1)] : [p.sub, ''];
        body = ICONS[p.icon](p) + big(p.title, 138, 30, '#fffaf0') +
          `<text text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="9" fill="${p.ink}">
            <tspan x="100" y="156">${l1}</tspan><tspan x="100" y="167">${l2}</tspan></text>`;
      }
      break;
    case 'star':
      body = ICONS[p.icon](p) + big(p.title, 116, 26, '#fffaf0') +
        `<text x="100" y="138" text-anchor="middle" font-family="Bagel Fat One" font-size="16" fill="${p.accent}" stroke="${p.ink}" stroke-width="4" paint-order="stroke">${p.sub}</text>`;
      break;
    case 'squircle':
      body = ICONS[p.icon](p) +
        `<rect x="30" y="118" width="140" height="44" rx="12" fill="${p.ink}"/>
         <text x="100" y="138" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="11" fill="#fffaf0">${p.sub}</text>
         <text x="100" y="157" text-anchor="middle" font-family="Bagel Fat One" font-size="17" fill="${p.fill}">${p.title}</text>`;
      break;
    default: // badge
      body = ICONS[p.icon](p) +
        `<g transform="rotate(-8 100 130)">
          <rect x="30" y="106" width="140" height="56" rx="10" fill="${p.edge}" stroke="${p.ink}" stroke-width="4"/>
          ${big(p.title, 140, 26, '#fff1a8')}
          <text x="100" y="156" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="10" fill="${p.ink}">— ${p.sub} —</text>
        </g>`;
  }

  return `<svg viewBox="0 0 200 200" aria-hidden="true">
    <defs><clipPath id="${uid}-clip"><path d="${inner}"/></clipPath></defs>
    <path d="${outer}" fill="${p.edge}"/>
    <path d="${outer}" fill="none" stroke="url(#merrow)" stroke-width="10" opacity=".55"/>
    <path d="${inner}" fill="${p.fill}"/>
    <rect width="200" height="200" fill="url(#satin)" clip-path="url(#${uid}-clip)"/>
    <path d="${stitch}" fill="none" stroke="${p.ink}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="4 4"/>
    ${body}
  </svg>`;
}

window.Pixel = { drawPet, drawBug, drawDigits, patchSVG };
