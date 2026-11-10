# Pacing check — 2.070.4

## Release requirements

A reasonably informed active player should normally have a useful progression operation within 100 simulated seconds. A short maximum wait alone is insufficient: numerical upgrades, milestones, and factory reward gates must also be separated instead of chaining immediately.

The audit attempts native purchases as soon as they are affordable. It never adds artificial purchase delays or grants resources to make the results look balanced. Numerical rewards less than 10 seconds apart on the tested routes fail the audit. Utility unlocks (20/40 Chemists) are tracked as actions, but do not count as numerical-reward bursts: the new full-staffing production requires an explicit player toggle.

## Scope of the change

- Researcher milestone 17: 22 purchased Factory I levels, with base-bonus gates at 24/27/30/33/36/39 (+.07 each, total +.42).
- Its Hiawd credit starts above 21 purchased levels, at 750 eligible Hiawd levels per level. It cannot apply the full existing Hiawd stockpile immediately.
- Milestone 16 provides small Widget steps at Factory I levels 19–21, each x1.5 and at most x3.375. These bridge the earlier slowdown without a large one-time multiplier.
- Chemistry I requires 3 Factory VI levels after milestone 18 at 2 levels, separating those two rewards.
- Chemistry II–V element gates: K46 / Ca49 / both51 / both54.
- Numerical Chemistry milestones: K50 / Ca52 with K51 / both55 with Chemistry V.
- At 40 Chemists the optional H–Ne full-staffing mode returns manual staff to the free pool and supplies effective full staff in the first ten unlocked elements. Later elements remain manual. Automatic Nitrogen uses the same native recruitment formula.
- The revised free Chemistry milestones are revalidated on migration. Resources and purchased upgrades are retained.

## Native policy and checkpoints

Normal Mode, seed 391, one simulated second per tick. The original route starts at the built-in **Group 3 unlock** save. It discovers the original third-period elements, maintains useful science/construction, buys native Human Bulk only when available, and counts Bulk only when actual Human buyable levels improve.

At 40 Chemists the policy enables the new QoL once. It maintains the remaining manual elements and gives available staff to K/Ca science after opening those elements. It buys useful factories and Research/Chemistry upgrades through the endpoint. Cosmetic clicks and repeated staff shuffling are not events.

The second route loads the user-supplied save locally and resumes its paused state, with no additional resources. It starts with about 6.73e20 Researchers, 103 Factory I levels, 40 Chemists, Chemistry I, and best K/Ca levels 43/46. The encoded save remains local; only aggregate progression results are published.

## Results

| Route | Endpoint time | Longest useful-operation gap | Minimum numerical-reward gap | Cluster failures |
| --- | ---: | ---: | ---: | ---: |
| Original Group 3 checkpoint | 6497 s | 92 s | 18 s | 0 |
| Supplied reference save | 125 s | 4 s | 15 s | 0 |

Both routes reach Chemistry V, 55 best K/Ca levels, and at least 1e24 current Researchers. See [the full-route summary](pacing-2.070.4.json) and [the reference summary](pacing-2.070.4-reference-summary.json).

### Reference-save numerical rewards

| Reward | Seconds after load |
| --- | ---: |
| Buy chem upgrade 12 | 12 |
| Buy chem upgrade 13 | 30 |
| Earn chem:1 | 45 |
| Buy chem upgrade 14 | 64 |
| Earn chem:2 | 79 |
| Buy chem upgrade 15 | 110 |
| Earn chem:3 | 125 |

### Original-route numerical rewards

| Reward | Seconds from checkpoint |
| --- | ---: |
| Buy r upgrade 14 | 730 |
| Factory Widget ramp 19 | 2047 |
| Factory Widget ramp 20 | 2312 |
| Factory Widget ramp 21 | 2457 |
| Earn r:17 | 2713 |
| Factory base bonus 24 | 3130 |
| Factory base bonus 27 | 3600 |
| Factory base bonus 30 | 3913 |
| Factory base bonus 33 | 4138 |
| Factory base bonus 36 | 4333 |
| Factory base bonus 39 | 4527 |
| Buy r upgrade 15 | 4808 |
| Earn r:18 | 6092 |
| Buy chem upgrade 11 | 6276 |
| Buy chem upgrade 12 | 6294 |
| Buy chem upgrade 13 | 6325 |
| Earn chem:1 | 6348 |
| Buy chem upgrade 14 | 6386 |
| Earn chem:2 | 6412 |
| Buy chem upgrade 15 | 6469 |
| Earn chem:3 | 6497 |

## Failures investigated

1. Moving milestone 17 to 22 levels without an intermediate Widget ramp produced a **130-second** operation gap near Factory I level 20. That candidate was rejected.
2. The first version also awarded Researcher milestone 18 and Chemistry I at the same timestamp. Requiring the next native Factory VI level separates them.
3. A tested intermediate Mastery VI exponent ramp did not fix the 130-second gap and was removed. The released code leaves that formula intact and uses the bounded milestone-16 Widget ramp instead.
4. Element-level logarithms could round an exact level-55 boundary down to 54. The level helper now verifies the nearby exact amount thresholds; boundary tests cover all new gate levels.

## Functional and visual verification

All **40 functional tests** pass, including full-staffing conservation, actual/effective staff separation, disabling the toggle, save reload, Nitrogen recruitment without double counting, milestone migration, prices and gated upgrades, exact level boundaries, unlock notes, and the original earlier-layer regressions.

At each changed Factory I stage, a stress test holds other inputs fixed and checks that the Widget production jump from one purchased level remains smaller than the increase in the next purchase cost, even with a large Hiawd stockpile. This guards against a single factory purchase paying for a cascade of further levels through its multiplier alone.

Two import tests also verify that a local save opens in a new slot and invalid files leave existing progress intact. The file input supports browsers that do not implement the original prompt-based import.

The live browser is also checked for K/Na and Ca/Mg column alignment, the auto-staffing switch, milestone text, and orange headings with white body text.

## Limits and reproduction

These are two representative Normal Mode routes and targeted boundary tests. They do not guarantee identical timings for every allocation strategy, original earlier layer, Extreme Mode, or imported save. The full-staffing toggle is enabled in the audited routes; leaving it OFF changes the policy and timing. Existing resource stockpiles are retained, so past progress is not undone.

```sh
npm test
npm run check:pacing
npm run check:pacing -- --save /path/to/local-save.txt --output work/reference-report.json
```

The script fails if its route does not finish, a useful-operation gap exceeds 100 seconds, or numerical rewards occur less than 10 seconds apart. GitHub Actions runs the default full route. The supplied-save replay is local because the original attachment is not committed. [The previous report](PACING-2.070.3.md) records the earlier pacing checks.
