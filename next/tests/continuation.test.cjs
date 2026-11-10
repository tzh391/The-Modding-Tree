const test = require('node:test');
const assert = require('node:assert/strict');
const { engine } = require('./helpers/engine.cjs');

function loaded(search = '', storage = [], early = false) {
    const e = engine(search, storage, early); e.run('loadContinuation()'); return e;
}
function late() {
    const e = loaded('?start=chemistry');
    e.run('player.r.milestones = Array.from({length:18}, (_,i) => i+1); player.r.buyables[23]=new Decimal(3); player.r.points = new Decimal(1e20); player.r.best = new Decimal(1e20); updateTemp()');
    return e;
}
test('starts in English at the original beginning with the original layer set', () => {
    const e = loaded();
    assert.equal(e.run('modInfo.id'), 'tree_of_life_continuation');
    assert.equal(e.run('VERSION.withoutName'), 'v2.070.4');
    assert.equal(e.run('player.tab'), 'none');
    assert(!e.run('player.hu.unlocked')); assert(!e.run('player.chem.unlocked'));
    assert(!e.run('layers.hu2 || layers.r2 || layers.lab2'));
    assert(e.run('modInfo.offlineLimit === 0'));
    assert(e.run('NaNcheck(player)'));
});
test('Human and other Researcher mechanics stay equivalent outside the documented milestone-17 balance and Widget bonus', () => {
    const e = engine();
    const serialize = layer => JSON.stringify(layer, (_, value) => typeof value === 'function' ? value.toString() : value);
    const mechanics = layer => {
        const copy=Object.fromEntries(Object.entries(layer).filter(([key]) => key !== 'tabFormat'));
        copy.widgets=Object.fromEntries(Object.entries(layer.widgets).filter(([key])=>!['getResetGain','getMilestone17Levels'].includes(key)));
        copy.buyables=Object.fromEntries(Object.entries(layer.buyables).filter(([key])=>key!=='getBaseMult'));
        copy.milestones={...layer.milestones,16:Object.fromEntries(Object.entries(layer.milestones[16]).filter(([key])=>key!=='effectDescription')),17:Object.fromEntries(Object.entries(layer.milestones[17]).filter(([key])=>!['effectDescription','requirementDescription','done'].includes(key)))};
        return copy;
    };
    const humans = serialize(e.ctx.layers.hu), researchers = serialize(mechanics(e.ctx.layers.r));
    e.run('installChemistryContinuation()');
    assert.equal(serialize(e.ctx.layers.hu), humans);
    assert.equal(serialize(mechanics(e.ctx.layers.r)), researchers);
    assert.equal(e.run('Object.keys(layers.hu.upgrades).filter(x => /^\\d+$/.test(x)).length'), 75);
    assert.equal(e.run('Object.keys(layers.hu.milestones).length'), 100);
});
test('Chemistry checkpoint migrates all new fields without granting new upgrades', () => {
    const e = loaded('?start=chemistry');
    assert(e.run('player.chem.unlocked'));
    assert(e.run('player.chem.amount.H.gt(0)'));
    assert(e.run('player.chem.amount.K.eq(0) && player.chem.amount.Ca.eq(0)'));
    assert(!e.run('hasUpgrade("chem",11)'));
    assert(!e.run('tmp.chem.upgrades[11].unlocked'));
    e.run('gameLoop(1); updateTemp(); save()');
    const restored = loaded('?start=chemistry', [...e.storage]);
    assert(restored.run('player.chem.buildings.K instanceof Decimal'));
    assert(restored.run('player.chem.amount.Ca instanceof Decimal'));
    assert(restored.run('NaNcheck(player)'));
    assert(!e.storage.has('tree_of_life'));
});
test('original chemistry multipliers and decay are unchanged before the extension', () => {
    const e = engine('?start=chemistry');
    e.run('const legacyWorker = layers.chem.buildings.getWorkerMultiplier; const legacyScientist = layers.chem.buildings.getScientistMultiplier; const legacyDecay = layers.chem.buildings.getDecay; loadContinuation()');
    assert(e.run('legacyWorker().eq(layers.chem.buildings.getWorkerMultiplier())'));
    assert(e.run('legacyScientist().eq(layers.chem.buildings.getScientistMultiplier())'));
    assert(e.run('legacyDecay() === layers.chem.buildings.getDecay()'));
});
test('Chemistry I requires the original late-game milestone and pays Researchers', () => {
    const e = late();
    const chemists = e.run('player.chem.points.toString()');
    e.run('buyUpgrade("chem",11); updateTemp()');
    assert(e.run('hasUpgrade("chem",11)'));
    assert(e.run('player.r.points.eq(0)'));
    assert.equal(e.run('player.chem.points.toString()'), chemists);
    assert(e.run('player.chem.chemUnlocks.period4'));
    assert(!e.run('tmp.chem.upgrades[12].unlocked'));
});
test('Potassium and Calcium use the existing building, production, decay, and assignment rules', () => {
    const e = late();
    e.run('buyUpgrade("chem",11); player.chem.focus="K"; player.chem.points=new Decimal(3); updateTemp(); clickClickable("chem",11); clickClickable("chem",13); updateTemp()');
    assert(e.run('player.chem.workers.K.eq(1) && player.chem.scientists.K.eq(1)'));
    assert(e.run('player.chem.points.eq(1)'));
    for (let i=0;i<10;i++) e.run('gameLoop(1); updateTemp()');
    assert(e.run('player.chem.buildings.K.gt(0)'));
    assert(e.run('player.chem.amount.K.gt(0)'));
    e.run('clickClickable("chem",12); clickClickable("chem",14); updateTemp()');
    assert(e.run('player.chem.workers.K.eq(0) && player.chem.scientists.K.eq(0)'));
    assert(e.run('player.chem.points.eq(3)'));
    assert(e.run('NaNcheck(player)'));
});
test('new upgrades, milestones, and endgame follow their displayed requirements', () => {
    const e = late();
    e.run('buyUpgrade("chem",11); player.r.points=new Decimal(1e24); player.r.best=new Decimal(1e24); player.chem.amount.K=new Decimal(5).times(Decimal.pow(2,55)); player.chem.amount.Ca=player.chem.amount.K; player.chem.best_amount.K=player.chem.amount.K; player.chem.best_amount.Ca=player.chem.amount.Ca.plus(1); player.chem.best_amount.K=player.chem.amount.K.plus(1); updateTemp()');
    for (const id of [12,13,14,15]) e.run(`updateTemp(); buyUpgrade("chem",${id})`);
    assert(!e.run('hasUpgrade("chem",15)'), 'buying V must still pay its full cost');
    e.run('player.r.points=new Decimal(1e24); updateTemp(); buyUpgrade("chem",15); updateMilestones("chem"); updateTemp(); updateMilestones("chem"); updateTemp(); updateMilestones("chem"); updateTemp()');
    assert(e.run('hasUpgrade("chem",15) && hasMilestone("chem",3)'));
    assert(!e.run('isEndgameRaw()'));
    e.run('player.r.points=new Decimal(1e24)');
    assert(e.run('isEndgameRaw()'));
    e.run('player.extremeMode=true; player.ch.points=new Decimal(297)'); assert(!e.run('isEndgameRaw()'));
    e.run('player.ch.points=new Decimal(298)'); assert(e.run('isEndgameRaw()'));
});
test('cold and cached loading orders both install only after the engine is ready', () => {
    const e = loaded('', [], true);
    e.run('gameLoop(1); updateTemp()');
    assert.equal(e.run('VERSION.withoutName'), 'v2.070.4');
    assert(e.run('NaNcheck(player)'));
});
test('zero decay keeps its linear limit', () => {
    const e = loaded();
    assert(e.run('getLogisticAmount(new Decimal(100),new Decimal(10),0,1).eq(110)'));
});
