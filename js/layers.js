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
	
	return gain
}

function getMEff(id){
        return layers.m.upgrades[id].effect()
}

addLayer("m", {
        name: "Middle School", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                        unlocked: true,
			points: new Decimal(0),
        }},
        color: "#FFC746",
        requires: new Decimal(1e14), // Can be a function that takes requirement increases into account
        resource: "Middle School Students", // Name of prestige currency
        baseResource: "Elementary Students", // Name of resource prestige is based on
        baseAmount() {return player.e.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: Math.log(2) / Math.log(1e5),  
        // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
                gain = new Decimal(1)
                return gain
        },
        branches: ["e"],
        gainExp() { // Calculate the exponent on main currency from bonuses
                let x = hasMilestone("m", 3) ? 1.5 : 1
                if (hasUpgrade("m", 13)) x *= 5/3
                return new Decimal(x)
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "m", description: "Press M for Middle School Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return hasUpgrade("e", 44) || player.m.points.gt(0) || player.m.upgrades.length > 0},
	upgrades: {
		rows: 4,
                cols: 4,
                11: {
                        title: "Functions",
                        description: "Buff the exponentiation effect maxing at 1e5, and push the log softcap to 2^64",
                        cost: new Decimal(1),
                        effect(){
                                return getPEff(13).pow(3/5).min(1e5)
                        },
                        unlocked() {
                                return true
                        },
                },
                12: {
                        title: "Composition of functions",
                        description: "Multiply points by 8 to the square root of prestige upgrades",
                        cost: new Decimal(1),
                        effect(){
                                return Decimal.pow(8, Math.sqrt(player.p.upgrades.length))
                        },
                        unlocked() {
                                return hasUpgrade("m", 11)
                        },
                },
                13: {
                        title: "Product of functions",
                        description: "Each Middle School Upgrade keeps the corresponding Elementary School Upgrade",
                        cost: new Decimal(2),
                        unlocked() {
                                return hasUpgrade("m", 12)
                        },
                },
                14: {
                        title: "Fraction Addition",
                        description: "Raise Middle School Student gain to the five thirds",
                        cost: new Decimal(3),
                        unlocked(){
                                return hasUpgrade("m", 13)
                        },
                },
                21: {
                        title: "Fraction Multiplication",
                        description: "Unlock the first challenge", //bullying idfk
                        /*
                        reward: (1+comps)^5*2^(comps^2) to points
                        chall: points ^(1/(2+comps))
                        */
                        cost: new Decimal(7),
                        unlocked(){
                                return hasUpgrade("m", 14) && hasMilestone("m", 2)
                        },
                },
                22: {
                        title: "Function Rules",
                        description: "Unlock the second challenge",
                        cost: new Decimal(12),
                        /*
                        reward: (2+comps)^comps - 1 to prestige gain
                        chall: prestige points ^(1/(2+comps))
                        */
                        unlocked(){
                                return hasUpgrade("m", 21) && hasMilestone("m", 2) && false //completed the second challenge
                        },
                }
	},
        milestones: {
                1: {
                        requirementDescription: "<i>Student</i><br>1 Middle School Student",
                        effectDescription: "You keep one row of prestige upgrades per milestone",
                        done(){
                                return player.m.points.gte(1)
                        },
                },
                2: {
                        
                        requirementDescription: "<i>Group Project</i><br>4 Middle School Students",
                        effectDescription: "Unlock a new row of upgrades",
                        done(){
                                return player.m.points.gte(4)
                        },
                },
                3: {
                        requirementDescription: "<i>Class</i><br>16 Middle School Students",
                        effectDescription: "Raise Middle School Student gain to the 1.5",
                        done(){
                                return player.m.points.gte(16)
                        },
                },
                4: {
                        requirementDescription: "<i>Grade</i><br>64 Middle School Students",
                        effectDescription: "Gain 100% of Elementary School Students on reset per second",
                        done(){
                                return player.m.points.gte(64)
                        },
                },
                5: {
                        requirementDescription: "<i>Middle School</i><br>256 Middle School Students",
                        done(){
                                return player.m.points.gte(256)
                        },
                },
        }

})






