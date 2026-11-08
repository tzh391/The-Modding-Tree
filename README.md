# Tree of Life Remake / 生命树重制版

A **native The Modding Tree mod** built on this repository's existing TMT 2.6.6.2 engine. The root page uses the original Vue runtime, engine loop, layer tree, components, CSS and save manager.

这是使用原仓库 **The Modding Tree 模组框架** 的生命树重制版。首页保留原生层级树、黑色界面、标签页、按钮、滑块、进度条、设置与多存档系统。

- 中文分支：[remake-zh](https://github.com/tzh391/The-Modding-Tree/tree/remake-zh)
- English branch: [remake-en](https://github.com/tzh391/The-Modding-Tree/tree/remake-en)

## Run / 运行

No dependency installation or build is required. With Python 3 installed, run from the repository root:

无需安装依赖或构建；在仓库目录执行：

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173). `npm start` runs the same server.

- 中文：[http://127.0.0.1:4173/?lang=zh](http://127.0.0.1:4173/?lang=zh)
- English: [http://127.0.0.1:4173/?lang=en](http://127.0.0.1:4173/?lang=en)
- Original evolution mod / 原版游戏：[legacy.html](legacy.html)

Serve the game over HTTP. Do not open `index.html` as a `file:` URL.

## Hydrogen layer / 氢层

The first layer is registered using `addLayer("h", ...)`. Collect hydrogen, allocate collection/bonding power, manage heat, form H₂ and spend 32 H₂ to create the first molecular cloud. Completion uses TMT's native endgame screen and Keep Going control. Later evolution layers are planned, not implemented.

第一层通过 `addLayer("h", ...)` 注册。玩法：自动采集氢 → 分配采集/成键功率 → 控制温度 → 合成 H₂ → 用 32 H₂ 形成分子云。章节完成使用 TMT 原生结束画面，可继续观测。后续生命、细胞、组织、器官、人类层仍在规划中。

This is an abstract resource game, not a physical simulation. [Design / 设计](docs/REMAKE-DESIGN.md).

## Native saves / 原生存档

TMT owns the game clock, `player.h` state, Decimal resource quantities, offline production, auto-save, multiple saves and import/export. Click the original settings gear to use these features.

使用原生设置齿轮保存、导入导出、管理多存档、切换主题。自动保存每五秒执行；离线收益最多四小时。暂停会停止生产、冷却及离线时间消耗。

The remake's storage key is `tree_of_life_remake_tmt`, shared by Chinese and English. Original evolution saves (`tree_of_life`) and the previous standalone prototype saves remain separate. Do not import those incompatible formats into this mod.

重制版的中英文共用独立 TMT 存档；与原版及上一版独立页面原型的存档分开。

## Development / 开发

With Node.js 22 or newer:

```sh
npm test
```

Tests boot the actual TMT scripts and verify layer registration, Decimal resources, engine-driven progression, native clickable completion, pause, offline limits, multilingual save round trips and hydrogen conservation.

- `js/remake/mod.js`: TMT mod metadata and global mod hooks.
- `js/remake/hydrogen.js`: native hydrogen layer and TMT components.
- `js/remake/tree.js`: original framework's tree layout.
- `js/remake/simulation.js`: pure equations, called from the TMT layer update hook.
- `js/remake/native-ui.js`: translated native system tabs.
- `js/remake/config.js`: branch's default language.

Small compatibility fixes guard the original fork's optional cell slowdown, preserve UTF-8 saves, honor offline/auto-save settings, and order dynamically loaded mod scripts. The original evolution entry still works through `legacy.html`.

GitHub Actions tests both branches and uploads a runnable native TMT artifact. It does not replace the existing Pages deployment. To build the same package locally:

```sh
python3 scripts/package-preview.py preview
```

MIT notices in `LICENSE` and `Prestige-tree-license` are preserved. Credits: The Tree of Life by pg132, TMT by Acamaeda, The Prestige Tree by Jacorb and Aarex.
