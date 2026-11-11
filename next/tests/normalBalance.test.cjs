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



test('Token schedules contain finite increasing exponents with the original number of entries',()=>{
 const e=loaded();
 for(const name of ['TOKEN_COSTS','TOKEN_COSTS_LEGACY','TOKEN_COSTS_EXTREME'])assert(e.run(`${name}.every((x,i,a)=>Number.isFinite(x)&&x>0&&(i===0||x>a[i-1]))`),name+' must have finite increasing exponents');
 assert(e.run('TOKEN_COSTS.length===TOKEN_COSTS_LEGACY.length'));
});
test('editing tokenSupport table entries takes effect after installation without a price override',()=>{
 const e=loaded();
 for(const [index,exponent] of [[0,6650],[1,7770],[2,7800],[3,8200],[20,45900]]){
  e.run(`TOKEN_COSTS[${index}]=${exponent};player.tokens.total=new Decimal(${index});updateTemp();updateTemp()`);
  assert(e.run(`tmp.tokens.getNextAt.eq(new Decimal('1e${exponent}'))`),'editable Token '+(index+1));
 }
 e.run('player.tokens.total=new Decimal(1);player.easyMode=true;updateTemp();updateTemp()');assert(e.run('tmp.tokens.getNextAt.eq(Decimal.pow(10,7587))'));
 e.run('player.easyMode=false;player.hardMode=true;updateTemp();updateTemp()');assert(e.run('tmp.tokens.getNextAt.eq(Decimal.pow(10,7587).times(1e4))'));
 e.run('player.hardMode=false;player.extremeMode=true;updateTemp();updateTemp()');assert(e.run('tmp.tokens.getNextAt.eq(Decimal.pow(10,7600))'));
});

test('native advanced bulk gains and other difficulty threshold comparisons are retained',()=>{
 const e=engine();e.run('var originalTokenGain=layers.tokens.getResetGain;loadContinuation();player.hu.unlocked=true;player.points=new Decimal("eee20");updateTemp();updateTemp()');
 assert(e.run('layers.tokens.getResetGain().eq(originalTokenGain())'));
 e.run('player.hu.unlocked=false;player.tokens.total=new Decimal(0)');
 for(const mode of ['easyMode','hardMode','extremeMode']){
  e.run(`player.easyMode=false;player.hardMode=false;player.extremeMode=false;player.${mode}=true;updateTemp();updateTemp();player.points=tmp.tokens.getNextAt;updateTemp();updateTemp()`);
  assert(e.run('layers.tokens.getResetGain().eq(originalTokenGain())&&layers.tokens.getResetGain().eq(0)'),mode);
 }
});

test('raising a table entry cannot leave an affordable cached Normal Mode threshold',()=>{
 const e=loaded();e.run('player.h.upgrades=[55,65];player.tokens.total=new Decimal(1);player.points=new Decimal("1e7850");TOKEN_COSTS[1]=7800;updateTemp();updateTemp()');assert(e.run('tmp.tokens.canReset'));
 e.run('TOKEN_COSTS[1]=7900;updateTemp()');assert(e.run('tmp.tokens.getNextAt.eq("1e7900")&&layers.tokens.getResetGain().eq(0)'));
});

test('the first three Normal Mode Tokens use the configured costs and reset at exact boundaries',()=>{
 for(const n of [0,1,2]){
  const e=loaded();e.run(`player.h.upgrades=[55,65];player.tokens.total=new Decimal(${n});player.tokens.points=new Decimal(${n});var expectedCost=new Decimal('1e'+TOKEN_COSTS[${n}]);player.h.points=expectedCost.times(100);player.points=expectedCost.div(10);updateTemp();updateTemp()`);
  assert(e.run('tmp.tokens.getNextAt.eq(expectedCost)&&!tmp.tokens.canReset&&tmp.tokens.getResetGain.eq(0)'),'insufficient Life Points at Token '+(n+1));
  e.run('player.points=expectedCost;updateTemp();updateTemp()');assert(e.run('tmp.tokens.canReset&&tmp.tokens.getResetGain.eq(1)'));
  e.run('doReset("tokens");updateTemp();updateTemp()');assert(e.run(`player.tokens.total.eq(${n+1})&&player.tokens.points.eq(${n+1})&&tmp.tokens.getNextAt.eq(new Decimal('1e'+TOKEN_COSTS[${n+1}]))`));
 }
});
