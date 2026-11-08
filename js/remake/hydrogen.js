// Native TMT layer: resource quantities live in player.h as Decimals.
function readHydrogen() {
    var h = player.h;
    return { atoms: h.points.toNumber(), molecules: h.molecules.toNumber(),
        captured: h.total.toNumber(), formed: h.formed.toNumber(),
        heat: h.heat, allocation: Number(h.allocation) / 100,
        pulseCooldown: h.pulseCooldown, elapsed: h.elapsed,
        completed: h.cloudComplete, paused: player.paused };
}
function writeHydrogen(s) {
    var h = player.h;
    h.points = new Decimal(s.atoms); h.molecules = new Decimal(s.molecules);
    h.total = new Decimal(s.captured); h.formed = new Decimal(s.formed);
    h.best = h.best.max(h.points); h.heat = s.heat;
    h.pulseCooldown = s.pulseCooldown; h.elapsed = s.elapsed;
    h.cloudComplete = s.completed;
}
function hydrogenReadout() {
    var h = player.h, r = HydrogenSimulation.rates(readHydrogen());
    return '<h2 style="color:#a3e8c1">' + format(h.points) + ' H</h2> · ' + remakeText('游离氢原子', 'free hydrogen atoms') + '<br><br>' +
        '<h2 style="color:#c3e7ff">' + format(h.molecules) + ' H₂</h2> · ' + remakeText('氢分子', 'hydrogen molecules') + '<br><br>' +
        remakeText('采集', 'Collection') + ': +' + format(player.paused ? 0 : r.capture) + '/s · ' +
        remakeText('成键', 'Bonding') + ': +' + format(player.paused ? 0 : r.synthesis) + ' H₂/s<br><br>' +
        remakeText('功率分配：采集 ', 'Power: collection ') + formatWhole(Number(h.allocation)) + '% / ' + remakeText('成键 ', 'bonding ') + formatWhole(100 - Number(h.allocation)) + '%<br>' +
        remakeText('成键效率', 'Bonding efficiency') + ': ' + formatWhole(r.efficiency * 100) + '%';
}
function hydrogenPreset(value, zh, en) {
    return {
        title: remakeText(zh, en),
        display: remakeText('采集 ', 'Collection ') + value + '%<br>' + remakeText('成键 ', 'Bonding ') + (100 - value) + '%',
        canClick: function () { return !player.paused; },
        onClick: function () { player.h.allocation = value; save(); },
        style: function () { return { width: '130px', height: '100px', 'border-color': Number(player.h.allocation) === value ? '#ffffff' : '#678875' }; },
    };
}
var hydrogenTabs = {};
hydrogenTabs[remakeText('反应舱', 'Reactor')] = { content: [
    ['display-text', function () { return '<h2>' + remakeText('氢 · 生命演化的起点', 'Hydrogen · The beginning of life’s journey') + '</h2><br><br>' + remakeText('聚集氢原子，分配功率，让两个 H 结合成一个 H₂。', 'Gather atoms and balance power to combine two H into one H₂.'); }],
    'blank', ['display-text', hydrogenReadout], 'blank',
    ['display-text', remakeText('分配采集功率（其余功率用于成键）', 'Allocate collection power; the remainder powers bonding')],
    ['slider', ['allocation', 0, 100]], 'blank',
    ['clickables', [1]], 'blank', ['bar', 'heat'], 'blank',
    ['display-text', function () { return player.h.heat > 72 ? remakeText('舱温较高。降低采集功率后，舱体会自然冷却。', 'The chamber is hot. Lower collection power to let it cool.') : remakeText('高采集功率会升温；较低温度有利于成键。', 'High collection power raises heat; cooler conditions favor bonding.'); }],
    'blank', ['bar', 'cloud'], 'blank', ['clickables', [2]], 'blank',
] };
hydrogenTabs[remakeText('观测', 'Observations')] = { content: [
    ['display-text', function () {
        var h = player.h, notes = [];
        if (h.total.gte(8)) notes.push(remakeText('原子聚集：累计采集了 8 个氢原子。', 'Gathering atoms: captured at least 8 hydrogen atoms.'));
        if (h.formed.gte(1)) notes.push(remakeText('第一次成键：H₂ 已经出现。', 'The first bond: H₂ has formed.'));
        if (h.cloudComplete) notes.push(remakeText('稳定分子云：32 H₂ 已封存。', 'Stable molecular cloud: 32 H₂ preserved.'));
        return '<h2>' + remakeText('观察手记', 'Field notes') + '</h2><br><br>' + (notes.length ? notes.join('<br><br>') : remakeText('继续观测，新的发现会记录在这里。', 'Keep observing. New discoveries will be recorded here.'));
    }],
] };
hydrogenTabs[remakeText('说明', 'Guide')] = { content: [
    ['display-text', remakeText(
        '目标：积累 32 H₂ 并形成分子云。<br><br>捕获脉冲可选：获得 4 H，温度 +8，冷却 4 秒。<br>采集功率越高，流入越快、舱温越高；成键功率越高，结合容量越大。<br>没有足够氢原子时，实际成键速率会受到原料限制。<br><br>本版使用原仓库 The Modding Tree 引擎。设置齿轮提供原生存档、导入导出、多存档与主题。<br>后续生命、细胞、组织、器官、人类层尚未开放。<br><br>数值与反应环境为玩法抽象，观察记录不提供额外倍率。',
        'Goal: gather 32 H₂ and form a molecular cloud.<br><br>Optional capture pulse: +4 H, +8 heat, four-second cooldown.<br>More collection power increases inflow and heat. More bonding power increases reaction capacity.<br>Actual bonding is limited by available atoms.<br><br>This mod uses the original repository’s The Modding Tree engine. The settings gear opens native saves, import/export, multiple saves and themes.<br>Life, cells, tissues, organs and humans are future layers.<br><br>Quantities and reaction conditions are game abstractions. Field notes grant no extra multipliers.'
    )],
] };

addLayer('h', {
    name: remakeText('氢', 'Hydrogen'), symbol: 'H', color: '#a3e8c1', row: 0, position: 0,
    resource: remakeText('游离氢原子', 'free hydrogen atoms'), type: 'none',
    startData: function () { return {
        unlocked: true, points: new Decimal(0), best: new Decimal(0), total: new Decimal(0),
        molecules: new Decimal(0), formed: new Decimal(0), heat: 18, allocation: 60,
        pulseCooldown: 0, elapsed: 0, cloudComplete: false,
    }; },
    layerShown: true,
    tooltip: function () { return format(player.h.points) + ' H · ' + format(player.h.molecules) + ' H₂'; },
    update: function (diff) { var s = readHydrogen(); HydrogenSimulation.advance(s, diff); writeHydrogen(s); },
    tabFormat: hydrogenTabs,
    clickables: {
        11: {
            title: remakeText('捕获脉冲', 'Capture pulse'),
            display: function () { return '+4 H · ' + remakeText('温度', 'Heat') + ' +8<br>' + (player.h.pulseCooldown > 0 ? format(player.h.pulseCooldown, 1) + 's' : remakeText('准备就绪', 'Ready')); },
            canClick: function () { return !player.paused && player.h.pulseCooldown <= 0; },
            onClick: function () { var s = readHydrogen(); if (HydrogenSimulation.pulse(s)) { writeHydrogen(s); player.points = player.points.add(4); save(); } },
            style: { width: '130px', height: '100px' },
        },
        12: hydrogenPreset(85, '聚集', 'Gather'),
        13: hydrogenPreset(50, '平衡', 'Balance'),
        14: hydrogenPreset(20, '结合', 'Bond'),
        21: {
            title: function () { return player.h.cloudComplete ? remakeText('分子云已形成', 'Cloud formed') : remakeText('形成分子云', 'Form cloud'); },
            display: remakeText('消耗 32 H₂<br>完成氢层', 'Use 32 H₂<br>Complete the hydrogen layer'),
            canClick: function () { return !player.paused && !player.h.cloudComplete && player.h.molecules.gte(HydrogenSimulation.CLOUD_COST); },
            onClick: function () { var s = readHydrogen(); if (HydrogenSimulation.formCloud(s)) { writeHydrogen(s); save(); } },
            style: { width: '180px', height: '110px' },
        },
        22: {
            title: function () { return player.paused ? remakeText('继续', 'Resume') : remakeText('暂停', 'Pause'); },
            display: remakeText('暂停生产与冷却', 'Pause production and cooldown'), canClick: true,
            onClick: function () { player.paused = !player.paused; player.time = Date.now(); save(); },
            style: { width: '130px', height: '110px' },
        },
        23: {
            title: '中文 / English', display: remakeText('切换为英文', 'Switch to Chinese'), canClick: true,
            onClick: switchRemakeLanguage, style: { width: '130px', height: '110px' },
        },
    },
    bars: {
        heat: { direction: RIGHT, width: 300, height: 25,
            progress: function () { return player.h.heat / 100; },
            display: function () { return remakeText('舱温', 'Heat') + ': ' + formatWhole(player.h.heat) + ' / 100'; },
            fillStyle: { 'background-color': '#d7a65e' }, textStyle: { color: '#ffffff' },
        },
        cloud: { direction: RIGHT, width: 300, height: 30,
            progress: function () { return player.h.cloudComplete ? 1 : player.h.molecules.div(32).min(1); },
            display: function () { return player.h.cloudComplete ? remakeText('分子云已形成', 'Molecular cloud formed') : 'H₂: ' + format(player.h.molecules.min(32), 1) + ' / 32'; },
            fillStyle: { 'background-color': '#4e8d74' }, textStyle: { color: '#ffffff' },
        },
    },
});
