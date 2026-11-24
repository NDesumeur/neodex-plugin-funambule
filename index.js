// Funambule : Un funambule avance sur un fil tendu très haut au-dessus de la ville. Garde-le en équilibre contre le vent, le plus loin possible.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Funambule</span><span class="hint">Maintiens ← ou → (ou clique à gauche / à droite) pour rattraper l'équilibre · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="fuCanvas" width="288" height="216"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="fuStats"></div></div>
      <div class="row"><button class="btn main" id="fuNew">NOUVELLE TRAVERSÉE</button><button class="btn" id="fuFs">PLEIN ÉCRAN</button></div>
      <div class="sysCard"><b>CONTRATS</b><div class="hint">Traverser jusqu'au poteau demandé avec un plateau de trois verres sur la tête : s'il penche trop, les verres glissent et tombent. Une étoile par verre gardé ; chaque contrat réussi ouvre le suivant.</div><div class="fuGrid" id="fuGrid"></div></div>
      <div class="hint">Penche du côté opposé à la chute. Les rafales sont annoncées par des traits blancs qui traversent l'écran.</div><div class="hint">Tous les 250 m, le fil passe au-dessus d'une autre ville : Paris, Venise, New York la nuit, puis un canyon, et ça recommence. Plus loin, des pigeons se posent au bout de la perche (elle penche de leur côté) et des ballons montent de la ville et la cognent.</div>
    </div></div>
</div>`;
const CSS = `.fuGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}.fuGrid .btn{padding:6px 2px;font-size:12px}
.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 560px;min-width:min(100%,340px);position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(300px,calc((100vh - 190px) * 288 / 216)));height:auto;aspect-ratio:288/216}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 288 / 216))}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'FUNAMBULE', T: { k: '#0a0814', k2: '#141024', fill: '#1e1834', fillOn: '#2a2246', hl: '#362c58', line: '#544680', acc: '#ff4a5a', accL: '#ffb0b8', accS: '#c02a3a', accD: '#4a0a14',
  rivet: '#fff0f2', btn: '#362c58', btnHi: '#6a5aa0', btnLo: '#141024', btnHov: '#463a70', btnHovHi: '#8a7ac0', text: '#f4f0ff', muted: '#b8b0d8', acc2: '#5ec8ff', gold: '#ffd84a',
  orange: '#ffa030', red: '#ff4a5a', green: '#7ee07a', green2: '#2f8a3a', bg: '#0c0a18', bgDot: '#1e1834', bgDot2: '#141024', spark: '#544680', spark2: '#ffd84a',
  tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................',
    '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] },
  emblem: ['....kk......', '...kssk.....', '...kssk.....', 'kkkkrrkkkkkk', '....rr......', '....rr......', '....bb......', '...b..b.....', '...b..b.....', '..kk..kk....', 'wwwwwwwwwwww'],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

/* ---------- Funambule : pendule inversé (l'angle s'emballe tout seul), vent lissé + rafales, la perche corrige ---------- */
const FU = {W: 288, H: 216, ROPE: 150, X: 110, POLE: 260, FALL: 1.05};
const fus = gstore('funambule', {games: 0, poles: 0, meters: 0});
let fu = null;
const fuNoise = x => { const i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f), h = n => { n = Math.imul(n ^ n >>> 15, 0x2c1b3c6d); n = Math.imul(n ^ n >>> 12, 0x297a2d39); return ((n ^ n >>> 15) >>> 0) / 4294967296; }; return h(i) * (1 - s) + h(i + 1) * s; };
// le funambule, 11 × 20 (béret, marinière, ceinture) ; les jambes, les bras et la perche sont tracés à part pour pouvoir bouger
const FU_BODY = ['....kkk....', '..kkrrrkk..', '.krrrrrrrk.', '..kkkkkkk..', '..ksssssk..', '..ksksksk..', '..ksssssk..', '..kssmssk..', '...kssskk..', '....kssk...',
  '..kkwwwkk..', '.kwwwwwwwk.', '.krrrrrrrk.', '.kwwwwwwwk.', '.krrrrrrrk.', '.kwwwwwwwk.', '.krrrrrrrk.', '..kyyyyyk..', '..kbbbbbk..', '..kbbbbbk..'];
const FU_PAL = {k: '#1a1020', s: '#ffd0a8', r: '#ff4a5a', w: '#ffffff', y: '#ffd84a', b: '#2a3a8a', m: '#a04a4a'};
const FU_SPR = (() => { const c = el('canvas'); c.width = 11; c.height = 20; sprite(c.getContext('2d'), FU_BODY, 0, 0, FU_PAL); return c; })();
// les villes : chacune un ciel, un lointain (monuments) et un premier plan, dessinés une fois sur 576 px qui se répètent
const FU_TW = 576;
const fuLayer = (h, fn) => { const c = el('canvas'); c.width = FU_TW; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g, h); return c; };
const fuWin = (g, r, x, y, w, h, lit, dark, p = .3, sx = 3, sy = 4) => { for (let yy = y; yy < y + h - 2; yy += sy) for (let xx = x; xx < x + w - 1; xx += sx) px(g, r() < p ? lit : dark, xx, yy, 1, 2); };
function fuEiffel(g, x, base, h, c, c2) {  // la tour : quatre pieds qui se rejoignent, deux étages, l'antenne
  for (let i = 0; i < h; i++) { const t = i / h, w = Math.round(2 + Math.pow(1 - t, 2.4) * 36), y = base - i;
    if (t < .16) { const leg = Math.max(2, Math.round(w * .28)); px(g, c, x - (w >> 1), y, leg, 1); px(g, c, x + (w >> 1) - leg, y, leg, 1); }  // l'arche entre les pieds
    else { px(g, c, x - (w >> 1), y, w, 1); if (w > 6 && i % 3 === 0) for (let k = 2; k < w - 2; k += 3) px(g, c2, x - (w >> 1) + k, y, 1, 1); } }
  for (const t of [.16, .4]) { const w = Math.round(4 + Math.pow(1 - t, 2.4) * 36); px(g, c, x - (w >> 1) - 1, base - Math.round(t * h) - 1, w + 2, 2); }
  px(g, c, x, base - h - 6, 1, 6);
}
const FU_SCENES = [
  {name: 'PARIS', sky: ['#2a2058', '#3a2a6a', '#5a3a7a', '#8a4a7a', '#c86a6a', '#f0a070'], cloud: '#ffd8c0', cloud2: '#c88aa0', rope: '#1a1020',
    far: fuLayer(130, (g, h) => { const r = seeded(21);
      for (let x = 0; x < FU_TW; x += 6) px(g, '#7a4a7a', x, h - 26 - Math.round(r() * 6), 6, 40);  // les toits lointains
      fuEiffel(g, 150, h - 20, 112, '#4a2a5a', '#7a4a7a');
      px(g, '#6a3a6a', 384, h - 44, 90, 30); for (const [dx, rr] of [[30, 11], [14, 6], [48, 6]]) { for (let k = 0; k <= rr; k++) px(g, '#6a3a6a', 384 + dx - Math.round(Math.sqrt(rr * rr - k * k)), h - 44 - k, Math.round(Math.sqrt(rr * rr - k * k)) * 2, 1); px(g, '#6a3a6a', 384 + dx, h - 44 - rr - 5, 1, 5); }  // la basilique sur sa colline
    }),
    near: fuLayer(80, (g, h) => { const r = seeded(22); let x = 0;
      while (x < FU_TW - 30) { const w = 28 + Math.floor(r() * 22), bh = 30 + Math.floor(r() * 22), y = h - bh;
        px(g, '#1a1020', x, y, w, bh); px(g, '#d8c0a0', x + 1, y + 8, w - 2, bh); px(g, '#b89a80', x + w - 4, y + 8, 3, bh);  // la façade en pierre
        for (let k = 0; k < 8; k++) px(g, k < 2 ? '#1a1020' : '#5a6a88', x + 1 + Math.round(k * .6), y + k, w - 2 - Math.round(k * 1.2), 1);  // le toit de zinc, en pente
        for (let d = x + 5; d < x + w - 6; d += 9) { px(g, '#d8c0a0', d, y + 2, 4, 5); px(g, '#3a3050', d + 1, y + 3, 2, 3); }  // les lucarnes
        px(g, '#8a5a4a', x + 4, y - 4, 3, 5); px(g, '#8a5a4a', x + w - 9, y - 3, 3, 4);
        for (let yy = y + 11; yy < h - 6; yy += 8) { for (let xx = x + 3; xx < x + w - 5; xx += 5) px(g, r() < .25 ? '#ffd84a' : '#4a4060', xx, yy, 2, 4); px(g, '#2a2030', x + 2, yy + 5, w - 6, 1); }  // fenêtres et balcons
        x += w; }
    })},
  {name: 'VENISE', sky: ['#3a6aa8', '#5a8ac0', '#8ab0d0', '#d8c8a0', '#f0b878', '#f8d8a0'], cloud: '#ffffff', cloud2: '#d8c0b0', rope: '#1a1020',
    far: fuLayer(130, (g, h) => { const r = seeded(31), c = '#8a7a9a';
      for (let x = 0; x < FU_TW; x += 8) px(g, '#a08aa0', x, h - 30 - Math.round(r() * 8), 8, 40);
      for (const [x, th] of [[190, 88], [470, 60]]) { px(g, c, x, h - 30 - th, 9, th); px(g, '#6a5a7a', x + 2, h - 30 - th + 6, 5, 6); for (let k = 0; k < 10; k++) px(g, c, x + 4 - (k >> 1), h - 30 - th - 10 + k, (k >> 1) * 2 + 1, 1); }  // les campaniles
      for (const [dx, rr] of [[300, 12], [276, 8], [324, 8], [256, 6], [344, 6]]) { for (let k = 0; k <= rr; k++) { const w = Math.round(Math.sqrt(rr * rr - k * k)); px(g, c, dx - w, h - 40 - k, w * 2, 1); } px(g, c, dx, h - 40 - rr - 4, 1, 4); }  // les coupoles
      px(g, c, 248, h - 40, 104, 14);
    }),
    near: fuLayer(80, (g, h) => { const r = seeded(32), cols = ['#d89a4a', '#c8603a', '#d88a8a', '#e8d0a0', '#b85a4a', '#e0a860']; let x = 0; const wy = h - 16;
      while (x < FU_TW - 24) { const w = 20 + Math.floor(r() * 18), bh = 26 + Math.floor(r() * 26), y = wy - bh, c = cols[Math.floor(r() * cols.length)];
        px(g, '#1a1020', x, y, w, bh); px(g, c, x + 1, y + 1, w - 2, bh - 1); px(g, '#8a3a2a', x, y - 2, w, 3);  // tuiles
        for (let yy = y + 5; yy < wy - 7; yy += 9) for (let xx = x + 3; xx < x + w - 4; xx += 6) { px(g, '#3a2a3a', xx, yy + 1, 3, 5); px(g, '#3a2a3a', xx + 1, yy, 1, 1); px(g, '#f0e0c0', xx - 1, yy + 6, 5, 1); }  // fenêtres en arc
        x += w + (r() < .3 ? 6 : 0); }
      px(g, '#2a6a8a', 0, wy, FU_TW, 16); for (let i = 0; i < 90; i++) px(g, r() < .5 ? '#5aa0c0' : '#1a4a6a', Math.floor(r() * FU_TW), wy + 2 + Math.floor(r() * 13), 3 + Math.floor(r() * 5), 1);  // le canal
      for (let x2 = 30; x2 < FU_TW; x2 += 140) { for (let k = 0; k < 14; k++) px(g, k % 4 < 2 ? '#ffffff' : '#c8303a', x2, wy - 8 + k, 2, 1); }  // les poteaux d'amarrage
      for (const gx of [80, 360]) { px(g, '#1a1020', gx, wy + 4, 26, 3); px(g, '#1a1020', gx + 1, wy + 3, 2, 1); px(g, '#1a1020', gx + 23, wy + 1, 2, 3); px(g, '#1a1020', gx + 17, wy - 6, 1, 10); px(g, '#ffffff', gx + 15, wy - 4, 3, 2); }  // les gondoles et leur gondolier
    })},
  {name: 'NEW YORK', sky: ['#05061a', '#0a0c26', '#10143a', '#161c4a', '#1e2458', '#2a2e66'], stars: true, rope: '#c8c0d8',
    far: fuLayer(130, (g, h) => { const r = seeded(41); let x = 0;
      while (x < FU_TW) { const w = 10 + Math.floor(r() * 16), bh = 40 + Math.floor(r() * 50); px(g, '#141838', x, h - bh, w, bh); fuWin(g, r, x + 2, h - bh + 3, w - 3, bh - 3, '#c8a840', '#141838', .12); x += w + 1; }
      const ex = 250; for (const [w, top] of [[26, 70], [18, 88], [10, 100], [4, 108]]) { px(g, '#1c2048', ex - (w >> 1), h - top, w, top); } px(g, '#c8c8e0', ex, h - 118, 1, 10); px(g, '#ff4a5a', ex, h - 119, 1, 1);  // le gratte-ciel à étages et son antenne
      fuWin(g, r, ex - 12, h - 68, 24, 66, '#ffd84a', '#1c2048', .3);
      const cx = 470; px(g, '#1c2048', cx - 9, h - 92, 18, 92); for (let k = 0; k < 4; k++) { const w = 16 - k * 4; for (let a = 0; a <= w; a += 2) px(g, '#c8c8e0', cx - (w >> 1) + a, h - 92 - k * 5 - Math.round(Math.sin(a / w * Math.PI) * 3), 1, 2); } px(g, '#c8c8e0', cx, h - 116, 1, 6);  // la couronne en arcs
      fuWin(g, r, cx - 7, h - 86, 14, 84, '#ffd84a', '#1c2048', .3);
    }),
    near: fuLayer(80, (g, h) => { const r = seeded(42); let x = 0;
      while (x < FU_TW - 20) { const w = 18 + Math.floor(r() * 22), bh = 34 + Math.floor(r() * 44), y = h - bh;
        px(g, '#05061a', x, y, w, bh); px(g, '#1a1e3a', x + 1, y + 1, w - 2, bh); fuWin(g, r, x + 3, y + 4, w - 5, bh - 4, r() < .5 ? '#ffd84a' : '#fff0c0', '#0e1028', .45, 3, 4);
        if (r() < .5) { const tx = x + 4 + Math.floor(r() * (w - 12)); px(g, '#05061a', tx, y - 9, 7, 7); px(g, '#4a3a3a', tx + 1, y - 8, 5, 5); px(g, '#05061a', tx + 1, y - 2, 1, 2); px(g, '#05061a', tx + 5, y - 2, 1, 2); px(g, '#05061a', tx, y - 10, 7, 1); }  // un réservoir d'eau sur le toit
        x += w + 1; }
    })},
  {name: 'CANYON', sky: ['#3a8ad8', '#5aa0e0', '#8ac0e8', '#f0c890', '#f0a060', '#e88050'], cloud: '#fff0e0', cloud2: '#e8b8a0', rope: '#1a1020',
    far: fuLayer(130, (g, h) => { const r = seeded(51); let x = -10;
      while (x < FU_TW) { const w = 50 + Math.floor(r() * 70), bh = 40 + Math.floor(r() * 42), y = h - bh;
        for (let yy = y; yy < h; yy++) { const sl = Math.max(0, Math.round((yy - y) * .5)), band = Math.floor((yy - y) / 7) % 2; px(g, band ? '#a8584a' : '#b8684a', x - sl, yy, w + sl * 2, 1); }  // un plateau aux couches de roche
        px(g, '#d8885a', x, y, w, 2); x += w + 20 + Math.floor(r() * 40); }
    }),
    near: fuLayer(80, (g, h) => { const r = seeded(52);
      px(g, '#d8a060', 0, h - 12, FU_TW, 12); for (let i = 0; i < 80; i++) px(g, '#c08850', Math.floor(r() * FU_TW), h - 11 + Math.floor(r() * 11), 2, 1);
      for (let x = 20; x < FU_TW - 30; x += 70 + Math.floor(r() * 50)) { const w = 10 + Math.floor(r() * 8), bh = 30 + Math.floor(r() * 36);  // les cheminées de fée
        for (let yy = h - 12 - bh; yy < h - 12; yy++) { const t = (yy - (h - 12 - bh)) / bh, ww = Math.round(w * (.7 + .3 * Math.sin(t * 9))); px(g, '#1a1020', x - (ww >> 1) - 1, yy, ww + 2, 1); px(g, Math.floor(yy / 5) % 2 ? '#c86a4a' : '#b85a3a', x - (ww >> 1), yy, ww, 1); }
        px(g, '#8a3a2a', x - (w >> 1) - 2, h - 12 - bh - 3, w + 4, 4); }
      const ax = 300; for (let a = 0; a < 60; a++) { const t = a / 59 * Math.PI, ox = Math.round(-Math.cos(t) * 30), oy = Math.round(Math.sin(t) * 34); px(g, '#1a1020', ax + ox - 1, h - 12 - oy - 6, 8, 9); px(g, '#c86a4a', ax + ox, h - 12 - oy - 5, 6, 7); }  // l'arche de pierre
      for (let k = 0; k < 6; k++) { const cx = 40 + k * 97 + Math.floor(r() * 20), ch = 10 + Math.floor(r() * 8); px(g, '#2a6a3a', cx, h - 12 - ch, 3, ch); px(g, '#2a6a3a', cx - 3, h - 18 - Math.floor(ch / 3), 2, 6); px(g, '#2a6a3a', cx - 3, h - 13 - Math.floor(ch / 3), 4, 2); px(g, '#2a6a3a', cx + 4, h - 20 - Math.floor(ch / 4), 2, 6); px(g, '#2a6a3a', cx + 2, h - 15 - Math.floor(ch / 4), 4, 2); px(g, '#4a9a4a', cx, h - 12 - ch, 1, ch); }  // les cactus
    })},
];
const FU_STARS = Array.from({length: 40}, (_, i) => { const r = seeded(60 + i); return [Math.floor(r() * 288), Math.floor(r() * 120), r() < .3]; });
const fuScene = d => { const m = d / 10; return {i: Math.floor(m / 250) % FU_SCENES.length, prev: (Math.floor(m / 250) + FU_SCENES.length - 1) % FU_SCENES.length, t: m < 250 ? 1 : Math.min(1, (m % 250) / 20), into: m % 250}; };
// les contrats : nombre de poteaux à atteindre ; les pigeons et ballons arrivent à partir du 3e
const FU_CT = [2, 2, 3, 3, 4, 4, 5, 6];
fus.contracts ??= {}; fus.birds ??= 0; fus.balloons ??= 0;
const FU_BIRD = ['..kk...', '.kgwk..', 'kgggkoo', '.kgggk.', '..kGGk.', '...y.y.'];
const FU_BIRDS = [false, true].map(fl => { const c = el('canvas'); c.width = 7; c.height = 6; const g = c.getContext('2d'); if (fl) { g.translate(7, 0); g.scale(-1, 1); } sprite(g, FU_BIRD, 0, 0, {k: '#1a1020', g: '#9a9aa8', G: '#6a6a78', w: '#ffffff', o: '#ffa83a', y: '#ffa83a'}); return c; });
const FU_BCOL = [['#ff4a5a', '#ffb0b8'], ['#4ac8ff', '#c0f0ff'], ['#ffd84a', '#fff4b0'], ['#7ee07a', '#d0ffc8']];
function fuTips() {  // les deux bouts de la perche, à l'écran (sans le ploiement)
  const th = fu.th, fy = FU.ROPE - 1 + Math.round(fu.fallY), sx = FU.X + Math.sin(th) * 14, sy = fy - Math.cos(th) * 14, cx = Math.cos(th), cy = Math.sin(th);
  return [[sx - cx * 38, sy - cy * 38 + 3], [sx + cx * 38, sy + cy * 38 + 3]];
}
function fuObstacles(sp) {  // un pigeon ou un ballon de temps en temps ; le pigeon posé alourdit son bout de perche, le ballon le cogne
  const free = fu.ck < 0, on = free ? fu.d > 300 : fu.ck >= 2;
  if (on && --fu.nextObs <= 0) { fu.obsN++; fu.nextObs = 420 + Math.random() * 360 - Math.min(160, fu.d / 50);
    if (fu.obsN % 2) fu.birds.push({side: Math.random() < .5 ? -1 : 1, t: 0}); else { const [, [rx, ry]] = fuTips(); fu.balloons.push({x: rx + 70, y: ry + 70 * .45 / sp + (Math.random() - .5) * 10, c: FU_BCOL[fu.obsN / 2 % 4 | 0]}); } }
  for (const b of fu.birds) { b.t++; if (b.t > 60 && b.t < 280) fu.w += b.side * .0011; if (b.t === 61) { fuBeep(1200, .08, 'square', 900); fus.birds++; } }
  fu.birds = fu.birds.filter(b => b.t < 330);
  const tips = fuTips();
  for (const b of fu.balloons) { b.x -= sp; b.y -= .45; for (const [k, [tx, ty]] of tips.entries()) if (!b.pop && Math.hypot(b.x - tx, b.y - ty) < 6) { b.pop = 12; fu.w += k ? -.03 : .03; fus.balloons++; fuBeep(300, .1, 'square', 80); } if (b.pop) b.pop--; }
  fu.balloons = fu.balloons.filter(b => b.pop !== 0 && b.y > -20 && b.x > -20);
}
function fuGlasses() {  // les verres glissent sur le plateau quand on penche ; au bord, ils tombent
  const k = .05 + fu.ck * .006;
  for (const v of fu.glasses) if (!v.gone) { v.v = (v.v + Math.sin(fu.th) * k) * .9; v.x += v.v;
    if (Math.abs(v.x) > 10) { v.gone = true; const th = fu.th; fu.shards.push({x: FU.X + v.x * Math.cos(th) + Math.sin(th) * 38, y: FU.ROPE - 38, vx: v.v, vy: -1, t: 0}); fuBeep(1800, .2, 'square', 300); } }
  for (const s of fu.shards) { s.t++; s.vy += .2; s.x += s.vx; s.y += s.vy; } fu.shards = fu.shards.filter(s => s.y < FU.H + 10);
  const left = fu.glasses.filter(v => !v.gone).length;
  if (!left) { fu.mode = 'over'; fu.how = 'verres'; fu.dead = 0; fuBeep(200, .6, 'sawtooth', 60); fuInfo(); return true; }
  if (fu.d >= fu.goal) { fu.mode = 'won'; fu.stars = left; fu.dead = 0; if (left > (fus.contracts[fu.ck] || 0)) fus.contracts = {...fus.contracts, [fu.ck]: left}; saveGames(); fuInfo(); fuGrid(); [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => fuBeep(f, .15, 'square'), i * 100)); return true; }
  return false;
}
function fuNew(ck = -1) { fu = Object.assign(fu || {tick: 0, raf: 0}, {ck, goal: ck >= 0 ? FU_CT[ck] * FU.POLE + 40 : 0, glasses: ck >= 0 ? [-6, 0, 6].map(x => ({x, v: 0})) : [], shards: [], birds: [], balloons: [], nextObs: ck >= 0 ? 260 : 500, obsN: 0, how: '', stars: 0}); Object.assign(fu, {seen: fu ? fu.tick : 0, mode: 'ready', th: 0, w: 0, d: 0, phi: 0, panic: 0, push: 0, gust: 0, gustDir: 1, nextGust: 400, streaks: [], fallY: 0, record: false, dead: 0, poles: 0, step: 0}); }
let fuac = null;
let fuBeep = function (f, d, type = 'triangle', slide = 0) { try { fuac ??= new AudioContext(); const o = fuac.createOscillator(), g = fuac.createGain(), t = fuac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(.05, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(fuac.destination); o.start(t); o.stop(t + d + .02); } catch {} }
const fuKeys = {L: false, R: false, ptr: 0};
function fuStart() {
  if (fu.mode === 'ready') { fu.mode = 'play'; fus.games++; saveGames(); }
  else if (fu.mode === 'pause') fu.mode = 'play';
  else if (fu.mode === 'over' && fu.dead > 50) fuNew(fu.ck);
  else if (fu.mode === 'won' && fu.dead > 50) fuNew(fu.ck + 1 < FU_CT.length ? fu.ck + 1 : -1);
}
const fuWind = () => (fuNoise(fu.d / 90) - .5) * Math.min(1, fu.d / 2500) * .0016 + fu.gust * fu.gustDir;
function fuUpdate() {
  if (fu.mode === 'won') { fu.dead++; return; }
  if (fu.mode === 'over' && fu.how === 'verres') { fu.dead++; for (const s of fu.shards) { s.vy += .2; s.x += s.vx; s.y += s.vy; } return; }
  if (fu.mode === 'over') { fu.dead++; fu.th += Math.sign(fu.th) * .05; fu.fallY += 1 + fu.dead * .15; fu.panic = 1; fu.phi += .5; return; }
  if (fu.mode !== 'play') return;
  const sp = .55 + Math.min(.35, fu.d / 8000); fu.d += sp; fu.step += sp;
  fu.push = (fuKeys.L || fuKeys.ptr < 0 ? -1 : 0) + (fuKeys.R || fuKeys.ptr > 0 ? 1 : 0);
  // rafales : annoncées par les traits blancs 1 s avant
  if (--fu.nextGust === 60) { fu.gustDir = Math.random() < .5 ? -1 : 1; for (let i = 0; i < 6; i++) fu.streaks.push({x: fu.gustDir > 0 ? -20 - i * 30 : FU.W + 20 + i * 30, y: 30 + Math.random() * 120}); }
  if (fu.nextGust <= 0) { fu.gust = .0006 + Math.min(.0006, fu.d / 30000); fu.nextGust = 360 + Math.random() * 300 - Math.min(150, fu.d / 40); fuBeep(180, .5, 'sawtooth', 120); }
  fu.gust *= .985;
  fuObstacles(sp);
  fu.w += Math.sin(fu.th) * .003 + fuWind() * Math.cos(fu.th) + fu.push * .0026; fu.w *= .98; fu.th += fu.w;
  if (fu.ck >= 0 && fuGlasses()) return;
  const pk = Math.min(1, Math.max(0, (Math.abs(fu.th) - .35) / .4)); fu.panic += (pk - fu.panic) * .15; fu.phi += (.12 + .38 * fu.panic) * (fu.th > 0 ? 1 : -1) * (fu.panic > .05 ? 1 : 0);
  for (const s of fu.streaks) s.x += fu.gustDir * 5; fu.streaks = fu.streaks.filter(s => s.x > -60 && s.x < FU.W + 60 + 200);
  if (Math.floor((fu.d - sp) / FU.POLE) < Math.floor(fu.d / FU.POLE)) { fu.poles++; fuBeep(784, .12, 'square', 1046); }
  if (Math.abs(fu.th) > FU.FALL) { fu.mode = 'over'; fu.dead = 0; fuBeep(500, .9, 'triangle', 60); const m = Math.floor(fu.d / 10); fu.record = fu.ck < 0 && best('funambule', m); fus.poles += fu.poles; fus.meters += m; saveGames(); fuInfo(); }
}
function fuLine(g, x0, y0, x1, y1, c) { const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))); for (let i = 0; i <= n; i++) px(g, c, x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, 1, 1); }
function fuDraw() {
  const g = fu.g, {W, H, ROPE, X} = FU;
  for (; fu.seen < fu.tick; fu.seen++) if (fu.mode !== 'play') fuUpdate();
  g.imageSmoothingEnabled = false;
  // ciel du soir en bandes, nuages, la ville tout en bas
  const SC = fuScene(fu.d), sc = FU_SCENES[SC.i];
  const scene = S => {
    S.sky.forEach((c, i) => px(g, c, 0, i * 30, W, 31)); px(g, S.sky[5], 0, 180, W, 36);
    if (S.stars) { for (const [x, y, big] of FU_STARS) px(g, (fu.tick >> 4) % 7 === (x % 7) ? '#8a8ab0' : '#ffffff', x, y, big ? 2 : 1, 1); for (let k = -6; k <= 6; k++) { const w = Math.round(Math.sqrt(36 - k * k)), w2 = Math.round(Math.sqrt(Math.max(0, 30 - (k + 2) * (k + 2)))); px(g, '#f0f0d8', 236 - w, 28 + k, w * 2 + 1, 1); if (w2) px(g, S.sky[0], 240 - w2, 28 + k, w2 * 2 + 1, 1); } }  // étoiles et croissant de lune
    else for (let i = 0; i < 6; i++) { const x = ((i * 83 - fu.d * .2) % (W + 80) + W + 80) % (W + 80) - 50, y = 18 + (i * 37) % 90; px(g, S.cloud, x, y + 3, 36, 4); px(g, S.cloud, x + 8, y, 18, 3); px(g, S.cloud2, x + 2, y + 7, 32, 2); }
    for (const [L, k, y] of [[S.far, .12, H - 130], [S.near, .35, H - 80]]) { const o = -Math.floor((fu.d * k) % FU_TW); g.drawImage(L, o, y); g.drawImage(L, o + FU_TW, y); }
  };
  if (SC.t < 1) { scene(FU_SCENES[SC.prev]); g.globalAlpha = SC.t; scene(sc); g.globalAlpha = 1; } else scene(sc);
  // le fil et les poteaux (un poteau tous les 26 m)
  const off = fu.d % FU.POLE;
  for (let k = -1; k < 3; k++) { const x = Math.round(X - off + k * FU.POLE + 40); px(g, '#1a1020', x - 3, ROPE, 7, H - ROPE); px(g, '#5a4a6a', x - 2, ROPE, 2, H - ROPE); px(g, '#1a1020', x - 6, ROPE - 3, 13, 4); px(g, '#ffd84a', x - 5, ROPE - 2, 11, 2); }
  for (let x = 0; x < W; x++) px(g, sc.rope, x, ROPE + Math.round(Math.sin((x + fu.d) / 30) * .6), 1, 1);
  for (let x = 0; x < W; x += 3) px(g, '#c8c0b0', x, ROPE - 1, 1, 1);
  for (const s of fu.streaks) { px(g, '#ffffff', s.x, s.y, 18, 1); px(g, '#ffffffaa', s.x + (fu.gustDir > 0 ? -10 : 18), s.y + 3, 10, 1); }
  // le funambule pivote autour de ses pieds ; la perche suit ses épaules et ploie au bout
  const th = Math.round(fu.th * 16) / 16, ph = fu.mode === 'play' ? fu.step / 9 * Math.PI : 0, fy = ROPE - 1 + Math.round(fu.fallY);
  g.save(); g.translate(X, fy); g.rotate(th);
  const seg = (x0, y0, x1, y1, c, w = 2) => { g.fillStyle = c; const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) || 1; for (let i = 0; i <= n; i++) g.fillRect(Math.round(x0 + (x1 - x0) * i / n) - (w >> 1), Math.round(y0 + (y1 - y0) * i / n) - (w >> 1), w, w); };
  // les jambes : un pas l'une devant l'autre sur le fil (pieds à y = 0)
  const step = Math.sin(ph) * 3, knee = Math.abs(Math.cos(ph)) * 2;
  for (const [sgn, c] of [[-1, '#1a1020'], [1, '#2a3a8a']]) { g.fillStyle = '#1a1020'; seg(sgn * 2, -12, sgn * step + 1, -6 - knee, '#1a1020', 3); seg(sgn * step + 1, -6 - knee, sgn * step * 1.4, 0, '#1a1020', 3); g.fillStyle = c; seg(sgn * 2, -12, sgn * step + 1, -6 - knee, c, 1); seg(sgn * step + 1, -6 - knee, sgn * step * 1.4, -1, c, 1); px(g, '#1a1020', Math.round(sgn * step * 1.4) - 2, -2, 5, 2); }
  g.drawImage(FU_SPR, -5, -31);
  if (fu.ck >= 0) { px(g, '#1a1020', -12, -34, 24, 3); px(g, '#c8c8d8', -11, -33, 22, 1);  // le plateau et ses verres
    for (const v of fu.glasses) if (!v.gone) { const x = Math.round(v.x) - 2; px(g, '#1a1020', x - 1, -42, 6, 8); px(g, '#c8f0ff', x, -41, 4, 7); px(g, '#d83a5a', x, -38, 4, 3); px(g, '#ffffff', x, -41, 1, 3); } }
  // les bras : posés sur la perche, ou qui moulinent quand il penche
  const sh = [[-4, -20], [4, -20]], hands = sh.map(([x, y], i) => { const rest = [x * 2.1, -14], a = fu.phi + i * Math.PI, wind = [x + Math.sin(a) * 9, y - Math.cos(a) * 9]; return rest.map((v, k) => v + (wind[k] - v) * fu.panic); });
  sh.forEach(([x, y], i) => { const [hx, hy] = hands[i], ex = (x + hx) / 2 + (i ? 2 : -2) * (1 - fu.panic), ey = (y + hy) / 2 + 1; g.fillStyle = '#1a1020'; seg(x, y, ex, ey, '#1a1020', 3); seg(ex, ey, hx, hy, '#1a1020', 3); g.fillStyle = '#ff4a5a'; seg(x, y, ex, ey, '#ff4a5a', 1); g.fillStyle = '#ffd0a8'; seg(ex, ey, hx, hy, '#ffd0a8', 1); px(g, '#ffd0a8', Math.round(hx) - 1, Math.round(hy) - 1, 2, 2); });
  g.restore();
  // la perche, tenue à la taille : elle ploie au bout du côté où l'on pousse
  const sx = X + Math.sin(th) * 14, sy = fy - Math.cos(th) * 14, cx = Math.cos(th), cy = Math.sin(th), L = 38, tip = fu.push * 3;
  fuLine(g, sx - cx * L, sy - cy * L + 3 - tip, sx + cx * L, sy + cy * L + 3 + tip, '#1a1020');
  px(g, '#ff4a5a', sx - cx * L - 1, sy - cy * L + 2 - tip, 3, 3); px(g, '#ff4a5a', sx + cx * L - 1, sy + cy * L + 2 + tip, 3, 3);
  const tips = fuTips();  // les pigeons (qui arrivent en volant puis se posent) et les ballons
  for (const b of fu.birds) { const [tx, ty] = tips[b.side > 0 ? 1 : 0], k = b.t < 60 ? 1 - b.t / 60 : b.t > 280 ? (b.t - 280) / 50 : 0, fx = tx + b.side * 120 * k, fy2 = ty - 7 - 70 * k, wing = k && (fu.tick >> 2) % 2;
    g.drawImage(FU_BIRDS[b.side > 0 ? 1 : 0], Math.round(fx) - 3, Math.round(fy2)); if (wing) px(g, '#6a6a78', Math.round(fx) - 1, Math.round(fy2) - 2, 3, 2); }
  for (const b of fu.balloons) { const x = Math.round(b.x), y = Math.round(b.y); if (b.pop) { for (let i = 0; i < 8; i++) { const a = i * .785, r = 12 - b.pop; px(g, b.c[0], x + Math.cos(a) * r, y + Math.sin(a) * r, 1, 1); } continue; }
    fuLine(g, x, y + 5, x + Math.round(Math.sin((fu.tick + x) / 9)), y + 13, '#1a1020'); for (let yy = -5; yy <= 5; yy++) { const w = Math.round(Math.sqrt(25 - yy * yy) * .85); px(g, '#1a1020', x - w - 1, y + yy, w * 2 + 3, 1); } for (let yy = -4; yy <= 4; yy++) { const w = Math.round(Math.sqrt(16 - yy * yy) * .85); px(g, b.c[0], x - w, y + yy, w * 2 + 1, 1); } px(g, b.c[1], x - 2, y - 3, 2, 2); }
  for (const s of fu.shards) { px(g, '#c8f0ff', s.x, s.y, 2, 2); px(g, '#d83a5a', s.x + 2, s.y + 1, 1, 1); }
  // la jauge d'équilibre : un arc de pixels, l'aiguille et la zone rouge
  for (let a = -FU.FALL; a <= FU.FALL; a += .03) px(g, Math.abs(a) > FU.FALL * .7 ? '#ff4a5a' : '#ffffff', W / 2 + Math.sin(a) * 30, 46 - Math.cos(a) * 30, 1, 1);
  fuLine(g, W / 2, 46, W / 2 + Math.sin(fu.th) * 26, 46 - Math.cos(fu.th) * 26, Math.abs(fu.th) > FU.FALL * .7 ? '#ff4a5a' : '#ffd84a');
  pxFont(g, Math.floor(fu.d / 10) + ' m', 6, 14, '#ffffff', 12);
  if (fu.ck >= 0) { pxFont(g, 'CONTRAT ' + (fu.ck + 1) + ' : ' + Math.floor(fu.goal / 10) + ' m', 6, 26, '#ffd84a', 8); const p = Math.min(1, fu.d / fu.goal); px(g, '#1a1020', 6, 30, 82, 4); px(g, '#ffd84a', 7, 31, Math.round(80 * p), 2); }
  if (fu.mode === 'play' && SC.into < 30 && (fu.d > 0)) { g.globalAlpha = Math.min(1, (30 - SC.into) / 8); pxFont(g, sc.name, W / 2, 80, '#ffd84a', 16, 'center'); g.globalAlpha = 1; }
  if (fu.mode === 'play' && Math.abs(fuWind()) > .0006) pxFont(g, fuWind() > 0 ? 'VENT →' : '← VENT', W - 6, 14, '#ffffff', 8, 'right');
  if (fu.mode === 'ready') gameText(g, W, [['FUNAMBULE', '#ff4a5a', 16], ['Maintiens ← ou → pour te rattraper', '#ffffff'], ['Espace pour partir', '#b8b0d8'], ['Record ' + (games.best.funambule || 0) + ' m', '#ffd84a']], 78);
  if (fu.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Espace pour reprendre', '#b8b0d8']], 90);
  if (fu.mode === 'won' && fu.dead > 30) gameText(g, W, [['CONTRAT RÉUSSI !', '#7ee07a', 14], ['*'.repeat(fu.stars) + ' · ' + fu.stars + (fu.stars > 1 ? ' verres gardés' : ' verre gardé'), '#ffd84a'], [fu.dead > 50 ? (fu.ck + 1 < FU_CT.length ? 'Espace : contrat suivant' : 'Espace : traversée libre') : '', '#b8b0d8']], 78);
  if (fu.mode === 'over' && fu.how === 'verres' && fu.dead > 40) gameText(g, W, [['PLUS DE VERRES !', '#ff4a5a', 14], ['Contrat ' + (fu.ck + 1) + ' raté à ' + Math.floor(fu.d / 10) + ' m', '#ffffff'], [fu.dead > 50 ? 'Espace pour recommencer' : '', '#b8b0d8']], 78);
  else if (fu.mode === 'over' && fu.dead > 40) gameText(g, W, [['CHUTE !', '#ff4a5a', 14], [Math.floor(fu.d / 10) + ' m · ' + fu.poles + ' poteaux', '#ffffff'], [fu.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.funambule || 0) + ' m', '#ffd84a'], [fu.dead > 50 ? 'Espace pour recommencer' : '', '#b8b0d8']], 78);
}
function fuGrid() {  // les contrats : chacun s'ouvre quand le précédent est réussi
  $('fuGrid').replaceChildren(...FU_CT.map((n, i) => { const s = fus.contracts[i] || 0, b = el('button', 'btn' + (fu?.ck === i ? ' main' : ''), (i + 1) + (s ? ' ' + '*'.repeat(s) : '')); b.title = n * 26 + ' m'; b.disabled = i > 0 && !fus.contracts[i - 1]; b.onclick = () => { fuNew(i); fuGrid(); }; return b; }));
}
function fuInfo() {
  $('fuStats').replaceChildren(...[['Plus loin', (games.best.funambule || 0) + ' m'], ['Traversées', fus.games], ['Poteaux franchis', fus.poles], ['Distance totale', fus.meters + ' m'], ['Contrats', Object.keys(fus.contracts).length + ' / ' + FU_CT.length + ' · ' + Object.values(fus.contracts).reduce((a, b) => a + b, 0) + ' étoiles'], ['Pigeons posés', fus.birds], ['Ballons éclatés', fus.balloons]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !fu || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'q') { e.preventDefault(); fuKeys.L = true; if (fu.mode !== 'play') fuStart(); }
  if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); fuKeys.R = true; if (fu.mode !== 'play') fuStart(); }
  if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); fuStart(); }
  if (e.key.toLowerCase() === 'p' && fu.mode === 'play') fu.mode = 'pause';
});
document.addEventListener('keyup', e => { if (['ArrowLeft', 'a', 'q'].includes(e.key)) fuKeys.L = false; if (['ArrowRight', 'd'].includes(e.key)) fuKeys.R = false; });
$('fuCanvas').onpointerdown = e => { e.preventDefault(); if (!fu) return; if (fu.mode !== 'play') return fuStart(); const b = e.currentTarget.getBoundingClientRect(); fuKeys.ptr = e.clientX < b.left + b.width / 2 ? -1 : 1; };
document.addEventListener('pointerup', () => { fuKeys.ptr = 0; });
$('fuNew').onclick = () => { fuNew(); fuGrid(); $('fuNew').blur(); };
$('fuFs').onclick = () => { $('fuFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else $('fuCanvas').parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
function fuCheck() {  // vérification : sans rien faire il tombe ; en corrigeant contre l'angle il tient 60 s ; les villes se suivent ; les bras moulinent quand il penche
  const keep = fu, realBest = games.best.funambule, realStats = {...fus}, kb = fuBeep, bad = []; fuBeep = () => {}; fu = null;
  fuNew(); fu.mode = 'play'; fu.th = .05; let n = 0; while (fu.mode === 'play' && n < 2000) { fuUpdate(); n++; } if (fu.mode !== 'over') bad.push('chute');
  fuNew(); fu.mode = 'play'; fu.th = .05; let calm = true; for (let i = 0; i < 3600 && fu.mode === 'play'; i++) { fuKeys.L = fu.th + fu.w * 12 > 0; fuKeys.R = !fuKeys.L; fuUpdate(); if (Math.abs(fu.th) < .2 && fu.panic > .5) calm = false; } if (fu.mode !== 'play') bad.push('équilibre'); if (!calm) bad.push('bras au calme'); fuKeys.L = fuKeys.R = false;
  if ([0, 2600, 5100, 7600, 10100].map(d => fuScene(d).i).join() !== '0,1,2,3,0' || fuScene(2600).t !== .5 || fuScene(100).t !== 1) bad.push('villes');
  fuNew(); fu.mode = 'play'; fu.th = .7; const p0 = fu.phi; for (let i = 0; i < 12; i++) { fu.w = 0; fu.th = .7; fuUpdate(); } if (!(fu.panic > .5 && fu.phi - p0 > 1)) bad.push('moulinet');
  const kc = {...fus.contracts}, kbi = fus.birds, kba = fus.balloons;
  const drift = birds => { fuNew(); fu.mode = 'play'; fu.birds = birds; fu.nextObs = 1e9; for (let i = 0; i < 40; i++) fuUpdate(); return fu.th; };
  if (!(drift([{side: 1, t: 61}]) > drift([]) + .02 && drift([{side: -1, t: 61}]) < -.02)) bad.push('pigeon');
  fuNew(); fu.mode = 'play'; fu.nextObs = 1e9; const [, [rx, ry]] = fuTips(); fu.balloons = [{x: rx + .6, y: ry + .45, c: FU_BCOL[0]}]; const w0 = fu.w; fuUpdate(); if (!(fu.w < w0 - .02 && fu.balloons[0]?.pop)) bad.push('ballon');
  fuNew(0); fu.mode = 'play'; for (let i = 0; i < 40 && fu.mode === 'play'; i++) { fu.th = .6; fu.w = 0; fuUpdate(); } if (fu.glasses.every(v => !v.gone)) bad.push('les verres ne glissent pas');
  fuNew(0); fu.mode = 'play'; for (let i = 0; i < 300; i++) { fu.th = 0; fu.w = 0; fuUpdate(); } if (fu.glasses.some(v => v.gone)) bad.push('les verres tombent à plat');
  fu.d = fu.goal - .1; fu.th = 0; fuUpdate(); if (!(fu.mode === 'won' && fu.stars === 3 && fus.contracts[0] === 3)) bad.push('contrat réussi');
  fus.contracts = kc; fus.birds = kbi; fus.balloons = kba;
  if (FU_BODY.some(r => r.length !== 11) || FU_SCENES.some(S => S.far.width !== FU_TW || S.near.width !== FU_TW)) bad.push('dessins');
  if (realBest === undefined) delete games.best.funambule; else games.best.funambule = realBest; Object.assign(fus, realStats); fuBeep = kb;
  fu = keep; return bad.length ? bad.join(', ') : 'ok';
}
{ const c = fuCheck(); console.assert(c === 'ok', 'funambule', c); }
$('fuCanvas').__fu = {st: () => fu, check: fuCheck, keys: fuKeys, go: fuNew, tips: fuTips};
ctx.onOpen(() => {
  if (!fu || !fu.g) { fuNew(); fu.g = $('fuCanvas').getContext('2d'); } fuGrid();
  gameLoop(fu, 'funambule', fuUpdate, fuDraw); fuInfo();
});
}
