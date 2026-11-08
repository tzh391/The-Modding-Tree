// A mod for the repository's original The Modding Tree engine.
var remakeLocale = REMAKE_DEFAULT_LOCALE;
try {
    var requestedLocale = new URLSearchParams(window.location.search).get('lang');
    var preferredLocale = localStorage.getItem('tree_of_life_remake_tmt_locale');
    if (['zh', 'en'].includes(requestedLocale)) remakeLocale = requestedLocale;
    else if (['zh', 'en'].includes(preferredLocale)) remakeLocale = preferredLocale;
} catch (_) { /* Default language works without a preference. */ }

function remakeText(zh, en) { return remakeLocale === 'zh' ? zh : en; }
document.documentElement.lang = remakeLocale === 'zh' ? 'zh-CN' : 'en';

let modInfo = {
    name: remakeText('生命树重制版', 'The Tree of Life Remake'),
    id: 'tree_of_life_remake_tmt',
    author: 'tzh391 · based on pg132 / Acamaeda',
    pointsName: remakeText('累计采集氢原子', 'hydrogen atoms captured'),
    modFiles: ['remake/hydrogen.js', 'remake/tree.js'],
    discordName: '', discordLink: '',
    initialStartPoints: new Decimal(0), offlineLimit: 4,
};
var VERSION = { num: '0.2.0', name: remakeText('原生 TMT · 氢的起点', 'Native TMT · Hydrogen') };
var CHANELOG_VERSION = 'v0.2.0';
var CHANGELOGS = [remakeText(
    'v0.2.0：使用原仓库 The Modding Tree 引擎。氢层采用原生层级、按钮、滑块、进度条与存档。',
    'v0.2.0: Uses the original repository’s The Modding Tree engine, native layers, clickables, slider, bars and saves.'
)];
var winText = remakeText('你形成了第一片稳定分子云！氢层原型已完成。', 'You formed the first stable molecular cloud! The hydrogen prototype is complete.');
var doNotCallTheseFunctionsEveryTick = [];
var backgroundStyle = {};
var shiftDown = false, controlDown = false;
var CUSTOM_SAVES = {}, CUSTOM_SAVES_IDS = [], CUSTOM_SAVE_IDS = [];

function getStartPoints() { return new Decimal(0); }
function canGenPoints() { return true; }
function getPointGen() { return player && player.h ? new Decimal(HydrogenSimulation.rates(readHydrogen()).capture) : new Decimal(0); }
function maxTickLength() { return 3600; }
function addedPlayerData() { return {
    paused: false, lastSave: Date.now(), shiftAlias: false, controlAlias: false,
    CHANGELOG_PAGE: 0, saveMenuOpen: false,
}; }
var displayThings = [function () {
    return player.paused ? remakeText('游戏已暂停', 'The game is paused') :
        remakeText('氢 → 分子网络 → 生命 → 细胞 → 组织 → 器官 → 人类', 'Hydrogen → molecules → life → cells → tissues → organs → humans');
}];
function isEndgame() { return !!(player && player.h && player.h.cloudComplete); }
function isEndgameRaw() { return isEndgame(); }
function checkWordData() { return false; } // This fork's optional word minigame is not part of the remake.
function fixOldSave() { /* Uses a separate native TMT save ID. */ }

function switchRemakeLanguage() {
    save();
    var locale = remakeLocale === 'zh' ? 'en' : 'zh';
    localStorage.setItem('tree_of_life_remake_tmt_locale', locale);
    var url = new URL(window.location.href);
    url.searchParams.set('lang', locale);
    window.location.href = url.href;
}
