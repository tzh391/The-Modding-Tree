const test=require('node:test');
const assert=require('node:assert/strict');
const {engine}=require('./helpers/engine.cjs');
const prices={61:'7.77e777',62:'1e800',63:'1e1000',64:'1e1040',65:'1e1319'};
function loaded(){const e=engine();e.run('loadContinuation()');return e;}
test('Normal Mode Hydrogen XVI–XX charge the specified Hydrogen prices at exact boundaries',()=>{
 const e=loaded();e.run('player.h.unlocked=true;player.tokens.milestones=[2]');
 for(const [id,cost] of Object.entries(prices)){
  e.run(`player.h.points=new Decimal('${cost}').times(.999);updateTemp();buyUpgrade('h',${id})`);
  assert(!e.run(`hasUpgrade('h',${id})`),'below price '+id);
  assert(e.run(`tmp.h.upgrades[${id}].cost.eq('${cost}')`));
  e.run(`player.h.points=new Decimal('${cost}');updateTemp();buyUpgrade('h',${id});updateTemp()`);
  assert(e.run(`hasUpgrade('h',${id})&&player.h.points.eq(0)`),'full payment '+id);
 }
 assert(e.run('tmp.h.upgrades[54].cost.eq("1e360")&&tmp.h.upgrades[55].cost.eq("1e380")'));
});
test('Hydrogen unlocks and all Easy/Hard/Extreme prices remain original',()=>{
 const e=engine();e.run('var originalHydrogenCosts={};for(const id of [54,55,61,62,63,64,65])originalHydrogenCosts[id]=layers.h.upgrades[id].cost;var originalHydrogenUnlocks={};for(const id of [61,62,63,64,65])originalHydrogenUnlocks[id]=layers.h.upgrades[id].unlocked;loadContinuation()');
 for(const flags of [[true,false],[false,true],[true,true]]){
  e.run(`player.hardMode=${flags[0]};player.extremeMode=${flags[1]};updateTemp()`);
  for(const id of [54,55,61,62,63,64,65])assert(e.run(`layers.h.upgrades[${id}].cost().eq(originalHydrogenCosts[${id}]())`));
 }
 e.run("player.hardMode=false;player.extremeMode=false;player.easyMode=true;updateTemp()");
 for(const id of [61,62,63,64,65])assert(e.run(`layers.h.upgrades[${id}].cost().eq(originalHydrogenCosts[${id}]())&&layers.h.upgrades[${id}].unlocked===originalHydrogenUnlocks[${id}]`));
});
test('the first Normal Mode Token costs Life Points and is available at exactly 1e6600',()=>{
 const e=loaded();e.run('player.h.upgrades=[55,65];player.h.points=new Decimal("1e7000");player.points=new Decimal("1e6599");updateTemp();updateTemp()');
 assert(e.run('tmp.tokens.getNextAt.eq("1e6600")&&!tmp.tokens.canReset&&tmp.tokens.getResetGain.eq(0)'));
 e.run('player.points=new Decimal("1e6600");updateTemp();updateTemp()');
 assert(e.run('tmp.tokens.canReset&&tmp.tokens.getResetGain.eq(1)'));
 e.run('doReset("tokens");updateTemp();updateTemp()');assert(e.run('player.tokens.total.eq(1)&&player.tokens.points.eq(1)&&tmp.tokens.getNextAt.eq("1e7760")'));
});
test('later Token prices, effective-token modifiers, and Hard/Extreme Token formulas stay original',()=>{
 const e=engine();e.run('var originalTokenNext=tokenNextAt;loadContinuation()');
 for(const flags of [[false,false],[true,false],[false,true],[true,true]])for(const n of [0,1,2,10,86,90]){
  e.run(`player.hardMode=${flags[0]};player.extremeMode=${flags[1]};player.tokens.total=new Decimal(${n});updateTemp();updateTemp()`);
  if(n<2&&!flags[0]&&!flags[1])continue;
  assert(e.run('tokenNextAt().eq(originalTokenNext())'),JSON.stringify({flags,n}));
 }
 e.run('player.hardMode=false;player.extremeMode=false;player.tokens.total=new Decimal(0);tmp.tokens.getMinusEffectiveTokens=new Decimal(1)');assert(e.run('tokenNextAt().eq(originalTokenNext())'));
});
test('existing Hydrogen upgrades and Token totals survive the price-only update',()=>{
 const e=loaded();e.run('player.version="2.070.5";player.h.upgrades=[54,55,61,62,63,64,65];player.h.points=new Decimal("1e1500");player.tokens.total=new Decimal(3);player.tokens.points=new Decimal(2);save()');
 const r=engine('',[...e.storage]);r.run('loadContinuation()');assert(r.run('player.h.upgrades.includes(65)&&player.h.points.eq("1e1500")&&player.tokens.total.eq(3)&&player.tokens.points.eq(2)'));
});

test('the second Normal Mode Token charges 1e7760 Life Points with an inclusive threshold',()=>{
 const e=loaded();e.run('player.h.upgrades=[55,65];player.tokens.total=new Decimal(1);player.tokens.points=new Decimal(1);player.points=new Decimal("1e7759");updateTemp();updateTemp()');
 assert(e.run('tmp.tokens.getNextAt.eq("1e7760")&&!tmp.tokens.canReset&&tmp.tokens.getResetGain.eq(0)'));
 e.run('player.points=new Decimal("1e7760");updateTemp();updateTemp()');assert(e.run('tmp.tokens.canReset&&tmp.tokens.getResetGain.eq(1)'));
 e.run('doReset("tokens");updateTemp();updateTemp()');assert(e.run('player.tokens.total.eq(2)&&player.tokens.points.eq(2)&&tmp.tokens.getNextAt.eq(Decimal.pow(10,7630))'));
});
