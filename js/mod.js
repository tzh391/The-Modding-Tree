let modInfo = {
	name: "The pg Tree",
	id: "pg132",
	author: "pg132",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
    offlineLimit: 1,  // In hours
    initialStartPoints: new Decimal (10) // Used for hard resets and new players
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

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
	
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600000) // Default is 1 hour which is just arbitrarily large
}