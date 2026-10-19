/* ==========================================================================
   STREET RICH FELLAS — demo content
   --------------------------------------------------------------------------
   Everything in this file is PLACEHOLDER until the client's assets arrive.

   To swap in a real product photo, set `front` / `back` to an image path:
       front: 'assets/products/crystal-hoodie-front.png',
       back:  'assets/products/crystal-hoodie-back.png',
   Transparent PNGs (or cutouts on black) work best. When a path is set the
   drawn SVG placeholder is skipped automatically.

   Lookbook photos work the same way: set `img` on a look.
   ========================================================================== */
(function () {
  'use strict';

  // Upcoming drop — drives the hero pill, countdown and featured section.
  const DROP = {
    name: 'The Cherub Drop',
    date: '2026-10-24T10:00:00-07:00', // launch time (Pacific)
    productId: 'cherub-tee',
    blurb: 'The exclusive premium heavyweight tee. 400 GSM cotton, 3D puff print, cut boxy with a dropped shoulder. Limited run — when it\'s gone, it\'s gone.'
  };

  const FREE_SHIPPING = 150;

  // Promo codes the dice game can hand out (and the bag accepts).
  const CODES = {
    FELLAS10: { pct: 0.10, label: 'Fellas 10% off' },
    DOUBLES15: { pct: 0.15, label: 'Doubles 15% off' },
    LUCKY20: { pct: 0.20, label: 'Lucky roll 20% off' }
  };

  const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

  const PRODUCTS = [
    { id: 'crystal-hoodie', name: 'Crystal Script Hoodie', color: 'Black / Rhinestone', price: 140, category: 'tops', kind: 'hoodie', palette: 'black', art: 'crystal', out: ['XL'] },
    { id: 'cherub-tee', name: 'Cherub Heavyweight Tee', color: 'Black', price: 60, category: 'tops', kind: 'tee', palette: 'black', art: 'cherub', out: [] },
    { id: 'rich-fellas-tee', name: 'Rich Fellas Tee', color: 'Vintage Red', price: 60, category: 'tops', kind: 'tee', palette: 'red', art: 'mascot', out: ['S'] },
    { id: 'rich-fellas-shorts', name: 'Rich Fellas Shorts', color: 'Vintage Red', price: 55, category: 'bottoms', kind: 'shorts', palette: 'red', art: 'mascot', out: [] },
    { id: 'script-tee', name: 'Script Logo Tee', color: 'Bone', price: 55, category: 'tops', kind: 'tee', palette: 'bone', art: 'script', out: ['2XL'] },
    { id: 'nylon-jacket', name: 'Nylon Windbreaker', color: 'Graphite', price: 130, category: 'tops', kind: 'jacket', palette: 'graphite', art: 'nylon', out: ['S', 'M'] },
    { id: 'nylon-shorts', name: 'Nylon Track Shorts', color: 'Graphite', price: 70, category: 'bottoms', kind: 'shorts', palette: 'graphite', art: 'nylon', out: [] },
    { id: 'crown-snapback', name: 'Crown Snapback', color: 'Black / Gold', price: 45, category: 'accessories', kind: 'hat', palette: 'black', art: 'crown', sizes: ['OS'], out: [] },
    { id: 'script-shades', name: 'Script Shades', color: 'Red Tint', price: 85, category: 'accessories', kind: 'shades', palette: 'black', art: 'shades', sizes: ['OS'], out: [], soldOut: true }
  ].map(p => ({ sizes: SIZES, front: null, back: null, soldOut: false, ...p }));

  const LOOKS = [
    { id: 'l1', title: 'Crystal Script Hoodie', place: 'Downtown — 1:14 AM', palette: 'black', crystal: true, shades: true, lights: ['#ff4a3d', '#ffb347', '#fff2d6'], bg: ['#1a0707', '#030303'] },
    { id: 'l2', title: 'Rich Fellas Set', place: 'Whittier Blvd', palette: 'red', lights: ['#ffd27a', '#ff8a3d', '#fff'], bg: ['#1c0e05', '#050302'] },
    { id: 'l3', title: 'Script Logo Tee — Bone', place: 'Sunday Cruise', palette: 'bone', lights: ['#9ec9ff', '#ffffff', '#ffd9a0'], bg: ['#08121f', '#020305'] },
    { id: 'l4', title: 'Nylon Windbreaker', place: 'Under the 110', palette: 'graphite', shades: true, lights: ['#c7f0ff', '#5fa8ff', '#ffffff'], bg: ['#06101a', '#010203'] },
    { id: 'l5', title: 'Cherub Heavyweight Tee', place: 'The Barbershop', palette: 'black', lights: ['#7ff0e6', '#e0fffb', '#ffffff'], bg: ['#05211d', '#020404'] },
    { id: 'l6', title: 'Crown Snapback', place: 'Afterhours', palette: 'black', shades: true, lights: ['#ff3df2', '#8a5bff', '#ffd1fb'], bg: ['#1a0624', '#030105'] },
    { id: 'l7', title: 'Rich Fellas Tee', place: 'Boyle Heights', palette: 'red', lights: ['#ffe9a8', '#ff5a36', '#fff'], bg: ['#1f0808', '#040202'] },
    { id: 'l8', title: 'Crystal Script Hoodie', place: 'Lot 7 — 2 AM', palette: 'black', crystal: true, lights: ['#ffffff', '#ffcf6b', '#ff8a3d'], bg: ['#141414', '#000'] }
  ];

  /* ------------------------------------------------------------------------
     Placeholder garment drawings (inline SVG). Delete once real photos land.
     ------------------------------------------------------------------------ */
  const GOLD = '#d4af37';

  const PALETTES = {
    black: { base: '#1a1a1a', edge: '#3a3a3a', shade: '#050505', print: '#ece8df' },
    red: { base: '#8b1d20', edge: '#c0524a', shade: '#3a0507', print: '#f3ece0', wash: true },
    bone: { base: '#e4dfd3', edge: '#ffffff', shade: '#8f897c', print: '#141414' },
    graphite: { base: '#4b4e54', edge: '#8a8e95', shade: '#1c1d20', print: '#1d1e21', sheen: true }
  };

  let uid = 0;

  function hash(str) {
    let h = 0;
    for (const c of str) h = (h * 31 + c.charCodeAt(0)) | 0;
    return Math.abs(h) || 1;
  }

  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const n = v => +v.toFixed(1);

  function script(x, y, size, fill, o = {}) {
    const rot = o.rotate ? ` transform="rotate(${o.rotate} ${x} ${y})"` : '';
    const len = o.w ? ` textLength="${o.w}" lengthAdjust="spacingAndGlyphs"` : '';
    const op = o.opacity ? ` opacity="${o.opacity}"` : '';
    return `<text x="${x}" y="${y}" font-family="Mr Dafoe, cursive" font-size="${size}" fill="${fill}" text-anchor="middle"${len}${rot}${op}>${o.text || 'Street Rich Fellas'}</text>`;
  }

  function gothic(x, y, size, fill, text, o = {}) {
    const len = o.w ? ` textLength="${o.w}" lengthAdjust="spacingAndGlyphs"` : '';
    return `<text x="${x}" y="${y}" font-family="UnifrakturMaguntia, serif" font-size="${size}" fill="${fill}" text-anchor="middle"${len}>${text}</text>`;
  }

  function mono(x, y, size, fill, text) {
    return `<text x="${x}" y="${y}" font-family="JetBrains Mono, monospace" font-size="${size}" fill="${fill}" text-anchor="middle" letter-spacing="${n(size * 0.35)}">${text}</text>`;
  }

  function crown(cx, y, w, fill) {
    const s = w / 100;
    return `<g transform="translate(${n(cx - w / 2)} ${y}) scale(${s})" fill="${fill}"><path d="M6 56 L0 12 L26 32 L50 0 L74 32 L100 12 L94 56 Z"/><rect x="6" y="60" width="88" height="9" rx="2"/></g>`;
  }

  const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

  function die(x, y, s, rot, face, fill, pip) {
    const dots = PIPS[face].map(i => {
      const cx = x + s * (0.25 + 0.25 * (i % 3));
      const cy = y + s * (0.25 + 0.25 * Math.floor(i / 3));
      return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(s * 0.08)}" fill="${pip}"/>`;
    }).join('');
    return `<g transform="rotate(${rot} ${x + s / 2} ${y + s / 2})"><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${n(s * 0.18)}" fill="${fill}"/>${dots}</g>`;
  }

  /* ---- garment silhouettes --------------------------------------------- */
  const KINDS = {
    tee(side, pal) {
      const neck = side === 'front' ? 'C172 80 228 80' : 'C176 68 224 68';
      return {
        outline: [`M150 62 ${neck} 250 62 L300 74 L352 118 L326 176 L290 160 L292 360 L108 360 L110 160 L74 176 L48 118 L100 74 Z`],
        over: side === 'front' ? `<path d="M150 62 C172 80 228 80 250 62 C228 54 172 54 150 62 Z" fill="${pal.shade}"/>` : '',
        details: [
          side === 'front' ? 'M153 66 C174 90 226 90 247 66' : 'M152 66 C176 76 224 76 248 66',
          'M104 78 Q114 120 110 160', 'M296 78 Q286 120 290 160',
          'M56 114 L82 172', 'M344 114 L318 172', 'M110 346 L290 346'
        ],
        floor: 372
      };
    },

    hoodie(side, pal, zip) {
      const body = 'M150 70 L102 84 L70 130 L52 318 L88 324 L112 180 L112 372 L288 372 L288 180 L312 324 L348 318 L330 130 L298 84 L250 70 Z';
      const hood = side === 'front'
        ? 'M146 76 C138 30 168 12 200 12 C232 12 262 30 254 76 C236 100 164 100 146 76 Z'
        : 'M144 82 C134 26 168 6 200 6 C232 6 266 26 256 82 C240 118 160 118 144 82 Z';
      let over = '';
      const details = ['M104 86 Q120 130 112 180', 'M296 86 Q280 130 288 180', 'M112 356 L288 356', 'M55 302 L89 308', 'M345 302 L311 308'];
      if (side === 'front') {
        over += `<path d="M164 74 C164 42 182 30 200 30 C218 30 236 42 236 74 C222 88 178 88 164 74 Z" fill="${pal.shade}"/>`;
        if (zip) {
          over += `<path d="M200 92 L200 372" stroke="#b9bcc2" stroke-width="3"/><rect x="194.5" y="100" width="11" height="20" rx="2" fill="#d2d5da"/>`;
          details.push('M128 250 L146 318', 'M272 250 L254 318');
        } else {
          details.push('M138 284 L262 284 L278 350 L122 350 Z');
        }
        over += `<g stroke="${pal.print}" stroke-width="3" stroke-linecap="round" opacity=".75"><path d="M186 90 L182 154"/><path d="M214 90 L218 154"/></g>`;
      } else {
        details.push('M200 8 L200 112');
      }
      if (zip) {
        over += `<g fill="none" stroke="#e2e3e6" stroke-opacity=".45" stroke-width="1.6"><path d="M112 196 C146 226 150 300 140 372"/><path d="M288 196 C254 226 250 300 260 372"/><path d="M72 140 C66 200 60 260 56 300"/><path d="M328 140 C334 200 340 260 344 300"/></g>`;
      }
      return {
        outline: [body, hood], over, details, floor: 384,
        sheen: '<path d="M126 120 C156 200 136 290 166 370"/><path d="M276 110 C246 200 266 280 236 370"/><path d="M78 150 C72 220 66 270 62 310"/>'
      };
    },

    jacket(side, pal) { return KINDS.hoodie(side, pal, true); },

    shorts(side, pal) {
      let over = `<path d="M108 92 L292 92 L294 126 L106 126 Z" fill="${pal.shade}" opacity=".45"/>`;
      const details = ['M86 316 L184 326', 'M314 316 L216 326', 'M106 126 L294 126'];
      if (side === 'front') {
        over += `<g stroke="${pal.print}" stroke-width="3" stroke-linecap="round" opacity=".8" fill="none"><path d="M194 116 Q188 150 182 170"/><path d="M206 116 Q212 150 218 170"/></g>`;
        details.push('M200 126 L200 194');
      } else {
        details.push('M222 150 L270 150 L268 198 L224 198 Z');
      }
      return {
        outline: ['M108 92 L292 92 L318 330 L214 342 L200 194 L186 342 L82 330 Z'],
        over, details, floor: 356,
        sheen: '<path d="M132 120 C142 200 122 260 122 330"/><path d="M268 120 C258 200 278 260 278 330"/>'
      };
    },

    hat(side, pal) {
      const dome = 'M96 252 C96 150 148 110 200 110 C252 110 304 150 304 252 Z';
      if (side === 'front') {
        return {
          outline: [dome, 'M74 250 C140 236 260 236 326 250 C342 266 322 288 296 292 C236 302 164 302 104 292 C78 288 58 266 74 250 Z'],
          over: `<circle cx="200" cy="111" r="7" fill="${pal.base}" stroke="${pal.edge}" stroke-width="1.5"/><circle cx="158" cy="148" r="3" fill="${pal.shade}"/><circle cx="242" cy="148" r="3" fill="${pal.shade}"/>`,
          details: ['M200 118 L200 236', 'M200 116 C166 136 150 186 146 240', 'M200 116 C234 136 250 186 254 240', 'M92 262 C150 252 250 252 308 262', 'M98 274 C160 264 240 264 302 274'],
          floor: 306
        };
      }
      return {
        under: `<path d="M84 252 C140 268 260 268 316 252 C322 260 316 270 300 272 C236 282 164 282 100 272 C84 270 78 260 84 252 Z" fill="${pal.shade}"/>`,
        outline: [dome],
        over: `<path d="M166 253 C166 220 234 220 234 253 Z" fill="#070707"/><path d="M146 236 L254 236 L254 252 L146 252 Z" fill="${pal.shade}"/>` +
          [160, 173, 186, 214, 227, 240].map(x => `<circle cx="${x}" cy="244" r="3" fill="${pal.edge}"/>`).join(''),
        details: ['M200 118 L200 220', 'M200 116 C166 136 150 186 146 236', 'M200 116 C234 136 250 186 254 236'],
        floor: 290
      };
    },

    shades(side, pal, zip, id) {
      const lensL = 'M70 190 C70 160 100 150 140 152 C175 154 188 168 186 196 C184 228 160 246 128 246 C92 246 70 224 70 190 Z';
      const lensR = 'M330 190 C330 160 300 150 260 152 C225 154 212 168 214 196 C216 228 240 246 272 246 C308 246 330 224 330 190 Z';
      const defs = `<defs><linearGradient id="ln-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff2a1a" stop-opacity=".92"/><stop offset=".6" stop-color="#ff7a2e" stop-opacity=".85"/><stop offset="1" stop-color="#ffc66b" stop-opacity=".75"/></linearGradient></defs>`;
      const shine = '<path d="M90 176 C102 164 128 160 150 163" stroke="#fff" stroke-opacity=".55" stroke-width="5" fill="none" stroke-linecap="round"/>';
      const shineR = '<path d="M234 170 C250 162 280 160 302 168" stroke="#fff" stroke-opacity=".35" stroke-width="4" fill="none" stroke-linecap="round"/>';
      const engrave = script(128, 210, 24, '#fff', { w: 82, opacity: 0.6 });
      if (side === 'front') {
        return {
          custom: defs +
            `<g stroke="${GOLD}" stroke-width="4" stroke-linecap="round" fill="none"><path d="M70 176 L24 166"/><path d="M330 176 L376 166"/><path d="M186 180 C194 168 206 168 214 180"/></g>` +
            `<path d="${lensL}" fill="url(#ln-${id})"/><path d="${lensR}" fill="url(#ln-${id})"/>${shine}${shineR}${engrave}` +
            `<circle cx="184" cy="212" r="4" fill="#efe7d4" opacity=".7"/><circle cx="216" cy="212" r="4" fill="#efe7d4" opacity=".7"/>`,
          floor: 300
        };
      }
      return {
        custom: defs + `<g transform="translate(200 206) scale(2) translate(-128 -199)"><path d="M186 180 C194 168 206 168 214 180" stroke="${GOLD}" stroke-width="3" fill="none"/><path d="M70 176 L24 166" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/><path d="${lensL}" fill="url(#ln-${id})"/>${shine}${engrave}</g>`,
        floor: 330
      };
    }
  };

  /* ---- prints ----------------------------------------------------------- */
  function stones(id, seed, count) {
    const r = rng(seed);
    let dots = '';
    for (let i = 0; i < count; i++) {
      const y = 40 + Math.pow(r(), 0.55) * 340; // denser toward the hem
      const x = 40 + r() * 320;
      dots += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(0.8 + r() * 1.9)}" class="twinkle" style="animation-delay:${n(-r() * 3)}s"/>`;
    }
    return `<g clip-path="url(#cl-${id})" fill="#fff">${dots}</g>`;
  }

  function cherub(cx, cy, s, fill, base) {
    const wing = 'M-8 -6 C-30 -40 -78 -44 -100 -22 C-84 -20 -76 -14 -72 -6 C-90 -4 -98 6 -100 16 C-80 10 -66 12 -58 18 C-72 24 -76 34 -74 44 C-50 30 -26 18 -8 8 Z';
    const feathers = `<g fill="none" stroke="${base}" stroke-width="1.6" opacity=".6"><path d="M-20 -8 C-40 -24 -60 -26 -78 -20"/><path d="M-22 4 C-44 0 -62 6 -80 12"/><path d="M-20 12 C-36 18 -52 28 -62 38"/></g>`;
    return `<g transform="translate(${cx} ${cy}) scale(${s})">
      <g fill="${fill}"><path d="${wing}"/><g transform="scale(-1 1)"><path d="${wing}"/></g></g>
      ${feathers}<g transform="scale(-1 1)">${feathers}</g>
      <path d="M-13 0 C-15 22 -10 40 0 46 C10 40 15 22 13 0 Z" fill="${fill}"/>
      <circle cx="0" cy="-14" r="15" fill="${fill}"/>
      <ellipse cx="0" cy="-38" rx="19" ry="5" fill="none" stroke="${GOLD}" stroke-width="3"/>
    </g>`;
  }

  const ART = {
    crystal(side, pal, id, kind, seed) {
      const type = side === 'front'
        ? crown(200, 118, 28, GOLD) + script(200, 184, 42, pal.print, { w: 150 })
        : crown(200, 136, 46, GOLD) + script(200, 228, 76, pal.print, { w: 210, text: 'Street Rich', rotate: -5 }) + script(206, 290, 76, pal.print, { w: 140, text: 'Fellas', rotate: -5 });
      return type + stones(id, seed, 210);
    },

    cherub(side, pal) {
      if (side === 'front') {
        return script(200, 152, 36, pal.print, { w: 140 }) + mono(200, 170, 7, pal.print, 'LOS ANGELES');
      }
      return gothic(200, 126, 36, pal.print, 'Street Rich', { w: 170 }) + gothic(200, 160, 32, pal.print, 'Fellas', { w: 100 }) +
        cherub(200, 238, 0.9, pal.print, pal.base) +
        `<path d="M140 300 L176 300 M224 300 L260 300" stroke="${pal.print}" stroke-width="1.2"/>` + mono(200, 303, 8, pal.print, 'CALIFORNIA');
    },

    mascot(side, pal, id, kind) {
      if (kind === 'shorts') {
        return side === 'front'
          ? gothic(140, 292, 18, pal.print, 'Street Rich', { w: 78 }) + gothic(140, 310, 16, pal.print, 'Fellas', { w: 46 })
          : `<circle cx="248" cy="268" r="26" fill="none" stroke="${pal.print}" stroke-width="2"/>` + die(236, 256, 22, -12, 5, pal.print, pal.base);
      }
      if (side === 'front') {
        return gothic(200, 142, 36, pal.print, 'Street Rich', { w: 150 }) + gothic(200, 172, 30, pal.print, 'Fellas', { w: 86 });
      }
      return `<circle cx="200" cy="222" r="78" fill="none" stroke="${pal.print}" stroke-width="4"/><circle cx="200" cy="222" r="68" fill="none" stroke="${pal.print}" stroke-width="1.5"/>` +
        gothic(200, 186, 26, pal.print, 'Rich', { w: 52 }) + gothic(200, 276, 26, pal.print, 'Fellas', { w: 78 }) +
        die(160, 200, 38, -14, 6, pal.print, pal.base) + die(204, 206, 38, 10, 1, pal.print, pal.base) +
        gothic(124, 150, 52, pal.print, 'S') + gothic(280, 150, 52, pal.print, 'R') + gothic(282, 338, 52, pal.print, 'F');
    },

    script(side, pal) {
      if (side === 'front') return crown(200, 112, 26, GOLD) + script(200, 160, 36, pal.print, { w: 150 });
      return crown(200, 98, 40, GOLD) + gothic(200, 178, 46, pal.print, 'Street Rich', { w: 200 }) + gothic(200, 226, 46, pal.print, 'Fellas', { w: 116 }) +
        mono(200, 256, 8, pal.print, 'LOS ANGELES · CALIFORNIA');
    },

    nylon(side, pal, id, kind) {
      if (kind === 'shorts') {
        return side === 'front' ? script(148, 300, 22, pal.print, { w: 84, opacity: 0.85 }) : crown(246, 280, 26, pal.print);
      }
      return side === 'front'
        ? script(156, 160, 24, pal.print, { w: 84, opacity: 0.85 })
        : script(200, 236, 58, pal.print, { w: 230, rotate: -4, opacity: 0.85 });
    },

    crown(side, pal) {
      return side === 'front'
        ? crown(200, 144, 52, GOLD) + script(200, 226, 32, pal.print, { w: 128 })
        : script(200, 226, 22, pal.print, { w: 70, text: 'Fellas' });
    },

    shades() { return ''; }
  };

  function renderGarment(p, side) {
    const id = 'g' + (++uid);
    const pal = PALETTES[p.palette];
    const g = KINDS[p.kind](side, pal, false, id);
    const shadow = `<ellipse cx="200" cy="${g.floor}" rx="140" ry="9" fill="#000" opacity=".75" filter="url(#bl-${id})"/>`;
    const filters = `<filter id="bl-${id}" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>`;
    const label = `aria-label="${p.name}, ${side} (placeholder)"`;

    if (g.custom) {
      return `<svg viewBox="0 0 400 420" role="img" ${label} xmlns="http://www.w3.org/2000/svg"><defs>${filters}</defs>${shadow}${g.custom}</svg>`;
    }

    const seed = hash(p.id + side);
    const clip = g.outline.map(d => `<path d="${d}"/>`).join('');
    const bodies = g.outline.map(d => `<path d="${d}" fill="${pal.base}"/><path d="${d}" fill="url(#sh-${id})"/>`).join('');
    const wash = pal.wash
      ? `<g clip-path="url(#cl-${id})" opacity=".6" style="mix-blend-mode:multiply"><rect width="400" height="420" filter="url(#wa-${id})"/></g>`
      : '';
    const sheen = pal.sheen
      ? `<g clip-path="url(#cl-${id})"><g filter="url(#bl-${id})" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="16">${g.sheen || ''}</g></g>`
      : '';
    const details = `<g fill="none" stroke="${pal.edge}" stroke-opacity=".5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${g.details.map(d => `<path d="${d}"/>`).join('')}</g>`;
    const art = ART[p.art](side, pal, id, p.kind, seed);

    return `<svg viewBox="0 0 400 420" role="img" ${label} xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${filters}
        <linearGradient id="sh-${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".12"/>
          <stop offset=".55" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".5"/>
        </linearGradient>
        <clipPath id="cl-${id}">${clip}</clipPath>
        <filter id="wa-${id}"><feTurbulence type="fractalNoise" baseFrequency=".012 .035" numOctaves="3" seed="${seed % 97}"/><feColorMatrix type="saturate" values="0"/></filter>
      </defs>
      ${shadow}${g.under || ''}${bodies}${wash}${sheen}${g.over || ''}${details}${art}
    </svg>`;
  }

  /* ---- lookbook placeholder: flash-lit figure at night ------------------ */
  function renderLook(look) {
    const id = 'lk' + (++uid);
    const pal = PALETTES[look.palette];
    const r = rng(hash(look.id));
    let bokeh = '';
    for (let i = 0; i < 12; i++) {
      const c = look.lights[i % look.lights.length];
      bokeh += `<circle cx="${n(r() * 300)}" cy="${n(20 + r() * 220)}" r="${n(4 + r() * 20)}" fill="${c}" opacity="${n(0.25 + r() * 0.55)}"/>`;
    }
    const torso = 'M54 400 L66 262 C70 222 104 200 150 198 C196 200 230 222 234 262 L246 400 Z';
    const fig = `
      <path d="M136 170 L164 170 L167 206 L133 206 Z" fill="#3a2b22"/>
      <path d="${torso}" fill="${pal.base}"/>
      <path d="${torso}" fill="url(#fl-${id})"/>
      <path d="M86 250 L80 400 M214 250 L220 400" stroke="#000" stroke-opacity=".35" stroke-width="3"/>
      <ellipse cx="150" cy="146" rx="30" ry="34" fill="#4a362a"/>
      <ellipse cx="150" cy="146" rx="30" ry="34" fill="url(#fl-${id})"/>
      <path d="M118 140 C116 98 184 98 182 140 Z" fill="#0d0d0d"/>
      <path d="M116 136 L198 132 C208 134 212 140 206 145 L118 146 Z" fill="#141414"/>
      ${crown(150, 114, 16, GOLD)}
      ${look.shades ? '<path d="M126 150 L148 150 L146 161 L129 161 Z M152 150 L174 150 L171 161 L154 161 Z" fill="#c8261c" opacity=".9"/><path d="M148 152 L152 152" stroke="#d4af37" stroke-width="1.5"/>' : ''}
      <path d="M124 204 C128 254 172 254 176 204" fill="none" stroke="${GOLD}" stroke-width="3" stroke-dasharray="2 2.5"/>
      <rect x="143" y="248" width="14" height="18" rx="2" fill="${GOLD}"/>
      ${script(150, 300, 30, pal.print, { w: 120, opacity: 0.9 })}`;
    const crystals = look.crystal
      ? (() => {
          let d = '';
          for (let i = 0; i < 70; i++) d += `<circle cx="${n(66 + r() * 168)}" cy="${n(270 + Math.pow(r(), 0.6) * 130)}" r="${n(0.6 + r() * 1.4)}" class="twinkle" style="animation-delay:${n(-r() * 3)}s"/>`;
          return `<g clip-path="url(#tc-${id})" fill="#fff">${d}</g>`;
        })()
      : '';
    const body = look.img
      ? `<image href="${look.img}" width="300" height="400" preserveAspectRatio="xMidYMid slice"/>`
      : `<rect width="300" height="400" fill="url(#bg-${id})"/>
         <g filter="url(#bb-${id})">${bokeh}</g>
         <g transform="translate(16 4)" fill="#000" opacity=".55" filter="url(#sd-${id})"><path d="${torso}"/><ellipse cx="150" cy="146" rx="30" ry="34"/><path d="M116 136 L198 132 L206 145 L118 146 Z"/></g>
         ${fig}${crystals}
         <rect width="300" height="400" fill="url(#vg-${id})"/>`;

    return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${look.title} — placeholder lookbook photo" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${look.bg[0]}"/><stop offset="1" stop-color="${look.bg[1]}"/></linearGradient>
        <radialGradient id="fl-${id}" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".5" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
        <radialGradient id="vg-${id}" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient>
        <filter id="bb-${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="sd-${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
        <clipPath id="tc-${id}"><path d="${torso}"/></clipPath>
      </defs>
      ${body}
    </svg>`;
  }

  window.SRF = { DROP, PRODUCTS, LOOKS, CODES, FREE_SHIPPING, renderGarment, renderLook };
})();
