// Mod-specific translations of TMT's system tabs. Original components and CSS stay in use.
Vue.mixin({
    methods: { tr: remakeText },
    computed: { modInfo: function () { return modInfo; }, layoutInfo: function () { return layoutInfo; }, TMT_VERSION: function () { return TMT_VERSION; } },
});

systemComponents['overlay-head'].template = `
<div class="overlayThing" style="padding-bottom:7px;width:90%;z-index:1000;position:relative">
    <br><h2 class="overlayThing" id="points">{{format(player.points)}}</h2>
    <span class="overlayThing"> ${modInfo.pointsName}</span><br>
    <span class="overlayThing">(+{{player.paused ? '0.00' : format(tmp.pointGen)}}/s)</span><br>
    <div v-for="thing in tmp.displayThings" class="overlayThing"><span v-html="thing"></span></div>
    <span v-if="player.offTime" class="overlayThing"><br>${remakeText('离线时间', 'Offline time')}: {{formatTime(player.offTime.remain)}}</span>
</div>`;

systemComponents['info-tab'].template = `
<div><h2>${modInfo.name}</h2><br><br><h3>{{VERSION.withName}}</h3><br><br>
The Modding Tree {{TMT_VERSION.tmtNum}} · Acamaeda<br>
The Prestige Tree · Jacorb / Aarex<br>The Tree of Life · pg132<br><br>
${remakeText('重制：tzh391。使用原仓库的 TMT 引擎、层级树与原生组件。', 'Remake by tzh391, using the original repository’s TMT engine, tree and native components.')}<br><br>
${remakeText('当前内容：氢层。后续生命演化层级仍在规划中。', 'Current content: hydrogen. Later evolution layers are planned.')}<br><br>
${remakeText('游戏时长', 'Time played')}: {{formatTime(player.timePlayed)}}<br><br>
<button class="opt" onclick="switchRemakeLanguage()">中文 / English</button>
<br><br><a class="link" href="https://github.com/tzh391/The-Modding-Tree" target="_blank">GitHub</a></div>`;

systemComponents['options-tab'].template = `
<div><h2>${remakeText('设置与存档', 'Settings and saves')}</h2><br><br>
<table><tr>
<td><button class="opt" onclick="save()">${remakeText('保存', 'Save')}</button></td>
<td><button class="opt" onclick="toggleOpt('autosave')">${remakeText('自动保存', 'Autosave')}: {{options.autosave ? 'ON' : 'OFF'}}</button></td>
<td><button class="opt" onclick="hardReset()">${remakeText('硬重置', 'Hard reset')}</button></td>
</tr><tr>
<td><button class="opt" onclick="exportSave()">${remakeText('导出到剪贴板', 'Export to clipboard')}</button></td>
<td><button class="opt" onclick="importSave()">${remakeText('导入存档', 'Import save')}</button></td>
<td><button class="opt" onclick="toggleOpt('offlineProd')">${remakeText('离线生产', 'Offline production')}: {{options.offlineProd ? 'ON' : 'OFF'}}</button></td>
</tr><tr>
<td><button class="opt" onclick="switchTheme()">${remakeText('主题', 'Theme')}: {{getThemeName()}}</button></td>
<td><button class="opt" onclick="toggleOpt('hqTree')">${remakeText('高质量层级树', 'High quality tree')}: {{options.hqTree ? 'ON' : 'OFF'}}</button></td>
<td><button class="opt" onclick="toggleOpt('forceOneTab'); needCanvasUpdate=true">${remakeText('单栏模式', 'Single tab mode')}: {{options.forceOneTab ? 'ON' : 'AUTO'}}</button></td>
</tr><tr>
<td><button class="opt" onclick="showAllSaves()">${remakeText('管理多存档', 'Manage saves')}</button></td>
<td><button class="opt" onclick="player.paused=!player.paused; player.time=Date.now(); save()">{{player.paused ? '${remakeText('继续', 'Resume')}' : '${remakeText('暂停', 'Pause')}'}}</button></td>
<td><button class="opt" onclick="switchRemakeLanguage()">中文 / English</button></td>
</tr></table><saves></saves><br><br>
${remakeText('重制版使用独立 TMT 存档；中英文兼容。', 'The remake uses separate native TMT saves, shared between languages.')}
</div>`;
