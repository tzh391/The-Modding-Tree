/* Extend Chemistry and apply the preview's documented Researcher balance and QoL. */
function installChemistryContinuation() {
    if (layers.chem.continuationInstalled) return;
    layers.chem.continuationInstalled = true;
    const chem = layers.chem;
    const oldStart = chem.startData;
    chem.startData = function () {
        const data = oldStart();
        data.chemUnlocks.period4 = false;
        for (const field of ["workers", "scientists", "buildings", "buildingProgress", "amount", "best_amount"]) {
            data[field].K = new Decimal(0);
            data[field].Ca = new Decimal(0);
        }
        return data;
    };
    chemAbbrev.K = "Potassium";
    chemAbbrev.Ca = "Calcium";
    chemInitialEffects.K = "per level multiply worker speed by 1.05 (max 100 levels)";
    chemInitialEffects.Ca = "per level multiply scientist speed by 1.05 (max 100 levels)";
    const level = (id, best) => player.chem[best ? "best_amount" : "amount"][id].div(5).max(1).log(2).floor().max(0);
    const cost = [1e20, 1e21, 1e22, 1e23, 1e24];
    const descriptions = [
        "Unlock Potassium and Calcium in Chemistry and double worker speed.",
        "Double scientist speed.",
        "Double worker speed.",
        "Double scientist speed again.",
        "Double worker and scientist speed.",
    ];
    chem.upgrades = { rows: 1, cols: 5 };
    for (let i = 0; i < 5; i++) {
        const id = 11 + i;
        chem.upgrades[id] = {
            title: () => "<bdi style='color: #" + getUndulatingColor() + "'>Chemistry " + ["I", "II", "III", "IV", "V"][i],
            description: () => descriptions[i],
            cost: () => new Decimal(cost[i]),
            currencyDisplayName: "Researchers", currencyInternalName: "points", currencyLayer: "r",
            unlocked() {
                if (hasUpgrade("chem", id)) return true;
                if (i === 0) return hasMilestone("r", 18) && player.r.best.gte(1e20);
                return hasUpgrade("chem", id - 1) && player.r.best.gte(cost[i]) &&
                    (i === 1 ? level("K", true).gte(10) : i === 2 ? level("Ca", true).gte(10) : level("K", true).gte(i === 3 ? 20 : 30) && level("Ca", true).gte(i === 3 ? 20 : 30));
            },
            unlockHint() {
                if (i === 0) return "Researcher milestone 18 (2 Factory VI levels) and " + format(cost[i]) + " best Researchers";
                return "Chemistry " + ["I", "II", "III", "IV"][i - 1] + ", " + format(cost[i]) + " best Researchers, and " +
                    (i === 1 ? "10 best Potassium levels" : i === 2 ? "10 best Calcium levels" : (i === 3 ? "20" : "30") + " best levels in both Potassium and Calcium");
            },
            onPurchase() { if (id === 11) player.chem.chemUnlocks.period4 = true; },
        };
    }
    chem.milestones = {
        1: { requirementDescription: () => "20 best Potassium levels", done: () => level("K", true).gte(20), unlocked: () => hasUpgrade("chem", 11), effectDescription: () => "Reward: Double worker speed." },
        2: { requirementDescription: () => "20 best Calcium levels", done: () => level("Ca", true).gte(20), unlocked: () => hasUpgrade("chem", 11), effectDescription: () => "Reward: Double scientist speed." },
        3: { requirementDescription: () => "40 best Potassium and Calcium levels", done: () => level("K", true).gte(40) && level("Ca", true).gte(40), unlocked: () => hasMilestone("chem", 1) && hasMilestone("chem", 2), effectDescription: () => "Reward: Halve element decay after Sulfur's effect." },
        4: { requirementDescription: () => "20 total Chemists (QoL)", done: () => player.chem.total.gte(20), unlocked: () => player.chem.unlocked, effectDescription: () => "Reward: Unlock worker and scientist assignment sliders. The existing +1/-1 controls remain available." },
    };
    const oldWorker = chem.buildings.getWorkerMultiplier;
    const oldScientist = chem.buildings.getScientistMultiplier;
    const oldDecay = chem.buildings.getDecay;
    const oldBuildingUpdate = chem.buildings.update;
    chem.buildings.getWorkerMultiplier = function () {
        let ret = oldWorker();
        for (const id of [11, 13, 15]) if (hasUpgrade("chem", id)) ret = ret.times(2);
        if (hasMilestone("chem", 1)) ret = ret.times(2);
        return ret.times(Decimal.pow(1.05, level("K").min(100)));
    };
    chem.buildings.getScientistMultiplier = function () {
        let ret = oldScientist();
        for (const id of [12, 14, 15]) if (hasUpgrade("chem", id)) ret = ret.times(2);
        if (hasMilestone("chem", 2)) ret = ret.times(2);
        return ret.times(Decimal.pow(1.05, level("Ca").min(100)));
    };
    chem.buildings.getDecay = function () { return oldDecay() * (hasMilestone("chem", 3) ? .5 : 1); };
    chem.buildings.update = function (diff) {
        oldBuildingUpdate(diff);
        if (!hasUpgrade("chem", 11)) return;
        const data = player.chem;
        for (const id of ["K", "Ca"]) {
            data.buildingProgress[id] = data.buildingProgress[id].plus(data.workers[id].times(tmp.chem.buildings.getWorkerMultiplier).times(diff));
            const buildings = data.buildings[id];
            const gain = data.scientists[id].times(tmp.chem.buildings.getScientistMultiplier).times(buildings.times(Decimal.pow(1.1, buildings)));
            data.amount[id] = getLogisticAmount(data.amount[id], gain, tmp.chem.buildings.getDecay, diff);
            data.best_amount[id] = data.best_amount[id].max(data.amount[id]);
            if (data.buildingProgress[id].gte(10)) data.buildings[id] = buildings.max(data.buildingProgress[id].div(10).log(3).floor().plus(1));
        }
    };
    const oldUpdate = chem.update;
    chem.update = function (diff) { oldUpdate(diff); if (hasUpgrade("chem", 11)) player.chem.chemUnlocks.period4 = true; };
    chem.tabFormat.Upgrades.unlocked = () => hasMilestone("r", 15) || hasUpgrade("chem", 11);
    chem.tabFormat.Milestones.unlocked = () => player.chem.unlocked;
    const contents = chem.tabFormat["Chemistry 1"].content;
    contents.splice(3, 0, "chem-period4");
    contents.splice(contents.indexOf("chem-details") + 1, 0, "blank", "chem-assignment-sliders");
    contents.push(["display-text", function () {
        if (!hasUpgrade("chem", 11)) return '<small class="unlock-hint">Next elements: Potassium and Calcium — unlock with Chemistry I at 1e20 Researchers, after Researcher milestone 18.</small>';
        return "";
    }]);
    const info = chem.tabFormat.Info.content;
    info.push("blank", ["display-text", function () {
        let text = "<small class='unlock-hint'>Continuation preview. Original saves can be imported through Options.</small>";
        if (hasUpgrade("chem", 11)) text += br2 + displayChemInitialEffect("K") + br + displayChemInitialEffect("Ca");
        return text + br2 + "Current endgame: Chemistry V, 40 best Potassium and Calcium levels, and 1e24 Researchers.";
    }]);
    const oldEndgame = isEndgameRaw;
    isEndgameRaw = function () {
        if (player.extremeMode) return oldEndgame();
        return hasUpgrade("chem", 15) && hasMilestone("chem", 3) && player.r.points.gte(1e24);
    };
    const factories = layers.r.tabFormat.Factories.content;
    factories.splice(2, 0, ["display-text", function () {
        return "Widget gain: +" + format(ChemistryQoL.widgetRate()) + " Widgets/sec";
    }]);
    // Count the Hiawd bonus gradually instead of crediting a large existing stockpile at 19.
    layers.r.widgets.getMilestone17Levels = function () {
        if (!hasMilestone("r", 17)) return new Decimal(0);
        return player.hu.buyables[13].sub(14000).max(0).min(player.r.buyables[11].floor().sub(18).max(0).times(750));
    };
    layers.r.widgets.getResetGain = function () {
        let ret = player.r.amounts[11].plus(1).times(tmp.r.buyables[11].effect);
        if (hasUpgrade("r", 14)) ret = ret.times(Decimal.pow(2, player.r.upgrades.length));
        if (hasMilestone("r", 17)) ret = ret.times(Decimal.pow(1.001, layers.r.widgets.getMilestone17Levels()));
        return ret;
    };
    // This shared base is exponentiated by purchased levels across the factory chain.
    // Keep all six thresholds, but reduce their combined base bonus from .6 to .42.
    layers.r.milestones[17].effectDescription = function () {
        return "Reward: <i>Hiawd</i> levels past 14,000 multiply Widget gain by 1.001, counting at most 750 Hiawd levels per purchased Factory<sup>1</sup> level past 18. Mastery VI double exponent is .1, and at 20 / 22 / 24 / 26 / 28 / 30 Factory<sup>1</sup> levels, add .07 to the multiplier per factory (max +.42).";
    };
    layers.r.buyables.getBaseMult = function () {
        let ret = new Decimal(2);
        if (hasMilestone("r", 16)) ret = ret.plus(player.r.milestones.length / 100);
        if (hasMilestone("r", 17)) {
            for (const threshold of [20, 22, 24, 26, 28, 30]) if (player.r.buyables[11].gte(threshold)) ret = ret.plus(.07);
        }
        if (hasMilestone("r", 18)) ret = ret.plus(player.r.buyables[23].min(10).times(.04));
        return ret;
    };
    VERSION.num = "2.070.3";
    VERSION.name = "Gradual Factory Rewards";
    VERSION.withoutName = "v" + VERSION.num;
    VERSION.withName = VERSION.withoutName + ": " + VERSION.name;
    CHANELOG_VERSION = "v2.070.3";
    const normalUpdate = (version, lines) => "<div class='normal-update'><br><h3>v" + version + "</h3><br>" + lines.map(line => "<span>- " + line + "</span><br>").join("") + "</div>";
    CHANGELOGS.unshift(normalUpdate("2.070", [
        "Continued Chemistry with Potassium, Calcium, five upgrades, and three milestones.",
        "Added next-unlock notes for upgrades and buyables.",
        "Preserved the original Human and Researcher layers.",
    ]));
    CHANGELOGS.unshift(normalUpdate("2.070.1", [
        "Added the Widget gain per second display.",
        "Unlock worker and scientist assignment sliders at 20 total Chemists.",
        "Fixed Researcher milestone 17's Factory I thresholds to match its description.",
        "Normal Mode update notes are orange.",
        "Added a release pacing check for meaningful progression within 100 seconds.",
    ]));
    CHANGELOGS.unshift(normalUpdate("2.070.2", [
        "Reduced each Researcher milestone 17 factory-base bonus from +.1 to +.07 (max +.42). The 20 / 22 / 24 / 26 / 28 / 30 level requirements are unchanged.",
        "Updated the milestone reward text to match the new bonus.",
        "Fixed the heading and body colors of Normal Mode update notes.",
        "Rechecked the active-play route and factory threshold boundaries. Existing resources and purchased levels are retained.",
    ]));
    CHANGELOGS.unshift(normalUpdate("2.070.3", [
        "Normal Mode update headings are orange and body text is white.",
        "Researcher milestone 17 now counts at most 750 Hiawd levels per purchased Factory I level past 18 for its Widget bonus. Existing Hiawd levels no longer grant the full bonus immediately at Factory I level 19.",
        "Kept the six factory-base bonuses at 20 / 22 / 24 / 26 / 28 / 30, each +.07 (max +.42).",
        "Rechecked the opening factory burst and the full active-play route. Existing resources and purchased levels are retained.",
    ]));
}
