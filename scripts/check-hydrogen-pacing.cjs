/* Native early-game audit; the built-in checkpoint is used without added resources. */
const fs=require('node:fs');const {engine}=require('../tests/helpers/engine.cjs');
const args=process.argv.slice(2);const outIndex=args.indexOf('--output');
const output=outIndex<0?'work/pacing-hydrogen-report.json':args[outIndex+1];
let e=engine();const seed=e.run('JSON.parse(atob(CUSTOM_SAVES["e300 Hydrogen"]))');
seed.versionType='tree_of_life_continuation';seed.paused=false;seed.keepGoing=false;seed.time=Date.now();
e=engine('',[['tree_of_life_continuation',Buffer.from(JSON.stringify({set:'audit',audit:seed})).toString('base64')]]);
e.run('loadContinuation();player.paused=false');
e.ctx.progress=x=>console.log(JSON.stringify(x));
const result=e.run(`(()=>{
 const events=[],targets=[];let time=0;
 const record=action=>events.push({time,action});
 const start={checkpoint:'Original e300 Hydrogen',hydrogen:player.h.points.toString(),lifePoints:player.points.toString(),tokens:player.tokens.total.toString()};
 for(;time<5000;time++){
  for(const layer of ['h','c','o','mini'])for(const id of Object.keys(layers[layer].upgrades).filter(x=>/^\\d+$/.test(x))){
   const n=player[layer].upgrades.length;buyUpgrade(layer,id);if(player[layer].upgrades.length>n){record(layer+' upgrade '+id);if(layer==='h'&&[61,62,63,64,65].includes(Number(id)))targets.push({time,action:'Hydrogen '+id,hydrogen:player.h.points.toString()});}
  }
  for(const id of Object.keys(layers.mini.buyables).filter(x=>/^\\d+$/.test(x))){
   const n=player.mini.buyables[id];buyBuyable('mini',id);if(player.mini.buyables[id].gt(n))record('mini buyable '+id);
  }
  if(tmp.tokens.canReset&&hasUpgrade('h',65)) {targets.push({time,action:'First Token',lifePoints:player.points.toString()});record('First Token');break;}
  gameLoop(1);updateTemp();
  if(time%100===0)progress({time,H:player.h.points.toString(),LP:player.points.toString(),hydrogenUpgrades:player.h.upgrades,miniUpgrades:player.mini.upgrades});
 }
 let longestWait=0,worst=null;for(let i=1;i<events.length;i++)if(events[i].time-events[i-1].time>longestWait){longestWait=events[i].time-events[i-1].time;worst={from:events[i-1],to:events[i]};}
 if(time-(events.at(-1)?.time||0)>longestWait){longestWait=time-(events.at(-1)?.time||0);worst={from:events.at(-1),to:{time,action:'Audit stopped'}};}
 const gaps=targets.slice(1).map((item,index)=>item.time-targets[index].time);
 return {version:VERSION.withoutName,start,simulatedSeconds:time,completed:targets.some(x=>x.action==='First Token'),maxWaitSeconds:100,longestWaitSeconds:longestWait,worstGap:worst,minimumTargetRewardGapSeconds:gaps.length?Math.min(...gaps):null,potentialBursts:gaps.map((gap,index)=>({from:targets[index],to:targets[index+1],seconds:gap})).filter(x=>x.seconds<10),targets,eventCount:events.length,final:{H:player.h.points.toString(),LP:player.points.toString()}};
})()`);
fs.mkdirSync('work',{recursive:true});fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log('HYDROGEN_PACING_RESULT '+JSON.stringify(result));
process.exitCode=result.completed&&result.longestWaitSeconds<=100&&result.potentialBursts.length===0?0:1;
