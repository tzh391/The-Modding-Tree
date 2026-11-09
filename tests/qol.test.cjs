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
test('Researcher milestone 17 keeps all six thresholds with a smaller capped base bonus', () => {
    const e=load();e.run('player.r.milestones=Array.from({length:17},(_,i)=>i+1)');
    for(const [level,bonus] of [[19,0],[20,.07],[21,.07],[22,.14],[23,.14],[24,.21],[25,.21],[26,.28],[27,.28],[28,.35],[29,.35],[30,.42],[200,.42]]) {
        e.run('player.r.buyables[11]=new Decimal('+level+')');
        assert(e.run('layers.r.buyables.getBaseMult().sub('+ (2.17+bonus) +').abs().lt(1e-12)'));
    }
    assert.match(e.run('layers.r.milestones[17].effectDescription()'),/add \.07 .*max \+\.42/);
    e.run('player.r.milestones.push(18);player.r.buyables[23]=new Decimal(7)');
    assert(e.run('layers.r.buyables.getBaseMult().sub(2.88).abs().lt(1e-12)'),'milestones 16 and 18 retain their original contributions');
});
test('each factory threshold avoids a large exponent jump and the six bonuses are bounded at level 30', () => {
    const e=load();e.run('player.r.milestones=Array.from({length:17},(_,i)=>i+1)');
    for(const level of [20,22,24,26,28,30]) {
        e.run('player.r.buyables[11]=new Decimal('+ (level-1) +');updateTemp();updateTemp();var previousEffect=tmp.r.buyables[11].effect');
        e.run('player.r.buyables[11]=new Decimal('+level+');updateTemp();updateTemp()');
        assert(e.run('tmp.r.buyables[11].effect.div(previousEffect).lt(6.0)'),'Factory I '+level+' level jump');
    }
    assert(e.run('tmp.r.buyables[11].effect.div(Decimal.pow(2.17,30)).lt(205)'));
});
test('rebalancing an existing save retains Widgets and all purchased factory levels', () => {
    const e=load();
    e.run('player.r.milestones=Array.from({length:18},(_,i)=>i+1);player.r.widgets.points=new Decimal("1e90");player.version="2.070.2";for(const id of [11,12,13,21,22,23]){player.r.buyables[id]=new Decimal(30);player.r.amounts[id]=new Decimal("1e40");}updateTemp();save()');
    const before=e.run('JSON.stringify({widgets:player.r.widgets.points,buyables:player.r.buyables,amounts:player.r.amounts})');
    const restored=engine('?start=chemistry',[...e.storage]);restored.run('loadContinuation()');
    assert.equal(restored.run('JSON.stringify({widgets:player.r.widgets.points,buyables:player.r.buyables,amounts:player.r.amounts})'),before);
    assert(restored.run('NaNcheck(player)'));
});
test('milestone 17 limits existing Hiawd levels by purchased Factory I levels', () => {
    const e=load();
    e.run('player.r.milestones=Array.from({length:17},(_,i)=>i+1);player.hu.buyables[13]=new Decimal(23177);player.r.amounts[11]=new Decimal("1e100")');
    for(const [level,counted] of [[18,0],[19,750],[20,1500],[22,3000],[24,4500],[26,6000],[28,7500],[30,9000],[31,9177],[200,9177]]) {
        e.run('player.r.buyables[11]=new Decimal('+level+')');
        assert(e.run('layers.r.widgets.getMilestone17Levels().eq('+counted+')'));
    }
    e.run('player.hu.buyables[13]=new Decimal(13000)');
    assert(e.run('layers.r.widgets.getMilestone17Levels().eq(0)'));
    e.run('player.r.milestones=[];player.hu.buyables[13]=new Decimal("1e300")');
    assert(e.run('layers.r.widgets.getMilestone17Levels().eq(0)'));
    assert.match(e.run('layers.r.milestones[17].effectDescription()'),/at most 750 Hiawd levels/);
});
test('Factory I level 19 cannot apply a large retroactive Widget multiplier', () => {
    const e=load();
    e.run('player.r.milestones=[15,17];player.r.upgrades=[14];player.r.buyables[11]=new Decimal(19);player.r.amounts[11]=new Decimal(1000);player.hu.buyables[13]=new Decimal("1e300");updateTemp();updateTemp()');
    assert(e.run('layers.r.widgets.getResetGain().div(player.r.amounts[11].plus(1).times(tmp.r.buyables[11].effect).times(2)).sub(Decimal.pow(1.001,750)).abs().lt(1e-9)'));
    assert(e.run('layers.r.widgets.getResetGain().isFinite()'));
    assert(e.run('NaNcheck(player)'));
    e.run('const beforeM17Widgets=player.r.widgets.points;const m17Rate=ChemistryQoL.widgetRate();layers.r.widgets.update(1)');
    assert(e.run('player.r.widgets.points.sub(beforeM17Widgets).eq(m17Rate)'));
});
test('Widget production outside milestone 17 retains the original factors', () => {
    const e=engine('?start=chemistry');
    e.run('const originalWidgetRate=layers.r.widgets.getResetGain;loadContinuation();player.r.buyables[11]=new Decimal(18);player.r.amounts[11]=new Decimal(1e12);updateTemp();updateTemp()');
    assert(e.run('layers.r.widgets.getResetGain().eq(originalWidgetRate())'));
    e.run('player.r.upgrades.push(14);updateTemp();updateTemp()');
    assert(e.run('layers.r.widgets.getResetGain().eq(originalWidgetRate())'));
});
test('Normal Mode update headings are orange and all body lines are white', () => {
    const e=load();assert.equal(e.run('VERSION.withoutName'),'v2.070.3');
    for(const i of [0,1,2,3]) {
        assert.match(e.run('CHANGELOGS['+i+']'),/class='normal-update'/);
        assert.match(e.run('CHANGELOGS['+i+']'),/<h3>.*<span>/);
        assert(!/[一-鿿]/.test(e.run('CHANGELOGS['+i+']')));
    }
    assert.match(e.run('CHANGELOGS[0]'),/v2\.070\.3/);
    const css=require('node:fs').readFileSync(require('node:path').join(__dirname,'../css/unlockHints.css'),'utf8');
    assert.match(css,/\.normal-update\s*\{[^}]*color:\s*#FFFFFF/);
    assert.match(css,/\.normal-update\s+span\s*\{[^}]*color:\s*#FFFFFF/);
    assert.match(css,/\.normal-update\s+h3\s*\{[^}]*color:\s*#CC6600/);
});
