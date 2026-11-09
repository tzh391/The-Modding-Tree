const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = path.join(__dirname, '..');
function engine(search = '', initialStorage = []) {
    const storage = new Map(initialStorage);
    const style = { setProperty() {} };
    const element = { style, classList: { add() {}, remove() {} }, appendChild() {}, removeChild() {},
        select() {}, setSelectionRange() {}, getContext() { return {}; } };
    const ctx = vm.createContext({ console, URLSearchParams, Math, Date,
        setInterval() {}, setTimeout() {}, clearInterval() {}, clearTimeout() {},
        alert(message) { throw new Error(message); }, confirm() { return false; }, prompt() { return null; },
        btoa: x => Buffer.from(x, 'binary').toString('base64'), atob: x => Buffer.from(x, 'base64').toString('binary'),
        location: { search }, navigator: { userAgent: 'node-test', platform: 'test' },
        localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) },
        window: { addEventListener() {}, innerWidth: 1440, innerHeight: 900 },
        document: { documentElement: element, body: element, head: element, createElement: () => element,
            getElementById: () => element, getElementsByClassName: () => [], addEventListener() {}, querySelector: () => element, execCommand() {} },
        Vue: { component() {}, set(object, key, value) { object[key] = value; }, observable: x => x },
    });
    const evaluate = filename => vm.runInContext(fs.readFileSync(path.join(base, filename), 'utf8'), ctx, { filename });
    const scripts = [...fs.readFileSync(path.join(base, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
    for (const file of scripts) if (!['js/vueFile.js', 'js/technical/loader.js', 'js/next/bootstrap.js'].includes(file)) evaluate(file);
    for (const file of vm.runInContext('modInfo.modFiles', ctx)) evaluate('js/' + file);
    evaluate('js/next/bootstrap.js');
    ctx.loadVue = () => {};
    ctx.resizeCanvas = () => {};
    return { ctx, storage, run: code => vm.runInContext(code, ctx) };
}
test('checkpoint boots through the real TMT save migration and temp engine', () => {
    const e = engine(); e.run('loadNext()');
    assert.equal(e.run('modInfo.id'), 'tree_of_life_next_human');
    assert(e.run('player.hu2.arc.active')); assert(e.run('player.hu2.arc.thoughts.eq(0)'));
    assert(e.run('NaNcheck(player)'));
    e.run('gameLoop(1); updateTemp(); gameLoop(1); updateTemp()');
    assert(e.run('player.hu2.arc.thoughts.gt(0)')); assert(e.run('NaNcheck(player)'));
    assert(!e.storage.has('tree_of_life'));
    e.run('save()'); const snapshot = e.storage.get('tree_of_life_next_human');
    assert(snapshot);
    const restored = engine('', [...e.storage]); restored.run('loadNext()');
    assert(restored.run('player.hu2.arc.thoughts.gt(0)'));
    assert(restored.run('player.hu2.arc.thoughts instanceof Decimal'));
    restored.run('player.subtabs.hu2.mainTabs = "认知"; exportSave()');
    assert.match(restored.run('decodeURIComponent(escape(atob(document.body.value)))'), /认知/);
});
test('life route starts at the original beginning and keeps cognition locked', () => {
    const e = engine('?start=life'); e.run('loadNext(); gameLoop(1); updateTemp()');
    assert.equal(e.run('modInfo.id'), 'tree_of_life_next_life');
    assert(!e.run('player.hu2.arc.active')); assert(e.run('player.hu2.arc.thoughts.eq(0)'));
    assert(!e.run('player.pl.unlocked')); assert(e.run('NaNcheck(player)'));
});
test('native research and lab controls share the same saved simulation', () => {
    const e = engine(); e.run('loadNext()');
    e.run('player.hu2.arc.insight = new Decimal(3); player.hu2.arc.thoughts = new Decimal(500); layers.r2.clickables[11].onClick()');
    assert.equal(e.run('player.hu2.arc.researchers'), 1);
    e.run('player.hu2.arc.research = new Decimal(50); layers.r2.clickables[21].onClick(); updateTemp(); gameLoop(1); updateTemp()');
    assert(e.run('tmp.lab2.layerShown')); assert(e.run('player.hu2.arc.stock.H.gt(0)'));
    assert.match(e.run('layers.lab2.clickables[11].display()'), /发现等级/);
    assert(e.run('NaNcheck(player)'));
    // Mg must not change the Na branch of the compatibility formula.
    e.run('player.chem.amount.Na = new Decimal(10); player.chem.amount.Mg = new Decimal(1e20)');
    assert(e.run('new Decimal(layers.tokens.buyables[213].base()).eq(1.6975)'));
});
