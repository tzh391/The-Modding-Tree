import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
function boot(locale = 'zh') {
  const storage = new Map();
  const c = vm.createContext({
    console: { ...console, log() {} }, URL, URLSearchParams,
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    btoa: s => Buffer.from(s, 'binary').toString('base64'), atob: s => Buffer.from(s, 'base64').toString('binary'),
    setInterval: () => 1, clearInterval: () => {}, setTimeout: () => 1,
    confirm: () => true, alert: msg => { throw new Error(msg); }, prompt: () => null,
    window: { innerWidth: 1280, innerHeight: 900, addEventListener() {}, location: { search: `?lang=${locale}`, href: 'http://localhost/', reload() {} } },
  });
  c.document = {
    documentElement: {}, body: { style: { setProperty() {} }, appendChild() {}, removeChild() {} },
    getElementById: () => null, activeElement: { blur() {} },
    createElement: () => ({ style: {}, setAttribute(key, value) { this[key] = value; }, select() {}, setSelectionRange() {} }),
    head: { insertBefore: el => run(el.src) }, execCommand: () => true,
  };
  const run = file => vm.runInContext(read(file), c, { filename: file });
  vm.runInContext('function Vue(o){Object.assign(this,o.data)}; Vue.set=(o,k,v)=>o[k]=v; Vue.component=()=>{}; Vue.mixin=()=>{};', c);
  const scripts = [...read('index.html').matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
  for (const file of scripts) if (file !== 'js/vueFile.js') run(file);
  vm.runInContext('load()', c);
  return { c, storage, eval: code => vm.runInContext(code, c) };
}

function model() { const c = vm.createContext({}); vm.runInContext(read('js/remake/simulation.js'), c); return c.HydrogenSimulation; }

test('native TMT boots the single hydrogen layer with Decimal resources', () => {
  const game = boot();
  assert.ok(game.eval('player.h.points instanceof Decimal && player.h.molecules instanceof Decimal'));
  assert.deepEqual(JSON.parse(game.eval('JSON.stringify(TREE_LAYERS)')), [['h']]);
  assert.equal(game.eval('layoutInfo.startTab'), 'h');
  assert.equal(game.eval('modInfo.id'), 'tree_of_life_remake_tmt');
  assert.equal(game.eval('TMT_VERSION.tmtNum'), '2.6.6.2');
  for (const tab of ['options-tab', 'info-tab', 'h']) game.eval(`showTab('${tab}'); gameLoop(0.1); updateTemp(true)`);
});

test('TMT gameLoop drives collection, conservation, native clickable completion and endgame', () => {
  const g = boot(); g.eval('gameLoop(180); updateTemp(true)');
  assert.ok(g.eval('player.h.molecules.gte(32)'));
  assert.ok(g.eval('Math.abs(player.h.total.toNumber()-player.h.points.toNumber()-2*player.h.molecules.toNumber()) < 1e-6'));
  g.eval('clickClickable("h",21); updateTemp(true)');
  assert.equal(g.eval('isEndgame()'), true);
  assert.ok(g.eval('Math.abs(player.h.total.toNumber()-player.h.points.toNumber()-2*(player.h.molecules.toNumber()+32)) < 1e-6'));
});

test('native pause freezes production and cooldowns, including offline banks', () => {
  const g = boot(); g.eval('clickClickable("h",11); updateTemp(true); clickClickable("h",22)');
  const before = g.eval('JSON.stringify(readHydrogen())');
  g.eval('player.offTime={remain:100}; player.time=Date.now()-1000; runInterval()');
  assert.equal(g.eval('JSON.stringify(readHydrogen())'), before);
  assert.equal(g.eval('player.offTime.remain'), 100);
});

test('native TMT save round trip restores Decimals and Chinese tab names', () => {
  const g = boot(); g.eval('gameLoop(20); player.subtabs.h.mainTabs="观测"; save()');
  const before = g.eval('player.h.molecules.toString()');
  assert.ok(g.storage.has('tree_of_life_remake_tmt'));
  assert.equal(g.storage.has('tree_of_life'), false);
  g.eval('player.h.molecules=new Decimal(0); load()');
  assert.equal(g.eval('player.h.molecules.toString()'), before);
  assert.equal(g.eval('player.subtabs.h.mainTabs'), '观测');
  g.eval('exportSave()'); // Must not throw btoa's Unicode error.
  const raw = JSON.parse(Buffer.from(g.storage.get('tree_of_life_remake_tmt'), 'base64').toString('utf8'));
  const exported = Buffer.from(JSON.stringify(raw[raw.set]), 'utf8').toString('base64');
  g.c.testImport = exported; g.eval('importSave(testImport); load()');
  assert.ok(g.eval('player.h.points instanceof Decimal'));
  assert.equal(g.eval('player.h.molecules.toString()'), before);
});

test('English and Chinese use the same gameplay and native save ID', () => {
  const zh = boot('zh'), en = boot('en');
  assert.equal(en.eval('layers.h.name'), 'Hydrogen'); assert.equal(zh.eval('layers.h.name'), '氢');
  zh.eval('gameLoop(100)'); en.eval('gameLoop(100)');
  assert.equal(zh.eval('player.h.molecules.toString()'), en.eval('player.h.molecules.toString()'));
  assert.equal(zh.eval('modInfo.id'), en.eval('modInfo.id'));
});

test('native offline catch-up is capped, can be disabled, and paused saves earn no offline bank', () => {
  const g = boot(); g.eval('player.time=Date.now()-8*3600*1000; save(); load(); runInterval()');
  assert.ok(g.eval('player.offTime.remain < 4*3600 && player.h.elapsed <= 4*3600'));
  g.eval('options.offlineProd=false; player.time=Date.now(); runInterval()');
  assert.equal(g.eval('player.offTime'), undefined);
  g.eval('player.paused=true; player.time=Date.now()-100000; save(); load()');
  assert.equal(g.eval('player.offTime'), undefined);
});

test('power endpoints, temperature and pulses preserve the model invariants', () => {
  const m = model();
  for (const allocation of [0, 0.2, 0.5, 0.85, 1]) {
    const s = m.createState(); s.allocation=allocation; m.advance(s, 300);
    assert.ok(s.atoms >= 0 && s.molecules >= 0 && Number.isFinite(s.heat));
    assert.ok(Math.abs(s.captured-s.atoms-2*s.molecules)<1e-6);
    if (allocation===1) assert.equal(s.molecules,0);
  }
  const s=m.createState(); assert.ok(m.pulse(s)); assert.ok(!m.pulse(s)); m.advance(s,4.1); assert.ok(m.pulse(s));
  s.heat=90; const hot=m.rates(s).capacity; s.heat=20; assert.ok(m.rates(s).capacity>hot);
});

test('large model ticks and small model ticks agree', () => {
  const m=model(), a=m.createState(), b=m.createState();m.advance(a,120);
  for(let i=0;i<1200;i++)m.advance(b,0.1);
  for(const key of ['atoms','molecules','heat','elapsed'])assert.ok(Math.abs(a[key]-b[key])<1e-6);
});
