// lancé par le test « local » de NeoDex : la vérification interne, une traversée tenue au clavier, les quatre villes,
// les bras qui moulinent, la chute, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('fuCanvas').__fu, fu = T.st(); ${code} })()`);
  const key = (type, k) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('fuCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'funambule-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await pj(`document.getElementById('fuNew').click(), 0`); await key('keydown', ' '); await key('keyup', ' ');
  // une seconde tenue : on garde l'équilibre en poussant contre la pente
  for (let i = 0; i < 20; i++) { await C(`T.keys.L = fu.th + fu.w * 12 > 0; T.keys.R = !T.keys.L; return 0;`); await sleep(50); }
  await C(`T.keys.L = T.keys.R = false; return 0;`);
  if (await C('return fu.mode;') !== 'play' || !(await C('return fu.d;') > 10)) throw new Error('la traversée devait avancer');
  // les quatre villes, prises en photo juste après leur arrivée (le nom s'affiche), puis en plein milieu
  for (const [n, d] of [['0-paris', 1200], ['1-venise', 2560], ['2-new-york', 5300], ['3-canyon', 7900], ['4-arrivee-venise', 2520], ['7-venise', 3300], ['8-paris-tour', 300]]) {
    await C(`fu.d = ${d}; fu.th = 0; fu.w = 0; return 0;`); await sleep(60); await shot(n); }
  // les bras qui moulinent quand il penche
  await C(`fu.d = 5600; fu.th = .75; fu.w = 0; return 0;`); for (let i = 0; i < 4; i++) { await sleep(50); await C(`fu.th = .75; fu.w = 0; return 0;`); }
  if (!(await C('return fu.panic;') > .4)) throw new Error('les bras devaient mouliner'); await shot('5-moulinet');
  // la chute
  await C(`fu.th = 1.2; return 0;`); await sleep(1000); if (await C('return fu.mode;') !== 'over') throw new Error('il devait tomber'); await shot('6-chute');
  await pj(`document.getElementById('fuNew').click(), 0`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('fuFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('fuCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('fuCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('fuCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok · traversée tenue · 4 villes · moulinet · chute · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
