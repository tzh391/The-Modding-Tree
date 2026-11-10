/* Extend Chemistry and apply the preview's documented Researcher balance and QoL. */
function installChemistryContinuation() {
    if (layers.chem.continuationInstalled) return;
    layers.chem.continuationInstalled = true;
    const chem = layers.chem;
    const oldStart = chem.startData;
    chem.startData = function () {
        const data = oldStart();
        data.chemUnlocks.period4 = false;
        data.autoEarly = false;
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
    const level = (id, best) => ChemistryQoL.level(id, best);
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
                if (i === 0) return hasMilestone("r", 18) && player.r.buyables[23].gte(3) && player.r.best.gte(1e20);
                return hasUpgrade("chem", id - 1) && player.r.best.gte(cost[i]) &&
                    (i === 1 ? level("K", true).gte(46) : i === 2 ? level("Ca", true).gte(49) : level("K", true).gte(i === 3 ? 51 : 54) && level("Ca", true).gte(i === 3 ? 51 : 54));
            },
            unlockHint() {
                if (i === 0) return "Researcher milestone 18, 3 Factory VI levels, and " + format(cost[i]) + " best Researchers";
                return "Chemistry " + ["I", "II", "III", "IV"][i - 1] + ", " + format(cost[i]) + " best Researchers, and " +
                    (i === 1 ? "46 best Potassium levels" : i === 2 ? "49 best Calcium levels" : (i === 3 ? "51" : "54") + " best levels in both Potassium and Calcium");
            },
            onPurchase() { if (id === 11) player.chem.chemUnlocks.period4 = true; },
        };
    }
    chem.milestones = {
        1: { requirementDescription: () => "50 best Potassium levels", done: () => level("K", true).gte(50), unlocked: () => hasUpgrade("chem", 11), effectDescription: () => "Reward: Double worker speed." },
        2: { requirementDescription: () => "52 best Calcium and 51 best Potassium levels", done: () => level("Ca", true).gte(52) && level("K", true).gte(51), unlocked: () => hasMilestone("chem", 1), effectDescription: () => "Reward: Double scientist speed." },
        3: { requirementDescription: () => "55 best Potassium and Calcium levels and Chemistry V", done: () => level("K", true).gte(55) && level("Ca", true).gte(55) && hasUpgrade("chem", 15), unlocked: () => hasMilestone("chem", 1) && hasMilestone("chem", 2), effectDescription: () => "Reward: Halve element decay after Sulfur's effect." },
        4: { requirementDescription: () => "20 total Chemists (QoL)", done: () => player.chem.total.gte(20), unlocked: () => player.chem.unlocked, effectDescription: () => "Reward: Unlock worker and scientist assignment sliders. The existing +1/-1 controls remain available." },
        5: { requirementDescription: () => "40 total Chemists (QoL)", done: () => player.chem.total.gte(40), unlocked: () => player.chem.unlocked, effectDescription: () => "Reward: Unlock optional full staffing for the first 10 elements (H–Ne). Each uses all Chemists as effective workers and scientists without consuming the manual staff pool." },
    };
    const oldFix = fixOldSave;
    fixOldSave = function (oldVersion) {
        oldFix(oldVersion);
        player.chem.milestones = player.chem.milestones.filter(id => ![1,2,3].includes(Number(id)) || chem.milestones[id].done());
        if (player.r.buyables[11].lt(22)) player.r.milestones = player.r.milestones.filter(id => Number(id) !== 17);
    };
    for (const id of [11,12,13,14]) {
        const oldCanClick = chem.clickables[id].canClick;
        chem.clickables[id].canClick = function () { return !ChemistryQoL.autoManaged(player.chem.focus) && oldCanClick(); };
        const oldDisplay = chem.clickables[id].display;
        chem.clickables[id].display = function () { return ChemistryQoL.autoManaged(player.chem.focus) ? "Automatic full staffing" + br + "Currently: " + formatWhole(player.chem.total) + " effective " + (id < 13 ? "workers" : "scientists") : oldDisplay(); };
    }
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
        const auto = ChemistryQoL.earlyElements.filter(id => ChemistryQoL.autoManaged(id));
        const before = auto.map(id => ({id, amount:player.chem.amount[id], buildings:player.chem.buildings[id]}));
        const totalStaff = player.chem.total.floor();
        if (auto.length) ChemistryQoL.releaseEarlyStaff();
        oldBuildingUpdate(diff);
        for (const state of before) {
            const id = state.id, data = player.chem;
            data.buildingProgress[id] = data.buildingProgress[id].plus(totalStaff.times(tmp.chem.buildings.getWorkerMultiplier).times(diff));
            const gain = totalStaff.times(tmp.chem.buildings.getScientistMultiplier).times(state.buildings.times(Decimal.pow(1.1,state.buildings)));
            data.amount[id] = getLogisticAmount(state.amount,gain,tmp.chem.buildings.getDecay,diff);
            data.best_amount[id] = data.best_amount[id].max(data.amount[id]);
            if (data.buildingProgress[id].gte(10)) data.buildings[id] = data.buildings[id].max(data.buildingProgress[id].div(10).log(3).floor().plus(1));
        }
        if (auto.includes("N")) {
            const base = hasMilestone("r",14) ? 2 : 4;
            const target = player.chem.best_amount.N.div(5).max(1).log(base).floor().plus(1).max(player.chem.total);
            const recruited = target.sub(player.chem.total);
            player.chem.total = player.chem.total.plus(recruited);
            player.chem.points = player.chem.points.plus(recruited);
        }
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
    contents.splice(contents.indexOf("chem-details") + 1, 0, "blank", "chem-assignment-sliders");
    contents.push(["display-text", function () {
        if (!hasUpgrade("chem", 11)) return '<small class="unlock-hint">Next elements: Potassium and Calcium — unlock with Chemistry I at 1e20 Researchers, after Researcher milestone 18 and 3 Factory VI levels.</small>';
        return "";
    }]);
    const info = chem.tabFormat.Info.content;
    info.push("blank", ["display-text", function () {
        let text = "<small class='unlock-hint'>Continuation preview. Original saves can be imported through Options.</small>";
        if (hasUpgrade("chem", 11)) text += br2 + displayChemInitialEffect("K") + br + displayChemInitialEffect("Ca");
        return text + br2 + "Current endgame: Chemistry V, 55 best Potassium and Calcium levels, and 1e24 Researchers.";
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
        return player.hu.buyables[13].sub(14000).max(0).min(player.r.buyables[11].floor().sub(21).max(0).times(750));
    };
    layers.r.widgets.getResetGain = function () {
        let ret = player.r.amounts[11].plus(1).times(tmp.r.buyables[11].effect);
        if (hasUpgrade("r", 14)) ret = ret.times(Decimal.pow(2, player.r.upgrades.length));
        if (hasMilestone("r",16)) ret = ret.times(Decimal.pow(1.5,player.r.buyables[11].floor().sub(18).max(0).min(3)));
        if (hasMilestone("r", 17)) ret = ret.times(Decimal.pow(1.001, layers.r.widgets.getMilestone17Levels()));
        return ret;
    };
    // This shared base is exponentiated by purchased levels across the factory chain.
    // Stagger six base bonuses at the revised thresholds, with a combined cap of .42.
    const oldFactoryMilestone16Text = layers.r.milestones[16].effectDescription;
    layers.r.milestones[16].effectDescription = function () { return oldFactoryMilestone16Text() + " Factory I levels 19–21 each multiply Widget gain by 1.5 (max x3.375)."; };
    layers.r.milestones[17].requirementDescription = () => "22 Factory<sup>1</sup> levels";
    layers.r.milestones[17].done = () => player.r.buyables[11].gte(22);
    layers.r.milestones[17].effectDescription = function () {
        return "Reward: <i>Hiawd</i> levels past 14,000 multiply Widget gain by 1.001, counting at most 750 Hiawd levels per purchased Factory<sup>1</sup> level past 21. Mastery VI double exponent is .1, and at 24 / 27 / 30 / 33 / 36 / 39 Factory<sup>1</sup> levels, add .07 to the multiplier per factory (max +.42).";
    };
    layers.r.buyables.getBaseMult = function () {
        let ret = new Decimal(2);
        if (hasMilestone("r", 16)) ret = ret.plus(player.r.milestones.length / 100);
        if (hasMilestone("r", 17)) {
            for (const threshold of [24, 27, 30, 33, 36, 39]) if (player.r.buyables[11].gte(threshold)) ret = ret.plus(.07);
        }
        if (hasMilestone("r", 18)) ret = ret.plus(player.r.buyables[23].min(10).times(.04));
        return ret;
    };
    VERSION.num = "2.070.4";
    VERSION.name = "Chemistry Progression and Automation";
    VERSION.withoutName = "v" + VERSION.num;
    VERSION.withName = VERSION.withoutName + ": " + VERSION.name;
    CHANELOG_VERSION = "v2.070.4";
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
    CHANGELOGS.unshift(normalUpdate("2.070.4", [
        "Placed Potassium below Sodium and Calcium below Magnesium in the periodic table.",
        "Raised and staggered Chemistry upgrade and milestone targets. The endpoint now requires Chemistry V, 55 best K/Ca levels, and 1e24 Researchers.",
        "40 total Chemists unlock optional automatic full staffing of H–Ne. Manual staff in these elements are returned to the free pool when enabled.",
        "Factory I levels 19–21 now provide a small Widget ramp, x1.5 per level (max x3.375). Chemistry I requires 3 Factory VI levels after Researcher milestone 18.",
        "Moved Researcher milestone 17 to 22 Factory I levels and its six base bonuses to 24 / 27 / 30 / 33 / 36 / 39. The Hiawd allowance now starts above 21 purchased levels.",
        "Revalidate free Chemistry milestones against their new requirements on update; preserve resources, buildings, and purchased upgrades.",
        "Added a local-file import option that opens the save in a separate slot and keeps existing saves.",
        "Audit both long waits and clustered progression, including a supplied late-Chemistry reference save.",
    ]));
}
