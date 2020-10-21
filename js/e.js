function getEEff(id){
        return layers.e.upgrades[id].effect()
}

addLayer("e", {
        name: "Elementary School", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                        unlocked: true,
			points: new Decimal(0),
        }},
        color: "#FFC746",
        requires: new Decimal(1e9), // Can be a function that takes requirement increases into account
        resource: "Elementary Students", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 1 / Math.log2(10),  
        // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
                gain = new Decimal(1)
                if (hasUpgrade("e", 23)) gain = gain.times(player.points.plus(1e9).log10().pow(-4).times(5e5).plus(1))
                if (player.e.upgrades.includes(34)) gain = gain.times(getEEff(34))
                return gain
        },
        branches: ["p"],
        gainExp() { // Calculate the exponent on main currency from bonuses
                return new Decimal(1)
        },
        update(diff){
                if (hasMilestone("m", 4) && tmp.e && tmp.e.resetGain) {
                        let div = hasMilestone("m", 5) ? 1 : 100
                        player.e.points = player.e.points.plus(tmp.e.resetGain.times(diff).div(div))
                }
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "e", description: "Press E for Elementary School Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.p.upgrades.length >= 12 || player.e.points.gt(0) || player.e.upgrades.length > 0 || tmp.m.layerShown},
        upgrades: {
                rows: 4,
                cols: 4,
                11: {
                        title: "Greater Than",
                        description: "Boost point gain based on Elementary Students",
                        cost: new Decimal(1),
                        effect() {
                                let ret = player.e.points.times(5).plus(4).pow(.5)
                                if (ret.gt(1e10)) ret = ret.log10().pow(10)
                                return ret
                        },
                        unlocked(){
                                return true
                        },
                },
                12: {
                        title: "Greater Than Or Equal To",
                        description: "Unlock two new Prestige Upgrades and double point gain",
                        cost: new Decimal(1),
                        unlocked() {
                                return hasUpgrade("e", 11)
                        },
                },
                13: {
                        title: "Less Than",
                        description: "Unlock two new Prestige Upgrades and triple point gain",
                        cost: new Decimal(2),
                        unlocked() {
                                return hasUpgrade("e", 12)
                        },
                },
                14: {
                        title: "Less Than Or Equal To",
                        description: "Add one to the exponent of the first sixteen Prestige Upgrades",
                        cost: new Decimal(5),
                        unlocked(){
                                return hasUpgrade("e", 13)
                        },
                },
                21: {
                        title: "One, Two, Three...",
                        description: "Keep the first four Prestige Upgrades and add one to their effect exponents",
                        cost: new Decimal(13),
                        unlocked(){
                                return hasUpgrade("e", 14)
                        }
                },
                22: {
                        title: "Ninety nine, One Hundred!",
                        description: "Keep the next four Prestige Upgrades and add one to their effect exponents",
                        cost: new Decimal(34),
                        unlocked(){
                                return hasUpgrade("e", 21)
                        },
                },
                23: {
                        title: "Counting With Your Hands",
                        description: "Multiply point gain based on total time played and buff the Elementary Students formula",
                        cost: new Decimal(89),
                        effect(){
                                let time = player.timePlayed
                                let eff = 1
                                return Decimal.add(1000, time).log10().pow(eff * 2)
                        },
                        unlocked(){
                                return hasUpgrade("e", 22)
                        },
                },
                24: {
                        title: "Count With Your Brain",
                        description: "Add to the exponent limit for the second Prestige Upgrade based on itself",
                        cost: new Decimal(233),
                        effect(){
                                let eff = 1
                                let ret = new Decimal(getExpEffForP(12)).plus(9).log10().pow(eff).div(10)
                                if (ret.gt(.25)) return ret.times(400).log10().div(8)
                                return ret
                        },
                        effectDisplay(){
                                return format(getEEff(24), 3)
                        },
                        unlocked(){
                                return hasUpgrade("e", 23)
                        },
                },
                31: {
                        title: "Addition without carrying",
                        description: "Keep the next four Prestige Upgrades and add one to their effect exponents",
                        cost: new Decimal(610),
                        unlocked(){
                                return hasUpgrade("e", 24)
                        },
                },
                32: {
                        title: "Addition with carrying",
                        description: "Keep the next four Prestige Upgrades and add one to their effect exponents",
                        cost: new Decimal(1597),
                        unlocked(){
                                return hasUpgrade("e", 31)
                        },
                },
                33: {
                        title: "Negative Numbers",
                        description: "The third Prestige Upgrade Effect is raised to the twentieth power after 200",
                        cost: new Decimal(4181),
                        unlocked(){
                                return hasUpgrade("e", 32)
                        },
                },
                34: {
                        title: "Repeated Addition",
                        description: "Multiply ES and point gain by the log of prestige points",
                        cost: new Decimal(10946),
                        effect(){
                                return player.p.points.plus(10).log10()
                        },
                        unlocked(){
                                return hasUpgrade("e", 33)
                        },
                },
                41: {
                        title: "Multiplcation Tables",
                        description: "Gain 100% of prestige point gained on reset every second",
                        cost: new Decimal(50000),
                        unlocked(){
                                return hasUpgrade("e", 34)
                        },
                },
                42: {
                        title: "Fractions",
                        description: "Unlock four new Prestige Upgrades",
                        cost: new Decimal(1e9),
                        unlocked(){
                                return hasUpgrade("e", 41)
                        },
                },
                43: {
                        title: "Fraction Addition",
                        description: "Raise point gain to the 1.01",
                        cost: new Decimal(1e12),
                        unlocked(){
                                return hasUpgrade("e", 42)
                        },
                },
                44: {
                        title: "Graduation to Middle School",
                        description: "Unlock the next prestige layer and double point gain",
                        cost: new Decimal(1e14),
                        unlocked(){
                                return hasUpgrade("e", 43)
                        },
                },
        },
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 1) return
                let keep = hasUpgrade("m", 13) ? player.m.upgrades : []
                player.e.upgrades = filter(player.e.upgrades, keep)
                player.e.points = new Decimal(0)
        }
})