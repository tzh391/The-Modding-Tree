# Tree of Life · Remake / 生命树重制版

A playable hydrogen prototype, rebuilt from the `evolution` branch of The Tree of Life.

从 `evolution` 分支重新开始的生命树游戏。本版只开放第一层：氢。

- 中文分支：[remake-zh](https://github.com/tzh391/The-Modding-Tree/tree/remake-zh)
- English branch: [remake-en](https://github.com/tzh391/The-Modding-Tree/tree/remake-en)

## Play / 运行

No npm dependencies or build step are required. With Python 3 installed, run this command from the repository root:

无需安装依赖或构建。在仓库目录中执行：

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). With Node.js installed, `npm start` runs the same server.

- Chinese / 中文：[http://127.0.0.1:4173/?lang=zh](http://127.0.0.1:4173/?lang=zh)
- English：[http://127.0.0.1:4173/?lang=en](http://127.0.0.1:4173/?lang=en)
- Original game / 原版入口：[http://127.0.0.1:4173/legacy.html](http://127.0.0.1:4173/legacy.html)

Serve the files over HTTP; opening `index.html` directly as a `file:` URL will not load JavaScript modules reliably.

请通过本地服务器运行，避免双击 HTML 导致浏览器阻止模块加载。

## First chapter / 第一章

Collect hydrogen atoms, balance collection and bonding power, and manage heat. Combine two H into H₂ and preserve 32 H₂ to form your first molecular cloud. Capture pulses are optional; passive play can complete the chapter.

自动聚集氢原子，调节采集与成键的功率分配，控制舱温，最终用 32 个 H₂ 形成分子云。捕获脉冲可加速，但无需持续点击也能完成。

This is a game abstraction, not an accurate physical simulation. Only hydrogen is playable; future chapters are explicitly marked. See [design and formulas / 设计与公式](docs/REMAKE-DESIGN.md).

## Saves / 存档

Auto-save runs every five seconds and on key actions. Offline production is capped at four hours. Pause stops production and cooldowns, including while away. Use Export/Import to back up and transfer saves between language versions. The original game's save format is separate and incompatible.

每五秒及关键操作后自动保存；最多结算四小时离线收益。暂停会停止生产、冷却及离线推进。中英文可共用导出存档；与原版存档独立。

## Checks / 测试

With Node.js 20 or newer:

```sh
npm test
```

Tests cover chapter completion, atom conservation, power endpoints, temperature, cooldowns, pause, time-step consistency, offline limits, save validation, and translation coverage.

GitHub Actions runs these checks and uploads a standalone static preview artifact for both remake branches. It does not deploy over the existing GitHub Pages site. To host a remake, publish this branch's root directory on a separately selected Pages deployment.

GitHub Actions 会测试并打包可运行的静态原型；本次不会替换原有 GitHub Pages 网站。

## Source layout / 代码结构

- `js/remake/simulation.js`: deterministic simulation and save validation.
- `js/remake/app.js`: interaction, persistence, accessible HTML and canvas.
- `js/remake/i18n.js`: shared Chinese and English text.
- `js/remake/config.js`: branch default language.
- `css/remake.css`: responsive interface and reduced-motion support.
- `tests/simulation.test.mjs`: dependency-free regression tests.

The original TMT resources remain available through `legacy.html`. MIT notices in `LICENSE` and `Prestige-tree-license` are preserved. Based on The Tree of Life by pg132 and the TMT engine by Acamaeda.
