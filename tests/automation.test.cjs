const test=require('node:test');const assert=require('node:assert/strict');const {engine}=require('./helpers/engine.cjs');
function load(){const e=engine('?start=chemistry');e.run('loadContinuation()');return e;}
function actual(e){return e.run('player.chem.points.plus(Object.values(player.chem.workers).reduce((a,b)=>a.plus(b),new Decimal(0))).plus(Object.values(player.chem.scientists).reduce((a,b)=>a.plus(b),new Decimal(0))).toString()');}
test('40 Chemists unlock optional H–Ne full staffing and preserve the actual staff pool',()=>{
 const e=load();assert(!e.run('ChemistryQoL.toggleAuto()'));
 e.run('player.chem.total=new Decimal(40);player.chem.points=player.chem.points.plus(20);updateMilestones("chem");updateTemp()');
 const before=actual(e);assert(e.run('hasMilestone("chem",5)'));assert(!e.run('player.chem.autoEarly'));
 assert(e.run('ChemistryQoL.toggleAuto()'));assert.equal(actual(e),before);
 for(const id of ['H','He','Li','Be','B','C','N','O','F','Ne']){
  assert(e.run('ChemistryQoL.effective("workers","'+id+'").eq(40)&&ChemistryQoL.effective("scientists","'+id+'").eq(40)'));
  assert(e.run('player.chem.workers["'+id+'"].eq(0)&&player.chem.scientists["'+id+'"].eq(0)'));
 }
 assert(!e.run('ChemistryQoL.assign("workers","H",1)'));assert(!e.run('ChemistryQoL.autoManaged("Na")||ChemistryQoL.autoManaged("K")||ChemistryQoL.autoManaged("Ca")'));
 assert(e.run('ChemistryQoL.assign("scientists","Na",4)'));assert.equal(actual(e),before);
 assert(e.run('ChemistryQoL.toggleAuto()'));assert(e.run('ChemistryQoL.assign("scientists","H",4)'));assert.equal(actual(e),before);
});
test('automatic production matches full manual input and does not double-count existing staff',()=>{
 const e=load();
 e.run('ChemistryQoL.assign("scientists","N",0);player.chem.total=new Decimal(40);player.chem.points=new Decimal(40);player.chem.buildings.H=new Decimal(10);player.chem.buildingProgress.H=new Decimal(0);player.chem.amount.H=new Decimal(0);player.chem.best_amount.N=new Decimal(0);player.chem.amount.N=new Decimal(0);player.chem.buildings.N=new Decimal(0);ChemistryQoL.assign("workers","H",5);ChemistryQoL.assign("scientists","H",5);ChemistryQoL.toggleAuto();updateTemp();const fullH=getLogisticAmount(new Decimal(0),new Decimal(40).times(tmp.chem.buildings.getScientistMultiplier).times(new Decimal(10).times(Decimal.pow(1.1,10))),tmp.chem.buildings.getDecay,1);const fullWork=new Decimal(40).times(tmp.chem.buildings.getWorkerMultiplier);layers.chem.buildings.update(1)');
 assert(e.run('player.chem.amount.H.eq(fullH)'));assert(e.run('player.chem.buildingProgress.H.eq(fullWork)'));assert.equal(actual(e),'40');
});
test('full staffing recruits through Nitrogen once and saves its toggle',()=>{
 const e=load();e.run('ChemistryQoL.assign("scientists","N",0);player.chem.total=new Decimal(40);player.chem.points=new Decimal(40);ChemistryQoL.toggleAuto();player.chem.best_amount.N=new Decimal(5).times(Decimal.pow(2,42));player.chem.amount.N=player.chem.best_amount.N;layers.chem.buildings.update(0)');
 assert(e.run('player.chem.total.eq(43)'));assert.equal(actual(e),'43');e.run('save()');
 const restored=engine('?start=chemistry',[...e.storage]);restored.run('loadContinuation()');assert(restored.run('player.chem.autoEarly'));assert.equal(actual(restored),'43');
});
test('migration revalidates free milestones while retaining resources and purchased upgrades',()=>{
 const e=load();e.run('player.version="2.070.3";player.r.buyables[11]=new Decimal(19);player.r.milestones.push(17);player.chem.upgrades=[11,12];player.chem.milestones=[1,2,3,4];player.chem.best_amount.K=new Decimal(5).times(Decimal.pow(2,43));player.chem.best_amount.Ca=new Decimal(5).times(Decimal.pow(2,46));player.r.widgets.points=new Decimal("1e150");save()');
 const restored=engine('?start=chemistry',[...e.storage]);restored.run('loadContinuation()');
 assert(restored.run('player.r.widgets.points.eq("1e150")&&player.chem.upgrades.includes(12)&&hasMilestone("chem",4)'));
 assert(!restored.run('hasMilestone("chem",1)||hasMilestone("chem",2)||hasMilestone("chem",3)||hasMilestone("r",17)'));
});
test('late Chemistry awards require distinct level thresholds even with a large Researcher bank',()=>{
 const e=load();e.run('player.r.milestones=Array.from({length:18},(_,i)=>i+1);player.chem.upgrades=[11];player.r.points=new Decimal("1e100");player.r.best=player.r.points;player.chem.best_amount.K=new Decimal(5).times(Decimal.pow(2,43));player.chem.best_amount.Ca=new Decimal(5).times(Decimal.pow(2,46));updateTemp()');
 assert(!e.run('tmp.chem.upgrades[12].unlocked'));e.run('player.chem.best_amount.K=new Decimal(5).times(Decimal.pow(2,46));updateTemp();buyUpgrade("chem",12);updateTemp()');
 assert(e.run('hasUpgrade("chem",12)'));assert(!e.run('tmp.chem.upgrades[13].unlocked'));
 e.run('player.chem.best_amount.K=new Decimal(5).times(Decimal.pow(2,49));player.chem.best_amount.Ca=new Decimal(5).times(Decimal.pow(2,51));updateMilestones("chem");updateTemp()');assert(!e.run('hasMilestone("chem",1)'));
 e.run('player.chem.best_amount.K=new Decimal(5).times(Decimal.pow(2,50));updateMilestones("chem");updateTemp()');assert(e.run('hasMilestone("chem",1)'));assert(!e.run('hasMilestone("chem",2)'));
 e.run('player.chem.best_amount.Ca=new Decimal(5).times(Decimal.pow(2,52));updateMilestones("chem");updateTemp()');assert(!e.run('hasMilestone("chem",2)'),'Potassium 51 is still required');
});

test('exact powers of two satisfy Chemistry level targets without a rounding delay',()=>{
 const e=load();for(const n of [40,46,49,50,51,52,54,55]){
  e.run('player.chem.best_amount.K=Decimal.pow(2,'+n+').times(5)');
  assert.equal(e.run('ChemistryQoL.level("K",true).toNumber()'),n);
 }
});
test('early Factory I Widget rewards stay bounded and milestone 17 starts at level 22',()=>{
 const e=load();e.run('player.r.milestones=Array.from({length:16},(_,i)=>i+1);player.chem.amount.Na=new Decimal(10);player.r.amounts[11]=new Decimal(1000)');
 for(const [level,mult]of [[18,1],[19,1.5],[20,2.25],[21,3.375],[22,3.375],[50,3.375]]){
  e.run('player.r.buyables[11]=new Decimal('+level+');updateTemp();updateTemp()');
  assert(e.run('layers.r.widgets.getResetGain().div(player.r.amounts[11].plus(1).times(tmp.r.buyables[11].effect).times(hasUpgrade("r",14)?Decimal.pow(2,player.r.upgrades.length):1)).sub('+mult+').abs().lt(1e-9)'));
  assert.equal(e.run('layers.r.milestones[17].done()'),level>=22);
 }
});
test('Chemistry I follows the milestone at two Factory VI levels with a third level',()=>{
 const e=load();e.run('player.r.milestones=Array.from({length:18},(_,i)=>i+1);player.r.points=new Decimal(1e20);player.r.best=player.r.points;player.r.buyables[23]=new Decimal(2);updateTemp()');
 assert(!e.run('tmp.chem.upgrades[11].unlocked'));e.run('player.r.buyables[23]=new Decimal(3);updateTemp()');assert(e.run('tmp.chem.upgrades[11].unlocked'));
});

test('a Factory I purchase does not make the next level cheaper relative to Widget production',()=>{
 const e=load();e.run('player.hu.buyables[13]=new Decimal("1e6");player.r.amounts[11]=new Decimal("1e10")');
 for(const level of [19,20,21,22,24,27,30,33,36,39]){
  e.run('player.r.milestones=Array.from({length:'+(level-1>=22?17:16)+'},(_,i)=>i+1);player.r.buyables[11]=new Decimal('+(level-1)+');updateTemp();updateTemp();var beforeRate=layers.r.widgets.getResetGain();var beforeCost=layers.r.buyables[11].cost()');
  e.run('player.r.buyables[11]=new Decimal('+level+');player.r.milestones=Array.from({length:'+(level>=22?17:16)+'},(_,i)=>i+1);updateTemp();updateTemp()');
  assert(e.run('layers.r.widgets.getResetGain().div(beforeRate).lt(layers.r.buyables[11].cost().div(beforeCost))'),'level '+level);
 }
});
