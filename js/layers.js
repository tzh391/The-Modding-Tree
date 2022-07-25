function getPointGen(){
	let ret = getPointConstant()
        ret = ret.times(getPointMultiplier())
        ret = ret.pow(getPointExponentiation())
        ret = dilate(ret, getPointDilationExponent())

	return ret
}

function getPointConstant(){
        let ret = decimalOne

        return ret
}

function getPointMultiplier(){
        let ret = decimalOne

        for (let i = 0; i < LAYERS.length; i++){
                if (layers[LAYERS[i]].row == "side") continue
                                        ret = ret.times(tmp[LAYERS[i]].effect || decimalOne)
        }

        if (hasUpgrade("a", 11))        ret = ret.times(tmp.a.upgrades[11].effect)
                                        ret = ret.times(CURRENT_BUYABLE_EFFECTS["a11"])
        if (hasUpgrade("a", 12))        ret = ret.times(tmp.a.upgrades[12].effect)

        return ret
}

function getPointExponentiation(){
        let ret = decimalOne

        if (hasUpgrade("a", 15))        ret = ret.times(1.01)
        if (hasMilestone("a", 2)) {
                let base = 1.01
                if (player.b.times > 0 || player.c.unlocked) base = 1.03
                                        ret = ret.times(Decimal.pow(base, player.a.milestones.length))
        }
        
        return ret
}

function getPointDilationExponent(){
        let ret = decimalOne
        
        return ret
}

function getDilationExponent(){
        return getPointDilationExponent()
}

function sortStrings(l){
        l.sort(function(a,b){return Number(a)-Number(b)})
}

var br = "<br>"
var br2= br + br

function dilate(x, exponent, base = 10){
        if (x.lt(base)) return x
        return Decimal.pow(base, x.log(base).pow(exponent))
}

/*
All option+character:
¡™£¢∞§¶•ªº–≠
œ∑´®¥¨ˆøπ“‘«
åß∂ƒ©˙∆˚¬…æ
Ω≈ç√∫˜µ≤≥÷

All option+shift+character:
⁄€‹›ﬁﬂ‡°·‚—±
Œ„´‰ˇÁ¨Ø∏”’»
ÍÎÏ˝ÓÔÒÚÆ
¸˛Ç◊ı˜Â¯˘¿

Made 
𝞀
*/

function makeRed(c){
        return "<bdi style='color:#CC0033'>" + c + "</bdi>"
}

function makeBlue(c){
        return "<bdi style='color:#3379E3'>" + c + "</bdi>"
}

function makeGreen(c){
        return "<bdi style='color:#66E000'>" + c + "</bdi>"
}

function makePurple(c){
        return "<bdi style='color:#66297D'>" + c + "</bdi>"
}
                                                                                                                                                                                                                                                                        
function filter(list, keep){
        return list.filter(x => keep.includes(x) || keep.includes(Number(x)))
}

function filterOut(list, out){
        return list.filter(x => !out.includes(x) && !out.includes(Number(x)))
}

addLayer("a", {
        name: "Alligators", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#BB4C83",
        branches: [],
        requires: new Decimal(10), // Can be a function that takes requirement increases into account
        resource: "Alligators", // Name of prestige currency
        baseResource: "Points", // Name of resource prestige is based on
        baseAmount() {return player.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return getGeneralizedPrestigeGain("a").pow(hasMilestone("d", 1) + 1)
        },
        getBaseDiv(){
                let ret = decimalOne
                
                return ret
        },
        getGainExp(){
                let ret = new Decimal(2)

                if (hasUpgrade("a", 13)) ret = ret.max(player.a.upgrades.length)
                ret = ret.plus(CURRENT_BUYABLE_EFFECTS["a31"])

                return ret
        },
        getGainMultPre(){
                let ret = decimalOne

                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["a32"])
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["b31"])

                return ret
        },
        getGainMultPost(){
                let ret = getGeneralizedInitialPostMult("a")

                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["a12"])
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["a33"].pow(player.a.upgrades.length))
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["b12"])

                return ret
        },
        effect(){
                if (!isPrestigeEffectActive("a")) return decimalOne

                let amt = player.a.points

                let exp = new Decimal(.5)
                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["a23"])

                let ret = amt.plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("a")
        },
        getNextAt(){
                return getGeneralizedNextAt("a")
        },
        update(diff){
                let data = player.a

                if (tmp.a.getResetGain.gt(0)) data.unlocked = true

                data.best = data.best.max(data.points)
                doPassiveGain("a", diff)
                
                if (hasMilestone("b", 3) || player.c.unlocked) {
                        handleGeneralizedBuyableAutobuy(diff, "a")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        layerShown(){return true},
        prestigeButtonText(){
                if (isPassiveGainActive("a")) return ""
                return getGeneralizedPrestigeButtonText("a")
        },
        canReset(){
                return player.a.time >= 2 && !isPassiveGainActive("a") && tmp.a.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-ligator"
                        },
                        description(){
                                let a = "Alligators multiply point gain"
                                if (player.shiftAlias) return "log10(x+10)<sup>3</sup>"
                                return a + br + "Currently: " + format(tmp.a.upgrades[11].effect)
                        },
                        cost: new Decimal(2),
                        effect(){
                                let exp = CURRENT_BUYABLE_EFFECTS["a22"].plus(3)
                                return player.a.points.plus(10).log10().pow(exp)
                        },
                        unlocked(){
                                return player.a.best.gt(0) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al-igator"
                        },
                        description(){
                                return "Each of the first nine upgrades unlocks an Alligator buyable and doubles point gain"
                        },
                        cost: new Decimal(30),
                        effect(){
                                return Decimal.pow(2, Math.min(9, player.a.upgrades.length))
                        },
                        unlocked(){
                                return player.a.best.gt(10) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A--igator"
                        },
                        description(){
                                return "Alligator initial gain exponent is the number of Alligator upgrades"
                        },
                        cost: new Decimal(500),
                        unlocked(){
                                return hasUpgrade("a", 12) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>All-gator"
                        },
                        description(){
                                return "Gain 100% of Alligator gained on reset and one reset per second but lose the ability to prestige"
                        },
                        cost: new Decimal(3e10),
                        unlocked(){
                                return hasUpgrade("a", 13) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-l-gator"
                        },
                        description(){
                                return "Add .005 to A 13 base and raise Point gain ^1.01"
                        },
                        cost: new Decimal(1e20),
                        unlocked(){
                                return hasUpgrade("a", 14) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al--gator"
                        },
                        description(){
                                return "Remove A 1X base costs"
                        },
                        cost: new Decimal(1e40),
                        unlocked(){
                                return hasUpgrade("a", 15) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A---gator"
                        },
                        description(){
                                return "Remove the linear exponential component of A 11's cost"
                        },
                        cost: new Decimal(1e70),
                        unlocked(){
                                return hasUpgrade("a", 21) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Alli-ator"
                        },
                        description(){
                                return "Remove A 22's base cost"
                        },
                        cost: new Decimal(1e119),
                        unlocked(){
                                return hasUpgrade("a", 22) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 23)
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-li-ator"
                        },
                        description(){
                                return "Remove A 23's base cost and unlock Beavers"
                        },
                        cost: new Decimal(5e192),
                        unlocked(){
                                return hasUpgrade("a", 23) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 24)
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al-i-ator"
                        },
                        description(){
                                return "Remove A 21's base cost and per upgrade add .01 to A 13's base"
                        },
                        cost: new Decimal("1e636"),
                        unlocked(){
                                return hasUpgrade("b", 12) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 25)
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A--i-ator"
                        },
                        description(){
                                return "Remove A 21's linear exponential cost component and A 23 gives free A 22 levels"
                        },
                        cost: new Decimal("1e705"),
                        unlocked(){
                                return player.b.best.gte(1e4) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 31)
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>All--ator"
                        },
                        description(){
                                return "You get 100% of Beavers upon reset per second and add 1 to its effect exponent"
                        },
                        cost: new Decimal("1e819"),
                        unlocked(){
                                return hasUpgrade("a", 31) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 32)
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-l--ator"
                        },
                        description(){
                                return "<bdi style='font-size: 80%'>Per upgrade upgrades/10 multiplies Beaver gain and All--ator adds to Beaver upgrade per this row upgrade</bdi>"
                        },
                        cost: new Decimal("1e942"),
                        unlocked(){
                                return hasUpgrade("a", 32) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 33)
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al---ator"
                        },
                        description(){
                                return "B 12 gives free A 32 levels and add .5 to the Beaver gain exponent"
                        },
                        cost: new Decimal("1e2048"),
                        unlocked(){
                                return hasUpgrade("b", 15) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 34)
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A----ator"
                        },
                        description(){
                                return "Remove A buyable's base cost and per row 2 Beaver upgrade add .5 to the Beaver gain exponent"
                        },
                        cost: new Decimal("1e5600"),
                        unlocked(){
                                return hasUpgrade("b", 21) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 35)
                41: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Allig-tor"
                        },
                        description(){
                                return "Remove B 11's base cost and A 31 gives free A 21 levels"
                        },
                        cost: new Decimal("1e38200"),
                        unlocked(){
                                return hasUpgrade("b", 25) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 41)
                42: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-lig-tor"
                        },
                        description(){
                                return "Each this row upgrade adds 1 to B 31's base and B 22 gives free B 12 levels"
                        },
                        cost: new Decimal("1e270000"),
                        unlocked(){
                                return hasUpgrade("a", 41) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 42)
                43: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-lig-tor"
                        },
                        description(){
                                return "B 23 gives free B 21 levels"
                        },
                        cost: new Decimal("1e305800"),
                        unlocked(){
                                return hasUpgrade("a", 42) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 43)
                44: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-lig-tor"
                        },
                        description(){
                                return "B 31 gives free B 13 levels and multiplies A 11 base"
                        },
                        cost: new Decimal("1e544600"),
                        unlocked(){
                                return hasUpgrade("a", 43) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 44)
                45: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al-ig-tor"
                        },
                        description(){
                                return "B 31 gives free B 21 levels and multiplies A 13 base"
                        },
                        cost: new Decimal("1e861300"),
                        unlocked(){
                                return hasUpgrade("a", 44) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 45)
                51: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A--ig-tor"
                        },
                        description(){
                                return "Remove C 13 base cost and each upgrade in this row doubles Beaver bulk amount"
                        },
                        cost: new Decimal("e6e25"),
                        unlocked(){
                                return hasUpgrade("b", 23) || player.d.unlocked
                        }, 
                }, // hasUpgrade("a", 51)
                52: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>All-g-tor"
                        },
                        description(){
                                return "This row upgrades multiplies base Capybara gain"
                        },
                        cost: new Decimal("e2e26"),
                        unlocked(){
                                return hasUpgrade("a", 51) || player.d.unlocked
                        }, 
                }, // hasUpgrade("a", 52)
                53: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-l-g-tor"
                        },
                        description(){
                                return "B 22 gives free B 21 levels"
                        },
                        cost: new Decimal("e8.64e26"),
                        unlocked(){
                                return hasUpgrade("a", 52) || player.d.unlocked
                        }, 
                }, // hasUpgrade("a", 53)
                54: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al--g-tor"
                        },
                        description(){
                                return "Each C 23 adds 1 to the C 23 base"
                        },
                        cost: new Decimal("e4.68e28"),
                        unlocked(){
                                return hasUpgrade("a", 53) || player.d.unlocked
                        }, 
                }, // hasUpgrade("a", 54)
                55: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A---g-tor"
                        },
                        description(){
                                return "Each C 12 subtracts 1 from the C 21 linear cost base"
                        },
                        cost: new Decimal("e1.28e30"),
                        unlocked(){
                                return hasUpgrade("a", 54) || player.d.unlocked
                        }, 
                }, // hasUpgrade("a", 55)
        },
        buyables: getLayerGeneralizedBuyableData("a", [
                        function(){
                                return hasUpgrade("a", 12) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 12) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 13) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 14) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 15) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 21) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 22) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 23) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 24) || player.b.unlocked
                        },
                ]),
        milestones: {
                1: {
                        requirementDescription(){
                                return "4 A22"
                        },
                        done(){
                                return player.a.buyables[22].gte(4)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per milestone add .001 to A 21's base."
                        },
                }, // hasMilestone("a", 1)
                2: {
                        requirementDescription(){
                                return "1e300 Points"
                        },
                        done(){
                                return player.points.gte(1e300)
                        },
                        unlocked(){
                                return hasMilestone("a", 1)
                        },
                        effectDescription(){
                                if (player.b.times > 0 || player.c.unlocked) return "Reward: Per milestone raise point gain ^" + makeRed("1.03") + "."
                                return "Reward: Per milestone raise point gain ^1.01."
                        },
                }, // hasMilestone("a", 2)
                3: {
                        requirementDescription(){
                                return "1e650 Points"
                        },
                        done(){
                                return player.points.gte("1e650")
                        },
                        unlocked(){
                                return hasMilestone("a", 2)
                        },
                        effectDescription(){
                                return "Reward: Remove the linear component of A 13's cost."
                        },
                }, // hasMilestone("a", 3)
                4: {
                        requirementDescription(){
                                return "1e1375 Points"
                        },
                        done(){
                                return player.points.gte("1e1375")
                        },
                        unlocked(){
                                return hasMilestone("a", 3)
                        },
                        effectDescription(){
                                return "Reward: Remove the linear component of A 22's cost and A buyables cost nothing."
                        },
                }, // hasMilestone("a", 4)
        },
        infoboxes: {
                introBox: {
                        title: "Introduction",
                        body(){
                                let a = "<h1>" + makeRed("Welcome to PRESTIGE CHAIN REINCARNATED!") + "</h1>"
                                let b = "There are seven pieces of information you should be aware of:"
                                let c = "First, pressing shift (and control occasionally) can often allow you to see more information."
                                let d = "Second, buyables are a key feature of every layer in the main chain, of which the ninth of each layer gives free levels to all prior in its layer."
                                let e = "Furthermore, later layers' buyables give free levels to the same positions in lower layers."
                                let f = "Third, there is a save bank. View it by going to the info tab and clicking \"Show built in saves\" and scrolling down."
                                let g = "Fourth, this game is designed to be played on a computer on Google Chrome. If this does not apply to you there might be some bugs or other issues you run into." 
                                let h = "Fifth, things in " +  makeRed("red") + " are buffs the next layer gives which are automatically given upon resetting once (and not viewable before so)."
                                let i = "Sixth, \"per upgrade\" and \"per milestone\" refer to the number of upgrades or milestones in the layer that the upgrade, milestone, or buyable is in."
                                let j = "Finally, you can click and drag to buy lots of upgrades at once!"

                                return a + br2 + b + br2 + c + br2 + d + br + e + br2 + f + br2 + g + br2 + h + br2 + i + br2 + j
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return isPassiveGainActive("a") ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                return shiftDown ? "Your best Alligators is " + format(player.a.best) : "You have done " + formatWhole(player.a.times) + " Alligator resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("a")) {
                                                        if (player.shiftAlias) return "Alligator gain formula is " + getGeneralizedPrestigeButtonText("a")
                                                        return "You are gaining " + format(tmp.a.getResetGain) + " Alligators per second"
                                                }
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.a.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                "upgrades",
                                ["infobox", "introBox"],],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("a")) return "You are gaining " + format(tmp.a.getResetGain) + " Alligators per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("a", 12) || player.b.unlocked
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.a.times) + " Alligator resets"
                                        }
                                ],
                                "milestones"],
                        unlocked(){
                                return player.a.buyables[22].gt(0) || player.b.unlocked
                        },
                },
        },
        onPrestige(gain){
                player.a.times += player.b.best.gt(0) ? 3 : 1
        },
        doReset(layer){
                let data = player.a
                if (layer == "a") data.time = 0
                if (!getsReset("a", layer)) return
                
                data.times = 0

                if (!false /*player.e.unlocked*/) { //upgrades
                        let keptUpgrades = 0
                        if (hasMilestone("b", 2)) keptUpgrades += player.b.times
                        if (!false) {
                                data.upgrades = data.upgrades.slice(0, keptUpgrades)
                        }
                }

                if (!player.d.unlocked) { //milestones
                        let keptMilestones = 0
                        if (hasMilestone("b", 2)) keptMilestones += player.b.times
                        if (!false) {
                                data.milestones = data.milestones.slice(0, keptMilestones)
                        }
                }

                //resources
                data.points = decimalZero
                data.total = decimalZero
                data.best = decimalZero

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.a.buyables[resetBuyables[j]] = decimalZero
                }
        },
})

addLayer("b", {
        name: "Beavers", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        row: 1, // Row the layer is in on the tree (0 is the first row)
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#EC7D20",
        branches: ["a"],
        requires: new Decimal("1e250"), // Can be a function that takes requirement increases into account
        resource: "Beavers", // Name of prestige currency
        baseResource: "Alligators", // Name of resource prestige is based on
        baseAmount() {return player.a.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return getGeneralizedPrestigeGain("b")
        },
        getBaseDiv(){
                let ret = new Decimal(1e230)
                
                return ret
        },
        getGainExp(){
                let ret = new Decimal(2)

                if (hasUpgrade("a", 34))        ret = ret.plus(.5)
                if (hasUpgrade("a", 35))        ret = ret.plus(.5 * player.b.upgrades.filter(x => x < 30 && x > 20).length)
                                                ret = ret.plus(CURRENT_BUYABLE_EFFECTS["b23"])

                return ret
        },
        getGainMultPre(){
                let ret = new Decimal(.05)

                if (inChallenge("c", 21))       return ret

                if (hasUpgrade("b", 23))        ret = ret.times(20)
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["c22"])

                return ret
        },
        getGainMultPost(){
                let ret = getGeneralizedInitialPostMult("b")

                if (hasUpgrade("b", 13))        ret = ret.times(Decimal.pow(2, player.b.upgrades.length))
                if (hasUpgrade("a", 33))        ret = ret.times(Decimal.pow(player.a.upgrades.length/10, player.a.upgrades.length).max(1))
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["b11"])
                if (hasMilestone("b", 8))       ret = ret.times(Decimal.pow(Math.max(6, player.b.milestones.length)/6, player.b.milestones.length))
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["b31"])
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["b33"].pow(player.b.upgrades.length))
                if (hasUpgrade("b", 44))        ret = ret.times(CURRENT_BUYABLE_EFFECTS["b12"])

                return ret
        },
        effect(){
                if (!isPrestigeEffectActive("b")) return decimalOne

                let amt = player.b.points

                let exp = new Decimal(1)
                if (hasUpgrade("a", 32))        exp = exp.plus(hasUpgrade("a", 33) ? player.a.upgrades.filter(x => x < 40 && x > 30).length : 1)
                                                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["b13"])

                let ret = amt.times(4).plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("b")
        },
        getNextAt(){
                return getGeneralizedNextAt("b")
        },
        update(diff){
                let data = player.b

                if (tmp.b.getResetGain.gt(0)) data.unlocked = true

                data.best = data.best.max(data.points)
                doPassiveGain("b", diff)
                
                if (hasMilestone("c", 1) || player.d.unlocked) {
                        handleGeneralizedBuyableAutobuy(diff, "b")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        layerShown(){return hasUpgrade("a", 24) || player.b.unlocked},
        prestigeButtonText(){
                if (isPassiveGainActive("b")) return ""
                return getGeneralizedPrestigeButtonText("b")
        },
        canReset(){
                return player.b.time >= 2 && !isPassiveGainActive("b") && tmp.b.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-aver"
                        },
                        description(){
                                let a = "The Alligator autobuy speed is multiplied by 1 + Beaver resets"
                                return a
                        },
                        cost: new Decimal(20),
                        unlocked(){
                                return hasMilestone("b", 3) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be-ver"
                        },
                        description(){
                                let a = "A 32 gives free A 22 levels and you can bulk [upgrades]x Alligator buyables"
                                return a
                        },
                        cost: new Decimal(1000),
                        unlocked(){
                                return hasUpgrade("b", 11) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B--ver"
                        },
                        description(){
                                let a = "Per upgrade double Beaver gain and A 22 gives free A 13 and A 11 levels"
                                return a
                        },
                        cost: new Decimal(2000),
                        unlocked(){
                                return hasUpgrade("a", 25) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Bea-er"
                        },
                        description(){
                                let a = "Per upgrade add .2 to A 32's base and A 31 gives free A 22 levels"
                                return a
                        },
                        cost: new Decimal(1e6),
                        unlocked(){
                                return hasUpgrade("a", 32) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-a-er"
                        },
                        description(){
                                let a = "A 32 gives free A 21 and A 13 levels and unlock Beaver buyables"
                                return a
                        },
                        cost: new Decimal(6e7),
                        unlocked(){
                                return hasUpgrade("a", 33) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be--er"
                        },
                        description(){
                                let a = "A 21 gives free A 12 and A 13 levels and unlock another buyable"
                                return a
                        },
                        cost: new Decimal(1e13),
                        unlocked(){
                                return hasUpgrade("b", 15) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B---er"
                        },
                        description(){
                                let a = "B 13 gives free B 11 levels"
                                return a
                        },
                        cost: new Decimal(3e18),
                        unlocked(){
                                return hasUpgrade("b", 21) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Beav-r"
                        },
                        description(){
                                let a = "Gain 20x Base Beaver gain"
                                return a
                        },
                        cost: new Decimal(3e24),
                        unlocked(){
                                return hasUpgrade("b", 22) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 23)
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-av-r"
                        },
                        description(){
                                let a = "Each B 12 past 50 adds .01 to the B 11 base"
                                return a
                        },
                        cost: new Decimal(2e36),
                        unlocked(){
                                return hasUpgrade("b", 23) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 24)
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be-v-r"
                        },
                        description(){
                                let a = "B 21 gives free A 33 levels"
                                return a
                        },
                        cost: new Decimal(3e66),
                        unlocked(){
                                return hasUpgrade("b", 24) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 25)
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B--v-r"
                        },
                        description(){
                                let a = "B 31 gives free B 22 levels, add 1 to the Capybara gain exponent, and buy a Capybara buyable per second"
                                return a
                        },
                        cost: new Decimal("ee6"),
                        unlocked(){
                                return hasUpgrade("c", 22) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 31)
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Bea--r"
                        },
                        description(){
                                let a = "Remove C 12 linear cost base and each upgrade in this row or below adds .0001 to the C 13 base"
                                return a
                        },
                        cost: new Decimal("e39.9e6"),
                        unlocked(){
                                return hasUpgrade("b", 31) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 32)
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-a--r"
                        },
                        description(){
                                let a = "C 11 gives free B 33 levels"
                                return a
                        },
                        cost: new Decimal("e157e6"),
                        unlocked(){
                                return hasUpgrade("b", 32) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 33)
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be---r"
                        },
                        description(){
                                let a = "B 22 gives free B 13 levels"
                                return a
                        },
                        cost: new Decimal("e737.5e6"),
                        unlocked(){
                                return hasUpgrade("b", 33) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 34)
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B----r"
                        },
                        description(){
                                let a = "B 23 gives free B 22 levels"
                                return a
                        },
                        cost: new Decimal("e4025e6"),
                        unlocked(){
                                return hasUpgrade("b", 34) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 35)
                41: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Beave-"
                        },
                        description(){
                                let a = "A 32 gives free A 23 levels and square Beaver buyable bulk amount"
                                return a
                        },
                        cost: new Decimal("e1.62e10"),
                        unlocked(){
                                return hasUpgrade("b", 35) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 41)
                42: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-ave-"
                        },
                        description(){
                                let a = "C 32's after 26 count towards Capybara milestone 14 and A---g-tor"
                                return a
                        },
                        cost: new Decimal("e6.75e10"),
                        unlocked(){
                                return hasUpgrade("b", 41) && player.c.best.gte("1e4989") || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 42)
                43: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be-ve-"
                        },
                        description(){
                                let a = "A 12 gives free A 11 levels"
                                return a
                        },
                        cost: new Decimal("e2.01e11"),
                        unlocked(){
                                return hasUpgrade("b", 42) && player.c.best.gte("1e5577") || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 43)
                44: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B--ve-"
                        },
                        description(){
                                let a = "B 12 affects Beaver gain"
                                return a
                        },
                        cost: new Decimal("e9.94e11"),
                        unlocked(){
                                return hasUpgrade("b", 43) && player.c.best.gte("1e6614") || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 44)
                45: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Bea-e-"
                        },
                        description(){
                                let a = "Disable B-av-r and unlock a challenge"
                                return a
                        },
                        cost: new Decimal("e1.00e12"),
                        unlocked(){
                                return hasUpgrade("b", 44) && player.c.best.gte("1e7182") || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 45)
                51: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-a-e-"
                        },
                        description(){
                                let a = "Alligator buyable max amount is 1e100 and Duck upgrades count towards Duck milestone 5"
                                return a
                        },
                        cost: new Decimal("e2.39e18"),
                        unlocked(){
                                return hasUpgrade("d", 15) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("b", 51)
                52: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be--e-"
                        },
                        description(){
                                let a = "C 22 gives free C 13 levels"
                                return a
                        },
                        cost: new Decimal("e2.24e19"),
                        unlocked(){
                                return hasUpgrade("b", 51) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("b", 52)
                53: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B---e-"
                        },
                        description(){
                                let a = "C 21 gives free C 13 levels"
                                return a
                        },
                        cost: new Decimal("e9.70e20"),
                        unlocked(){
                                return player.d.buyables[11].gte(6) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("b", 53)
                54: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Beav--"
                        },
                        description(){
                                let a = "C 21 gives free C 11 levels"
                                return a
                        },
                        cost: new Decimal("e1.36e21"),
                        unlocked(){
                                return player.d.buyables[11].gte(12) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("b", 54)
                55: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-av--"
                        },
                        description(){
                                let a = "C 13 gives free C 11 levels and square Capybara bulk buy amount"
                                return a
                        },
                        cost: new Decimal("e2.02e26"),
                        unlocked(){
                                return player.d.buyables[11].gte(870) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("b", 55)
        },
        buyables: getLayerGeneralizedBuyableData("b", [
                        function(){
                                return hasUpgrade("b", 15) || player.c.unlocked
                        },
                        function(){
                                return hasMilestone("b", 5) || player.c.unlocked
                        },
                        function(){
                                return hasUpgrade("b", 21) || player.c.unlocked
                        },
                        function(){
                                return player.b.best.gte(1e48) || player.c.unlocked
                        },
                        function(){
                                return hasMilestone("b", 9) || player.c.unlocked
                        },
                        function(){
                                return hasMilestone("b", 10) || player.c.unlocked
                        },
                        function(){
                                return player.b.buyables[23].gte(8) || player.c.unlocked
                        },
                        function(){
                                return player.b.buyables[31].gte(58) || player.c.unlocked
                        },
                        function(){
                                return player.b.buyables[31].gte(71) || player.c.unlocked
                        },
                ]),
        milestones: {
                1: {
                        requirementDescription(){
                                return "1 Beaver reset"
                        },
                        done(){
                                return player.b.times >= 1
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: A13 gives free A11 levels."
                        },
                }, // hasMilestone("b", 1)
                2: {
                        requirementDescription(){
                                return "2 Beaver resets"
                        },
                        done(){
                                return player.b.times >= 2
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep an Alligator upgrade and milestone and remove A 23's linear cost component."
                        },
                }, // hasMilestone("b", 2)
                3: {
                        requirementDescription(){
                                return "4 Beaver resets"
                        },
                        done(){
                                return player.b.times >= 4
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Autobuy an Alligator buyable once per second and A 31 gives free A 23 levels."
                        },
                }, // hasMilestone("b", 3)
                4: {
                        requirementDescription(){
                                return "8 Beaver resets"
                        },
                        done(){
                                return player.b.times >= 8
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: The Alligator autobuyer triggers on every buyable per activation and A 32 gives free A 12 levels."
                        },
                }, // hasMilestone("b", 4)
                5: {
                        requirementDescription(){
                                return "500,000,000 Beavers"
                        },
                        done(){
                                return player.b.points.gte(5e8)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: A 32 gives free A 31 levels and unlock another buyable."
                        },
                }, // hasMilestone("b", 5)
                6: {
                        requirementDescription(){
                                return "1e23 Beavers"
                        },
                        done(){
                                return player.b.points.gte(1e23)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: A 31 gives free A 12 levels and remove the linear cost component of A buyables."
                        },
                }, // hasMilestone("b", 6)
                7: {
                        requirementDescription(){
                                return "1 B 21"
                        },
                        done(){
                                return player.b.buyables[21].gte(1)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 21 affects A 32 and gives free B 11 and B 12 levels."
                        },
                }, // hasMilestone("b", 7)
                8: {
                        requirementDescription(){
                                return "5e54 Beavers"
                        },
                        done(){
                                return player.b.points.gte(5e54)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: (Milestones / 6)<sup>Milestones</sup> multiplies Beaver gain."
                        },
                }, // hasMilestone("b", 8)
                9: {
                        requirementDescription(){
                                return "1e99 Beavers"
                        },
                        done(){
                                return player.b.points.gte(1e99)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 13 gives free B 12 levels, remove B 12 base costs, and unlock a new Beaver buyable."
                        },
                }, // hasMilestone("b", 9)
                10: {
                        requirementDescription(){
                                return "25 B 22"
                        },
                        done(){
                                return player.b.buyables[22].gte(25)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Unlock a new Beaver buyable and remove B 13's base cost."
                        },
                }, // hasMilestone("b", 10)
                11: {
                        requirementDescription(){
                                return "1e1112 Beavers"
                        },
                        done(){
                                return player.b.points.gte("1e1112")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: A 32 qudratic cost base and B 11 linear cost bases are 1.3."
                        },
                }, // hasMilestone("b", 11)
                12: {
                        requirementDescription(){
                                return "1e1168 Beavers"
                        },
                        done(){
                                return player.b.points.gte("1e1168")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 32 gives free B 31 levels."
                        },
                }, // hasMilestone("b", 12)
                13: {
                        requirementDescription(){
                                return "1e1671 Beavers"
                        },
                        done(){
                                return player.b.points.gte("1e1671")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove B 11 linear cost component."
                        },
                }, // hasMilestone("b", 13)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return isPassiveGainActive("b") ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                return shiftDown ? "Your best Beavers is " + format(player.b.best) : "You have done " + formatWhole(player.b.times) + " Beaver resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("b")) {
                                                        if (player.shiftAlias) return "Beaver gain formula is " + getGeneralizedPrestigeButtonText("b")
                                                        return "You are gaining " + format(tmp.b.getResetGain) + " Beavers per second"
                                                }
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.b.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("b")) return "You are gaining " + format(tmp.b.getResetGain) + " Beavers per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("b", 15) || player.c.unlocked
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.b.times) + " Beaver resets"
                                        }
                                ],
                                "milestones"],
                        unlocked(){
                                return player.b.times > 0 || player.c.unlocked
                        },
                },
        },
        onPrestige(gain){
                player.b.times += player.c.best.gt(0) ? 3 : 1
        },
        doReset(layer){
                let data = player.b
                if (layer == "b") data.time = 0
                if (!getsReset("b", layer)) return
                
                data.times = Math.min(data.times, hasMilestone("c", 4) ? player.c.times : 0)

                if (!false/*player.f.unlocked*/) { //upgrades
                        let keptUpgrades = 0
                        if (hasMilestone("c", 3)) keptUpgrades += player.c.times
                        if (!false) {
                                data.upgrades = data.upgrades.slice(0, keptUpgrades)
                        }
                }

                if (!false/*player.e.unlocked*/) { //milestones
                        let keptMilestones = 0
                        if (hasMilestone("c", 2)) keptMilestones += player.c.times
                        if (!false) {
                                data.milestones = data.milestones.slice(0, keptMilestones)
                        }
                }

                //resources
                data.points = decimalZero
                data.total = decimalZero
                data.best = decimalZero

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = decimalZero
                }
        },
})

addLayer("c", {
        name: "Capybaras", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        row: 2, // Row the layer is in on the tree (0 is the first row)
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                everC12: false,
        }},
        color: "#6B8B2E",
        branches: ["b"],
        requires: new Decimal("1e1971"), // Can be a function that takes requirement increases into account
        resource: "Capybaras", // Name of prestige currency
        baseResource: "Beavers", // Name of resource prestige is based on
        baseAmount() {return player.b.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return getGeneralizedPrestigeGain("c")
        },
        getBaseDiv(){
                let ret = new Decimal("1e1871")
                
                return ret
        },
        getGainExp(){
                let ret = new Decimal(4)

                if (hasUpgrade("c", 11))        ret = ret.plus(player.c.upgrades.length)
                if (hasUpgrade("b", 31))        ret = ret.plus(1)
                                                ret = ret.plus(CURRENT_BUYABLE_EFFECTS["c21"])

                return ret
        },
        getGainMultPre(){
                let ret = new Decimal(.01)

                if (hasUpgrade("a", 52))        ret = ret.times(player.a.upgrades.filter(x => x > 50 && x < 60).length)
                                        
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["c31"])
                if (hasUpgrade("d", 15))        ret = ret.times(2)

                return ret
        },
        getGainMultPost(){
                let ret = getGeneralizedInitialPostMult("c")

                ret = ret.times(CURRENT_BUYABLE_EFFECTS["c11"])
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["c22"])
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["c33"].pow(player.c.upgrades.length))
                
                if (player.c.everC12)           ret = ret.times(10)
                if (hasMilestone("c", 21))      ret = ret.times(getBuyableAmount("c", 33).sub(33).max(0).div(4).floor().pow10())
                if (hasMilestone("c", 26))      ret = ret.times(getBuyableAmount("c", 33).sub(58).pow10().min(100).max(1))

                return ret
        },
        effect(){
                if (!isPrestigeEffectActive("c")) return decimalOne

                let amt = player.c.points

                let exp = new Decimal(5)
                if (hasUpgrade("c", 11))        exp = exp.plus(player.c.upgrades.length)

                                                exp = exp.times(CURRENT_BUYABLE_EFFECTS["c23"])
                if (hasMilestone("c", 27))      exp = exp.times(10)
                if (hasMilestone("c", 29))      exp = exp.times(2.5)
                if (hasMilestone("c", 30))      exp = exp.times(getBuyableAmount("c", 33).max(40).log(40).pow(getBuyableAmount("c", 33).sub(94).max(0).min(3)))
                if (hasUpgrade("c", 31))        exp = exp.times(player.d.points.max(10).log10())

                let ret = amt.times(2).plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("c")
        },
        getNextAt(){
                return getGeneralizedNextAt("c")
        },
        update(diff){
                let data = player.c

                if (tmp.c.getResetGain.gt(0)) data.unlocked = true

                data.best = data.best.max(data.points)
                doPassiveGain("c", diff)
                
                if (hasUpgrade("b", 31) || hasMilestone("d", 1)) {
                        handleGeneralizedBuyableAutobuy(diff, "c")
                } else {
                        data.abtime = 0
                }
                data.time += diff

                if (hasChallenge("c", 12)) player.c.everC12 = true
        },
        layerShown(){return player.b.best.gte("1e1900") || player.c.unlocked},
        prestigeButtonText(){
                if (isPassiveGainActive("c")) return ""
                return getGeneralizedPrestigeButtonText("c")
        },
        canReset(){
                return player.c.time >= 2 && !isPassiveGainActive("c") && tmp.c.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-pybara"
                        },
                        description(){
                                let a = "Each upgrade adds 1 to the Capybara effect and gain exponents and you can bulk 10x more Alligator buyables"
                                return a
                        },
                        cost: new Decimal(100),
                        unlocked(){
                                return true
                        }, 
                }, // hasUpgrade("c", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ca-ybara"
                        },
                        description(){
                                let a = "The number of upgrades multiplies B bulk amount and exponentiates A bulk amount and remove B 13 linear cost base"
                                return a
                        },
                        cost: new Decimal(3e7),
                        unlocked(){
                                return hasUpgrade("c", 11) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C--ybara"
                        },
                        description(){
                                let a = "Remove B 22 base cost and gain 100% of your Capybara's per reset per second but you can no longer prestige"
                                return a
                        },
                        cost: new Decimal(3e9),
                        unlocked(){
                                return hasUpgrade("c", 12) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Cap-bara"
                        },
                        description(){
                                let a = "Remove B 23 base cost and A 22 gives free A 21 levels"
                                return a
                        },
                        cost: new Decimal(3e12),
                        unlocked(){
                                return hasUpgrade("c", 13) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-p-bara"
                        },
                        description(){
                                let a = "Remove B 31 base cost and B 2X linear cost bases and B 11 gives free A 33 levels"
                                return a
                        },
                        cost: new Decimal(3e14),
                        unlocked(){
                                return hasUpgrade("c", 14) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ca--bara"
                        },
                        description(){
                                let a = "C 12 gives free B 32 levels"
                                return a
                        },
                        cost: new Decimal(3e30),
                        unlocked(){
                                return hasUpgrade("c", 15) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C---bara"
                        },
                        description(){
                                let a = "Remove B 31 linear cost base"
                                return a
                        },
                        cost: new Decimal(3e60),
                        unlocked(){
                                return hasUpgrade("c", 21) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Capy-ara"
                        },
                        description(){
                                let a = "Remove C 11 base cost"
                                return a
                        },
                        cost: new Decimal("3e1651"),
                        unlocked(){
                                return hasUpgrade("c", 22) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 23)
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-py-ara"
                        },
                        description(){
                                let a = "Each C 31 divides C 21 and C 22 base cost by 10 (min 1)"
                                return a
                        },
                        cost: new Decimal("3e4461"),
                        unlocked(){
                                return hasUpgrade("c", 23) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 24)
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ca-y-ara"
                        },
                        description(){
                                let a = "C 21 gives free C 12 levels"
                                return a
                        },
                        cost: new Decimal("3e5765"),
                        unlocked(){
                                return hasUpgrade("c", 24) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 25)
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C--y-ara"
                        },
                        description(){
                                let a = "log10(Ducks) multiplies the Capybara effect exponent"
                                return a
                        },
                        cost: new Decimal("3e37619"),
                        unlocked(){
                                return hasUpgrade("d", 13) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 31)
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Cap--ara"
                        },
                        description(){
                                let a = "Per Duck upgrade Duck upgrades multiply Duck gain and C 31 gives free C 22 levels"
                                return a
                        },
                        cost: new Decimal("3e39714"),
                        unlocked(){
                                return hasUpgrade("c", 31) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 32)
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-p--ara"
                        },
                        description(){
                                let a = "Upgrades - 11 multiplies base Duck gain and C 23 gives free C 13 levels"
                                return a
                        },
                        cost: new Decimal("3e94525"),
                        unlocked(){
                                return hasUpgrade("c", 32) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 33)
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ca---ara"
                        },
                        description(){
                                let a = "D 11 gives free C 33 levels and square Beaver buyable bulk amount"
                                return a
                        },
                        cost: new Decimal("3e538070"),
                        unlocked(){
                                return hasUpgrade("c", 33) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 34)
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C----ara"
                        },
                        description(){
                                let a = "Bulk 5x Duck buyables"
                                return a
                        },
                        cost: new Decimal("e73.9e6"),
                        unlocked(){
                                return hasUpgrade("c", 34) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 35)
        },
        buyables: getLayerGeneralizedBuyableData("c", [
                        function(){
                                return hasMilestone("c", 6) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(6) || hasMilestone("c", 7) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(125) || player.d.unlocked
                        },
                        function(){
                                return hasMilestone("c", 9) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(2030) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(2550) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(2800) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(3300) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(3620) || player.d.unlocked
                        },
                ]),
        milestones: {
                1: {
                        requirementDescription(){
                                return "1 Capybara reset"
                        },
                        done(){
                                return player.c.times >= 1
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.d.unlocked) return "Reward: A 22 gives free A 12 levels and autobuy " + makeRed("each") + " Beaver buyable once per second."
                                return "Reward: A 22 gives free A 12 levels and autobuy a Beaver buyable once per second."
                        },
                }, // hasMilestone("c", 1)
                2: {
                        requirementDescription(){
                                return "3 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(3)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove B 21 base cost and keep a milestone per reset."
                        },
                }, // hasMilestone("c", 2)
                3: {
                        requirementDescription(){
                                return "40 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(40)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Keep an upgrade per reset and you can buy all Beaver buyables at once."
                        },
                }, // hasMilestone("c", 3)
                4: {
                        requirementDescription(){
                                return "3,000 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(3000)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Keep a reset per reset, resets multiply Beaver autobuy times per second, and B 32 gives free levels to B 22."
                        },
                }, // hasMilestone("c", 4)
                5: {
                        requirementDescription(){
                                return "1,000,000 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(1e6)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 32 gives free B 23 levels and you can bulk 2x Beaver buyables."
                        },
                }, // hasMilestone("c", 5)
                6: {
                        requirementDescription(){
                                return "1e17 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(1e17)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Unlock Capybara buyables, remove B 32 base cost, and per milestone add 1 to the B 13 base."
                        },
                }, // hasMilestone("c", 6)
                7: {
                        requirementDescription(){
                                return "1e29 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(1e29)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove B 33 base cost."
                        },
                }, // hasMilestone("c", 7)
                8: {
                        requirementDescription(){
                                return "1e53 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(1e53)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 13 gives free C 12 and B 33 levels and remove B 32 linear cost base."
                        },
                }, // hasMilestone("c", 8)
                9: {
                        requirementDescription(){
                                return "1e1102 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e1102")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove B 33 linear cost base and C 12 cost base and unlock a new Capybara buyable."
                        },
                }, // hasMilestone("c", 9)
                10: {
                        requirementDescription(){
                                return "1e2660 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e2660")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 12 gives free B 11 levels and each milestone adds .01 to the C 22 base."
                        },
                }, // hasMilestone("c", 10)
                11: {
                        requirementDescription(){
                                return "1e2906 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e2906")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 21 gives free B 13 levels and Bea--r affects C 12."
                        },
                }, // hasMilestone("c", 11)
                12: {
                        requirementDescription(){
                                return "3e3213 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("3e3213")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 23 gives free C 22 levels."
                        },
                }, // hasMilestone("c", 12)
                13: {
                        requirementDescription(){
                                return "1e3943 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e3943")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each B 33 subtracts 1 from the C 23 cost base (until 25,000)."
                        },
                }, // hasMilestone("c", 13)
                14: {
                        requirementDescription(){
                                return "1e4210 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e4210")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each C 22 subtracts .0001 from the C 11 linear cost base until 1."
                        },
                }, // hasMilestone("c", 14)
                15: {
                        requirementDescription(){
                                return "1e4682 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e4682")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 31 gives free B 23 levels."
                        },
                }, // hasMilestone("c", 15)
                16: {
                        requirementDescription(){
                                return "1e4943 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e4943")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C-py-ara affects C 23."
                        },
                }, // hasMilestone("c", 16)
                17: {
                        requirementDescription(){
                                return "1e5325 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e5325")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Square B 11 base."
                        },
                }, // hasMilestone("c", 17)
                18: {
                        requirementDescription(){
                                return "1e6202 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e6202")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: You can bulk 2x more Alligator and Beaver buyables."
                        },
                }, // hasMilestone("c", 18)
                19: {
                        requirementDescription(){
                                return "1e6531 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e6531")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 12 base is raised to the C 33 levels and subtract 1 from the C 32 linear cost base per B 33 (min 100,000)."
                        },
                }, // hasMilestone("c", 19)
                20: {
                        requirementDescription(){
                                return "1e7761 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e7761")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Unlock another challenge, B 23 gives free B 13 levels, and B 32 gives free B 21 levels."
                        },
                }, // hasMilestone("c", 20)
                21: {
                        requirementDescription(){
                                return "1e8443 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e8443")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 33's after 33 divide C 23's linear cost base by 2.5 (until 1) and each 4th gives you 10x Capybaras."
                        },
                }, // hasMilestone("c", 21)
                22: {
                        requirementDescription(){
                                return "1e9214 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e9214")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Add .015 to the C 33 base per successive milestone."
                        },
                }, // hasMilestone("c", 22)
                23: {
                        requirementDescription(){
                                return "1e9418 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e9418")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 23 gives free B 12 levels."
                        },
                }, // hasMilestone("c", 23)
                24: {
                        requirementDescription(){
                                return "1e9488 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e9488")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each C 32 divides C 31's base cost by 10."
                        },
                }, // hasMilestone("c", 24)
                25: {
                        requirementDescription(){
                                return "1e9658 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e9658")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each C 33 divides C 32's base cost by 10."
                        },
                }, // hasMilestone("c", 25)
                26: {
                        requirementDescription(){
                                return "1e10,050 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e10050")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 22 gives free B 11 levels, each C 33 after 54 to the .8 divides C 31's linear cost base by 40 (min 1), and each C 33 after 58 gives you 10x Capybaras."
                        },
                }, // hasMilestone("c", 26)
                27: {
                        requirementDescription(){
                                return "1e10,933 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e10933")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Raise Capybara effect to the tenth power and each C 33 after 65 divides C 22's linear cost base by 1.4 (min 1)."
                        },
                }, // hasMilestone("c", 27)
                28: {
                        requirementDescription(){
                                return "1e11,116 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e11116")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Raise B 11 base to sqrt(C 33) (exponent becomes .76 at 69 C 33s)."
                        },
                }, // hasMilestone("c", 28)
                29: {
                        requirementDescription(){
                                return "1e11,363 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e11363")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Multiply Capybara effect exponent by 2.5, each C 33 after 74 adds .0008 to the C 31 base, and each C 33 after 72 to the .8 subtracts 6 from the C 13 linear cost base (min 15)."
                        },
                }, // hasMilestone("c", 29)
                30: {
                        requirementDescription(){
                                return "1e12,896 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e12896")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: log40(C 33s)<sup>min(3, C 33 - 94)</sup> multiplies Capybara effect exponent."
                        },
                }, // hasMilestone("c", 30)
                31: {
                        requirementDescription(){
                                return "1e14,001 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e14001")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each C 33 after 100 divides its linear cost base by 2.041 (min 1e58)."
                        },
                }, // hasMilestone("c", 31)
        },
        challenges: {
                11: {
                        name: "Challenge?",
                        goal(){
                                let id = player.c.challenges[11]
                                let x = [
                                        4.428e9, 5.305e9, 5.777e9, 6.269e9, 6.7821e9, 
                                        3.586e10, 3.878e10, 4.028e10, 4.181e10, 4.337e10, 
                                        7.432e11, 7.702e11, 7.975e11, 8.533e11, 8.963e11]
                                return Decimal.pow(10, x[id])
                        },
                        canComplete: () => player.b.points.gte(tmp.c.challenges[11].goal),
                        fullDisplay(){
                                let a = "Nullify Capybara and B 23 effects" + br 
                                a += "Goal: " + format(tmp.c.challenges[11].goal, 4) + " Beavers" + br2
                                a += "Reward: Add " + format(tmp.c.challenges[11].rewardEffect) + br
                                a += "to the C 11, C 22, and C 33 bases."
                                return a + br2 + "Completions: " + player.c.challenges[11] + "/15"
                        },
                        rewardEffect(){
                                return new Decimal(player.c.challenges[11] / 100)
                        },
                        unlocked(){
                                return hasUpgrade("b", 45) || player.d.unlocked
                        },
                        countsAs: [],
                        completionLimit: 15,
                }, // inChallenge("c", 11)
                12: {
                        name: "Challenge!",
                        goal(){
                                let id = player.c.challenges[12]
                                return Decimal.pow(10, [3.15e12, 5.99e12, 6.095e12, 6.421e12, 6.615e12][id])
                        },
                        canComplete: () => player.b.points.gte(tmp.c.challenges[12].goal),
                        fullDisplay(){
                                if (player.shiftAlias) return "Formula: (x-1)<sup>1.4</sup>"
                                let a = "Nullify B 12 effect" + br 
                                a += "Goal: " + format(tmp.c.challenges[12].goal, 4) + " Beavers" + br2
                                a += "Reward: C 22 gives free C 12 levels, gain 10x Capybara's permanently, "
                                a += "and per Capybara buyable subtract " + formatWhole(tmp.c.challenges[12].rewardEffect) + br
                                a += "from C 22 linear cost base."
                                return a + br2 + "Completions: " + player.c.challenges[12] + "/5"
                        },
                        rewardEffect(){
                                return new Decimal(player.c.challenges[12]).sub(1).max(0).pow(1.4)
                        },
                        unlocked(){
                                return hasMilestone("c", 20) || player.d.unlocked
                        },
                        countsAs: [],
                        completionLimit: 5,
                }, // inChallenge("c", 12)
                21: {
                        name: "Challenge!?",
                        goal(){
                                let id = player.c.challenges[21]
                                return Decimal.pow(10, [6.7e13, 7.85e13, 1.53e14, 2e14, 2.73e14, 5.46e16, 6.36e16, 1.26e17, 1.462e17, 7.45e17][id])
                        },
                        canComplete: () => player.b.points.gte(tmp.c.challenges[21].goal),
                        fullDisplay(){
                                let a = "Base beaver gain multipliers are disabled" + br 
                                a += "Goal: " + format(tmp.c.challenges[21].goal, 4) + " Beavers" + br2
                                a += "Reward: C 32 gives free C 31/23/22 levels completions after 3 add 1 to the C 33 base"
                                return a + br2 + "Completions: " + player.c.challenges[21] + "/10"
                        },
                        unlocked(){
                                return hasUpgrade("d", 12)
                        },
                        countsAs: [],
                        completionLimit: 10,
                }, // inChallenge("c", 21)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return isPassiveGainActive("c") ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                return shiftDown ? "Your best Capybaras is " + format(player.c.best) : "You have done " + formatWhole(player.c.times) + " Capybara resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("c")) {
                                                        if (player.shiftAlias) return "Capybara gain formula is " + getGeneralizedPrestigeButtonText("c")
                                                        return "You are gaining " + format(tmp.c.getResetGain) + " Capybaras per second"
                                                }
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.c.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("c")) return "You are gaining " + format(tmp.c.getResetGain) + " Capybara per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasMilestone("c", 6) || player.d.unlocked
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.c.times) + " Capybara resets"
                                        }
                                ],
                                "milestones"
                        ],
                        unlocked(){
                                return player.c.times > 0 || player.d.unlocked
                        },
                },
                "Challenges": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.c.times) + " Capybara resets"
                                        }
                                ],
                                "challenges"
                        ],
                        unlocked(){
                                return hasUpgrade("b", 45) || player.d.unlocked
                        },
                },
                "Info": {
                        content: [
                                ["display-text", "Unlocking a layer makes layers...<br>" + makeRed("2") + " above it get passive generation and autobuying."],
                                ["display-text", makeRed("3") + " above it keep all milestones and makes the autobuyer buy all buyables at once."],
                                ["display-text", makeRed("4") + " above it keep all upgrades."],
                                ["display-text", function(){return player.d.unlocked ? makeRed("5") + " above it keep all challenges." : ""}],
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        onPrestige(gain){
                player.c.times += player.d.best.gt(0) ? 3 : 1
        },
        doReset(layer){
                let data = player.c
                if (layer == "c") data.time = 0
                if (!getsReset("c", layer)) return
                
                data.times = Math.min(hasMilestone("d", 2) ? player.d.times : 0, data.times)

                if (!false/*player.g.unlocked*/) { //upgrades
                        let keptUpgrades = 0
                        if (hasMilestone("d", 5)) keptUpgrades += player.d.times
                        if (!false) {
                                data.upgrades = data.upgrades.slice(0, keptUpgrades)
                        }
                }

                if (!false/*player.f.unlocked*/) { //milestones
                        let keptMilestones = 0
                        if (hasMilestone("d", 3)) keptMilestones += player.d.times
                        if (!false) {
                                data.milestones = data.milestones.slice(0, keptMilestones)
                        }
                }

                //resources
                data.points = decimalZero
                data.total = decimalZero
                data.best = decimalZero

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = decimalZero
                }

                //challenges
                let resetChallenges = [11, 12]
                for (let j = 0; j < resetChallenges.length; j++) {
                        if (hasMilestone("d", 4)) break
                        data.challenges[resetChallenges[j]] = 0
                }
        },
})



addLayer("d", {
        name: "Ducks", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        row: 3, // Row the layer is in on the tree (0 is the first row)
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                everU15: false,
        }},
        color: "#6B46B9",
        branches: ["c"],
        requires: new Decimal("1e15020"), // Can be a function that takes requirement increases into account
        resource: "Ducks", // Name of prestige currency
        baseResource: "Capybaras", // Name of resource prestige is based on
        baseAmount() {return player.c.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return getGeneralizedPrestigeGain("d")
        },
        getBaseDiv(){
                let ret = new Decimal("1e14020")
                
                return ret
        },
        getGainExp(){
                let ret = new Decimal(5)

                if (hasUpgrade("d", 11)) ret = ret.plus(player.d.upgrades.length)

                return ret
        },
        getGainMultPre(){
                let ret = new Decimal(.001)

                if (hasUpgrade("c", 33))        ret = ret.times(Math.max(player.c.upgrades.length - 11, 1))

                return ret
        },
        getGainMultPost(){
                let ret = getGeneralizedInitialPostMult("d")

                if (hasUpgrade("c", 32))        ret = ret.times(Decimal.pow(player.d.upgrades.length, player.d.upgrades.length))
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["d11"])

                return ret
        },
        effect(){
                if (!isPrestigeEffectActive("d")) return decimalOne

                let amt = player.d.points

                let exp = amt.plus(999).log10().min(100)

                let ret = amt.plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("d")
        },
        getNextAt(){
                return getGeneralizedNextAt("d")
        },
        update(diff){
                let data = player.d

                if (tmp.d.getResetGain.gt(0)) data.unlocked = true

                data.best = data.best.max(data.points)
                doPassiveGain("d", diff)
                
                if (hasMilestone("d", 11)) {
                        handleGeneralizedBuyableAutobuy(diff, "d")
                } else {
                        data.abtime = 0
                }
                data.time += diff

                if (hasUpgrade("d", 15)) data.everU15 = true
        },
        layerShown(){return player.c.best.gte("1e15000") || player.d.unlocked},
        prestigeButtonText(){
                if (isPassiveGainActive("d")) return ""
                return getGeneralizedPrestigeButtonText("d")
        },
        canReset(){
                return player.d.time >= 2 && !isPassiveGainActive("d") && tmp.d.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D-cks"
                        },
                        description(){
                                let a = "C 13 linear cost base is .1 less per C 33 past 150 and each upgrade adds 1 to the gain exponent"
                                return a
                        },
                        cost: new Decimal(1e4),
                        unlocked(){
                                return true //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Du-ks"
                        },
                        description(){
                                let a = "Remove the ability to prestige for Ducks but gain 100% of your ducks on reset and a reset per second"
                                return a
                        },
                        cost: new Decimal(1e5),
                        unlocked(){
                                return player.d.times >= 70 //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D--ks"
                        },
                        description(){
                                let a = "C 32's boost to C 21's cap is now .27 and each OoM of Ducks after 1e10 divides C 33's linear cost base by 10"
                                return a
                        },
                        cost: new Decimal(1e10),
                        unlocked(){
                                return hasUpgrade("d", 12) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Duc-s"
                        },
                        description(){
                                let a = "C 31 gives free C 23 levels and triple Beaver bulk amount"
                                return a
                        },
                        cost: new Decimal(5e15),
                        unlocked(){
                                return hasUpgrade("d", 13) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D-c-s"
                        },
                        description(){
                                let a = "Permanently remove C 32's base cost and double base Capybara gain"
                                return a
                        },
                        cost: new Decimal(1e20),
                        unlocked(){
                                return hasUpgrade("d", 14) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Du--s"
                        },
                        description(){
                                let a = "Duck buyables are free"
                                return a
                        },
                        cost: new Decimal(1e41),
                        unlocked(){
                                return hasUpgrade("d", 15) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D---s"
                        },
                        description(){
                                let a = "C 23 gives free C 21 levels"
                                return a
                        },
                        cost: new Decimal(1e66),
                        unlocked(){
                                return hasUpgrade("d", 21) //|| player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 22)
        },
        buyables: getLayerGeneralizedBuyableData("d", [
                        function(){
                                return hasMilestone("d", 8) //|| player.e.unlocked
                        },
                        function(){
                                return player.d.buyables[11].gte(500) //|| player.e.unlocked
                        },
                        function(){
                                return player.d.buyables[11].gte(1100) //|| player.e.unlocked
                        },
                ]),
        milestones: {
                1: {
                        requirementDescription(){
                                return "1 Duck reset"
                        },
                        done(){
                                return player.d.times >= 1
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Autobuy Capybara buyables, each Capybara autobuy tick buys each buyable once, square Alligator gain, and subtract .01 from the C 11 base cost."
                        },
                }, // hasMilestone("d", 1)
                2: {
                        requirementDescription(){
                                return "2 Duck resets"
                        },
                        done(){
                                return player.d.times >= 2
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Bulk 2x Beaver and Capybara buyables, per reset keep a Capybara reset, and C 32's effect past .05 adds to C 22's base."
                        },
                }, // hasMilestone("d", 2)
                3: {
                        requirementDescription(){
                                return "3 Duck resets"
                        },
                        done(){
                                return player.d.times >= 3
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep a milestone, resets multiplies the Capybara autobuyer speed, and add .0001 to the C 13 base."
                        },
                }, // hasMilestone("d", 3)
                4: {
                        requirementDescription(){
                                return "4 Duck resets"
                        },
                        done(){
                                return player.d.times >= 4
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Keep challenges and per reset<sup>1.5</sup> divide C 32 linear cost base by 1.02 (min 1)."
                        },
                }, // hasMilestone("d", 4)
                5: {
                        requirementDescription(){
                                return "100 Ducks"
                        },
                        done(){
                                return player.d.points.gte(100)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep a upgrade, triple Capybara bulk amount, and per milestone divide C 33 linear cost base by 10."
                        },
                }, // hasMilestone("d", 5)
                6: {
                        requirementDescription(){
                                return "1000 Ducks"
                        },
                        done(){
                                return player.d.points.gte(1000)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Square Capybara bulk amount and add .0001 to the C 13 base."
                        },
                }, // hasMilestone("d", 6)
                7: {
                        requirementDescription(){
                                return "200,000 Ducks times Duck resets (+1)"
                        },
                        done(){
                                return player.d.points.times(player.d.times + 1).gte(2e5)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Ducks<sup>Duck resets</sup> divides C 33 cost base."
                        },
                }, // hasMilestone("d", 7)
                8: {
                        requirementDescription(){
                                return "1e30 Ducks"
                        },
                        done(){
                                return player.d.points.gte(1e30)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 31 gives free C 21 levels and unlock a Duck buyable."
                        },
                }, // hasMilestone("d", 8)
                9: {
                        requirementDescription(){
                                return "1e115 Ducks"
                        },
                        done(){
                                return player.d.points.gte(1e115)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 22 gives free C 21 levels."
                        },
                }, // hasMilestone("d", 9)
                10: {
                        requirementDescription(){
                                return "1e168 Ducks"
                        },
                        done(){
                                return player.d.points.gte(1e168)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 33 base is raised to the number of milestones and if you have 1,000 D 11 C 11 gets free levels from C 12."
                        },
                }, // hasMilestone("d", 10)
                11: {
                        requirementDescription(){
                                return "1e196 Ducks"
                        },
                        done(){
                                return player.d.points.gte(1e196)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Autobuy a Duck buyable per second and each D 13 divides D 11 and D 12 cost base by 1.03 ."
                        },
                }, // hasMilestone("d", 11)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return isPassiveGainActive("d") ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                return shiftDown ? "Your best Ducks is " + format(player.d.best) : "You have done " + formatWhole(player.d.times) + " Duck resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("d")) {
                                                        if (player.shiftAlias) return "Duck gain formula is " + getGeneralizedPrestigeButtonText("d")
                                                        return "You are gaining " + format(tmp.d.getResetGain) + " Ducks per second"
                                                }
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.d.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("d")) return "You are gaining " + format(tmp.d.getResetGain) + " Ducks per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasMilestone("d", 8) //|| player.e.unlocked
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.d.times) + " Ducks resets"
                                        }
                                ],
                                "milestones"
                        ],
                        unlocked(){
                                return player.d.times > 0 //|| player.e.unlocked
                        },
                },
        },
        onPrestige(gain){
                player.d.times += /*player.e.best.gt(0)*/ false ? 3 : 1
        },
        doReset(layer){
                let data = player.d
                if (layer == "d") data.time = 0
                if (!getsReset("d", layer)) return
                
                data.times = 0

                if (!false/*player.h.unlocked*/) { //upgrades
                        let keptUpgrades = 0
                        if (false) keptUpgrades += 0
                        if (!false) {
                                data.upgrades = data.upgrades.slice(0, keptUpgrades)
                        }
                }

                if (!false/*player.g.unlocked*/) { //milestones
                        let keptMilestones = 0
                        if (false) keptMilestones += 0
                        if (!false) {
                                data.milestones = data.milestones.slice(0, keptMilestones)
                        }
                }

                //resources
                data.points = decimalZero
                data.total = decimalZero
                data.best = decimalZero

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = decimalZero
                }
        },
})

addLayer("ach", {
        name: "Achievements",
        symbol: "⭑", 
        position: 1,
        startData(){ return {
                unlocked: true,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                hiddenRows: 0,
                clickedYeet: 0,
                completedRows: 0,
        }},
        color: "#FFC746",
        branches: [],
        requires: decimalZero,
        resource: "Achievements",
        baseResource: "points",
        baseAmount(){return decimalZero},
        type: "none",
        update(diff){
                let data = player.ach
                data.points = new Decimal(data.achievements.length).max(data.points)
                data.best = data.best.max(data.points)
                if (hasCompletedFirstNRows(player.ach.completedRows + 1)){
                        player.ach.completedRows ++
                }
        },
        row: "side",
        hotkeys: [
                {
                        key: "THIS SHOULD NOT BE POSSIBLE",
                        description: makeBlue("<b>Generally applicable</b>:"),
                        onPress(){
                                console.log("oops something went really badly wrong")
                        },
                },
                {key: "Control+C", description: "Control+C: Go to changelog", onPress(){
                                showTab("changelog-tab")
                        }
                },
                {key: ",", description: ",: Move one tab to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getNextLeftTab(l)
                        }
                },
                {key: ".", description: ".: Move one tab to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getNextRightTab(l)
                        }
                },
                {key: "ArrowLeft", description: "Left Arrow: Move one tab to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                if (!player.arrowHotkeys) return
                                player.subtabs[l].mainTabs = getNextLeftTab(l)
                        }
                },
                {key: "ArrowRight", description: "Right Arrow: Move one tab to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                if (!player.arrowHotkeys) return
                                player.subtabs[l].mainTabs = getNextRightTab(l)
                        }
                },
                {key: "shift+<", description: "Shift+,: Move all the way to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                k = getUnlockedSubtabs(l)
                                player.subtabs[l].mainTabs = k[0]
                        }
                },
                {key: "shift+>", description: "Shift+.: Move all the way to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                k = getUnlockedSubtabs(l)
                                player.subtabs[l].mainTabs = k[k.length-1]
                        }
                },
                {key: "Control+S", description: "Control+S: Save", 
                        onPress(){
                                save()
                        }
                },
                {key: "shift+Control+S", description: "Shift+Control+S: Save", 
                        onPress(){
                                save()
                        }
                },
                {key: "shift+Control+E", description: "Shift+Control+E: Force endgame",
                        onPress(){ // forces the endgame screen to pop up 
                                forceEndgame = true
                                player.keepGoing = false
                        }
                },
                {key: " ", description: "Space: Toggle Pause", 
                        onPress(){
                                if (player.spaceBarPauses) player.paused = !player.paused
                        }
                },
                {
                        key: "THIS SHOULD NOT BE POSSIBLE2",
                        description: br + makeBlue("<b>Jump to locations</b>:"),
                        onPress(){
                                console.log("oops something went really badly wrong")
                        },
                },
                {key: "shift+!", description: "Shift+1: Go to achievements", 
                        onPress(){
                                player.tab = "ach"
                        }
                },
                {key: "shift+A", description: "Shift+A: Go to Alligator", 
                        onPress(){
                                if (player.a.unlocked) player.tab = "a"
                        }
                },
                {key: "shift+B", description: "Shift+B: Go to Beaver", 
                        onPress(){
                                if (player.b.unlocked) player.tab = "b"
                        },
                        unlocked(){
                                return player.b.unlocked
                        }
                },
                {key: "shift+C", description: "Shift+C: Go to Capybara", 
                        onPress(){
                                if (player.c.unlocked) player.tab = "c"
                        },
                        unlocked(){
                                return player.c.unlocked
                        }
                },
                {key: "shift+D", description: "Shift+D: Go to Duck", 
                        onPress(){
                                if (player.d.unlocked) player.tab = "d"
                        },
                        unlocked(){
                                return player.d.unlocked
                        }
                },
                {
                        key: "THIS SHOULD NOT BE POSSIBLE3",
                        description: br + makeBlue("<b>Prestige</b>:"),
                        onPress(){
                                console.log("oops something went really badly wrong")
                        },
                        unlocked(){
                                return true
                        },
                },
                {key: "a", description: "A: Go to Alligators",
                        onPress(){
                                if (canReset("a")) doReset("a")
                        }
                },
                {key: "b", description: "B: Reset for Beavers",
                        onPress(){
                                if (canReset("b")) doReset("b")
                        },
                        unlocked(){
                                return player.b.unlocked
                        }
                },
                {key: "c", description: "C: Reset for Capybaras",
                        onPress(){
                                if (canReset("c")) doReset("c")
                        },
                        unlocked(){
                                return player.c.unlocked
                        }
                },
                {key: "d", description: "D: Reset for Ducks",
                        onPress(){
                                if (canReset("d")) doReset("d")
                        },
                        unlocked(){
                                return player.d.unlocked
                        }
                },
                {
                        key: "THIS SHOULD NOT BE POSSIBLE4",
                        description: br + makeBlue("<b>Other</b>:"),
                        onPress(){
                                console.log("oops something went really badly wrong")
                        },
                        unlocked(){
                                return true
                        },
                },
        ],
        layerShown(){return true},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        achievements: getFirstNAchData(Object.keys(PROGRESSION_MILESTONES).length),
        clickables: {
                rows: 1,
                cols: 3,
                11: {
                        title(){
                                return "<h3 style='color: #0033FF'>Hide the top row</h3>"
                        },
                        display(){
                                return "Shift: Hides top layers until an unfinished layer"
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                if (player.shiftAlias) return true
                                return player.ach.hiddenRows < Object.keys(PROGRESSION_MILESTONES).length/7
                        },
                        onClick(){
                                if (!this.canClick()) return
                                if (!player.shiftAlias) {
                                        player.ach.hiddenRows ++
                                        return
                                }
                                player.ach.hiddenRows = 0
                                let b = 0
                                while (hasCompletedFirstNRows(player.ach.hiddenRows + 1)) {
                                        b ++ 
                                        player.ach.hiddenRows ++
                                        if (b > 1000) {
                                                console.log('uh oh')
                                                return
                                        }
                                }
                        },
                },
                12: {
                        title(){
                                return "<h3 style='color: #0033FF'>Show a row</h3>"
                        },
                        display(){
                                return "Shift: Show all rows"
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return player.ach.hiddenRows > 0
                        },
                        onClick(){
                                if (!this.canClick()) return
                                if (player.shiftAlias) player.ach.hiddenRows = 0
                                else player.ach.hiddenRows --
                        },
                },
                13: {
                        title(){
                                return "<h3 style='color: #0033FF'>Click</h3>"
                        },
                        display(){
                                return formatWhole(player.ach.clickedYeet) + (player.ach.clickedYeet == 69 ? " nice" : "")
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.ach.clickedYeet ++ 
                        },
                },
        },
        tabFormat: {
                "Achievements": {
                        content: [
                                "main-display-goals",
                                "clickables",
                                ["display-text",function(){
                                        return "You have completed the first " + formatWhole(player.ach.completedRows) + " rows"
                                }],
                                "achievements",
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){},
})

