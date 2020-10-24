function getEffectFromEndsProg(lower, higher, progress, exp = 1){
        let a = 1 / (1 + Math.pow(progress, exp))
        return higher - (higher - lower) * a
}

function filter(list, keep){
        return list.filter(x => keep.includes(x))
}

//theme: math education
/*
layer: school levels (elem, middle, high, coll, grad etc)
professions: 


second layer unlocks with u34 and 1e9 pts
*/

// Determines if it should show points/sec
function canGenPoints(){
	return player.p.upgrades.includes(11)
}

// Calculate points/sec!
function getPointGen() {
	if (!canGenPoints()) return new Decimal(0)

        //buffs
	let gain = new Decimal(1)
	if (player.p.upgrades.includes(12)) gain = gain.times(getPEff(12))
	if (player.p.upgrades.includes(13)) gain = gain.times(getPEff(13))
        
	if (player.e.upgrades.includes(11)) gain = gain.times(getEEff(11))
	if (player.e.upgrades.includes(12)) gain = gain.times(2)
	if (player.e.upgrades.includes(13)) gain = gain.times(3)
	if (player.e.upgrades.includes(23)) gain = gain.times(getEEff(23))
	if (player.e.upgrades.includes(34)) gain = gain.times(getEEff(34))
        
        if (player.p.upgrades.includes(51)) gain = gain.times(getPEff(51))
        if (player.p.upgrades.includes(52)) gain = gain.times(getPEff(52))
        if (player.p.upgrades.includes(53)) gain = gain.times(getPEff(53))
        if (player.p.upgrades.includes(54)) gain = gain.times(getPEff(54))
        
        if (hasUpgrade("e", 43)) gain = gain.pow(1.01)
        if (hasUpgrade("e", 44)) gain = gain.times(2)
        if (hasUpgrade("m", 12)) gain = gain.times(getMEff(12))
        if (challengeCompletions("m", 11) > 0) gain = gain.times(getMChallRewardEff(11))
        if (challengeCompletions("m", 12) > 0) gain = gain.times(getMChallRewardEff(12))


        //nerfs (challenges)
        let exp = new Decimal(1)
        if (inChallenge("m", 11)) {
                exp = exp.times(getMChallEff(11))
        }
        if (inChallenge("m", 12)) {
                //Decimal.div(30, challengeCompletions("m", 12) + 3)
                if (gain.gt(10)) gain = gain.log10().pow(getMChallEff(12)).min(gain)
        }
        if (inChallenge("m", 22)){
                exp = exp.times(getMChallEff(22))
        }
	
	let ret = gain.pow(exp)
        if (ret.gt(1e200)) ret = ret.sqrt().times(1e100)
        if (ret.gt(1e300)) ret = ret.sqrt().times(1e150)
        if (ret.gt("1e400")) ret = ret.sqrt().times(1e200)
        return ret
}






