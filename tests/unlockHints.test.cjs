const test = require('node:test');
const assert = require('node:assert/strict');
const { engine } = require('./helpers/engine.cjs');
function load(search='') { const e=engine(search); e.run('loadContinuation()'); return e; }
test('all original upgrade/buyable predicates parse, including mode-dependent local variables', () => {
    const e=load(); let count=0;
    for(const layer of Object.values(e.ctx.layers)) for(const kind of ['upgrades','buyables']) {
        for(const item of Object.values(layer[kind]||{})) if(typeof item.unlocked==='function'&&!item.unlockHint) {
            e.ctx.UnlockHints.parse(item.unlocked); count++;
        }
    }
    assert(count>=1200);
});
test('interpreted predicates agree with the real predicates across game modes', () => {
    const e=load('?start=chemistry'); let checked=0;
    for(const mode of [false,true]) {
        e.run(`player.extremeMode=${mode}; updateTemp()`);
        for(const layer of Object.values(e.ctx.layers)) for(const kind of ['upgrades','buyables']) {
            for(const item of Object.values(layer[kind]||{})) if(typeof item.unlocked==='function'&&!item.unlockHint) {
                const ast=e.ctx.UnlockHints.selected(e.ctx.UnlockHints.parse(item.unlocked));
                assert.equal(Boolean(e.ctx.UnlockHints.value(ast)),Boolean(item.unlocked())); checked++;
            }
        }
    }
    assert(checked>=2400);
});
test('Human upgrade hints show the real Plant threshold, not its purchase price', () => {
    const e=load('?start=chemistry');
    e.run('player.pl.best=new Decimal(255); player.hu.upgrades=[]; updateTemp()');
    const hint=e.ctx.UnlockHints.next('hu','upgrades',[1,2,3,4,5]);
    assert.match(hint,/Humans II/); assert.match(hint,/276/); assert.match(hint,/Plants/);
    assert(!hint.includes('100,000'));
});
test('buyable hints describe prerequisites and skip permanently hidden placeholders', () => {
    const e=load();
    const hint=e.ctx.UnlockHints.next('hu','buyables');
    assert.match(hint,/Next buyable:/); assert.match(hint,/purchase Humans XIII/);
    e.run('player.r.milestones=Array.from({length:18},(_,i)=>i+1); updateTemp()');
    assert(!e.ctx.UnlockHints.next('r','buyables').includes('Factory<sup>1</sup>'));
});
test('next hidden upgrade moves forward as content unlocks and covers later sections', () => {
    const e=load();
    const before=e.ctx.UnlockHints.next('h','upgrades');
    e.run('player.h.best=new Decimal(1); updateTemp()');
    const after=e.ctx.UnlockHints.next('h','upgrades');
    assert.notEqual(before,after);
    assert.match(after,/Hydrogen II/);
    const other=e.ctx.UnlockHints.next('h','upgrades',[100]);
    assert.match(other,/another section/);
});
test('notes never grant resources or change unlock conditions', () => {
    const e=load('?start=chemistry'); const before=e.run('JSON.stringify(player)');
    for(const [id] of Object.entries(e.ctx.layers)) for(const kind of ['upgrades','buyables']) e.ctx.UnlockHints.next(id,kind);
    assert.equal(e.run('JSON.stringify(player)'),before);
});
test('Chemistry notes explicitly show the resource and element-level gates', () => {
    const e=load('?start=chemistry');
    let note=e.ctx.UnlockHints.next('chem','upgrades');
    assert.match(note,/Researcher milestone 18/); assert.match(note,/Researchers/);
    e.run('player.chem.upgrades=[11]; updateTemp()');
    note=e.ctx.UnlockHints.next('chem','upgrades');
    assert.match(note,/Chemistry II/); assert.match(note,/10 best Potassium levels/);
});
