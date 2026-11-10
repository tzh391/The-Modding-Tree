/* Native-engine release audit. A supplied save is read locally and never embedded in reports. */
const fs = require('node:fs');
const { engine } = require('../tests/helpers/engine.cjs');
const args = process.argv.slice(2);
const option = name => { const i=args.indexOf(name); return i<0 ? undefined : args[i+1]; };
const savePath=option('--save'), reportPath=option('--output') || 'work/pacing-report.json';
let storage=[];
if(savePath) {
    const raw=JSON.parse(Buffer.from(fs.readFileSync(savePath,'utf8').trim(),'base64').toString('utf8'));
    const player=raw.r ? raw : raw[raw.set];
    player.versionType='tree_of_life_chemistry_checkpoint';
    storage=[['tree_of_life_chemistry_checkpoint',Buffer.from(JSON.stringify({set:'chemistry',chemistry:player}),'utf8').toString('base64')]];
}
const e=engine('?start=chemistry',storage);
e.ctx.isReference=!!savePath;
e.run('loadContinuation();player.paused=false;Math=Object.create(Math);let auditRng=391;Math.random=()=>{auditRng=(1664525*auditRng+1013904223)>>>0;return auditRng/4294967296;}');
e.ctx.auditProgress=x=>process.stdout.write(JSON.stringify(x)+'\n');
const report=e.run(`(function(){
    const events=[],majorRewards=[],factoryCurve=[],chemistryCurve=[],potentialBursts=[];
    const gates=[24,27,30,33,36,39];
    const curveLevels=[18,19,20,21,22,24,27,30,33,36,39,40,51,60,100];
    const maxAuditSeconds=isReference?2400:10800;
    const old=['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar'];
    const seenMilestones=new Set(['r','chem'].flatMap(layer=>player[layer].milestones.map(id=>layer+':'+id)));
    const initialFactory=player.r.buyables[11].toNumber();
    const seenWarmups=new Set([19,20,21].filter(l=>initialFactory>=l));
    const seenGates=new Set(gates.filter(l=>initialFactory>=l && hasMilestone('r',17)));
    const start={researchers:player.r.points.toString(),factoryI:player.r.buyables[11].toString(),chemists:player.chem.total.toString(),chemistry:player.chem.upgrades.slice(),milestones:player.chem.milestones.slice()};
    let time=0,autoActivated=!!player.chem.autoEarly;
    function record(action){events.push({time,action});}
    function major(action){record(action);majorRewards.push({time,action});}
    function collect(){
        for(const layer of ['r','chem']) for(const id of player[layer].milestones){
            const key=layer+':'+id;if(seenMilestones.has(key))continue;seenMilestones.add(key);
            if((layer==='r' && [17,18].includes(Number(id))) || (layer==='chem' && [1,2,3].includes(Number(id))))major('Earn '+key);
        }
        for(const l of [19,20,21])if(hasMilestone('r',16)&&player.r.buyables[11].gte(l)&&!seenWarmups.has(l)){seenWarmups.add(l);major('Factory Widget ramp '+l);}
        for(const l of gates) if(hasMilestone('r',17)&&player.r.buyables[11].gte(l)&&!seenGates.has(l)){seenGates.add(l);major('Factory base bonus '+l);}
        while(curveLevels.length&&player.r.buyables[11].gte(curveLevels[0])){
            const targetLevel=curveLevels.shift();
            if(targetLevel<initialFactory)continue;
            factoryCurve.push({targetLevel,time,base:layers.r.buyables.getBaseMult().toString(),widgetsPerSecond:ChemistryQoL.widgetRate().toString(),countedHiawdLevels:layers.r.widgets.getMilestone17Levels().toString()});
        }
    }
    function step(){
        gameLoop(1);updateTemp();time++;collect();
        if(time%100===0)auditProgress({time,researchers:player.r.points.toString(),factoryI:player.r.buyables[11].toString(),K:player.chem.best_amount.K.div(5).max(1).log(2).floor().toString(),Ca:player.chem.best_amount.Ca.div(5).max(1).log(2).floor().toString(),chemistry:player.chem.upgrades.slice()});
    }
    if(!isReference){
        for(const id of old)for(const role of ['workers','scientists'])ChemistryQoL.assign(role,id,0);
        for(const id of old){
            if(player.chem.buildings[id].lt(1)){
                ChemistryQoL.assign('workers',id,1);record('Start first '+id+' building');
                while(player.chem.buildings[id].lt(1)&&time<100)step();
                ChemistryQoL.assign('workers',id,0);
            }
            if(ChemistryQoL.assign('scientists',id,1))record('Start '+id+' production');
            while(player.chem.best_amount[id].lt(10)&&time<100)step();
        }
    }
    updateTemp();
    function allocate(){
        if(ChemistryQoL.autoUnlocked()&&!autoActivated){ChemistryQoL.toggleAuto();autoActivated=true;record('Enable full staffing for H–Ne');}
        const active=hasUpgrade('chem',11)?old.concat(['K','Ca']):old;
        for(const id of active)if(!ChemistryQoL.autoManaged(id)&&player.chem.scientists[id].eq(0)&&player.chem.points.gte(1)){
            if(ChemistryQoL.assign('scientists',id,1))record('Start '+id+' science');
        }
        const priority=hasUpgrade('chem',11)?['K','Ca','O','He','N','C']:['O','He','N','C'];
        for(const id of priority)if(!ChemistryQoL.autoManaged(id)&&player.chem.workers[id].eq(0)&&player.chem.points.gte(1)){
            if(ChemistryQoL.assign('workers',id,1))record('Start '+id+' construction');
        }
        for(let n=0;player.chem.points.gte(1)&&n<100;n++){
            const science=player.chem.autoEarly&&hasUpgrade('chem',11);
            const id=science?(player.chem.scientists.K.lte(player.chem.scientists.Ca)?'K':'Ca'):priority[n%priority.length];
            const role=science?'scientists':'workers';
            if(ChemistryQoL.autoManaged(id))continue;
            if(ChemistryQoL.assign(role,id,player.chem[role][id].plus(1)))record('Assign a free Chemist to '+id+' '+role);
        }
    }
    while(time<maxAuditSeconds){
        allocate();
        if(tmp.hu.buyables[41].unlocked&&tmp.hu.buyables[41].canAfford){
            const before=Object.values(player.hu.buyables).reduce((a,b)=>a.plus(b),new Decimal(0));buyBuyable('hu',41);
            const after=Object.values(player.hu.buyables).reduce((a,b)=>a.plus(b),new Decimal(0));
            if(after.gt(before))record('Improve Human buyables with Bulk');
        }
        for(const layer of ['r','chem'])for(const id of Object.keys(layers[layer].upgrades).filter(x=>/^\\d+$/.test(x))){
            const before=player[layer].upgrades.length;buyUpgrade(layer,id);
            if(player[layer].upgrades.length>before){major('Buy '+layer+' upgrade '+id);if(layer==='chem')chemistryCurve.push({time,upgrade:Number(id),K:player.chem.best_amount.K.div(5).max(1).log(2).floor().toString(),Ca:player.chem.best_amount.Ca.div(5).max(1).log(2).floor().toString()});}
        }
        if(hasMilestone('r',15))for(const id of [23,22,21,13,12,11]){
            const before=player.r.buyables[id];buyBuyable('r',id);if(player.r.buyables[id].gt(before))record('Factory '+id+' level '+player.r.buyables[id]);
        }
        collect();if(isEndgameRaw()){record('Patch endpoint');break;}step();
    }
    let longestWait=0,worstGap=null;
    for(let i=1;i<events.length;i++){const gap=events[i].time-events[i-1].time;if(gap>longestWait){longestWait=gap;worstGap={from:events[i-1],to:events[i]};}}
    if(events.length&&time-events[events.length-1].time>longestWait){longestWait=time-events[events.length-1].time;worstGap={from:events[events.length-1],to:{time,action:'Audit ended'}};}
    for(let i=1;i<majorRewards.length;i++)if(majorRewards[i].time-majorRewards[i-1].time<10)potentialBursts.push({from:majorRewards[i-1],to:majorRewards[i],seconds:majorRewards[i].time-majorRewards[i-1].time});
    return {version:VERSION.withoutName,scenario:isReference?'Local supplied save replay':'Original Group 3 unlock through continuation',seed:391,timeStepSeconds:1,start,simulatedSeconds:time,completed:isEndgameRaw(),maxWaitSeconds:100,longestWaitSeconds:longestWait,worstGap,meaningfulEvents:events.length,majorRewards,potentialBursts,factoryCurve,chemistryCurve,final:{researchers:player.r.points.toString(),factoryI:player.r.buyables[11].toString(),chemists:player.chem.total.toString(),chemistry:player.chem.upgrades.slice(),milestones:player.chem.milestones.slice(),K:player.chem.best_amount.K.div(5).max(1).log(2).floor().toString(),Ca:player.chem.best_amount.Ca.div(5).max(1).log(2).floor().toString()}};
})()`);
fs.mkdirSync('work',{recursive:true});fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
process.stdout.write('PACING_RESULT '+JSON.stringify(report)+'\n');
process.exitCode=report.completed&&report.longestWaitSeconds<=100&&report.potentialBursts.length===0?0:1;
