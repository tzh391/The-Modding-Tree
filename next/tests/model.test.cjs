const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Decimal = require('../js/technical/break_eternity.js');
const context = vm.createContext({ Decimal });
vm.runInContext(fs.readFileSync(require.resolve('../js/next/model.js'), 'utf8'), context);
const M = context.NextArc;
const D = x => new Decimal(x);
const fresh = () => M.createState(true);

test('locked prologue does not produce; active humans can afford the first skill', () => {
    const locked = M.createState(); M.tick(locked, 20); assert(locked.thoughts.eq(0));
    const s = fresh(); M.tick(s, 12); assert(s.thoughts.gt(10));
    assert(M.buySkill(s, 'memory')); assert.equal(s.levels.memory, 1);
    assert(s.thoughts.gte(0)); assert(!M.buySkill(s, 'invalid'));
});
test('spending thoughts does not reduce inheritance; research and stocks survive it', () => {
    const s = fresh(); s.thoughts = D(20000); s.runThoughts = D(20000);
    s.research = D(300); s.researchers = 2; s.projects = ['observe']; s.stock.H = D(100);
    const gain = M.prestigeGain(s); M.buySkill(s, 'tools'); assert(M.prestigeGain(s).eq(gain));
    assert(M.prestige(s)); assert(s.insight.eq(gain)); assert(s.humans.eq(1));
    assert(s.thoughts.eq(0)); assert(s.runThoughts.eq(0)); assert.equal(s.levels.tools, 0);
    assert(s.research.eq(300)); assert.equal(s.researchers, 2); assert(s.stock.H.eq(100));
    assert(!M.prestige(s));
});
test('research cannot bypass inheritance, project prerequisites, or payment', () => {
    const s = fresh(); s.thoughts = D(1e6); s.research = D(1e6);
    assert(!M.recruit(s)); assert(!M.buyProject(s, 'observe'));
    s.insight = D(3); assert(M.recruit(s)); assert(s.thoughts.eq(1e6 - 500));
    assert(!M.buyProject(s, 'life')); assert(M.buyProject(s, 'observe'));
    assert(!M.buyProject(s, 'observe')); assert(M.buyProject(s, 'atom'));
});
test('staff allocation conserves people and cannot target undiscovered elements', () => {
    const s = fresh(); s.insight = D(3); s.research = D(1000); M.buyProject(s, 'observe');
    assert.equal(M.staff(s), 3); assert.equal(M.freeStaff(s), 1);
    assert(!M.allocate(s, 'C', 1)); assert(M.allocate(s, 'H', 1));
    assert(!M.allocate(s, 'O', 1)); assert(!M.allocate(s, 'H', -4));
    assert(!M.allocate(s, 'H', .5)); assert(M.allocate(s, 'H', -1));
    assert.equal(M.freeStaff(s), 1);
});
test('production has no decay and permanent discoveries survive synthesis', () => {
    const s = fresh(); s.insight = D(3); s.research = D(1000); M.buyProject(s, 'observe'); M.tick(s, 20);
    const level = M.discoveryLevel(s, 'H'); const oldStock = s.stock.H;
    assert(M.react(s, 'water')); assert(s.stock.H.eq(oldStock.sub(2)));
    assert(M.discoveryLevel(s, 'H').eq(level)); M.allocate(s, 'H', -1);
    const stock = s.stock.H; M.tick(s, 20); assert(s.stock.H.eq(stock));
});
test('recipes consume all required materials atomically', () => {
    const s = fresh(); s.projects = ['observe', 'atom', 'life', 'cycle'];
    s.stock.P = D(10); s.stock.O = D(10); s.stock.water = D(0);
    assert(!M.react(s, 'nutrient')); assert(s.stock.P.eq(10)); assert(s.stock.O.eq(10));
    s.stock.water = D(2); assert(M.react(s, 'nutrient', 2));
    assert(s.stock.P.eq(8)); assert(s.stock.O.eq(6)); assert(s.stock.water.eq(0));
    assert(s.stock.nutrient.eq(2)); assert(!M.react(s, 'nutrient', -1));
    assert(!M.react(s, 'unknown')); assert(!M.react(s, 'nutrient', Infinity));
});
test('automated reactions wait for inputs and keep inventories nonnegative', () => {
    const s = fresh(); s.projects = ['observe', 'atom', 'life', 'cycle'];
    assert(M.toggleReaction(s, 'water')); assert(M.toggleReaction(s, 'organic'));
    s.allocated.H = 1; s.allocated.O = 1; s.allocated.C = 1;
    M.tick(s, 100); for (const amount of Object.values(s.stock)) assert(amount.gte(0));
    assert(s.produced.water.gt(0)); assert(s.produced.organic.gt(0));
});
test('offline batches retain the same automation cadence as one-second ticks', () => {
    const a = fresh(), b = fresh();
    for (const s of [a, b]) {
        s.insight = D(3); s.researchers = 2; s.projects = ['observe', 'cycle'];
        s.allocated.H = 1; s.allocated.O = 1; s.autoReactions = ['water'];
    }
    M.tick(a, 120); for (let i = 0; i < 120; i++) M.tick(b, 1);
    assert(a.thoughts.eq(b.thoughts)); assert(a.stock.H.eq(b.stock.H)); assert(a.stock.water.eq(b.stock.water));
});
test('completion requires every project and five cumulative product targets', () => {
    const s = fresh(); for (const id of Object.keys(M.reactions)) s.produced[id] = D(25);
    assert(!M.complete(s)); s.projects = M.projects.map(p => p.id); assert(M.complete(s));
    s.stock.water = D(0); assert(M.complete(s)); s.produced.ammonia = D(24); assert(!M.complete(s));
});
test('legacy zero decay is the linear limit and positive decay stays finite', () => {
    const ctx = vm.createContext({ Decimal });
    vm.runInContext(fs.readFileSync(require.resolve('../js/utils/mathSupport.js'), 'utf8'), ctx);
    assert(ctx.getLogisticAmount(D(100), D(10), 0, 1).eq(110));
    assert(ctx.getLogisticAmount(D(100), D(10), D(0), 1).eq(110));
    const result = ctx.getLogisticAmount(D(100), D(10), .01, 1);
    assert(result.gt(100) && result.lt(110));
});
test('a playing policy reaches the complete chapter without granting resources', () => {
    const s = fresh();
    let completion = -1;
    for (let t = 0; t < 14400; t++) {
        M.tick(s, 1);
        if (s.insight.lt(3) && M.prestigeGain(s).gte(s.insight.eq(0) ? 1 : 2)) M.prestige(s);
        // Reserve recruiting funds once research is open; prefer useful growth otherwise.
        if (M.researchUnlocked(s) && s.researchers < 7) M.recruit(s);
        for (const id of Object.keys(M.skills)) {
            if (s.levels[id] < 12 && (s.researchers >= 2 || !M.researchUnlocked(s))) M.buySkill(s, id);
        }
        for (const p of M.projects) M.buyProject(s, p.id);
        if (M.has(s, 'observe')) {
            if (s.facility < 3 && s.researchers >= 3) M.build(s);
            const unlocked = Object.keys(M.elements).filter(id => M.elementUnlocked(s, id));
            // Redistribute when discoveries add another element.
            for (const id of Object.keys(M.elements)) while (s.allocated[id] > 0) M.allocate(s, id, -1);
            for (const id of unlocked) M.allocate(s, id, 1);
            while (M.freeStaff(s) > 0) M.allocate(s, 'H', 1);
            for (const id of Object.keys(M.reactions)) M.react(s, id);
        }
        if (M.complete(s)) { completion = t; break; }
    }
    assert(completion > 0 && completion < 14400, 'chapter must be reachable within four simulated hours');
    console.log('Balanced policy completes chapter in', completion, 'simulated seconds');
});
