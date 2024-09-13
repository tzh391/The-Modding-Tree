function getColRowCode(det, base = 7){
        let tens = Math.floor((det-1)/base) + 1
        let extra = det % base == 0 ? base : det % base
        return 10 * tens + extra
}

function getNumberNameLT1000(n){ //currently only works up to 1000
        if (n < 100) return getNumberNameLT100(n)
        if (n % 100 == 0) return getNumberNameLT100(n / 100) + " Hundred"
        let hun = getNumberNameLT100(Math.floor(n / 100)) + " Hundred and "
        return hun + getNumberNameLT100(n % 100)
}

function getNumberName(n){ //currently only works up to 1e6
        if (n < 1000) return getNumberNameLT1000(n)
        if (n < 1e6) {
                if (n % 1000 == 0) return getNumberNameLT1000(n / 1000) + " Thousand"
                let thou = getNumberNameLT1000(Math.floor(n / 1000)) + " Thousand "
                return thou + getNumberNameLT1000(n % 1000)
        }
}

function getNumberNameLT100(n){
        let units = {
                1: "One",
                2: "Two",
                3: "Three",
                4: "Four",
                5: "Five",
                6: "Six",
                7: "Seven",
                8: "Eight",
                9: "Nine",
        }
        let tens = {
                2: "Twenty",
                3: "Thirty",
                4: "Forty",
                5: "Fifty",
                6: "Sixty",
                7: "Seventy",
                8: "Eighty",
                9: "Ninety",
        }
        let forced = {
                10: "Ten",
                11: "Eleven",
                12: "Twelve",
                13: "Thirteen",
                14: "Fourteen",
                15: "Fifteen",
                16: "Sixteen",
                17: "Seventeen",
                18: "Eighteen", 
                19: "Nineteen",
        }
        if (forced[n] != undefined) return forced[n]
        if (n == 0) return "Zero"
        if (n % 10 == 0) return tens[n/10]
        if (n < 10) return units[n]
        return tens[Math.floor(n/10)] + "-" + units[n % 10].toLowerCase()
}

function getAchStuffFromNumber(n){
        let name = getNumberName(n)
        let id = getColRowCode(n)
        let done = function(){
                return hasAchievement("ach", id) || PROGRESSION_MILESTONES[n]()
        }
        let isChall = false
        if (n > 301 && n < 309) isChall = true
        if (n > 323 && n < 330) isChall = true
        let startStr = isChall ? "Complete " : "Get "
        let tooltip = function(){
                return startStr + PROGRESSION_MILESTONES_TEXT[n]
        }

        // KEEP IN THIS FILE

        let tens = id - id % 10
        
        let a = Math.sin(tens/34 + 0) 
        let b = Math.sin(tens/34 + 2)
        let c = Math.sin(tens/34 + 3)
        a = convertToB16(Math.floor(a*128) + 128)
        b = convertToB16(Math.floor(b*128) + 128)
        c = convertToB16(Math.floor(c*128) + 128)

        // END OF KEEP IN THIS FILE

        let style = function(){
                for (i = 1; i <= 7; i++){
                        if (!hasAchievement("ach", tens + i)) return {}
                }
                return {"background-color": "#" + String(a) + String(b) + String(c)}
        }
        let unlocked 
        if (n <= 42) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return true
                }
        } else if (n <= 98) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return player.b.unlocked
                }
        } else if (n <= 7777) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return player.e.unlocked
                }
        } else if (n <= Infinity) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return false
                }
        } 
        return {name: name, done: done, tooltip: tooltip, unlocked: unlocked, style: style}
}

function getFirstNAchData(n){
        let obj = {}
        for (i = 1; i <= n; i++){
                obj[getColRowCode(i)] = getAchStuffFromNumber(i)
        }
        obj.rows = Math.ceil(n / 7)
        obj.cols = 7
        return obj
}

function hasCompletedFirstNRows(n){
	for (i = 1; i <= n; i++){
		for (j = 1; j <= 7; j++){
			let x = 10 * i + j
			if (layers.ach.achievements[x] == undefined) return false
			if (!hasAchievement("ach", x)) return false
		}
	}
	return true
}

PROGRESSION_MILESTONES = {
        1:   () => player.points.gte(1),
        2:   () => player.points.gte(Decimal.pow(2, 0).pow10()),
        3:   () => player.points.gte(Decimal.pow(2, 1).pow10()),
        4:   () => player.points.gte(Decimal.pow(2, 2).pow10()),
        5:   () => player.points.gte(Decimal.pow(2, 3).pow10()),
        6:   () => player.points.gte(Decimal.pow(2, 4).pow10()),
        7:   () => player.points.gte(Decimal.pow(2, 5).pow10()),
        8:   () => player.a.points.gte(1),
        9:   () => player.a.points.gte(Decimal.pow(3, 0).pow10()),
        10:  () => player.a.points.gte(Decimal.pow(3, 1).pow10()),
        11:  () => player.a.points.gte(Decimal.pow(3, 2).pow10()),
        12:  () => player.a.points.gte(Decimal.pow(3, 3).pow10()),
        13:  () => player.a.points.gte(Decimal.pow(3, 4).pow10()),
        14:  () => player.a.points.gte(Decimal.pow(3, 5).pow10()),
        15:  () => player.points.gte(Decimal.pow(2, 6).pow10()),
        16:  () => player.points.gte(Decimal.pow(2, 7).pow10()),
        17:  () => player.points.gte(Decimal.pow(2, 8).pow10()),
        18:  () => player.points.gte(Decimal.pow(2, 9).pow10()),
        19:  () => player.points.gte(Decimal.pow(2, 10).pow10()),
        20:  () => player.points.gte(Decimal.pow(2, 11).pow10()),
        21:  () => player.points.gte(Decimal.pow(2, 12).pow10()),
        22:  () => player.b.points.gte(1),
        23:  () => player.b.points.gte(Decimal.pow(4, 0).pow10()),
        24:  () => player.b.points.gte(Decimal.pow(4, 1).pow10()),
        25:  () => player.b.points.gte(Decimal.pow(4, 2).pow10()),
        26:  () => player.b.points.gte(Decimal.pow(4, 3).pow10()),
        27:  () => player.b.points.gte(Decimal.pow(4, 4).pow10()),
        28:  () => player.b.points.gte(Decimal.pow(4, 5).pow10()),
        29:  () => player.a.points.gte(Decimal.pow(3, 6).pow10()),
        30:  () => player.a.points.gte(Decimal.pow(3, 7).pow10()),
        31:  () => player.a.points.gte(Decimal.pow(3, 8).pow10()),
        32:  () => player.a.points.gte(Decimal.pow(3, 9).pow10()),
        33:  () => player.a.points.gte(Decimal.pow(3, 10).pow10()),
        34:  () => player.a.points.gte(Decimal.pow(3, 11).pow10()),
        35:  () => player.a.points.gte(Decimal.pow(3, 12).pow10()),
        36:  () => player.points.gte(Decimal.pow(2, 13).pow10()),
        37:  () => player.points.gte(Decimal.pow(2, 14).pow10()),
        38:  () => player.points.gte(Decimal.pow(2, 15).pow10()),
        39:  () => player.points.gte(Decimal.pow(2, 16).pow10()),
        40:  () => player.points.gte(Decimal.pow(2, 17).pow10()),
        41:  () => player.points.gte(Decimal.pow(2, 18).pow10()),
        42:  () => player.points.gte(Decimal.pow(2, 19).pow10()),
        43:  () => player.points.gte(Decimal.pow10(1e6)),
        44:  () => player.points.gte(Decimal.pow10(1e7)),
        45:  () => player.points.gte(Decimal.pow10(1e8)),
        46:  () => player.points.gte(Decimal.pow10(1e9)),
        47:  () => player.points.gte(Decimal.pow10(1e10)),
        48:  () => player.points.gte(Decimal.pow10(1e100)),
        49:  () => player.points.gte(Decimal.pow10("1e1000")),
        50:  () => player.b.points.gte(Decimal.pow(4, 6).pow10()),
        51:  () => player.b.points.gte(Decimal.pow(4, 7).pow10()),
        52:  () => player.b.points.gte(Decimal.pow(4, 8).pow10()),
        53:  () => player.b.points.gte(Decimal.pow(4, 9).pow10()),
        54:  () => player.b.points.gte(Decimal.pow10(1e6)),
        55:  () => player.b.points.gte(Decimal.pow10(1e7)),
        56:  () => player.b.points.gte(Decimal.pow10(1e8)),
        57:  () => player.c.points.gte(Decimal.pow10(0)),
        58:  () => player.c.points.gte(Decimal.pow10(1)),
        59:  () => player.c.points.gte(Decimal.pow10(5)),
        60:  () => player.c.points.gte(Decimal.pow10(25)),
        61:  () => player.c.points.gte(Decimal.pow10(125)),
        62:  () => player.c.points.gte(Decimal.pow10(625)),
        63:  () => player.c.points.gte(Decimal.pow10(3125)),
        64:  () => player.c.points.gte(Decimal.pow10(15625)),
        65:  () => player.c.points.gte(Decimal.pow10(1e5)),
        66:  () => player.c.points.gte(Decimal.pow10(1e6)),
        67:  () => player.c.points.gte(Decimal.pow10(1e7)),
        68:  () => player.c.points.gte(Decimal.pow10(1e8)),
        69:  () => player.c.points.gte(Decimal.pow10(1e9)),
        70:  () => player.c.points.gte(Decimal.pow10(1e10)),
        71:  () => player.d.points.gte(Decimal.pow10(0)),
        72:  () => player.d.points.gte(Decimal.pow10(1)),
        73:  () => player.d.points.gte(Decimal.pow10(6)),
        74:  () => player.d.points.gte(Decimal.pow10(36)),
        75:  () => player.d.points.gte(Decimal.pow10(216)),
        76:  () => player.d.points.gte(Decimal.pow10(1296)),
        77:  () => player.d.points.gte(Decimal.pow10(7776)),
        78:  () => player.points.gte(Decimal.pow10(1e4).pow10()),
        79:  () => player.points.gte(Decimal.pow10(1e5).pow10()),
        80:  () => player.points.gte(Decimal.pow10(1e6).pow10()),
        81:  () => player.points.gte(Decimal.pow10(1e7).pow10()),
        82:  () => player.points.gte(Decimal.pow10(1e8).pow10()),
        83:  () => player.points.gte(Decimal.pow10(1e9).pow10()),
        84:  () => player.points.gte(Decimal.pow10(1e10).pow10()),
        85:  () => player.d.points.gte(Decimal.pow10(1e5)),
        86:  () => player.d.points.gte(Decimal.pow10(1e6)),
        87:  () => player.d.points.gte(Decimal.pow10(1e7)),
        88:  () => player.d.points.gte(Decimal.pow10(1e8)),
        89:  () => player.d.points.gte(Decimal.pow10(1e9)),
        90:  () => player.d.points.gte(Decimal.pow10(1e10)),
        91:  () => player.d.points.gte(Decimal.pow10(1e60)),
        92:  () => player.e.points.gte(Decimal.pow10(0)),
        93:  () => player.e.points.gte(Decimal.pow10(1)),
        94:  () => player.e.points.gte(Decimal.pow10(7)),
        95:  () => player.e.points.gte(Decimal.pow10(49)),
        96:  () => player.e.points.gte(Decimal.pow10(343)),
        97:  () => player.e.points.gte(Decimal.pow10(2401)),
        98:  () => player.e.points.gte(Decimal.pow10(16807)),
        99:  () => player.E.points.gte(Decimal.pow10(0)),
        100: () => player.E.points.gte(Decimal.pow10(1)),
        101: () => player.E.points.gte(Decimal.pow10(8)),
        102: () => player.E.points.gte(Decimal.pow10(27)),
        103: () => player.E.points.gte(Decimal.pow10(64)),
        104: () => player.E.points.gte(Decimal.pow10(125)),
        105: () => player.E.points.gte(Decimal.pow10(216)),
        106: () => player.T.unlocked,
        107: () => player.T.points.gte(4),
        108: () => player.T.points.gte(9),
        109: () => player.T.points.gte(16),
        110: () => player.T.points.gte(25),
        111: () => player.T.points.gte(36),
        112: () => player.T.points.gte(49),
        113: () => player.T.points.gte(64),
        114: () => player.T.points.gte(81),
        115: () => player.T.points.gte(100),
        116: () => player.T.points.gte(200),
        117: () => player.T.points.gte(300),
        118: () => player.T.points.gte(500),
        119: () => player.T.points.gte(800),
        120: () => player.e.points.gte(Decimal.pow10(1e5)),
        121: () => player.e.points.gte(Decimal.pow10(1e6)),
        122: () => player.e.points.gte(Decimal.pow10(1e7)),
        123: () => player.e.points.gte(Decimal.pow10(1e8)),
        124: () => player.e.points.gte(Decimal.pow10(1e9)),
        125: () => player.e.points.gte(Decimal.pow10(1e10)),
        126: () => player.e.points.gte(Decimal.pow10(1e70)),
        127: () => player.E.points.gte(Decimal.pow10(343)),
        128: () => player.E.points.gte(Decimal.pow10(512)),
        129: () => player.E.points.gte(Decimal.pow10(729)),
        130: () => player.E.points.gte(Decimal.pow10(1000)),
        131: () => player.E.points.gte(Decimal.pow10(2000)),
        132: () => player.E.points.gte(Decimal.pow10(5000)),
        133: () => player.E.points.gte(Decimal.pow10(14000)),
        134: () => player.f.points.gte(Decimal.pow10(0)),
        135: () => player.f.points.gte(Decimal.pow10(1)),
        136: () => player.f.points.gte(Decimal.pow10(8)),
        137: () => player.f.points.gte(Decimal.pow10(64)),
        138: () => player.f.points.gte(Decimal.pow10(512)),
        139: () => player.f.points.gte(Decimal.pow10(4096)),
        140: () => player.f.points.gte(Decimal.pow10(32768)),
        141: () => player.T.points.gte(1300),
        142: () => player.T.points.gte(2100),
        143: () => player.T.points.gte(3400),
        144: () => player.T.points.gte(5500),
        145: () => player.T.points.gte(8900),
        146: () => player.T.points.gte(14400),
        147: () => player.T.points.gte(23300),
        148: () => player.f.points.gte(Decimal.pow10(262144)),
        149: () => player.f.points.gte(Decimal.pow10(2097152)),
        150: () => player.f.points.gte(Decimal.pow10(16777216)),
        151: () => player.f.points.gte(Decimal.pow10(134217728)),
        152: () => player.f.points.gte(Decimal.pow10(1073741824)),
        153: () => player.f.points.gte(Decimal.pow10(1e10)),
        154: () => player.f.points.gte(Decimal.pow10(1e80)),
        155: () => player.E.points.gte(Decimal.pow10(42000)),
        156: () => player.E.points.gte(Decimal.pow10(132000)),
        157: () => player.E.points.gte(Decimal.pow10(429e3)),
        158: () => player.E.points.gte(Decimal.pow10(1430e3)),
        159: () => player.E.points.gte(Decimal.pow10(4862e3)),
        160: () => player.E.points.gte(Decimal.pow10(16796e3)),
        161: () => player.E.points.gte(Decimal.pow10(58786e3)),
        162: () => player.G.points.gte(1),
        163: () => player.G.points.gte(3),
        164: () => player.G.points.gte(6),
        165: () => player.G.points.gte(10),
        166: () => player.G.points.gte(30),
        167: () => player.G.points.gte(60),
        168: () => player.G.points.gte(100),
}

PROGRESSION_MILESTONES_TEXT = {
        1:   "1 Point",
        2:   "10 Points",
        3:   "100 Points",
        4:   "10,000 Points",
        5:   "100,000,000 Points",
        6:   "1e16 Points",
        7:   "1e32 Points",
        8:   "1 Alligator",
        9:   "10 Alligators",
        10:  "1,000 Alligators",
        11:  "1,000,000,000 Alligators",
        12:  "1e27 Alligators",
        13:  "1e81 Alligators",
        14:  "1e243 Alligators",
        15:  "1e64 Points",
        16:  "1e128 Points",
        17:  "1e256 Points",
        18:  "1e512 Points",
        19:  "1e1,024 Points",
        20:  "1e2,048 Points",
        21:  "1e4,096 Points",
        22:  "1 Beaver",
        23:  "10 Beavers",
        24:  "10,000 Beavers",
        25:  "1e16 Beavers",
        26:  "1e64 Beavers",
        27:  "1e256 Beavers",
        28:  "1e1,024 Beavers",
        29:  "1e729 Alligators",
        30:  "1e2,187 Alligators",
        31:  "1e6,561 Alligators",
        32:  "1e19,683 Alligators",
        33:  "1e59,049 Alligators",
        34:  "1e177,147 Alligators",
        35:  "1e531,441 Alligators",
        36:  "1e8,192 Points",
        37:  "1e16,384 Points",
        38:  "1e32,768 Points",
        39:  "1e65,536 Points",
        40:  "1e131,072 Points",
        41:  "1e262,144 Points",
        42:  "1e524,288 Points",
        43:  "1e1,000,000 Points",
        44:  "1e10,000,000 Points",
        45:  "1e100,000,000 Points",
        46:  "1e1,000,000,000 Points",
        47:  "e1e10 Points",
        48:  "e1e100 Points",
        49:  "e1e1000 Points",
        50:  "1e4,096 Beavers",
        51:  "1e16,384 Beavers",
        52:  "1e65,536 Beavers",
        53:  "1e262,144 Beavers",
        54:  "1e1,000,000 Beavers",
        55:  "1e10,000,000 Beavers",
        56:  "1e100,000,000 Beavers",
        57:  "1 Capybara",
        58:  "10 Capybaras",
        59:  "100,000 Capybaras",
        60:  "1e25 Capybaras",
        61:  "1e125 Capybaras",
        62:  "1e625 Capybaras",
        63:  "1e3125 Capybaras",
        64:  "1e15,625 Capybaras",
        65:  "1e100,000 Capybaras",
        66:  "1e1,000,000 Capybaras",
        67:  "1e10,000,000 Capybaras",
        68:  "1e100,000,000 Capybaras",
        69:  "1e1,000,000,000 Capybaras",
        70:  "e1e10 Capybaras",
        71:  "1 Duck",
        72:  "10 Ducks",
        73:  "1,000,000 Ducks",
        74:  "1e36 Ducks",
        75:  "1e216 Ducks",
        76:  "1e1296 Ducks",
        77:  "1e7776 Ducks",
        78:  "e1e10,000 Points",
        79:  "e1e100,000 Points",
        80:  "e1e1,000,000 Points",
        81:  "e1e10,000,000 Points",
        82:  "e1e100,000,000 Points",
        83:  "e1e1,000,000,000 Points",
        84:  "ee1e10 Points",
        85:  "1e100,000 Ducks",
        86:  "1e1,000,000 Ducks",
        87:  "1e10,000,000 Ducks",
        88:  "1e100,000,000 Ducks",
        89:  "1e1,000,000,000 Ducks",
        90:  "e1e10 Ducks",
        91:  "e1e60 Ducks",
        92:  "1 Eagle",
        93:  "10 Eagles",
        94:  "10,000,000 Eagles",
        95:  "1e49 Eagles",
        96:  "1e343 Eagles",
        97:  "1e2401 Eagles",
        98:  "1e16,807 Eagles",
        99:  "1 Emerald",
        100: "10 Emeralds",
        101: "100,000,000 Emeralds",
        102: "1e27 Emeralds",
        103: "1e64 Emeralds",
        104: "1e125 Emeralds",
        105: "1e216 Emeralds",
        106: "1 Tier",
        107: "4 Tiers",
        108: "9 Tiers",
        109: "16 Tiers",
        110: "25 Tiers",
        111: "36 Tiers",
        112: "49 Tiers",
        113: "64 Tiers",
        114: "81 Tiers",
        115: "100 Tiers",
        116: "200 Tiers",
        117: "300 Tiers",
        118: "500 Tiers",
        119: "800 Tiers",
        120: "1e100,000 Eagles",
        121: "1e1,000,000 Eagles",
        122: "1e10,000,000 Eagles",
        123: "1e100,000,000 Eagles",
        124: "1e1,000,000,000 Eagles",
        125: "e1e10 Eagles",
        126: "e1e70 Eagles",
        127: "1e343 Emeralds",
        128: "1e512 Emeralds",
        129: "1e729 Emeralds",
        130: "1e1000 Emeralds",
        131: "1e2000 Emeralds",
        132: "1e5000 Emeralds",
        133: "1e14,000 Emeralds",
        134: "1 Finch",
        135: "10 Finches",
        136: "100,000,000 Finches",
        137: "1e64 Finches",
        138: "1e512 Finches",
        139: "1e4096 Finches",
        140: "1e32768 Finches",
        141: "1300 Tiers",
        142: "2100 Tiers",
        143: "3400 Tiers",
        144: "5500 Tiers",
        145: "8900 Tiers",
        146: "14,400 Tiers",
        147: "23,300 Tiers",
        148: "1e262,144 Finches",
        149: "1e2,097,152 Finches",
        150: "1e16,777,216 Finches",
        151: "1e134,217,728 Finches",
        152: "1e1,073,741,824 Finches",
        153: "e1e10 Finches",
        154: "e1e80 Finches",
        155: "1e42,000 Emeralds",
        156: "1e132,000 Emeralds",
        157: "1e429,000 Emeralds",
        158: "1e1,430,000 Emeralds",
        159: "1e4,862,000 Emeralds",
        160: "1e16,796,000 Emeralds",
        161: "1e58,786,000 Emeralds",
        162: "1 Grade",
        163: "3 Grades",
        164: "6 Grades",
        165: "10 Grades",
        166: "30 Grades",
        167: "60 Grades",
        168: "100 Grades",
}









