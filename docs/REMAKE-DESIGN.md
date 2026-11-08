# Tree of Life remake · 0.1 / 生命树重制版

## 本次可玩范围

只实现第一层“氢”。未来章节在侧栏标注为未开放，不能进入。

核心循环：自动采集 H → 分配采集/成键功率 → 调节温度与反应效率 → 生成 H₂ → 封存 32 H₂ 为分子云。

- 捕获脉冲：获得 4 H，温度增加 8，冷却 4 秒。脉冲是可选加速操作。
- 功率比例：采集占比为 a，成键占比为 1-a，范围 0–100%。
- 氢流入：0.2 + 2.2a / 秒。基础流入保证全成键配置也能缓慢前进。
- 成键容量：1.4(1-a) × 效率 / 秒；每个 H₂ 消耗两个 H。
- 效率：clamp(1 - max(0, 温度 - 28) / 85, 0.12, 1)。
- 温度按 12 秒时间常数趋近 12 + 88a + 5 × 实际成键速率。
- 0.1 秒以下步长进行确定性积分；后台离线收益最多 4 小时，暂停时不结算。
- 以默认 60% 配置，不点击也能在 180 秒内达到本章目标。玩家可通过两阶段采集/成键调度加快过程。
- 观察手记只记录发现，不附加倍率，不要求重复刷取。
- 完成本章消费 32 H₂ 并保留“已形成分子云”状态；不会自动重置。

这是生命演化题材的抽象资源游戏。H₂ 配比保留原子守恒，温度、反应速度、分子云规模、电子轨道均为玩法示意，不用于模拟真实宇宙或化学实验。

## 后续设计边界

规划方向：氢 → 元素与分子网络 → 原始生命 → 细胞 → 组织 → 器官 → 人类。

进入生命前需要交代其他元素的来源，并引入碳、氮、氧、磷、硫等原料。界面里的后续章节只是方向；本版没有实现其他元素、生命、细胞或人类。

每章围绕一种新的系统决策展开。例如分子网络关注反应配比，细胞关注膜内外交换，组织关注分工。旧章节在完成后逐渐成为可自动管理的底层供应；避免所有章节都重复升级商店、里程碑列表和重置挑战。

## 语言与代码维护

- `remake-zh`：默认中文；`remake-en`：默认英文。
- 两分支的模拟、界面、双语字典和测试共享；仅默认语言配置与初始 HTML 语言/标题不同。
- 切换语言不重置进度。`?lang=zh` 和 `?lang=en` 可显式指定语言。
- 两种语言使用同一存档格式。同一网站来源共享本地存档，不同网站来源通过导出/导入迁移。
- 重制版使用独立存储键 `tree-of-life-remake-v1`，不会读取或覆盖原版存档。
- 原版入口保留为 `legacy.html`，历史资源及 MIT 授权保留。

## English design brief

Version 0.1 implements hydrogen only. Adjust the balance between collection and bonding; greater collection power raises heat and reduces bonding efficiency. An optional four-second capture pulse accelerates supply at a thermal cost. Two H form one H₂. Preserve 32 H₂ to complete the chapter without a prestige reset.

The next chapters are a roadmap, not playable content. They will introduce other elements before prebiotic chemistry and life. Each chapter should add a distinct system decision rather than another sequence of multiplier purchases.

The simulation is deterministic and conserves hydrogen. The physics, quantities, temperatures and orbit illustration are abstractions. Both language branches share gameplay and save format. Offline progress is capped at four hours and stops while paused. The original game and its saves are retained separately.
