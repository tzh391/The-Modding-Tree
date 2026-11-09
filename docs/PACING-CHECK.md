# Pacing check — 2.070.2

## Release rule

A reasonably informed active player should normally have a meaningful next progression opportunity within 100 simulated seconds. This limits forced inactivity, rather than requiring every major upgrade within 100 seconds of the previous one. Useful factory levels and Human buyable improvements can bridge those upgrades.

Every release runs functional tests and this native-engine audit. Cosmetic clicks, repeatedly swapping the same staff, and Bulk clicks without actual buyable-level improvements do not count.

## Factory balance

The six Factory I gates remain 20/22/24/26/28/30. Each adds **.07** to the shared factory base, with a combined maximum **+.42**, instead of +.1 per gate / +.6 total. The reward text uses the same values. Other milestone-17 rewards and milestones 16/18 retain their formulas.

Factory effects exponentiate this base by purchased levels, and the production chain compounds it further. With 17 milestones and no milestone-18 bonus, all six rewards alone multiply the Factory I level-30 effect by **201.93x**, instead of **1,515.66x**. This is an approximately **86.7%** reduction in this isolated reward multiplier; it is not a whole-economy percentage. Existing resources, factory amounts, and purchased levels are retained.

## Audited route and method

- Start from the unmodified built-in **Group 3 unlock** save: approximately 1.36e7 Researchers and 20 total Chemists.
- Normal Mode, deterministic random seed 391, actual game loop and native purchases, one simulated second per tick.
- No resources, factory levels, upgrades, milestones, or element amounts are granted by the audit.
- Discover the original third-period elements using the original worker/building/scientist flow, then maintain productive scientist assignments.
- Allocate only genuinely available or newly recruited Chemists; do not repeatedly shuffle staff to generate audit events.
- Use the original Human Bulk operation as part of the existing Researcher/Widget loop. A cooldown click counts only when it increases actual Human buyable levels.
- Purchase available Research/Chemistry upgrades and useful factories. All native costs and prerequisites apply.
- Continue through the 2.070 Chemistry endpoint.

- The audit window is 7,200 simulated seconds to cover the deliberately slower route. The allowed gap remains 100 seconds; extending total playtime does not relax that limit.
- Record Factory I boundary snapshots at levels 19, 20, 22, 24, 26, 28, 30, 40, 51, 60, and 100 if reached.

## Current result

**PASS: longest recorded gap was 81 seconds**, between actual Human buyable improvements through Bulk at seconds 4,429 and 4,510.

The unchanged Chemistry endpoint was reached after **5,152 simulated seconds** (85 minutes 52 seconds), with **1,411 meaningful events**, all five Chemistry upgrades, the three K/Ca progression milestones, and about 1.01e24 current Researchers. The same route in 2.070.1 took 3,489 seconds with a 54-second maximum gap. The new route is slower overall while remaining within the interaction limit.

| Major event | Simulated second |
| --- | ---: |
| Research IV | 730 |
| Research V | 2973 |
| Chemistry I | 4581 |
| Chemistry II | 4949 |
| Chemistry III | 5087 |
| Chemistry IV | 5116 |
| Chemistry V | 5142 |
| Patch endpoint | 5152 |

Factory purchases, productive allocation of newly recruited staff, and actual Human buyable improvements continue between these major events. See [the machine-readable result](pacing-2.070.2.json) for factory boundary snapshots and the full summary.

## Rejected candidates

The same one-second native-engine policy was run before publication. No weaker candidate was labeled balanced merely because it reduced large numbers.

| Bonus per gate | Maximum gap | Endpoint within 7,200 seconds | Decision |
| --- | ---: | --- | --- |
| .01 | 191 s | No | Reject |
| .03 | 144 s | No | Reject |
| .05 | 141 s | No | Reject |
| .06 | 102 s | Yes, at 6,568 s | Reject; exceeds 100 s |
| **.07** | **81 s** | **Yes, at 5,152 s** | **Release** |

## Functional and boundary checks

- All 26 functional tests pass.
- Test each of the six gates and the levels immediately below/between them, plus the cap at level 200.
- Test settled native Factory I effects across each boundary; each purchase remains below 6x at these gates, and the isolated level-30 bonus stays below 205x.
- Confirm milestones 16/18 retain their original contributions.
- Load a 2.070.1 save with large Widget balances and purchased factory levels; retain resources, amounts, and levels without NaN.
- Keep the Widget-rate, staff conservation, save reload, original-layer regression, Chemistry payment/endpoint, and unlock-note checks.
- Check Normal Mode note markup and descendant styles. Before completing deployment, also inspect computed browser colors for the headings and body text of 2.070/2.070.1/2.070.2.

## Scope and limitations

This is one active-play route and one random seed, beginning at an original Chemistry checkpoint. It does not prove the same maximum wait for every allocation strategy, earlier layer, imported save, or Extreme Mode. The audit samples the game at one-second ticks; browser updates are finer. All durations above are simulated game time, rather than test runtime.

The 2.070.1 baseline fixed the historical evolution commit's 200/202/204/206/208/2200 implementation to the existing 20/22/24/26/28/30 description. This release rebalances the size of that reward in response to play feedback.

## Reproduce

```sh
npm test
npm run check:pacing
```

The script fails if the endpoint is not reached within its window or if an event gap exceeds 100 seconds. It writes `work/pacing-report.json`; GitHub Actions runs both checks. For each future approved update, add affected checkpoints and investigate failures before publication.
