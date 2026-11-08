# 原生 TMT 重制版 / Native TMT remake · 0.2

## 框架

以本仓库原有 The Modding Tree 2.6.6.2 为基础。入口保留原版 HTML 布局、Vue、Decimal、引擎时钟、层级树、CSS、设置与存档系统。没有独立应用壳或第二套游戏时钟。

氢层是标准 `addLayer("h", ...)`：

- `startData()` 初始化 `player.h`；原子、分子、累计量与最高量为 TMT Decimal。
- `update(diff)` 由原生 `gameLoop` 调用，计算采集、成键和热平衡。
- `tabFormat` 创建“反应舱 / 观测 / 说明”标签页。
- `clickables` 实现捕获脉冲、三种配置、形成分子云、暂停与语言切换。
- 原生 `slider` 分配功率，原生 `bars` 显示温度和分子云目标。
- `tree.js` 只开放 H 节点；后续层尚未实现。
- 完成后触发 TMT 原生结束画面，允许继续观测。

## 玩法与公式

自动采集 H → 分配采集/成键功率 → 控制温度 → 生成 H₂ → 消耗 32 H₂ 形成分子云。

采集占比 a 在 0–1 之间；成键占比为 1-a。

- 采集速率：0.2 + 2.2a / 秒。
- 成键容量：1.4(1-a) × 效率 / 秒；每个 H₂ 消耗两个 H。
- 效率：clamp(1 - max(0, 温度 - 28) / 85, 0.12, 1)。
- 温度以 12 秒时间常数趋近 12 + 88a + 5 × 实际成键速率。
- 捕获脉冲：+4 H、温度 +8、冷却 4 秒；无需持续点击也可完成。
- 默认 60% 配置约 93 秒可达到目标；50% 配置约 64 秒。
- 方程用不超过 0.1 秒的步长积分。TMT 负责传入时间和离线结算。
- 观察记录没有额外倍率；本章不要求购买升级或重复重置。

资源、温度、反应环境、分子云规模均为玩法抽象。H₂ 的配比保持氢原子守恒；未来版本再根据后续层的需求调整数值。

## 存档与双语

统一采用原生 TMT 多存档和 Base64 导入导出。独立存储键 `tree_of_life_remake_tmt`，与原版、0.1 独立原型的存档分开。中英文共用格式；标签名在换语言后由 TMT 的 `fixSave()` 归一化。

`remake-zh` 默认中文，`remake-en` 默认英文。两分支共用引擎、玩法、原生组件扩展和测试，仅配置与初始 HTML 语言/标题不同。

原 fork 的少量兼容修复：可选细胞减速字段增加存在性检查，离线时间尊重设置和暂停，离开页面时遵守自动保存设置，UTF-8 导入导出支持中文标签，动态模组脚本按顺序加载。

## 后续方向

氢 → 其他元素与分子网络 → 原始生命 → 细胞 → 组织 → 器官 → 人类。

进入生命前先交代碳、氮、氧、磷、硫等元素来源。后续每层围绕一个新系统决策展开，同时利用 TMT 原生层级和组件扩展。当前只实现氢层。

## English brief

Version 0.2 is an actual TMT mod, not a separate frontend. It uses this repository's engine and registers hydrogen with `addLayer`. The engine owns time, resources, native controls, tree navigation, completion and saves. The first chapter retains the collection/bonding/heat allocation loop. Additional evolution layers are planned. The original evolution game is retained at `legacy.html`.
