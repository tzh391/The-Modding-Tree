/* Native The Modding Tree adapter. Legacy layers remain intact for the life prologue. */
function installNextLayers() {
    "use strict";
    if (layers.hu2) return;
    const state = () => player.hu2.arc;
    const number = x => format(x);
    const panel = text => '<div class="next-panel">' + text + '</div>';
    const objective = () => panel('<span class="next-eyebrow">下一步</span><br>' + NextArc.objective(state()));
    const humanBuyables = {};
    Object.keys(NextArc.skills).forEach((id, i) => {
        const def = NextArc.skills[id];
        humanBuyables[11 + i] = {
            title: def.name,
            cost: () => NextArc.skillCost(state(), id),
            canAfford: () => state().active && state().thoughts.gte(NextArc.skillCost(state(), id)),
            buy() { NextArc.buySkill(state(), id); },
            display: () => '等级 ' + state().levels[id] + '<br><br>' + def.text + '<br><br>花费 ' + number(NextArc.skillCost(state(), id)) + ' 思想',
        };
    });
    addLayer("hu2", {
        name: "人类 · 认知", symbol: "人", color: "#bce8c6", row: 4, position: 0, branches: [], type: "none",
        resource: "人类", startData: () => ({ unlocked: true, points: new Decimal(1), arc: NextArc.createState(), showLifeTree: false }),
        layerShown: true,
        tooltip: () => "人类 · 认知 / 工具 / 合作",
        update(diff) {
            const s = state();
            if (!s.active && (player.pl.biomass.points.gte("1e44000") && hasUpgrade("pl", 45) || player.hu.unlocked)) s.active = true;
            NextArc.tick(s, diff);
            player.hu2.points = s.humans;
            player.r2.points = new Decimal(s.researchers);
            player.lab2.points = new Decimal(NextArc.freeStaff(s));
        },
        buyables: humanBuyables,
        clickables: {
            11: {
                title: "传承知识", canClick: () => state().active && NextArc.prestigeGain(state()).gte(1),
                display: () => '获得 ' + number(NextArc.prestigeGain(state())) + ' 传承<br><br>重置人类、思想与三项技能。<br>保留传承、研究员、研究项目、实验室与全部发现。<br><br>本轮累计思想：' + number(state().runThoughts),
                onClick() { NextArc.prestige(state()); },
                style: { width: "360px", height: "160px", borderRadius: "12px" },
            },
            12: {
                title: "思想自动化", unlocked: () => NextArc.has(state(), "catalyst"), canClick: () => true,
                display: () => state().autoSkills ? "已开启 · 每秒购买各技能一次" : "已关闭 · 点击开启",
                onClick() { state().autoSkills = !state().autoSkills; },
            },
            21: {
                title: "切换生命树", canClick: () => true,
                display: () => player.hu2.showLifeTree ? "显示人类篇的三层进度树" : "查看人类之前的原版生命树",
                onClick() { player.hu2.showLifeTree = !player.hu2.showLifeTree; needCanvasUpdate = true; },
            },
        },
        milestones: {
            1: { requirementDescription: "1 传承 · 认知的火种", done: () => state().insight.gte(1), effectDescription: "每点传承提高人类增长、思想效率与元素产量；购买不会削减等待奖励。" },
            2: { requirementDescription: "3 传承 · 知识的积累", done: () => state().insight.gte(3), effectDescription: "开放研究员。研究员、研究点和实验室均不会被传承重置。" },
            3: { requirementDescription: "实验方法 · 观察世界", done: () => NextArc.has(state(), "observe"), effectDescription: "开放化学实验室，发现氢和氧。" },
            4: { requirementDescription: "催化与稳定 · 共同学习", done: () => NextArc.has(state(), "catalyst"), effectDescription: "开放思想自动化。" },
            5: { requirementDescription: "生命化学 · 本章完成", done: () => NextArc.complete(state()), effectDescription: "完成全部六项研究，五类产物各累计合成 25 份。" },
        },
        tabFormat: {
            "认知": { content: [
                ["display-text", () => '<div class="next-title">生命树 <span>· 人类篇</span></div><p class="next-subtitle">从一次思考，到理解生命的化学。</p>'],
                "main-display", ["display-text", () => '思想 <b>' + number(state().thoughts) + '</b>（+' + number(NextArc.rates(state()).thoughts) + '/秒） · 传承 <b>' + number(state().insight) + '</b><br>人类增长 +' + number(NextArc.rates(state()).humans) + '/秒'],
                "blank", ["display-text", objective], "blank", "buyables", "blank", ["clickable", 11], ["clickable", 12],
            ] },
            "里程碑": { content: ["milestones"] },
            "说明": { content: [
                ["display-text", () => panel('<h2>认知 → 研究 → 生命化学</h2><p>思想用来购买记忆、工具与合作。传承收益由本轮累计产生的思想决定，花费思想不会减少收益。</p><p>3 传承开放研究。传承只重置本轮的人类、思想和三项技能。</p><p>原版生命起点、细胞与植物等前期内容仍可通过左侧生命树查看。人类篇使用独立存档，原版存档不会被自动读取。</p><p><a href="?start=life">从生命起点开始（独立存档）</a> · <a href="?start=human">人类篇试玩存档</a></p>')],
                ["clickable", 21],
            ] },
        },
    });
    const projectButtons = {};
    NextArc.projects.forEach((p, i) => {
        projectButtons[21 + i] = {
            title: p.name,
            unlocked: () => i === 0 || NextArc.has(state(), NextArc.projects[i - 1].id),
            canClick: () => NextArc.canProject(state(), p.id),
            display: () => (NextArc.has(state(), p.id) ? '<b>已完成</b>' : p.cost + ' 研究点') + '<br><br>' + p.text,
            onClick() { NextArc.buyProject(state(), p.id); },
            style: { width: "220px", height: "160px", borderRadius: "12px" },
        };
    });
    addLayer("r2", {
        name: "研究 · 知识", symbol: "研", color: "#b9d7f1", row: 5, position: 0, branches: ["hu2"], type: "none", resource: "研究员",
        startData: () => ({ unlocked: true, points: new Decimal(0) }),
        layerShown: () => NextArc.researchUnlocked(state()),
        clickables: Object.assign({
            11: { title: "培养研究员", canClick: () => NextArc.researchUnlocked(state()) && state().thoughts.gte(NextArc.recruitCost(state())),
                display: () => number(NextArc.recruitCost(state())) + ' 思想<br><br>增加 1 位永久研究员', onClick() { NextArc.recruit(state()); } },
        }, projectButtons),
        tabFormat: ["main-display", ["display-text", () => '研究点 <b>' + number(state().research) + '</b>（+' + number(NextArc.rates(state()).research) + '/秒）<br>思想：' + number(state().thoughts)],
            "blank", ["display-text", objective], "blank", ["clickable", 11], "blank", ["row", [["clickable", 21], ["clickable", 22], ["clickable", 23]]],
            ["row", [["clickable", 24], ["clickable", 25], ["clickable", 26]]]],
    });
    const labButtons = {};
    Object.keys(NextArc.elements).forEach((id, i) => {
        labButtons[11 + i] = {
            title: id + ' · ' + NextArc.elements[id].name,
            unlocked: () => NextArc.elementUnlocked(state(), id), canClick: () => true,
            display: () => '库存 ' + number(state().stock[id]) + '<br>发现等级 ' + formatWhole(NextArc.discoveryLevel(state(), id)) + '<br>岗位 ' + state().allocated[id],
            onClick() { state().selected = id; },
            style: () => ({ width: "108px", height: "116px", borderRadius: "12px", backgroundColor: state().selected === id ? "#f4de9f" : "#d8c7e9" }),
        };
    });
    Object.keys(NextArc.reactions).forEach((id, i) => {
        const def = NextArc.reactions[id];
        labButtons[41 + i] = {
            title: '合成 · ' + def.name, unlocked: () => NextArc.has(state(), def.project),
            canClick: () => NextArc.reactionLimit(state(), id).gte(1),
            display: () => Object.entries(def.inputs).map(([key, amount]) => amount + ' ' + (NextArc.elements[key]?.name || NextArc.reactions[key].name)).join(' + ') + '<br><br>库存 ' + number(state().stock[id]) + ' · 累计 ' + number(state().produced[id]) + '<br>' + def.text,
            onClick() { NextArc.react(state(), id); },
            style: { width: "210px", height: "150px", borderRadius: "12px" },
        };
        labButtons[51 + i] = {
            title: def.name + ' · 自动反应', unlocked: () => NextArc.has(state(), "cycle") && NextArc.has(state(), def.project), canClick: () => true,
            display: () => state().autoReactions.includes(id) ? "已开启 · 每秒最多 1 批" : "已关闭 · 点击开启",
            onClick() { NextArc.toggleReaction(state(), id); }, style: { width: "210px", height: "100px", borderRadius: "12px" },
        };
    });
    Object.assign(labButtons, {
        21: { title: "增加岗位", canClick: () => NextArc.freeStaff(state()) > 0 && NextArc.elementUnlocked(state(), state().selected), display: () => '分配 1 人至 ' + state().selected, onClick() { NextArc.allocate(state(), state().selected, 1); } },
        22: { title: "减少岗位", canClick: () => state().allocated[state().selected] > 0, display: () => '从 ' + state().selected + ' 调回 1 人', onClick() { NextArc.allocate(state(), state().selected, -1); } },
        23: { title: "升级实验设施", canClick: () => state().research.gte(NextArc.facilityCost(state())), display: () => '设施等级 ' + state().facility + '<br><br>' + number(NextArc.facilityCost(state())) + ' 研究点<br>元素产量 ×1.5', onClick() { NextArc.build(state()); } },
    });
    addLayer("lab2", {
        name: "化学 · 实验室", symbol: "化", color: "#d8c7e9", row: 6, position: 0, branches: ["r2"], type: "none", resource: "空闲实验岗位",
        startData: () => ({ unlocked: true, points: new Decimal(0) }), layerShown: () => NextArc.has(state(), "observe"), clickables: labButtons,
        tabFormat: {
            "元素": { content: ["main-display", ["display-text", () => '总岗位 ' + NextArc.staff(state()) + ' · 累计研究增加岗位，最多 24 人<br>研究点 ' + number(state().research)],
                "blank", ["display-text", objective], "blank", ["row", [11, 12, 13, 14, 15, 16].map(id => ["clickable", id])],
                "blank", ["display-text", () => {
                    const s = state(), id = s.selected, rate = NextArc.rates(s).elements.mul(s.allocated[id] * NextArc.elements[id].rate);
                    return panel('<h3>' + id + ' · ' + NextArc.elements[id].name + '</h3><p>库存 ' + number(s.stock[id]) + ' · 产量 ' + number(rate) + '/秒 · 累计生产 ' + number(s.produced[id]) + '</p><p>发现等级 ' + formatWhole(NextArc.discoveryLevel(s, id)) + '，下级需累计 ' + number(Decimal.pow(2, NextArc.discoveryLevel(s, id).add(1)).sub(1).mul(10)) + '。发现永久保留，调动人员与合成都不会降低等级。</p>');
                }], "blank", ["row", [["clickable", 21], ["clickable", 22], ["clickable", 23]]]] },
            "反应": { content: [["display-text", () => panel('<h2>从元素到生命的原料</h2><p>配方使用抽象元素单位，便于生产规划。产物的累计合成量提供永久增益；被其他配方消耗后，增益仍然保留。</p><p>自动反应按水 → 有机前体 → 氨 → 营养盐 → 稳定剂的顺序运行，共享原料不足时会暂停对应反应。</p>')],
                "blank", ["row", [["clickable", 41], ["clickable", 42], ["clickable", 43]]], ["row", [["clickable", 51], ["clickable", 52], ["clickable", 53]]],
                ["row", [["clickable", 44], ["clickable", 45]]], ["row", [["clickable", 54], ["clickable", 55]]], "blank", ["display-text", objective]] },
        },
    });
    // The compatibility tree must use sodium for both halves of the sodium effect.
    layers.tokens.buyables[213].base = function (){
                                if (player.chem.amount.Na.gte(10)) {
                                        let l = player.chem.amount.Na.div(5).log(2).floor()
                                        return new Decimal(1.7).sub(l.div(400)).max(1.2)
                                }
                                if (hasUpgrade("hu", 143)) {
                                        if (hasMilestone("r", 14))              return 1.015
                                        if (hasMilestone("r", 11))              return 1.030 - Math.min(Math.max(0, player.r.times - 20), 10) / 1000
                                                                                return 1.030
                                }
                                if (hasUpgrade("hu", 111))                      return 1.001
                                if (hasUpgrade("hu", 94))                       return 1.002
                                if (hasUpgrade("hu", 92))                       return 1.003
                                if (hasChallenge("hu", 62))                     return 1.004
                                if (hasUpgrade("hu", 85))                       return 1.006
                                if (hasUpgrade("hu", 83))                       return 1.007
                                if (player.hu.challenges[42] >= 2) {
                                        if (hasMilestone("r", 8))               return 1.008
                                        if (player.hu.points.gte("1e59732"))    return 1.008
                                        if (player.hu.points.gte("1e59435"))    return 1.009
                                }
                                if (hasChallenge("hu", 42)) {
                                        if (hasMilestone("r", 8))               return 1.01
                                        if (player.hu.points.gte("1e58925"))    return 1.01
                                }
                                if (hasChallenge("hu", 22))                     return 1.011
                                if (hasMilestone("hu", 97)) {
                                        if (player.hu.points.gte("1e52415"))    return 1.012
                                        if (player.hu.points.gte("1e52253"))    return 1.013
                                        if (player.hu.points.gte("1e52150"))    return 1.014
                                }
                                if (hasMilestone("hu", 92)) {
                                        if (player.hu.points.gte("1e43473"))    return 1.015
                                        if (player.hu.points.gte("1e43135"))    return 1.016
                                        if (player.hu.points.gte("1e42880"))    return 1.017
                                        if (player.hu.points.gte("1e39941"))    return 1.018
                                        if (player.hu.points.gte("1e39629"))    return 1.019
                                        if (player.hu.points.gte("1e39389"))    return 1.020
                                        if (player.hu.points.gte("1e39223"))    return 1.021
                                        if (player.hu.points.gte("1e39052"))    return 1.022
                                }
                                if (hasMilestone("hu", 87)) {
                                        if (player.hu.points.gte("1e35951"))    return 1.023
                                        if (player.hu.points.gte("1e35157"))    return 1.024
                                }
                                if (hasMilestone("hu", 84)) {
                                        let l = player.hu.buyables[33].toNumber()
                                        if (l >= 101)   return 1.025
                                        if (l >= 100)   return 1.026
                                        if (l >= 94)    return 1.027
                                        if (l >= 89)    return 1.028
                                        if (l >= 86)    return 1.029
                                }
                                if (hasMilestone("hu", 80)) {
                                        if (player.hu.points.gte("1e28665"))    return 1.030
                                        if (player.hu.points.gte("1e28389"))    return 1.032
                                        if (player.hu.points.gte("1e28234"))    return 1.034
                                        if (player.hu.points.gte("1e28074"))    return 1.036
                                        if (player.hu.points.gte("1e28045"))    return 1.038
                                }
                                if (hasMilestone("hu", 71)) {
                                        if (player.hu.points.gte("1e21118"))    return 1.040
                                        if (player.hu.points.gte("1e21040"))    return 1.041
                                        if (player.hu.points.gte("1e20968"))    return 1.042
                                        if (player.hu.points.gte("3e20805"))    return 1.043
                                        if (player.hu.points.gte("1e20705"))    return 1.044
                                        if (player.hu.points.gte("3e20678"))    return 1.045
                                }
                                if (hasMilestone("hu", 70)) {
                                        if (player.hu.points.gte("1e19854")) return 1.046
                                        if (player.hu.points.gte("3e19718")) return 1.048
                                        if (player.hu.points.gte("1e19134")) return 1.05
                                }
                                if (hasMilestone("hu", 66))     return 1.06
                                if (hasMilestone("hu", 64)) {
                                        if (player.hu.points.gte("1e11379")) return 1.07
                                        if (player.hu.points.gte("3e11335")) return 1.08
                                        if (player.hu.points.gte("3e11316")) return 1.09
                                        if (player.hu.points.gte("1e11266")) return 1.1
                                }
                                if (hasMilestone("hu", 59)) {
                                        if (player.hu.points.gte("3e9110")) return 1.12
                                        if (player.hu.points.gte("1e9086")) return 1.13
                                        if (player.hu.points.gte("1e9057")) return 1.14
                                        if (player.hu.points.gte("2e9041")) return 1.15
                                }
                                if (hasMilestone("hu", 50)) {
                                        if (player.hu.points.gte("1e5419")) return 1.16
                                        if (player.hu.points.gte("1e5397")) return 1.18
                                        if (player.hu.points.gte("1e5376")) return 1.20
                                        if (player.hu.points.gte("1e5337")) return 1.21
                                        if (player.hu.points.gte("1e4914")) return 1.22
                                        if (player.hu.points.gte("1e4880")) return 1.23
                                        return 1.24
                                }
                                if (hasMilestone("r", 6)) {
                                        if (hasUpgrade("hu", 54)) return 1.26
                                        if (hasUpgrade("hu", 53)) return 1.28
                                        if (hasUpgrade("hu", 52)) return 1.3
                                        if (hasUpgrade("hu", 51)) return 1.35
                                }
                                if (hasUpgrade("hu", 54) && player.hu.points.gte("1e4823"))     return 1.26
                                if (hasUpgrade("hu", 53) && player.hu.points.gte("1e4705"))     return 1.28
                                if (hasUpgrade("hu", 52) && player.hu.points.gte("5e4602"))     return 1.3
                                if (hasUpgrade("hu", 51) && player.hu.points.gte("1e4502"))     return 1.35
                                return 1.4
                        };
    // These IDs and formulas remain available to old lower-layer calculations.
    ["hu", "r", "chem"].forEach(id => { layers[id].layerShown = false; });
    layers["tree-tab"].tabFormat = [["display-text", () => '<div class="next-tree-label">' + (state().active ? '人类篇 · 进度树' : '生命的起点') + '</div>'],
        ["tree", () => state().active && !player.hu2.showLifeTree ? [["hu2"], ["r2"], ["lab2"]] : TREE_LAYERS]];
    layoutInfo.startTab = "hu2";
    VERSION.num = "2.070-next.1";
    VERSION.name = "认知与生命化学";
    VERSION.withoutName = "v" + VERSION.num;
    VERSION.withName = VERSION.withoutName + " · " + VERSION.name;
    const legacyOverlay = systemComponents["overlay-head"].template;
    systemComponents["overlay-head"].template = '<div><div v-if="player.hu2.arc.active" class="next-overlay">' +
        '<span class="next-badge">EVOLUTION NEXT · 0.1</span><h2>认知与生命化学</h2>' +
        '<p>传承 {{format(player.hu2.arc.insight)}} · 研究员 {{formatWhole(player.hu2.arc.researchers)}}</p>' +
        '<p v-if="player.offTime && player.offTime.remain > 0">离线进度 {{formatTime(player.offTime.remain)}}</p>' +
        '</div><div v-else>' + legacyOverlay + '</div></div>';
    isEndgameRaw = function () { return !!player.hu2 && NextArc.complete(state()); };
    // Completion remains an in-game milestone so a player can keep experimenting.
    isEndgame = function () { return false; };
    displayThings = [() => '<span class="next-badge">EVOLUTION NEXT · 0.1</span>'];
}
