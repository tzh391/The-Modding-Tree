/*
key = [buyable layer][buyable id] i.e. a11 or b23
data = [another key]: function
*/

var MAIN_BUYABLE_DATA = {
        a11: {
                name: "A 11",
                func: "exp",
                effects: "points",
                base: {
                        initial: new Decimal(1.5),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["a13"]
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b21"]
                                },
                        },
                        3: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b32"]
                                },
                        },
                        4: {
                                active(){
                                        return hasUpgrade("a", 44)
                                },
                                type: "mult",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b31"]
                                },
                        }
                },
                bases(){
                        let b0 = new Decimal(30)
                        let b1 = new Decimal(1.1)
                        let b2 = new Decimal(1.001)
                        if (hasUpgrade("a", 21)) b0 = decimalOne
                        if (hasUpgrade("a", 22)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                a12: {active:() => hasUpgrade("b", 43)},
                a13: {active:() => hasMilestone("b", 1)},
                a22: {active:() => hasUpgrade("b", 13)},
        },
        a12: {
                name: "A 12",
                func: "exp",
                effects: "Alligators",
                base: {
                        initial: new Decimal(1.3),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["a21"]
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b21"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(200)
                        let b1 = new Decimal(1.3)
                        let b2 = new Decimal(1.003)
                        if (hasUpgrade("a", 21)) b0 = decimalOne
                        if (hasUpgrade("b", 11)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                a21: {active:() => hasUpgrade("b", 21)},
                a22: {active:() => hasMilestone("c", 1)},
                a31: {active:() => hasMilestone("b", 6)},
                a32: {active:() => hasMilestone("b", 4)},
        },
        a13: {
                name: "A 13",
                func: "lin",
                effects: "A 11 base",
                base: {
                        initial: new Decimal(.03),
                        1: {
                                active(){
                                        return hasUpgrade("a", 15)
                                },
                                type: "add",
                                amount(){
                                        return new Decimal(.005)
                                },
                        },
                        2: {
                                active(){
                                        return hasUpgrade("a", 25)
                                },
                                type: "add",
                                amount(){
                                        return new Decimal(.01).times(player.a.upgrades.length)
                                },
                        },
                        3: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b21"]
                                },
                        },
                        4: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c12"]
                                },
                        },
                        5: {
                                activation(){
                                        return hasUpgrade("a", 45)
                                },
                                type: "mult",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b31"]
                                },
                        }
                },
                bases(){
                        let b0 = new Decimal(300)
                        let b1 = new Decimal(1.5)
                        let b2 = new Decimal(1.01)
                        if (hasUpgrade("a", 21)) b0 = decimalOne
                        if (hasMilestone("a", 3)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                a21: {active:() => hasUpgrade("b", 21)},
                a22: {active:() => hasUpgrade("b", 13)},
                a32: {active:() => hasUpgrade("b", 15)},
        },
        a21: {
                name: "A 21",
                func: "lin",
                effects: "A 12 base",
                base: {
                        initial: new Decimal(.01),
                        1: {
                                active(){
                                        return hasMilestone("a", 1)
                                },
                                type: "add",
                                amount(){
                                        return new Decimal(.001 * player.a.milestones.length)
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b22"]
                                },
                        },
                        3: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b32"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(5e16)
                        let b1 = new Decimal(3)
                        let b2 = new Decimal(1.03)
                        if (hasUpgrade("a", 25)) b0 = decimalOne
                        if (hasUpgrade("a", 31)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                a22: {active:() => hasUpgrade("c", 14)},
                a31: {active:() => hasUpgrade("a", 41)},
                a32: {active:() => hasUpgrade("b", 15)},
        },
        a22: {
                name: "A 22",
                func: "lin",
                effects: "A-ligator effect exponent",
                base: {
                        initial: new Decimal(.3),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b22"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e34)
                        let b1 = new Decimal(2)
                        let b2 = new Decimal(1.05)
                        if (hasUpgrade("a", 23)) b0 = decimalOne
                        if (hasMilestone("a", 4)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                a23: {active:() => hasUpgrade("a", 31)},
                a31: {active:() => hasUpgrade("b", 14)},
                a32: {active:() => hasUpgrade("b", 12)},
        },
        a23: {
                name: "A 23",
                func: "lin",
                effects: "Alligator effect exponent",
                base: {
                        initial: new Decimal(.1),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b22"]
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c12"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e55)
                        let b1 = new Decimal(6)
                        let b2 = new Decimal(1.1)
                        if (hasUpgrade("a", 24)) b0 = decimalOne
                        if (hasMilestone("b", 2)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                a31: {active:() => hasMilestone("b", 3)},
                a32: {active:() => hasUpgrade("b", 41)},
        },
        a31: {
                name: "A 31",
                func: "lin",
                effects: "Alligator gain exponent",
                base: {
                        initial: new Decimal(.1),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b32"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e84)
                        let b1 = new Decimal(10)
                        let b2 = new Decimal(1.2)
                        if (hasUpgrade("a", 35)) b0 = decimalOne
                        if (hasMilestone("b", 6)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                a32: {active:() => hasMilestone("b", 5)},
        },
        a32: {
                name: "A 32",
                func: "linp1",
                effects: "pre-exp Alligator gain",
                base: {
                        initial: new Decimal(.2),
                        1: {
                                active(){
                                        return hasUpgrade("b", 14)
                                },
                                type: "add",
                                amount(){
                                        return new Decimal(player.b.upgrades.length).div(5)
                                }
                        },
                        2: {
                                active(){
                                        return hasMilestone("b", 7)
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b21"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e138)
                        let b1 = new Decimal(200)
                        let b2 = new Decimal(1.5)
                        if (hasUpgrade("a", 35)) b0 = decimalOne
                        if (hasMilestone("b", 6)) b1 = decimalOne
                        if (hasMilestone("b", 11)) b2 = new Decimal(1.3)
                        return [b0, b1, b2]
                },
                b12: {active:() => hasUpgrade("a", 34)},
        },
        a33: {
                name: "A 33",
                func: "exp",
                effects: "Alligators per upgrade",
                base: {
                        initial: new Decimal(1.2),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c12"]
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "mult",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b33"].pow(player.b.upgrades.length)
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e214)
                        let b1 = new Decimal(5e12)
                        let b2 = new Decimal(2)
                        if (hasUpgrade("a", 35)) b0 = decimalOne
                        if (hasMilestone("b", 6)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                b11: {active:() => hasUpgrade("c", 15)},
                b21: {active:() => hasUpgrade("b", 25)},
        },
        b11: {
                name: "B 11",
                func: "exp",
                effects: "Beavers",
                base: {
                        initial: new Decimal(1.4),
                        1: {
                                active() {
                                        return hasUpgrade("b", 24)
                                },
                                type: "add",
                                amount(){
                                        return player.b.buyables[12].sub(50).max(0).div(100)
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b22"]
                                },
                        },
                        3: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b32"]
                                },
                        },
                        4: {
                                active(){
                                        return hasMilestone("c", 17)
                                },
                                type: "pow",
                                amount(){
                                        return new Decimal(2)
                                },
                        },
                        5: {
                                active(){
                                        return hasMilestone("c", 28)
                                },
                                type: "pow",
                                amount(){
                                        return getBuyableAmount("c", 33).max(1).pow(getBuyableAmount("c", 33).gte(69) ? .76 : .5)
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e8)
                        let b1 = new Decimal(1.5)
                        let b2 = new Decimal(1.01)
                        if (hasUpgrade("a", 41)) b0 = decimalOne
                        if (hasMilestone("b", 11)) b1 = new Decimal(1.3)
                        if (hasMilestone("b", 13)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                b12: {active:() => hasMilestone("c", 10)},
                b13: {active:() => hasUpgrade("b", 22)},
                b21: {active:() => hasMilestone("b", 7)},
                b22: {active:() => hasMilestone("c", 26)},
        },
        b12: {
                name: "B 12",
                func: "exp",
                effects: "Alligators",
                base: {
                        initial: new Decimal(1e10),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c13"]
                                },
                        },
                        2: {
                                active(){
                                        return hasMilestone("c", 19)
                                },
                                type: "exp",
                                amount(){
                                        return getBuyableAmount("c", 33).max(1)
                                },
                        },
                        3: {
                                active(){
                                        return inChallenge("c", 12)
                                },
                                type: "exp",
                                amount(){
                                        return decimalZero
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(2e8)
                        let b1 = new Decimal(1)
                        let b2 = new Decimal(1.02)
                        if (hasMilestone("b", 9)) b0 = decimalOne
                        return [b0, b1, b2]
                },
                b13: {active:() => hasMilestone("b", 9)},
                b21: {active:() => hasMilestone("b", 7)},
                b22: {active:() => hasUpgrade("a", 42)},
                b23: {active:() => hasMilestone("c", 23)},
        },
        b13: {
                name: "B 13",
                func: "lin",
                effects: "Beaver effect exponent",
                base: {
                        initial: new Decimal(2),
                        1: {
                                active(){
                                        return hasMilestone("c", 6)
                                },
                                type: "add",
                                amount(){
                                        return player.c.milestones.length
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c12"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e17)
                        let b1 = new Decimal(3)
                        let b2 = new Decimal(1.03)
                        if (hasMilestone("b", 10)) b0 = decimalOne
                        if (hasUpgrade("c", 12)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                b21: {active:() => hasMilestone("c", 11)},
                b22: {active:() => hasUpgrade("b", 34)},
                b23: {active:() => hasMilestone("c", 20)},
                b31: {active:() => hasUpgrade("a", 44)},
        },
        b21: {
                name: "B 21",
                func: "lin",
                effects: "A 1X bases",
                base: {
                        initial: new Decimal(2),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b32"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e50)
                        let b1 = new Decimal(5)
                        let b2 = new Decimal(1.05)
                        if (hasMilestone("c", 2)) b0 = decimalOne
                        if (hasUpgrade("c", 15)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                b22: {active:() => hasUpgrade("a", 53)},
                b23: {active:() => hasUpgrade("a", 43)},
                b31: {active:() => hasUpgrade("a", 45)},
                b32: {active:() => hasMilestone("c", 20)},
        },
        b22: {
                name: "B 22",
                func: "lin",
                effects: "A 2X and B 11 bases",
                base: {
                        initial: new Decimal(.01),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c13"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e113)
                        let b1 = new Decimal(50)
                        let b2 = new Decimal(1.08)
                        if (hasUpgrade("c", 13)) b0 = decimalOne
                        if (hasUpgrade("c", 15)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                b23: {active:() => hasUpgrade("b", 35)},
                b31: {active:() => hasUpgrade("b", 31)},
                b32: {active:() => hasMilestone("c", 4)},
        },
        b23: {
                name: "B 23",
                func: "lin",
                effects: "Beaver gain exponent",
                base: {
                        initial: new Decimal(.2),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c12"]
                                },
                        },
                        2: {
                                active(){
                                        return inChallenge("c", 11)
                                },
                                type: "times",
                                amount(){
                                        return decimalZero
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e200)
                        let b1 = new Decimal(1e7)
                        let b2 = new Decimal(1.13)
                        if (hasUpgrade("c", 14)) b0 = decimalOne
                        if (hasUpgrade("c", 15)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                b31: {active:() => hasMilestone("c", 15)},
                b32: {active:() => hasMilestone("c", 5)},
        },
        b31: {
                name: "B 31",
                func: "exp",
                effects: "Beavers and base Alligators",
                base: {
                        initial: new Decimal(5),
                        1: {
                                active(){
                                        return hasUpgrade("a", 42)
                                },
                                type: "add",
                                amount(){
                                        return player.a.upgrades.filter(x => x > 40 && x < 50).length
                                }
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["b32"]
                                },
                        },
                        3: {
                                active(){
                                        return true
                                },
                                type: "times",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c31"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e256)
                        let b1 = new Decimal(1e10)
                        let b2 = new Decimal(1.21) // fibonacci
                        if (hasUpgrade("c", 15)) b0 = decimalOne
                        if (hasUpgrade("c", 22)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                b32: {active:() => hasMilestone("b", 12)},
        },
        b32: {
                name: "B 32",
                func: "lin",
                effects: "Prior left column bases",
                base: {
                        initial: new Decimal(.01),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c13"]
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "times",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c31"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal("1e1107")
                        let b1 = new Decimal(1e23)
                        let b2 = new Decimal(1.34) // fibonacci
                        if (hasMilestone("c", 6)) b0 = decimalOne
                        if (hasMilestone("c", 8)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                c12: {active:() => hasUpgrade("c", 21)},
        },
        b33: {
                name: "B 33",
                func: "exp",
                effects: "Beaver gain and A 33 base per upgrade",
                base: {
                        initial: new Decimal(1.2),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c12"]
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "times",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c31"]
                                },
                        },
                        3: {
                                active(){
                                        return true
                                },
                                type: "times",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c33"].pow(player.c.upgrades.length)
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal("5e1371")
                        let b1 = new Decimal(1e161)
                        let b2 = new Decimal(1.55) // fibonacci
                        if (hasMilestone("c", 7)) b0 = decimalOne
                        if (hasMilestone("c", 9)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                c11: {active:() => hasUpgrade("b", 33)},
                c13: {active:() => hasMilestone("c", 8)},
        },
        c11: {
                name: "C 11",
                func: "exp",
                effects: "Capybara gain",
                base: {
                        initial: new Decimal(1.2),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c13"]
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return tmp.c.challenges[11].rewardEffect
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e17)
                        let b1 = new Decimal(1.3)
                        let b2 = new Decimal(1.001) // 2**x
                        if (hasUpgrade("c", 23)) b0 = decimalOne
                        if (hasMilestone("d", 1)) b1 = b1.sub(.01)
                        if (hasMilestone("c", 14)) {
                                b1 = b1.sub(getBuyableAmount("c", 22).div(1e4)).max(1)
                                if (hasUpgrade("b", 42) && !hasUpgrade("b", 45)) {
                                        b1 = b1.sub(getBuyableAmount("c", 32).sub(26).max(0).div(1e4)).max(1)
                                }
                        }
                        return [b0, b1, b2]
                },
        },
        c12: {
                name: "C 12",
                func: "lin",
                effects: "Previous Right Column bases",
                base: {
                        initial: new Decimal(.01),
                        1: {
                                active(){
                                        return hasUpgrade("b", 32) && hasMilestone("c", 11)
                                },
                                type: "add",
                                amount(){
                                        return player.b.upgrades.filter(x => x > 30).length / 1e4
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c32"]
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e18)
                        let b1 = new Decimal(1.5)
                        let b2 = new Decimal(1.002) // 2**x
                        if (hasMilestone("c", 9)) b0 = decimalOne
                        if (hasUpgrade("b", 32)) b1 = decimalOne
                        return [b0, b1, b2]
                },
                c13: {active:() => hasMilestone("c", 8)},
                c21: {active:() => hasUpgrade("c", 25)},
                c22: {active:() => hasChallenge("c", 12)},
        },
        c13: {
                name: "C 13",
                func: "lin",
                effects: "C 11 and B X2 bases",
                base: {
                        initial: new Decimal(.01),
                        1: {
                                active(){
                                        return hasUpgrade("b", 32)
                                },
                                type: "add",
                                amount(){
                                        return player.b.upgrades.filter(x => x > 30).length / 1e4
                                },
                        },
                        2: {
                                active(){
                                        return hasMilestone("d", 6)
                                },
                                type: "add",
                                amount(){
                                        return .0001
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal(1e39)
                        let b1 = new Decimal(100)
                        let b2 = new Decimal(1.004) // 2**x
                        if (hasUpgrade("a", 51)) b0 = decimalOne
                        if (hasMilestone("c", 29)) b1 = b1.sub(getBuyableAmount("c", 33).sub(72).max(0).pow(.8).times(6)).max(15)
                        if (hasUpgrade("d", 11)) b1 = b1.sub(getBuyableAmount("c", 33).sub(150).max(0).div(10)).max(1)
                        return [b0, b1, b2]
                },
                c22: {active:() => hasUpgrade("b", 52)},
                c23: {active:() => hasUpgrade("c", 33)},
        },
        c21: {
                name: "C 21",
                func: "lin",
                effects: "Capybara Gain exponent",
                base: {
                        initial: new Decimal(.13),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c32"].min(hasUpgrade("d", 13) ? .27 : .07)
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal("1e1108")
                        let b1 = new Decimal(1e4)
                        let b2 = new Decimal(1.008) // 2**x
                        if (hasUpgrade("a", 55)) {
                                b1 = b1.sub(getBuyableAmount("c", 12)).max(1)
                                if (hasUpgrade("b", 42) && !hasUpgrade("b", 45)) {
                                        b1 = b1.sub(getBuyableAmount("c", 32).sub(26).max(0)).max(1)
                                }
                        }
                        if (hasUpgrade("c", 24)) b0 = b0.div(getBuyableAmount("c", 31).pow10()).max(1)
                        return [b0, b1, b2]
                },
        },
        c22: {
                name: "C 22",
                func: "exp",
                effects: "Capybara and Base Beaver gain",
                base: {
                        initial: new Decimal(2),
                        1: {
                                active(){
                                        return hasMilestone("c", 10)
                                },
                                type: "add",
                                amount(){
                                        return player.c.milestones.length / 100
                                },
                        },
                        2: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return tmp.c.challenges[11].rewardEffect
                                },
                        },
                        3: {
                                active(){
                                        return hasMilestone("d", 2)
                                },
                                type: "add",
                                amount(){
                                        return CURRENT_BUYABLE_EFFECTS["c32"].sub(.05).max(0)
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal("1e2024")
                        let b1 = new Decimal(1e5)
                        let b2 = new Decimal(1.016) // 2**x
                        if (hasUpgrade("c", 24)) b0 = b0.div(getBuyableAmount("c", 31).pow10()).max(1)
                        
                        if (hasChallenge("c", 12)) {
                                function g(x) {return getBuyableAmount("c", x)}
                                let a = g(11).plus(g(12)).plus(g(13)).plus(g(21)).plus(g(22)).plus(g(23)).plus(g(31)).plus(g(32)).plus(g(33))
                                b1 = b1.sub(a.times(tmp.c.challenges[12].rewardEffect).floor()).max(900)
                        }
                        if (hasMilestone("c", 27)) b1 = b1.div(Decimal.pow(1.4, getBuyableAmount("c", 33).sub(65).max(0))).max(1)
                        return [b0, b1, b2]
                },
                c23: {active:() => hasMilestone("c", 12)},
                c31: {active:() => hasUpgrade("c", 32)},
                c32: {active:() => player.c.challenges[21] >= 3},
        },
        c23: {
                name: "C 23",
                func: "linp1",
                effects: "Capybara effect exponent",
                base: {
                        initial: new Decimal(500),
                        1: {
                                active(){
                                        return hasUpgrade("a", 54)
                                },
                                type: "add",
                                amount(){
                                        return getBuyableAmount("c", 23)
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal("1e3131")
                        let b1 = new Decimal(1e6)
                        let b2 = new Decimal(1.032) // 2**x
                        if (hasMilestone("c", 13)) b1 = b1.sub(getBuyableAmount("b", 33)).max(25e3)
                        if (hasMilestone("c", 21)) {
                                b1 = b1.div(Decimal.pow(2.5, getBuyableAmount("c", 33).sub(33).max(0))).max(1)
                        }
                        if (hasMilestone("c", 16)) if (hasUpgrade("c", 24)) b0 = b0.div(getBuyableAmount("c", 31).pow10()).max(1)
                        return [b0, b1, b2]
                },
                c31: {active:() => hasUpgrade("d", 14)},
                c32: {active:() => player.c.challenges[21] >= 2},
        },
        c31: {
                name: "C 31",
                func: "linp1",
                effects: "B 3X bases and base Capybara gain",
                base: {
                        initial: new Decimal(.05),
                        1: {
                                active(){
                                        return hasMilestone("c", 29)
                                },
                                type: "add",
                                amount(){
                                        return getBuyableAmount("c", 33).sub(74).max(0).times(.0008)
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal("1e3727")
                        let b1 = new Decimal(1e10)
                        let b2 = new Decimal(1.064) // 2**x
                        if (hasMilestone("c", 24)) b0 = b0.div(getBuyableAmount("c", 32).pow10()).max(1)
                        if (hasMilestone("c", 26)) b1 = b1.div(Decimal.pow(40, getBuyableAmount("c", 33).sub(54).max(0).pow(.8))).max(1)
                        return [b0, b1, b2]
                },
                c32: {active:() => player.c.challenges[21] >= 1},
        },
        c32: {
                name: "C 32",
                func: "lin",
                effects: "C 12 and C 21 [max .07] bases",
                base: {
                        initial: new Decimal(.0001),
                },
                bases(){
                        let b0 = new Decimal("1e5078")
                        let b1 = new Decimal(3e7)
                        let b2 = new Decimal(1.128) // 2**x
                        if (hasMilestone("c", 25)) b0 = b0.div(getBuyableAmount("c", 33).pow10()).max(1)
                        if (hasMilestone("c", 19)) b1 = b1.sub(getBuyableAmount("b", 33)).max(1e5)
                        if (hasMilestone("d", 4)) {
                                b1 = b1.div(Decimal.pow(1.02, player.d.times ** 1.5)).max(1)
                        }
                        if (player.d.everU15) b0 = decimalOne
                        return [b0, b1, b2]
                },
        },
        c33: {
                name: "C 33",
                func: "exp",
                effects: "Capybara gain and B 33 base per upgrade",
                base: {
                        initial: new Decimal(1.2),
                        1: {
                                active(){
                                        return true
                                },
                                type: "add",
                                amount(){
                                        return tmp.c.challenges[11].rewardEffect
                                },
                        },
                        2: {
                                active(){
                                        return hasMilestone("c", 22)
                                },
                                type: "add",
                                amount(){
                                        return .015 * Math.max(player.c.milestones.length - 21, 0)
                                },
                        },
                        3: {
                                active(){
                                        return player.c.challenges[21] >= 4
                                },
                                type: "add",
                                amount(){
                                        return (player.c.challenges[21] - 3)
                                },
                        },
                },
                bases(){
                        let b0 = new Decimal("1e6067")
                        let b1 = new Decimal(1e69)
                        let b2 = new Decimal(1.256) // 2**x
                        if (hasMilestone("c", 31))      b1 = b1.div(Decimal.pow(2.041, getBuyableAmount("c", 33).sub(100).max(0))).max(1e58)
                        if (hasMilestone("d", 5)){
                                b1 = b1.div(Decimal.pow10(player.d.milestones.length)).max(1)
                                if (hasUpgrade("b", 51)) b1 = b1.div(Decimal.pow10(player.d.upgrades.length)).max(1)
                        }
                        if (hasUpgrade("d", 13))        b1 = b1.div(Decimal.pow10(player.d.points.div(1e10).max(10).log10().floor())).max(1)
                        if (hasMilestone("d", 7)) b0 = b0.div(player.d.points.max(1).pow(player.d.times)).max(1)
                        return [b0, b1, b2]
                },
        },
}

var EXTRA_FREE_BUYABLE_DATA = {
}


/*
Function order:
- Reset buyable extras
- Reset buyable effects
- Update buyable extras
- Update buyable effects
- is buyable defined (bool)
- is buyable unlocked (booL)
- getBuyableTotal (Decimal, amount)
- getCodedBuyableAmount (Decimal, amount)
- isValidBuyableCode (bool)
- getBuyableName (string)
- calcBuyableExtra (recalls it)
- reCalcBuyableExtra (calcs it)
- getAlwaysActiveAdditionalBuyables (returns list)
- getBuyableExtraText (returns text)
- getBuyableEffectFunction (returns function for inputted buyable)
- getBuyableEffectSymbol (returns the symbol that the effect has)
- getBuyableEffectString (returns the effect display string)
- reCalcBuyableBase (calcs it)
- getIdentity (recalls what happens with no effect/disabled)
- reCalcBuyableEffect (calcs it)
- getBuyableBase (recalls it)
- getBuyableBases (recalls it)
- getBuyableCost (calcs it)
- canAffordBuyable (calcs it)
- isBuyableFree
- buyManualBuyable
- buyMaximumBuyable
- getBuyableAmountDisplay (calcs it)
- getBuyableDisplay (calcs it)
- canBuySimultaniously
*/

var CURRENT_BUYABLE_EXTRAS = {}
var CURRENT_BUYABLE_BASES = {}
var CURRENT_BUYABLE_EFFECTS = {}
var BUYABLES_FUNCTION_NAMES = {
        "exp": {
                "func": BUYABLE_EFFECT_EXPONENTIAL,
                "identity": decimalOne,
                "string": "^x",
                "eff": "*",
        },
        "exp_sqrt":{
                "func": BUYABLE_EFFECT_EXPONENTIAL_SQRT,
                "identity": decimalOne,
                "string": "^sqrt(x)",
                "eff": "*",
        },
        "exp_cbrt": {
                "func": BUYABLE_EFFECT_EXPONENTIAL_CBRT,
                "identity": decimalOne,
                "string": "^cbrt(x)",
                "eff": "*",
        },
        "lin": {
                "func": BUYABLES_EFFECT_LINEAR,
                "identity": decimalZero,
                "string": "*x",
                "eff": "+",
        },
        "linp1": {
                "func": BUYABLES_EFFECT_LINEAR_PLUS1,
                "identity": decimalOne,
                "string": "*x",
                "eff": "*",
        },
        "linp1sq": {
                "func": BUYABLES_EFFECT_LINEAR_PLUS1_SQUARE,
                "identity": decimalOne,
                "string": "*x",
                "eff": "*",
        },
        "lin_sqrt": {
                "func": BUYABLES_EFFECT_LINEAR_SQRT,
                "identity": decimalZero,
                "string": "*sqrt(x)",
                "eff": "+",
        },
}

function resetCurrBuyableExtras(){ 
        // Fully general
        for (i in MAIN_BUYABLE_DATA){
                CURRENT_BUYABLE_EXTRAS[i] = decimalZero
        }
}
resetCurrBuyableExtras()

function resetCurrBuyableEffects(){
        // Fully general
        for (i in MAIN_BUYABLE_DATA){
                let id = getIdentity(i.slice(0,1), i.slice(1,3))
                CURRENT_BUYABLE_BASES[i] = id
                CURRENT_BUYABLE_EFFECTS[i] = id
        }
}
resetCurrBuyableEffects()

function updateAllBuyableExtras(){
        // Fully general
        resetCurrBuyableExtras()
        let order = Object.keys(MAIN_BUYABLE_DATA).reverse()
        for (j in order){
                i = order[j]
                CURRENT_BUYABLE_EXTRAS[i] = reCalcBuyableExtra(i.slice(0,1), i.slice(1,3))
        }
}

function updateAllBuyableEffects(){
        // Fully general
        resetCurrBuyableEffects()
        let order = Object.keys(MAIN_BUYABLE_DATA).reverse()
        for (j in order){
                i = order[j]
                CURRENT_BUYABLE_BASES[i]   = reCalcBuyableBase(  i.slice(0,1), i.slice(1,3))
                CURRENT_BUYABLE_EFFECTS[i] = reCalcBuyableEffect(i.slice(0,1), i.slice(1,3))
        }
}

function isBuyableDefined(layer, id){
        // Fully general
        if (layers[layer] == undefined) return false
        if (layers[layer].buyables == undefined) return false
        return layers[layer].buyables[id] != undefined
}

function isBuyableUnlocked(layer, id){
        // Fully general
        if (!isBuyableDefined(layer, id)) return false
        return layers[layer].buyables[id].unlocked()
}

function getBuyableTotal(layer, id){
        // Fully general
        if (!isBuyableDefined(layer, id)) return decimalZero
        return getBuyableAmount(layer, id).plus(calcBuyableExtra(layer, id))
}

function getCodedBuyableAmount(code){
        // NOT fully general
        return getBuyableTotal(code.slice(0,1), code.slice(1,3)) 
}

function isValidBuyableCode(code){
        // NOT fully general
        if (code.length != 3) return false
        let letter = code.slice(0,1)
        let num = Number(code.slice(1,3))
        return isBuyableDefined(letter, num)
}

function getBuyableName(code){
        // NOT fully general
        if (MAIN_BUYABLE_DATA[code] != undefined && MAIN_BUYABLE_DATA[code].name != undefined) return MAIN_BUYABLE_DATA[code].name
        console.log("Please implement: " + code)
        return "bug bug bug"
        //return layers[code.slice(0,1)].buyables[code.slice(1,3)].title
}

function getNoExtras(layer, id){
        return false
}

function calcBuyableExtra(layer, id){
        // Fully general
        if (!isBuyableDefined(layer, id)) return decimalZero
        if (getNoExtras(layer, id)) return decimalZero
        let a = CURRENT_BUYABLE_EXTRAS[layer + id]
        if (a != undefined) return a
        return decimalZero
}

function reCalcBuyableExtra(layer, id){
        // Fully general
        let key = layer + id
        let data = MAIN_BUYABLE_DATA[key] || {}
        if (data == undefined) return decimalZero
        let amt = decimalZero
        for (i in data) {
                if (!isValidBuyableCode(i)) continue
                if (data[i].active() == true) amt = amt.plus(getCodedBuyableAmount(i))
        }
        let data2 = getAlwaysActiveAdditionalBuyables(layer, id)
        for (j in data2) {
                let i = data2[j]
                amt = amt.plus(getCodedBuyableAmount(i))
        }
        let data3 = EXTRA_FREE_BUYABLE_DATA[key] || {}
        for (i in data3) {
                if (data3[i].active() == true) amt = amt.plus(data3[i].amount())
        }
        return amt
}

function getAlwaysActiveAdditionalBuyables(layer, id){
        // kinda a spec thing, but basically general
        let l = []
        let hitCurrentLayerYet = false
        for (j in LAYERS){
                i = LAYERS[j]
                if (layers[i].row == "side") continue
                if (hitCurrentLayerYet && isBuyableDefined(i, id)) l.push(i+id)
                if (i == layer) hitCurrentLayerYet = true
        }
        if (id == 33) return l
        if (isBuyableDefined(layer, 33)) l.push(layer+33)
        return l
}

function getBuyableExtraText(layer, id){
        // Fully general
        let a = "<b><h3>Extra levels from:</h3><br>"
        let extra = false
        let key = layer + id
        let data = MAIN_BUYABLE_DATA[key] || {}
        for (i in data) {
                if (!isValidBuyableCode(i)) continue
                if (data[i].active() == true) {
                        extra = true
                        a += "<h3>" + getBuyableName(i) + "</h3>, "
                }
        }
        let data3 = EXTRA_FREE_BUYABLE_DATA[key] || {}
        for (i in data3) {
                if (!data3[i].name) continue
                if (data3[i].active() == true) {
                        extra = true
                        a += "<h3>" + data3[i].name + "</h3>, "
                }
        }
        if (!extra) return ""
        return a.slice(0, a.length-2) + "<br>"
}

function BUYABLE_EFFECT_EXPONENTIAL(a,b){
        return a.pow(b)
}

function BUYABLE_EFFECT_EXPONENTIAL_SQRT(a,b){
        return a.pow(b.sqrt())
}

function BUYABLE_EFFECT_EXPONENTIAL_CBRT(a,b){
        return a.pow(b.cbrt())
}

function BUYABLES_EFFECT_LINEAR(a,b){
        return a.times(b)
}

function BUYABLES_EFFECT_LINEAR_PLUS1(a,b){
        return a.times(b).plus(1)
}

function BUYABLES_EFFECT_LINEAR_PLUS1_SQUARE(a,b){
        return a.times(b.pow(2)).plus(1)
}

function BUYABLES_EFFECT_LINEAR_SQRT(a,b){
        return a.times(b.sqrt())
}

function getBuyableEffectFunction(layer, id){
        // Fully general
        if (!isValidBuyableCode(layer + id)) return BUYABLE_EFFECT_EXPONENTIAL
        let func = MAIN_BUYABLE_DATA[layer+id]["func"]
        if (typeof func == "function") return func // if its a function, then return the function
        return BUYABLES_FUNCTION_NAMES[func]["func"] || BUYABLE_EFFECT_EXPONENTIAL
}

function getBuyableEffectSymbol(layer, id){
        // Fully general
        if (!isValidBuyableCode(layer + id)) return "bug"
        let data = MAIN_BUYABLE_DATA[layer+id]
        
        return data["effectSymbol"] || BUYABLES_FUNCTION_NAMES[data["func"]]["eff"] || "bug"
}

function getBuyableEffectString(layer, id){
        // Fully general
        if (!isValidBuyableCode(layer + id)) return "bug"
        let func = MAIN_BUYABLE_DATA[layer+id]["func"]
        if (typeof func == "function") return MAIN_BUYABLE_DATA[layer+id]["effectSymbol"]
        return BUYABLES_FUNCTION_NAMES[func]["string"] || "bug"
}

function reCalcBuyableBase(layer, id){
        if (!isValidBuyableCode(layer + id)) {
                console.log("Your code broke at " + layer + id)
                Decimal(0)
        }
        if (!isBuyableActive(layer, id)) return getIdentity(layer, id)
        
        let data = MAIN_BUYABLE_DATA[layer + id].base
        let a = data.initial
        let b = 0
        while (b < 10){ //maybe change later
                b ++
                let data2 = data[b]
                //this is the data
                if (data2 == undefined) break
                //if data undefined done w loop
                if (data2.active != undefined && !data2.active()) continue
                //if the effect isnt active continue to next effect
                let func = data2.type
                let eff = data2.amount()
                //effect of the effect... 
                if (func == "add" || func == "plus") a = a.plus(eff)
                else if (func == "mult" || func == "times") a = a.times(eff)
                else if (func == "exp" || func == "pow") a = a.pow(eff)
                else {
                        console.log("ahh")
                        console.log(b)
                        console.log(layer + id)
                }
                //do the effect to a
        }
        return a
}

function getIdentity(layer, id){
        // Fully general
        let data1 = MAIN_BUYABLE_DATA[layer + id]
        if (typeof data1.func == "function") return data1.identity
        return BUYABLES_FUNCTION_NAMES[data1.func]["identity"]
}

function reCalcBuyableEffect(layer, id){
        // Fully general
        if (!isBuyableActive(layer, id)) return getIdentity(layer, id)
        let base = CURRENT_BUYABLE_BASES[layer + id]

        return getBuyableEffectFunction(layer,id)(base, getBuyableTotal(layer, id))
}

function getBuyableBase(layer, id){
        // Fully general
        return CURRENT_BUYABLE_BASES[layer + id]
}

function getBuyableBases(layer, id){
        // Fully general
        if (!isValidBuyableCode(layer + id)) {
                console.log("ya boi broke" + layer+ id)
                Decimal(0)
        }
        return MAIN_BUYABLE_DATA[layer + id].bases()
}

function getBuyableCost(layer, id, delta = decimalZero){
        // assuming the cost formula is alwuas the same fully general
        let bases = getBuyableBases(layer, id)
        let x = getBuyableAmount(layer, id).plus(delta)

        let base0 = bases[0]
        let base1 = bases[1]
        let base2 = bases[2]
        let exp0 = 1
        let exp1 = x
        let exp2 = x.pow(2)

        return new Decimal(base0).times(Decimal.pow(base1, exp1)).times(Decimal.pow(base2, exp2)).ceil()
}

function canAffordBuyable(layer, id, cost = undefined){
        // Fully general
        if (player.tab != layer) return false
        let amt = getBuyableAmount(layer, id)
        if (amt.eq(amt.plus(1))) return false
        if (cost == undefined) cost = getBuyableCost(layer, id, 0)
        return player[layer].points.gte(cost) && getBuyableAmount(layer, id).lt(getMaxBuyablesAmount(layer))
}

function isBuyableFree(layer){
        // Spec function
        if (hasMilestone("a", 4) && layer == "a") return true
        return false
}

function buyManualBuyable(layer, id){
        // Fully general
        let cost = getBuyableCost(layer, id)
        if (!canAffordBuyable(layer, id, cost)) return
        player[layer].buyables[id] = player[layer].buyables[id].plus(1)
        if (!isBuyableFree(layer)) player[layer].points = player[layer].points.minus(cost)
        return true
}

function buyMaximumBuyable(layer, id, maximum){
        // Fully general
        let maxAllowed = getMaxBuyablesAmount(layer)
        if (getBuyableAmount(layer, id).gte(maxAllowed)) return
        let bases = getBuyableBases(layer, id)
        let pts = player[layer].points
        if (!isBuyableUnlocked(layer, id)) return 
        if (pts.lt(bases[0])) return 
        
        let pttarget = pts.div(bases[0]).log(1.01)
        let bfactor = Decimal.log(bases[1], 3).div(Decimal.log(1.01, 3))
        //want to find ax^2+bx = c
        let c = pttarget
        let b = bfactor
        let a = Decimal.log(bases[2], 3).div(Decimal.log(1.01, 3))

        let target = c.times(a).times(4).plus(b.pow(2)).sqrt().minus(b).div(2).div(a).floor().plus(1)
        //-b + sqrt(b*b+4*c*a)

        target = target.min(maxAllowed)

        let diff = target.minus(player[layer].buyables[id]).max(0)
        if (maximum != undefined) diff = diff.min(maximum)
                                
        player[layer].buyables[id] = player[layer].buyables[id].plus(diff)

        if (isBuyableFree(layer) || diff.eq(0)) return diff.gt(0)
        pts = pts.sub(getBuyableCost(layer, id, -1)).max(0)
        //max 0 so nothing goes horribly wrong with weird errors and stuffs
        return diff.gt(0)
}

function getBuyableAmountDisplay(layer, id){
        // Fully general
        let extra = calcBuyableExtra(layer, id)
        if (extra.eq(0)) return formatWhole(getBuyableAmount(layer, id))
        return formatWhole(getBuyableAmount(layer, id)) + "+" + formatWhole(extra)
}

function getBuyableDisplay(layer, id){
        // other than softcapping fully general
        if (!shiftDown) {
                let amt = "<b><h2>Amount</h2>: " + getBuyableAmountDisplay(layer, id) + "</b><br>"
                let eff1 = "<b><h2>Effect</h2>: " + getBuyableEffectSymbol(layer, id) 
                let effectsName = MAIN_BUYABLE_DATA[layer + id]["effects"]
                if (typeof effectsName == "function") effectsName = effectsName()
                let eff2 = format(CURRENT_BUYABLE_EFFECTS[layer + id], 4) + " " + effectsName + "</b><br>"
                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost(layer, id)) + " " + layers[layer].name + "</b><br>"
        
                return br + amt + eff1 + eff2 + cost + "Shift to see details"
        }

        let eformula = ""
        if (MAIN_BUYABLE_DATA[layer + id]["eFormula"] != undefined) {
                eformula = MAIN_BUYABLE_DATA[layer + id]["eFormula"]
                if (typeof eformula == "function") eformula = eformula()
                eformula = eformula.replace("[base]", format(getBuyableBase(layer, id), 4))
        } else {
                eformula = format(getBuyableBase(layer, id), 4) + getBuyableEffectString(layer, id)
                if (MAIN_BUYABLE_DATA[layer + id].func == "linp1")      eformula = "1+" + eformula
                if (MAIN_BUYABLE_DATA[layer + id].func == "linp1sq")    eformula = "1+" + eformula + "<sup>2</sup>"
        }
        let allEff = "<b><h2>Effect formula:</h2><br>" + eformula + "</b><br>"

        let bases = getBuyableBases(layer, id)
        let cost1 = "<b><h2>Cost formula:</h2><br>"
        let cost3 = "</b><br>"
        let cost2a = bases[0].eq(1) ? "" :  "" + formatBuyableCostBase(bases[0]) + ""
        let cost2b = bases[1].eq(1) ? "" : "*" + formatBuyableCostBase(bases[1]) + "<sup>x</sup>"
        let cost2c = bases[2].eq(1) ? "" : "*" + formatBuyableCostBase(bases[2]) + "<sup>x<sup>2</sup></sup>" 
        let cost2 = cost2a + cost2b + cost2c
        if (cost2[0] == "*") cost2 = cost2.slice(1) //removes the star if its the first character
        let allCost = cost1 + cost2 + cost3

        return br + allEff + getBuyableExtraText(layer, id) + allCost
}

function formatBuyableCostBase(x){
        if (x.lt(1)) {
                let a = formatBuyableCostBase(Decimal.div(1, x))
                if (a == "1") return "1"
                return "1/" + a
        } else if (x.lt(1.0001)) return "1"
        else if (x.eq(x.floor())) return formatWhole(x)
        else if (x.lt(1.99)) return format(x, 4)
        else if (x.lt(10)) return format(x, 3)
        return format(x)
}

function getGeneralizedBuyableData(layer, id, unlockedTF){
        let title = getBuyableName(layer + id)
        let display = function(){
                return getBuyableDisplay(layer, id)
        }
        let effect = function(){
                return CURRENT_BUYABLE_EFFECTS[layer+id]
        }
        let canAfford = function(){
                return canAffordBuyable(layer, id)
        }
        let total = function(){
                return getBuyableAmount(layer, id).plus(this.extra())
        }
        let extra = function(){
                return calcBuyableExtra(layer, id)
        }
        let buy = function(){
                return buyManualBuyable(layer, id)
        }
        let buyMax = function(maximum){
                return buyMaximumBuyable(layer, id, maximum)
        }
        return {
                title: title, 
                display: display, 
                effect: effect,
                canAfford: canAfford,
                total: total,
                extra: extra,
                buy: buy,
                buyMax: buyMax,
                unlocked: unlockedTF,
                }
}

function isBuyableActive(layer, id){
        if (layer == "o") return true
        if (layer == "n") return true
        if (layer == "m") return true
        if (layer == "l") return true
        if (layer == "k") return true
        if (layer == "j") return true
        if (layer == "i") return true
        if (layer == "h") return true
        if (layer == "g") return true
        if (layer == "f") return true
        if (layer == "e") return true
        if (layer == "d") return true
        if (layer == "c") return true
        if (layer == "b") return true
        if (layer == "a") return true
        console.log(layer, id)
        return true
}

function getABBulk(layer){
        let amt = decimalOne
        if (layer == "a"){
                if (hasUpgrade("b", 12))        amt = amt.times(Math.max(1, player.b.upgrades.length))
                if (hasUpgrade("c", 11))        amt = amt.times(10)
                if (hasMilestone("c", 18))      amt = amt.times(2)
                if (hasUpgrade("c", 12))        amt = amt.pow(player.c.upgrades.length)
        }
        if (layer == "b") {
                if (hasMilestone("c", 5))       amt = amt.times(2)
                if (hasUpgrade("c", 12))        amt = amt.times(player.c.upgrades.length)
                if (hasMilestone("c", 18))      amt = amt.times(2)
                if (hasMilestone("d", 2))       amt = amt.times(2)
                if (hasUpgrade("d", 14))        amt = amt.times(3)
                if (hasUpgrade("a", 51))        amt = amt.times(Decimal.pow(2, player.a.upgrades.filter(x => x < 60 && x > 50).length))
                if (hasUpgrade("b", 41))        amt = amt.pow(2)
        }
        if (layer == "c") {
                if (hasMilestone("d", 2))       amt = amt.times(2)
                if (hasMilestone("d", 5))       amt = amt.times(3)
                if (hasMilestone("d", 6))       amt = amt.pow(2)
        }
        return amt
}

function getABSpeed(layer){
        let diffmult = 1 // times per second
        if (layer == "a") {
                if (hasUpgrade("b", 11)) diffmult *= player.b.times + 1
        }
        if (layer == "b") {
                if (hasMilestone("c", 4)) diffmult *= Math.max(1, player.c.times)
        }
        if (layer == "c"){
                // do multiplications first
                if (hasMilestone("d", 3)) diffmult *= Math.max(1, player.d.times)
                if (hasMilestone("d", 1) && hasUpgrade("b", 31)) diffmult += 1
        }
        return diffmult
}

function canBuySimultaniously(layer){
        if (layer == "c")               return hasMilestone("d", 1) //|| player.f.unlocked
        if (layer == "b")               return hasMilestone("c", player.d.unlocked ? 1 : 3) //|| player.e.unlocked
        if (layer == "a")               return hasMilestone("b", 4) || player.d.unlocked
        return false
}

function getMaxBuyablesAmount(layer){
        let ret = Decimal.pow(10, 20)

        if (layer == "a") {
                if (hasUpgrade("b", 51)) ret = ret.pow(5)
        }
        return ret
}

function handleGeneralizedBuyableAutobuy(diff, layer){
        player[layer].abtime += diff * getABSpeed(layer)

        if (player[layer].abtime > 10) player[layer].abtime = 10
        if (player[layer].abtime > 1) {
                player[layer].abtime += -1
                let amt = getABBulk(layer)
                let tlb = tmp[layer].buyables
                let ids = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                let hasBoughtYet = false
                let cbs = canBuySimultaniously(layer)
                for (let i = 0; i < 9; i++) {
                        let id = ids[i]
                        if (tlb[id] && tlb[id].unlocked) {
                                hasBoughtYet = layers[layer].buyables[id].buyMax(amt) || hasBoughtYet
                        }
                        if (hasBoughtYet && !cbs) break
                }
        }
}

