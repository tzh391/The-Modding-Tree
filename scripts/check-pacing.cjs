/* Release audit using the actual game loop and a legal active-play policy. */
const fs = require('node:fs');
const { engine } = require('../tests/helpers/engine.cjs');
const e = engine('?start=chemistry'); e.run('loadContinuation(); Math=Object.create(Math); let auditRng=391; Math.random=()=>{auditRng=(1664525*auditRng+1013904223)>>>0;return auditRng/4294967296;}');
e.ctx.auditProgress = x => process.stdout.write(JSON.stringify(x) + '\n');
const report = e.run(`(function () {
    const events = [], transitions = [];
    let time = 0;
    function record(action) { events.push({ time, action }); }
    function step() {
        gameLoop(1); updateTemp(); time++;
        if (time % 100 === 0) auditProgress({time, researchers:player.r.points.toString(), factories:player.r.buyables[11].toString(), chemistry:player.chem.upgrades.slice(), totalChemists:player.chem.total.toString()});
    }
    const old = ['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar'];
    for (const id of old) for (const role of ['workers','scientists']) ChemistryQoL.assign(role,id,0);
    for (const id of old) {
        if (player.chem.buildings[id].lt(1)) {
            ChemistryQoL.assign('workers',id,1); record('Start first '+id+' building');
            while(player.chem.buildings[id].lt(1) && time<100) step();
            ChemistryQoL.assign('workers',id,0);
        }
        ChemistryQoL.assign('scientists',id,1); record('Start '+id+' production');
        while(player.chem.best_amount[id].lt(10) && time<100) step();
    }
    updateTemp();
    const factoryIds = [23,22,21,13,12,11];
    function allocateNewStaff() {
        const active=hasUpgrade('chem',11)?old.concat(['K','Ca']):old;
        for(const id of active) if(player.chem.scientists[id].eq(0) && player.chem.points.gte(1)) {
            ChemistryQoL.assign('scientists',id,1); record('Start '+id+' scientist allocation');
        }
        const priority=hasUpgrade('chem',11)?['K','Ca','O','He','N','C']:['O','He','N','C'];
        for(const id of priority) if(player.chem.workers[id].eq(0) && player.chem.points.gte(1)) {
            ChemistryQoL.assign('workers',id,1); record('Start '+id+' construction');
        }
        // Newly recruited staff add permanent productive capacity; no repeated shuffling.
        for(let n=0;player.chem.points.gte(1)&&n<50;n++) {
            const id=priority[n%priority.length];
            ChemistryQoL.assign('workers',id,player.chem.workers[id].plus(1)); record('Assign a new Chemist to '+id);
        }
    }
    while(time<3600) {
        allocateNewStaff();
        // Original Human Bulk is an important part of the Researcher/Widget loop.
        // A cooldown click alone is not recorded; actual buyable levels must improve.
        if(tmp.hu.buyables[41].unlocked && tmp.hu.buyables[41].canAfford) {
            const before=Object.values(player.hu.buyables).reduce((a,b)=>a.plus(b),new Decimal(0));
            buyBuyable('hu',41);
            const after=Object.values(player.hu.buyables).reduce((a,b)=>a.plus(b),new Decimal(0));
            if(after.gt(before)) record('Improve Human buyables with Bulk');
        }
        for(const layer of ['r','chem']) for(const id of Object.keys(layers[layer].upgrades).filter(x=>/^\\d+$/.test(x))) {
            const before=player[layer].upgrades.length; buyUpgrade(layer,id);
            if(player[layer].upgrades.length>before) {
                record('Buy '+layer+' upgrade '+id); transitions.push({time,action:'Buy '+layer+' upgrade '+id,researchers:player.r.points.toString()});
            }
        }
        if(hasMilestone('r',15)) for(const id of factoryIds) {
            const before=player.r.buyables[id]; buyBuyable('r',id);
            if(player.r.buyables[id].gt(before)) record('Factory '+id+' level '+player.r.buyables[id]);
        }
        if(isEndgameRaw()) { record('Patch endpoint'); break; }
        step();
    }
    let longestWait=0, worst=null;
    for(let i=1;i<events.length;i++) { const wait=events[i].time-events[i-1].time; if(wait>longestWait){longestWait=wait;worst={from:events[i-1],to:events[i]};} }
    const tail=time-events[events.length-1].time;
    if(tail>longestWait){longestWait=tail;worst={from:events[events.length-1],to:{time,action:'Audit ended without another action'}};}
    return {scenario:'Original Group 3 unlock save through Chemistry continuation',maxWaitSeconds:100,timeStepSeconds:1,simulatedSeconds:time,completed:isEndgameRaw(),longestWaitSeconds:longestWait,worstGap:worst,meaningfulEvents:events.length,transitions,final:{researchers:player.r.points.toString(),chemistry:player.chem.upgrades.slice(),milestones:player.r.milestones.slice(),chemistryMilestones:player.chem.milestones.slice(),K:player.chem.best_amount.K.toString(),Ca:player.chem.best_amount.Ca.toString()}};
})()`);
fs.mkdirSync('work',{recursive:true});
fs.writeFileSync('work/pacing-report.json', JSON.stringify(report,null,2)+'\n');
process.stdout.write('PACING_RESULT '+JSON.stringify(report)+'\n');
process.exitCode = report.longestWaitSeconds<=100 && report.completed ? 0 : 1;
