function getMEff(id){
        return layers.m.upgrades[id].effect()
}

function getMChallEff(id){
        return layers.m.challenges[id].challengeEffect()
}

function getMChallRewardEff(id){
        return layers.m.challenges[id].rewardEffect()
}

function addMOld() {addLayer("m", {
        name: "Middle School", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                        unlocked: true,
			points: new Decimal(0),
        }},
        color: "#B0250E",
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
        postExpGainMult(){

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
                        description: "Unlock the first set of challenges", 
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
                        description: "Unlock the second set of challenges",
                        cost: new Decimal(100),
                        /*
                        reward: (2+comps)^comps - 1 to prestige gain
                        chall: prestige points ^(1/(2+comps))
                        */
                        unlocked(){
                                return hasUpgrade("m", 21) && challengeCompletions("m", 12) > 0
                        },
                },
                23: {
                        title: "Associative Property",
                        description: "The Square Root challenge exponent is raised to the .8",
                        cost: new Decimal(15e3),
                        unlocked(){
                                return hasUpgrade("m", 22) && challengeCompletions("m", 21) > 0
                        },
                },
                24: {
                        title: "Commutative Property",
                        description: "Logarithm completions effect Square Root reward",
                        cost: new Decimal(1e5), //change
                        unlocked(){
                                return hasUpgrade("m", 23)
                        },
                },
                31: {
                        title: "Variables",
                        description: "Keep all elementary school upgrades, and the Square Root challenge exponent is raised to the .8",
                        cost: new Decimal(1e7), //change
                        unlocked(){
                                return hasUpgrade("m", 24) && challengeCompletions("m", 22) > 0
                        },
                },
                32: {
                        title: "Equations",
                        description: "Raise Double Logairthm challenge exponent raised to the .5",
                        cost: new Decimal(3e7), //change
                        unlocked(){
                                return hasUpgrade("m", 31)
                        },
                },
                33: {
                        title: "Solving Euqations",
                        description: "Remove all Exponentiation softcaps (not yet)",
                        cost: new Decimal(3e8), //change
                        unlocked(){
                                return hasUpgrade("m", 32)
                        },
                },

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
                        effectDescription: "Gain 1% of Elementary School Students on reset per second",
                        done(){
                                return player.m.points.gte(64)
                        },
                },
                5: {
                        requirementDescription: "<i>Middle School</i><br>640 Middle School Students",
                        effectDescription: "Gain 99% of Elementary School Students on reset per second",
                        done(){
                                return player.m.points.gte(640)
                        },
                },
        },
        challenges: {
                rows: 3,
                cols: 2,
                11: {
                        name: "Square Root",
                        challengeDescription() {
                                return "^" + format(getMChallEff(11), 3) + " to point gain"
                        },
                        challengeEffect(){
                                let exp = hasUpgrade("m", 23) ? .8 : 1
                                exp *= hasUpgrade("m", 31) ? .8 : 1
                                return Decimal.div(2, Decimal.add(4, challengeCompletions("m", 11))).pow(exp)
                        },
                        rewardDescription() {
                                return "Boost point gain based on " + (hasUpgrade("m", 23) ? "this row " : "") + "completions"
                        },
                        rewardEffect(){
                                let c = challengeCompletions("m", 11)
                                if (hasUpgrade("m", 24)) c += challengeCompletions("m", 12) 
                                let c2 = Math.max(c , 3)
                                let ret = Decimal.add(1, c).pow(5).times(Decimal.pow(2, c*c2))
                                if (ret.gt(1e50)) ret = ret.log10().times(2).pow(25)
                                return ret
                        },
                        rewardDisplay(){
                                let end = challengeCompletions("m", 11) == 1 ? "" : "s"
                                return format(getMChallRewardEff(11)) + "x to point gain <br> because you have " + format(challengeCompletions("m", 11), 0) + " completion" + end
                                //we need a thing for when you have finished 5 times (a different display)
                        },
                        goal() {
                                let c = challengeCompletions("m", 11)
                                let exp = 9 + (c*c + c)/2
                                let base = 10
                                if (c >= 5) {
                                        base *= c / 4
                                        exp *= Math.sqrt(c)/2
                                }
                                let ret = Decimal.pow(base, exp)
                                return Decimal.pow(10, ret.log10().floor())
                        },
                        unlocked(){
                                return hasUpgrade("m", 21)
                        },
                        completionLimit: 10,
                        currencyInternalName: "points",
                },
                12: {
                        name: "Logarithm",
                        challengeDescription() {
                                return "Point gain above 10 is log(gain)^" + format(getMChallEff(12))
                        },
                        challengeEffect(){
                                return Decimal.div(60, challengeCompletions("m", 12) + 6)
                        },
                        rewardDescription: "Boost point gain based on this row completions",
                        rewardEffect(){
                                let c = challengeCompletions("m", 12)
                                let c2 = c + challengeCompletions("m", 11) / 3
                                let base = Decimal.add(1, c ** 2 + c).min(7)
                                let exp = c2 + c2*c2 * 3 + 1/3
                                let ret = Decimal.pow(base, exp)
                                if (ret.gt(1e50)) ret = ret.log10().times(2).pow(25)
                                return ret
                        },
                        rewardDisplay(){
                                let end = challengeCompletions("m", 12) == 1 ? "" : "s"
                                return format(getMChallRewardEff(12)) + "x to point gain <br> because you have " + format(challengeCompletions("m", 12), 0) + " completion" + end
                        },
                        goal() {
                                let c = challengeCompletions("m", 12)
                                //let exp = Math.pow(c + 1, 3) + Math.pow(c + 2, 2) + c + 4
                                let exp = 14 + c * 2
                                if (c >= 5) exp += (c - 3) * (c - 4) / 2
                                return Decimal.pow(10, exp)
                        },
                        unlocked(){
                                return challengeCompletions("m", 11) > 0
                        },
                        completionLimit: 10,
                        currencyInternalName: "points",
                },
                21: {
                        name: "Cube Root",
                        challengeDescription() {
                                return "^" + format(getMChallEff(21), 3) + " to prestige point gain"
                        },
                        challengeEffect(){
                                return Decimal.div(2, Decimal.add(4, challengeCompletions("m", 21)))
                        },
                        rewardDescription: "Boost prestige point gain based on completions",
                        rewardEffect(){
                                let c = challengeCompletions("m", 21)
                                return Decimal.add(1, 2*c).pow(c + 3)
                        },
                        rewardDisplay(){
                                let end = challengeCompletions("m", 21) == 1 ? "" : "s"
                                return format(getMChallRewardEff(21)) + "x to prestige point gain <br> because you have " + format(challengeCompletions("m", 21), 0) + " completion" + end
                        },
                        goal() {
                                let c = challengeCompletions("m", 21)
                                let exp = Math.floor(Math.pow(2, 6 + c/2)) + 22
                                return Decimal.pow(10, exp)
                        },
                        unlocked(){
                                return hasUpgrade("m", 22)
                        },
                        completionLimit: 10,
                        currencyInternalName: "points",
                },
                22: {
                        name: "Double Logarithm",
                        challengeDescription() {
                                return "Point and prestige point gain is ^" + format(getMChallEff(22), 3)
                        },
                        challengeEffect(){
                                let exp = 1
                                exp *= hasUpgrade("m", 32) ? .5 : 1
                                return Decimal.div(1, Decimal.add(2, challengeCompletions("m", 22))).pow(exp)
                        },
                        rewardDescription(){
                                return "Prestige points ^" + format(getMChallRewardEff(22), 3) + "<br> boost the Elementary Student gain formula because you have " + format(challengeCompletions("m", 22), 0) + " completions"
                        },
                        rewardEffect(){
                                let c = challengeCompletions("m", 22)
                                let ret = Math.sqrt(c) / 10 + c / 100 + Math.cbrt(c) / 6
                                if (ret > .5) ret = Math.log10(ret * 20) / 2
                                return ret
                        },
                        goal() {
                                /*
                                change it to points per second, with goal being
                                [???] + 10*c*c points/s
                                */
                                let c = challengeCompletions("m", 22)
                                //let exp = Math.pow(c + 1, 3) + Math.pow(c + 2, 2) + c + 4
                                let exp = 73 + c * (c-1) * (c-2)
                                return Decimal.pow(10, exp)
                        },
                        unlocked(){
                                return challengeCompletions("m", 21) > 0 
                        },
                        completionLimit: 10,
                        currencyInternalName: "points",
                },
        },

})}
addMOld()
