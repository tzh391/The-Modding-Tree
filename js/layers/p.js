function getPEff(id){
        return layers.p.upgrades[id].effect()
}

function getExpEffForP(id){
        let eff = 1
        if (id == 11) return eff - 1
        if (id < 14 && hasUpgrade("p", 14)) eff *= getPEff(14).toNumber()
        if (id < 21 && hasUpgrade("p", 21)) eff *= getPEff(21).toNumber()
        if (id < 22 && hasUpgrade("p", 22)) eff *= getPEff(22).toNumber()
        if (id < 23 && hasUpgrade("p", 23)) eff *= getPEff(23).toNumber()
        if (id < 24 && hasUpgrade("p", 24)) eff *= getPEff(24).toNumber()
        if (id % 10 == 1 && id < 31 && hasUpgrade("p", 31)) eff += getPEff(31).toNumber()
        if (id % 10 == 2 && id < 32 && hasUpgrade("p", 32)) eff += getPEff(32).toNumber()
        if (id % 10 == 3 && id < 33 && hasUpgrade("p", 33)) eff += getPEff(33).toNumber()
        if (id % 10 == 4 && id < 34 && hasUpgrade("p", 34)) eff += getPEff(34).toNumber()
        if (id < 50 && hasUpgrade("e", 14)) eff += 1
        if (id < 20 && id > 10 && hasUpgrade("e", 21)) eff += 1
        if (id < 30 && id > 20 && hasUpgrade("e", 22)) eff += 1
        if (id < 40 && id > 30 && hasUpgrade("e", 31)) eff += 1
        if (id < 50 && id > 40 && hasUpgrade("e", 32)) eff += 1
        if (id % 10 == 1 && id < 41 && hasUpgrade("p", 41)) eff += getPEff(41).toNumber()
        if (id % 10 == 2 && id < 42 && hasUpgrade("p", 42)) eff += getPEff(42).toNumber()

        return eff - 1
}


function softcapP13(ret){
        if (ret.gt(1e15)) ret = ret.times(1e5).pow(3/4)
        if (player.m.upgrades.includes(11)){
                if (ret.gt(Decimal.pow(2, 64))) {
                        let log = ret.log(2)
                        ret = Decimal.pow(log * 4, 8)
                }
        } else if (ret.gt(1e10)) ret = ret.log10().pow(10)
        return ret
}

addLayer("p", {
        name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: true,
			points: new Decimal(0),
        }},
        color: "#4BDC13",
        requires: new Decimal(10), // Can be a function that takes requirement increases into account
        resource: "prestige points", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        canReset() {return player.points.gte(10)},
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
                mult = new Decimal(1)
                return mult
        },
        postExpMult(){
                mult = new Decimal(1)
                if (challengeCompletions("m", 21) > 0) mult = mult.times(getMChallRewardEff(21))
                return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
                let x = new Decimal(1)
                if (inChallenge("m", 21)) x = x.times(getMChallEff(21))
                if (inChallenge("m", 22)) x = x.times(getMChallEff(22))
                return x
        },
        update(diff){
                if (hasUpgrade("e", 41) && tmp.p && tmp.p.resetGain) {
                        player.p.points = player.p.points.plus(tmp.p.resetGain.times(diff))
                }
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return true},
        upgrades: {
                rows: 5,
                cols: 4,
                11: {
                        title: "Addition",
                        description: "Gain one point per second",
                        cost: new Decimal(1),
                        unlocked: () => true,
                },
                12: {
                        title: "Multiplication",
                        description: "Logarithimically multiply points gained based on points",
                        cost: new Decimal(1),
                        effect() {
                                let eff = getExpEffForP(12)
                                let higher = 5
                                if (player.e.upgrades.includes(24)) higher += getEEff(24).toNumber()
                                let exp = getEffectFromEndsProg(1, higher, eff)
                                let ret = player.points.plus(10).log10().pow(exp).plus(1).times(eff + 1)
                                if (ret.gt(1e10)) ret = ret.log10().pow(10)
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("p", 11)
                        },
                },
                13: {
                        title: "Exponentiation",
                        description: "Double Logarithimically multiply points gained based on points",
                        cost: new Decimal(2),
                        effect() {
                                let eff = getExpEffForP(13)
                                let exp = getEffectFromEndsProg(1, 7, eff)
                                let mult = Math.min(eff + 1, 20)
                                let ret = player.points.plus(10).log10().plus(10).log10().pow(exp).plus(1).times(mult)
                                if (hasUpgrade("e", 33) && ret.gt(200)) ret = ret.div(200).pow(20).times(200)
                                ret = ret.times(ret.pow(3/2).min(1e5))

                                ret = softcapP13(ret)
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("p", 12)
                        },
                },
                14: {
                        title: "Tetration",
                        description: "Buff all previous upgrade exponents based on points",
                        cost: new Decimal(5),
                        effect() {
                                let eff = getExpEffForP(14)
                                let exp = getEffectFromEndsProg(.1, .3, eff)
                                return player.points.plus(10).log10().pow(exp).div(5).plus(1)
                        },
                        effectDisplay() {
                                return "*" +format(getPEff(14), 3) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("p", 13)
                        },
                },
                21: {
                        title: "Subtraction",
                        description: "Buff all previous upgrade exponents based on points",
                        cost: new Decimal(9),
                        effect() {
                                let eff = getExpEffForP(21)
                                let exp = getEffectFromEndsProg(.1, .3, eff)
                                return player.points.plus(10).log10().plus(10).log10().pow(exp).div(3).plus(1)
                        },
                        effectDisplay() {
                                return "*" +format(getPEff(21), 3) + " to the exponent formula"
                        },
                        unlocked() {
                                return hasUpgrade("p", 14)
                        },
                },
                22: {
                        title: "Division",
                        description: "Buff all previous upgrade exponents based on points",
                        cost: new Decimal(30),
                        effect() {
                                let eff = getExpEffForP(22)
                                let exp = getEffectFromEndsProg(.1, .25, eff)
                                return player.points.plus(2).slog(2).pow(exp).div(2).plus(1)
                        },
                        effectDisplay() {
                                return "*" +format(getPEff(22), 3) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("p", 21)
                        },
                },
                23: {
                        title: "Logarithim",
                        description: "Buff all previous upgrade exponents based on points",
                        cost: new Decimal(100),
                        effect() {
                                let eff = getExpEffForP(23)
                                let exp = getEffectFromEndsProg(.1, 1, eff)
                                return player.points.plus(2).slog(2).pow(exp).div(3).plus(1)
                        },
                        effectDisplay() {
                                return "*" +format(getPEff(23), 3) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("p", 22)
                        },
                },
                24: {
                        title: "Slog",
                        description: "Buff all previous upgrade exponents based on points",
                        cost: new Decimal(400),
                        effect() {
                                let eff = getExpEffForP(24)
                                let exp = getEffectFromEndsProg(.1, 2, eff)
                                return player.points.plus(2).slog(2).pow(exp).div(10).plus(1)
                        },
                        effectDisplay() {
                                return "*" +format(getPEff(24), 3) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("p", 23)
                        },
                },
                31: {
                        title: "Associativity",
                        description: "Buff the above upgrade based on prestige points",
                        cost: new Decimal(2000),
                        effect() {
                                let eff = getExpEffForP(31)
                                return player.p.points.plus(eff).times(eff + 1).plus(9).log10().pow(.3).minus(1).times(4)
                        },
                        effectDisplay() {
                                return "+" +format(getPEff(31), 3) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("p", 24)
                        },
                },
                32: {
                        title: "Identity",
                        description: "Buff the above upgrades based on prestige points",
                        cost: new Decimal(4000),
                        effect() {
                                let eff = getExpEffForP(32)
                                return player.p.points.plus(eff).plus(10).log10().pow(.2)
                        },
                        effectDisplay() {
                                return "+" +format(getPEff(32), 3) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("p", 24)
                        },
                },
                33: {
                        title: "Inverses",
                        description: "Buff the above upgrades based on prestige points",
                        cost: new Decimal(1e4),
                        effect() {
                                let eff = getExpEffForP(33)
                                return player.p.points.plus(10).log10().pow(.8).minus(1).plus(eff / 10)
                        },
                        effectDisplay() {
                                return "+" +format(getPEff(33), 3) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("p", 24)
                        },
                },
                34: {
                        title: "Commutativity",
                        description: "Buff the above upgrades based on prestige points",
                        cost: new Decimal(2e4),
                        effect() {
                                let eff = getExpEffForP(34) + 1
                                return player.p.points.plus(10).times(eff).log10().pow(Math.min(eff, 8) / 10).minus(1)
                        },
                        effectDisplay() {
                                return "+" +format(getPEff(34), 3) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("p", 24)
                        },
                },
                41: {
                        title: "Distributive",
                        description: "Buff the 5th and 9th upgrade based on Elementary Students",
                        cost: new Decimal(25e5),
                        effect(){
                                let eff = getExpEffForP(41)
                                let exp = getEffectFromEndsProg(.5, .7, eff)
                                let ret = player.e.points.plus(8).pow(exp).minus(2.5).pow(exp)
                                if (ret.gt(2)) return ret.minus(1)
                                return ret.div(2)
                        },
                        effectDisplay() {
                                return "+" +format(getPEff(41)) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("e", 12) && hasUpgrade("p", 34)
                        },
                },
                42: {
                        title: "Group",
                        description: "Buff the second column of upgrades based on Elementary Students",
                        cost: new Decimal(5e6),
                        effect(){
                                let eff = getExpEffForP(42)
                                let exp = getEffectFromEndsProg(.5, .8, eff)
                                return player.e.points.pow(2).plus(9).pow(exp).plus(1).pow(exp).plus(2).pow(exp)
                        },
                        effectDisplay() {
                                return "+" +format(getPEff(42)) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("e", 12) && hasUpgrade("p", 34)
                        },
                },
                43: {
                        title: "Ring",
                        description: "Buff the third column of upgrades based on Elementary Students",
                        cost: new Decimal(2e7),
                        effect(){
                                let eff = getExpEffForP(43)
                                let exp = getEffectFromEndsProg(.2, .5, eff)
                                return player.e.points.plus(10).log10().plus(100).pow(exp).div(2)
                        },
                        effectDisplay() {
                                return "+" +format(getPEff(43)) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("e", 13) && hasUpgrade("p", 34)
                        },
                },
                44: {
                        title: "Field",
                        description: "Buff the fourth column of upgrades based on Elementary Students",
                        cost: new Decimal(1e9),
                        effect(){
                                let eff = getExpEffForP(44)
                                let exp = getEffectFromEndsProg(.25, .6, eff)
                                let ret = player.e.points.plus(10).log10().plus(10).pow(exp)
                                if (ret.gt(1.5)) return ret.times(6).plus(1).log10().times(1.5)
                                return ret
                        },
                        effectDisplay() {
                                return "+" +format(getPEff(44)) + " to the exponent formula"
                        },
                        unlocked(){
                                return hasUpgrade("e", 13) && hasUpgrade("p", 34)
                        },
                },
                51: {
                        title: "Module",
                        description: "Multiply point gain based on the first column of upgrades",
                        cost: new Decimal(3e18),
                        effect(){
                                let a = getPEff(21).plus(1)
                                let b = getPEff(31).plus(1)
                                let c = getPEff(41).plus(10).log10()
                                let ret = a.times(b).times(c).pow(2)
                                if (ret.gt(1e10)) ret = ret.log10().times(10)
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("e", 42) && hasUpgrade("p", 44)
                        },
                },
                52: {
                        title: "Algebra",
                        description: "Multiply point gain based on the second column of upgrades",
                        cost: new Decimal(1e21),
                        effect(){
                                let a = getPEff(22).plus(1)
                                let b = getPEff(32).plus(1)
                                let c = getPEff(42).plus(10).log10()
                                let d = getPEff(12).log10().plus(9).log10().pow(5)
                                let ret = a.times(b).times(c).times(d).pow(3)
                                if (ret.gt(1e10)) ret = ret.log10().times(10)
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("e", 42) && hasUpgrade("p", 51)
                        },
                },
                53: {
                        title: "Vector Space",
                        description: "Multiply point gain based on the third column of upgrades",
                        cost: new Decimal(1e30),
                        effect(){
                                let a = getPEff(23).plus(1)
                                let b = getPEff(33).plus(1)
                                let c = getPEff(43).plus(1)
                                let d = getPEff(13).log10()
                                let ret = a.times(b).times(c).pow(2).times(d)
                                if (ret.gt(1e10)) ret = ret.log10().times(10)
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("e", 42) && hasUpgrade("p", 52)
                        },
                },
                54: {
                        title: "Homomorphism",
                        description: "Multiply point gain based on the fourth column of upgrades",
                        cost: new Decimal(1e40),
                        effect(){
                                let a = getPEff(24).plus(1)
                                let b = getPEff(34).plus(1)
                                let c = getPEff(44).plus(1)
                                let ret = a.times(b).times(c).pow(2)
                                if (ret.gt(1e10)) ret = ret.log10().times(10)
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("e", 42) && hasUpgrade("p", 53)
                        },
                },
        },
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 0) return
                let keep = []
                if (hasUpgrade("e", 21) || hasMilestone("m", 1)) {
                        keep.push(11, 12, 13, 14)
                }
                if (hasUpgrade("e", 22) || hasMilestone("m", 2)) {
                        keep.push(21, 22, 23, 24)
                }
                if (hasUpgrade("e", 31) || hasMilestone("m", 3)) {
                        keep.push(31, 32, 33, 34)
                }
                if (hasUpgrade("e", 32) || hasMilestone("m", 4)) {
                        keep.push(41, 42, 43, 44)
                }
                if (hasMilestone("m", 5)) {
                        keep.push(51, 52, 53, 54)
                }
                player.p.upgrades = filter(player.p.upgrades, keep)
                player.p.points = new Decimal(0)
        }
})