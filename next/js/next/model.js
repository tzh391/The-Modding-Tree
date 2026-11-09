/* Human -> research -> chemistry. Pure simulation shared by the native UI and tests. */
(function (root) {
    "use strict";
    const D = x => new Decimal(x);
    const elements = {
        H: { name: "氢", rate: 3, project: null },
        O: { name: "氧", rate: 2, project: null },
        C: { name: "碳", rate: 1.5, project: "atom" },
        N: { name: "氮", rate: 1.5, project: "life" },
        P: { name: "磷", rate: 1, project: "cycle" },
        S: { name: "硫", rate: 1, project: "catalyst" },
    };
    const skills = {
        memory: { name: "记忆", base: 10, scaling: 1.65, text: "每级使思想产量 ×1.6" },
        tools: { name: "工具", base: 25, scaling: 1.75, text: "提高人类增长速度" },
        cooperation: { name: "合作", base: 80, scaling: 1.85, text: "每级使思想产量 ×1.3，并提高研究效率" },
    };
    const projects = [
        { id: "observe", name: "实验方法", cost: 50, text: "开放实验室，获得 3 个实验岗位；研究氢和氧。" },
        { id: "atom", name: "物质结构", cost: 200, text: "发现碳，开放有机前体合成。" },
        { id: "life", name: "生命的原料", cost: 600, text: "发现氮，开放氨的合成。" },
        { id: "cycle", name: "营养循环", cost: 1500, text: "发现磷，开放营养盐合成与自动反应。" },
        { id: "catalyst", name: "催化与稳定", cost: 4000, text: "发现硫，开放稳定剂；获得思想购买自动化。" },
        { id: "synthesis", name: "生命化学", cost: 10000, text: "完成理论研究；五类产物各累计 25 份即可完成本章。" },
    ];
    // Abstract element units, not balanced molecular equations.
    const reactions = {
        water: { name: "水", inputs: { H: 2, O: 1 }, project: "observe", text: "累计产量提高人类增长" },
        organic: { name: "有机前体", inputs: { C: 1, H: 2, O: 1 }, project: "atom", text: "累计产量提高思想产量" },
        ammonia: { name: "氨", inputs: { N: 1, H: 3 }, project: "life", text: "累计产量提高研究产量" },
        nutrient: { name: "营养盐", inputs: { P: 1, O: 2, water: 1 }, project: "cycle", text: "累计产量提高元素产量" },
        stabilizer: { name: "稳定剂", inputs: { S: 1, water: 1 }, project: "catalyst", text: "累计产量提高研究产量" },
    };
    function createState(active = false) {
        return {
            schema: 1, active, humans: D(1), thoughts: D(0), lifetimeThoughts: D(0), runThoughts: D(0),
            insight: D(0), resets: 0, levels: { memory: 0, tools: 0, cooperation: 0 },
            researchers: 0, research: D(0), lifetimeResearch: D(0), projects: [], facility: 0,
            allocated: Object.fromEntries(Object.keys(elements).map(id => [id, 0])),
            stock: Object.fromEntries([...Object.keys(elements), ...Object.keys(reactions)].map(id => [id, D(0)])),
            produced: Object.fromEntries([...Object.keys(elements), ...Object.keys(reactions)].map(id => [id, D(0)])),
            autoReactions: [], autoSkills: false, autoClock: 0, selected: "H", elapsed: 0,
        };
    }
    function has(s, id) { return s.projects.includes(id); }
    function researchUnlocked(s) { return s.active && s.insight.gte(3); }
    function skillCost(s, id) {
        const def = skills[id];
        return def ? D(def.base).mul(Decimal.pow(def.scaling, s.levels[id])) : D(Infinity);
    }
    function buySkill(s, id) {
        if (!s.active || !skills[id]) return false;
        const cost = skillCost(s, id);
        if (s.thoughts.lt(cost)) return false;
        s.thoughts = s.thoughts.sub(cost); s.levels[id]++;
        return true;
    }
    function prestigeGain(s) { return s.runThoughts.div(1500).sqrt().floor(); }
    function prestige(s) {
        const gain = prestigeGain(s);
        if (!s.active || gain.lt(1)) return false;
        s.insight = s.insight.add(gain); s.resets++;
        s.humans = D(1); s.thoughts = D(0); s.runThoughts = D(0);
        s.levels = { memory: 0, tools: 0, cooperation: 0 };
        return true;
    }
    function recruitCost(s) { return D(500).mul(Decimal.pow(2, s.researchers)); }
    function recruit(s) {
        const cost = recruitCost(s);
        if (!researchUnlocked(s) || s.thoughts.lt(cost)) return false;
        s.thoughts = s.thoughts.sub(cost); s.researchers++;
        return true;
    }
    function canProject(s, id) {
        const i = projects.findIndex(p => p.id === id), p = projects[i];
        return !!p && researchUnlocked(s) && !has(s, id) && (i === 0 || has(s, projects[i - 1].id)) && s.research.gte(p.cost);
    }
    function buyProject(s, id) {
        if (!canProject(s, id)) return false;
        s.research = s.research.sub(projects.find(p => p.id === id).cost); s.projects.push(id);
        if (id === "observe") { s.allocated.H = 1; s.allocated.O = 1; }
        return true;
    }
    function staff(s) { return has(s, "observe") ? 3 + Math.min(21, s.lifetimeResearch.div(150).sqrt().floor().toNumber()) : 0; }
    function freeStaff(s) { return staff(s) - Object.values(s.allocated).reduce((a, b) => a + b, 0); }
    function elementUnlocked(s, id) { return !!elements[id] && has(s, "observe") && (!elements[id].project || has(s, elements[id].project)); }
    function allocate(s, id, delta) {
        if (!elementUnlocked(s, id) || !Number.isInteger(delta) || delta === 0) return false;
        if (delta > 0 && freeStaff(s) < delta || delta < 0 && s.allocated[id] < -delta) return false;
        s.allocated[id] += delta; return true;
    }
    function facilityCost(s) { return D(25).mul(Decimal.pow(3, s.facility)); }
    function build(s) {
        const cost = facilityCost(s);
        if (!has(s, "observe") || s.research.lt(cost)) return false;
        s.research = s.research.sub(cost); s.facility++; return true;
    }
    function discoveryLevel(s, id) { return s.produced[id].div(10).add(1).log2().floor(); }
    function buff(s, id) { return s.produced[id].sqrt().div(10).add(1); }
    function rates(s) {
        const insight = s.insight.mul(.25).add(1);
        return {
            humans: D(.06).mul(Math.pow(1 + s.levels.tools, 1.5)).mul(insight).mul(buff(s, "water")),
            thoughts: s.humans.mul(Decimal.pow(1.6, s.levels.memory)).mul(Decimal.pow(1.3, s.levels.cooperation)).mul(insight.sqrt()).mul(buff(s, "organic")),
            research: D(s.researchers).mul(1 + s.levels.cooperation * .08).mul(insight.sqrt()).mul(buff(s, "ammonia")).mul(buff(s, "stabilizer")),
            elements: Decimal.pow(1.5, s.facility).mul(s.insight.mul(.1).add(1)).mul(buff(s, "nutrient")),
        };
    }
    function reactionLimit(s, id) {
        const def = reactions[id];
        if (!def || !has(s, def.project)) return D(0);
        let limit = D(Infinity);
        for (const [input, count] of Object.entries(def.inputs)) limit = limit.min(s.stock[input].div(count).floor());
        return limit.max(0);
    }
    function react(s, id, batches = 1) {
        if (!Number.isSafeInteger(batches) || batches <= 0 || reactionLimit(s, id).lt(batches)) return false;
        for (const [input, count] of Object.entries(reactions[id].inputs)) s.stock[input] = s.stock[input].sub(count * batches);
        s.stock[id] = s.stock[id].add(batches); s.produced[id] = s.produced[id].add(batches);
        return true;
    }
    function toggleReaction(s, id) {
        if (!has(s, "cycle") || !reactions[id] || !has(s, reactions[id].project)) return false;
        if (s.autoReactions.includes(id)) s.autoReactions = s.autoReactions.filter(x => x !== id);
        else s.autoReactions.push(id);
        return true;
    }
    function tick(s, seconds) {
        if (!s.active || !Number.isFinite(seconds) || seconds <= 0) return;
        let remaining = Math.min(seconds, 3600);
        while (remaining > 1e-8) {
            const dt = Math.min(1, remaining), r = rates(s);
            s.humans = s.humans.add(r.humans.mul(dt));
            const thoughtGain = r.thoughts.mul(dt), researchGain = r.research.mul(dt);
            s.thoughts = s.thoughts.add(thoughtGain); s.runThoughts = s.runThoughts.add(thoughtGain);
            s.lifetimeThoughts = s.lifetimeThoughts.add(thoughtGain);
            s.research = s.research.add(researchGain); s.lifetimeResearch = s.lifetimeResearch.add(researchGain);
            for (const [id, def] of Object.entries(elements)) {
                if (!elementUnlocked(s, id)) continue;
                const gain = r.elements.mul(s.allocated[id] * def.rate * dt);
                s.stock[id] = s.stock[id].add(gain); s.produced[id] = s.produced[id].add(gain);
            }
            s.autoClock += dt;
            if (s.autoClock >= 1) {
                s.autoClock -= 1;
                // Stable recipe order makes shared-input shortages predictable.
                for (const id of Object.keys(reactions)) if (s.autoReactions.includes(id) && has(s, "cycle")) react(s, id);
                if (s.autoSkills && has(s, "catalyst")) for (const id of Object.keys(skills)) buySkill(s, id);
            }
            s.elapsed += dt; remaining -= dt;
        }
    }
    function complete(s) { return has(s, "synthesis") && Object.keys(reactions).every(id => s.produced[id].gte(25)); }
    function objective(s) {
        if (!s.active) return "生命起点：获得植物层第 45 个升级并积累 1e44,000 生物质，开启人类篇。";
        if (s.insight.lt(3)) return "认知阶段：购买记忆、工具和合作。累计 1,500 本轮思想可传承，积累 3 传承以开放研究。";
        if (!s.researchers) return "知识阶段：用 500 思想培养首位研究员。";
        const next = projects.find(p => !has(s, p.id));
        if (next) return "研究目标：" + next.name + "（" + next.cost + " 研究点） · " + next.text;
        if (!complete(s)) return "应用目标：水、有机前体、氨、营养盐、稳定剂各累计合成 25 份。";
        return "本章完成！你已建立从认知、研究到生命化学的生产循环。可以继续积累，或尝试不同人员配置。";
    }
    root.NextArc = { elements, skills, projects, reactions, createState, has, researchUnlocked, skillCost, buySkill,
        prestigeGain, prestige, recruitCost, recruit, canProject, buyProject, staff, freeStaff, elementUnlocked,
        allocate, facilityCost, build, discoveryLevel, rates, reactionLimit, react, toggleReaction, tick, complete, objective };
})(typeof globalThis === "undefined" ? this : globalThis);
