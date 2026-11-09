const test = require('node:test');
const assert = require('node:assert/strict');
const { engine } = require('./helpers/engine.cjs');
function load() { const e=engine('?start=chemistry');e.run('loadContinuation()');return e; }
function total(e) { return e.run('player.chem.points.plus(Object.values(player.chem.workers).reduce((a,b)=>a.plus(b),new Decimal(0))).plus(Object.values(player.chem.scientists).reduce((a,b)=>a.plus(b),new Decimal(0))).toString()'); }
test('assignment sliders unlock at 20 total Chemists without a late-game purchase', () => {
    const e=load();assert(e.run('ChemistryQoL.unlocked()'));
    e.run('player.chem.total=new Decimal(19)');
    const before=e.run('JSON.stringify(player.chem)');
    assert(!e.run('ChemistryQoL.assign("scientists","N",0)'));
    assert.equal(e.run('JSON.stringify(player.chem)'),before);
    e.run('player.chem.total=new Decimal(20);updateMilestones("chem");updateTemp()');
    assert(e.run('hasMilestone("chem",4)'));
    assert(!e.run('hasUpgrade("chem",11)'));
});
test('dragging reallocates in one operation and conserves the full staff pool', () => {
    const e=load(),before=total(e);
    assert(e.run('ChemistryQoL.assign("scientists","N",0)'));
    assert(e.run('player.chem.points.eq(20)'));
    e.run('ChemistryQoL.assign("workers","H",5); ChemistryQoL.assign("scientists","H",8)');
    assert(e.run('player.chem.points.eq(7)'));
    assert(e.run('ChemistryQoL.limit("workers","H").eq(12)'));
    e.run('ChemistryQoL.slide("workers","H",12)');
    assert(e.run('player.chem.workers.H.eq(12) && player.chem.scientists.H.eq(8) && player.chem.points.eq(0)'));
    assert.equal(total(e),before);
    e.run('ChemistryQoL.slide("scientists","H",0)');
    assert(e.run('player.chem.points.eq(8)'));
    assert.equal(total(e),before);
});
test('slider limits exclude other roles and elements and reject invalid targets', () => {
    const e=load();e.run('ChemistryQoL.assign("scientists","N",0);ChemistryQoL.assign("scientists","O",7);ChemistryQoL.assign("workers","H",3)');
    e.run('ChemistryQoL.assign("scientists","H",10000)');
    assert(e.run('player.chem.scientists.H.eq(10) && player.chem.workers.H.eq(3) && player.chem.scientists.O.eq(7)'));
    const before=e.run('JSON.stringify(player.chem)');
    for(const expression of [
        'ChemistryQoL.assign("workers","K",1)', 'ChemistryQoL.assign("wrong","H",1)',
        'ChemistryQoL.assign("workers","missing",1)', 'ChemistryQoL.assign("workers","H",Infinity)',
        'ChemistryQoL.assign("workers","H",NaN)', 'ChemistryQoL.assign("workers","H","invalid")',
    ]) assert(!e.run(expression),expression);
    assert.equal(e.run('JSON.stringify(player.chem)'),before);
});
test('large Decimal populations can be allocated without unsafe integer conversion', () => {
    const e=load();e.run('ChemistryQoL.assign("scientists","N",0);player.chem.total=new Decimal("1e40");player.chem.points=new Decimal("1e40")');
    assert.equal(e.run('ChemistryQoL.sliderMax("workers","H")'),1000);
    e.run('ChemistryQoL.slide("workers","H",500)');
    assert(e.run('player.chem.workers.H.eq("5e39") && player.chem.points.eq("5e39")'));
    e.run('ChemistryQoL.slide("workers","H",1000)');
    assert(e.run('player.chem.workers.H.eq("1e40") && player.chem.points.eq(0)'));
    e.run('ChemistryQoL.slide("workers","H",0)');
    assert(e.run('player.chem.points.eq("1e40")'));
});
test('Widget rate display matches the actual one-second Widget production', () => {
    const e=load();assert(e.run('ChemistryQoL.widgetRate().eq(0)'));
    e.run('player.r.milestones.push(15);updateTemp(); const widgetBefore=player.r.widgets.points; const displayedRate=ChemistryQoL.widgetRate(); layers.r.widgets.update(1)');
    assert(e.run('player.r.widgets.points.sub(widgetBefore).eq(displayedRate)'));
    e.run('player.r.buyables[11]=new Decimal(4);player.r.amounts[11]=new Decimal(8);updateTemp(); const secondBefore=player.r.widgets.points;const secondRate=ChemistryQoL.widgetRate();layers.r.widgets.update(1)');
    assert(e.run('player.r.widgets.points.sub(secondBefore).eq(secondRate)'));
    assert(e.run('secondRate.gt(displayedRate)'));
    assert.match(e.run('layers.r.tabFormat.Factories.content[2][1]()'),/Widgets\/sec/);
});
test('assignment changes survive saving and reloading', () => {
    const e=load();e.run('ChemistryQoL.assign("scientists","N",0);ChemistryQoL.assign("workers","H",9);ChemistryQoL.assign("scientists","O",11);save()');
    const restored=engine('?start=chemistry',[...e.storage]);restored.run('loadContinuation()');
    assert(restored.run('player.chem.workers.H.eq(9) && player.chem.scientists.O.eq(11) && player.chem.points.eq(0)'));
    assert(restored.run('NaNcheck(player)'));
});
test('Researcher milestone 17 applies at the six thresholds stated in its original description', () => {
    const e=load();e.run('player.r.milestones=Array.from({length:17},(_,i)=>i+1)');
    for(const [level,bonus] of [[19,0],[20,.1],[22,.2],[24,.3],[26,.4],[28,.5],[30,.6],[200,.6]]) {
        e.run('player.r.buyables[11]=new Decimal('+level+')');
        assert(e.run('layers.r.buyables.getBaseMult().sub('+ (2.17+bonus) +').abs().lt(1e-12)'));
    }
});
test('2.070.1 and 2.070 are recorded as orange Normal Mode updates', () => {
    const e=load();assert.equal(e.run('VERSION.withoutName'),'v2.070.1');
    for(const i of [0,1]) {
        assert.match(e.run('CHANGELOGS['+i+']'),/color: #CC6600/);
        assert(!/[一-鿿]/.test(e.run('CHANGELOGS['+i+']')));
    }
    assert.match(e.run('CHANGELOGS[0]'),/v2\.070\.1/);
});
