# Pacing check — 2.070.3

## Release rule

A reasonably informed active player should normally have a meaningful next progression opportunity within 100 simulated seconds. This limits forced inactivity, rather than requiring every major upgrade or factory bonus within 100 seconds of the previous one. Useful factory purchases, productive new staff allocations, and actual Human buyable improvements can bridge those milestones.

Every release runs the functional suite and the native-engine audit. Cosmetic clicks, repeated staff shuffling, and Bulk clicks without actual buyable-level improvements do not count. Purchases are attempted as soon as affordable; the policy never adds deliberate delays to spread the rewards out.

## Diagnosis and change

Before the 19th Factory I purchase, the representative save already has about 23,177 Hiawd levels. Previously milestone 17 immediately credited all eligible levels above 14,000: about **9,600x** Widget gain. That made the first bonus arrive only two seconds after level 19 and compressed all six base bonuses into 160 seconds from level 20 to 30. Checking only the maximum wait did not catch this opening burst.

The 2.070.3 rule is:

```text
eligible = max(Hiawd levels - 14000, 0)
capacity = 750 * max(floor(purchased Factory I levels) - 18, 0)
counted = min(eligible, capacity)
Hiawd Widget multiplier = 1.001 ^ counted
```

At Factory I level 19 the counted amount is at most 750, so this part of the bonus is at most **2.1162x**. Purchased levels gradually increase the cap; produced Factory I amounts cannot bypass it. This adds no timer or extra save field. Widgets, factory amounts, and purchased levels in existing saves are retained.

The 20/22/24/26/28/30 base bonuses remain +.07 each (max +.42). Mastery VI, milestone 16/18, native factory prices/unlocks, and the Chemistry endpoint retain their formulas.

## Audited route

- Original built-in **Group 3 unlock** save, approximately 1.36e7 Researchers and 20 total Chemists.
- Normal Mode, seed 391, native game loop and purchases, one simulated second per tick.
- No granted resources, upgrades, factory levels, element amounts, or milestones.
- Discover the original third-period elements through native workers/buildings/scientists, maintain productive scientists, and assign genuinely available or newly recruited Chemists.
- Use native Human Bulk only when available; count an event only if actual Human buyable levels improve.
- Buy useful factories and Research/Chemistry upgrades, through the unchanged endpoint.
- The total audit window remains 7,200 simulated seconds. The maximum allowed inactivity gap remains 100 seconds.

## Current result

**PASS: the endpoint was reached at 5,674 simulated seconds (94 minutes 34 seconds), with a longest meaningful-operation gap of 63 seconds.** The worst interval was between actual Human buyable improvements through Bulk at seconds 4,855 and 4,918. There were 1,515 meaningful events, all five Chemistry upgrades, and approximately 1.01e24 current Researchers at the endpoint.

The first factory-base reward now arrives **205 seconds after Factory I level 19**, rather than two seconds. The level-20-to-30 bonus span is **498 seconds**, rather than 160. Other useful operations remain available between those larger rewards; the overall maximum interaction gap is 63 seconds.

| Factory I purchased level | 2.070.2 arrival (s) | 2.070.3 arrival (s) |
| --- | ---: | ---: |
| 19 | 2048 | 2048 |
| 20 | 2050 | 2253 |
| 22 | 2055 | 2411 |
| 24 | 2075 | 2540 |
| 26 | 2118 | 2642 |
| 28 | 2162 | 2704 |
| 30 | 2210 | 2751 |
| 40 | 2651 | 3176 |
| 51 | 3707 | 4232 |
| 60 | 4847 | 5371 |

| Major event | 2.070.3 simulated second |
| --- | ---: |
| Research IV | 730 |
| Research V | 3498 |
| Chemistry I | 5105 |
| Chemistry II | 5470 |
| Chemistry III | 5609 |
| Chemistry IV | 5638 |
| Chemistry V | 5664 |
| Patch endpoint | 5674 |

The full summary, Hiawd counts, and Widget/base snapshots are in [the machine-readable result](pacing-2.070.3.json). [The previous release report](PACING-2.070.2.md) records the older calibration and its limits.

## Opening-burst regression

The release check now also fails if, on this representative route, the first bonus arrives less than 10 seconds after level 19, or the six-bonus span from level 20 to 30 is less than 180 seconds. These are audit thresholds, not additional game waiting timers. They catch the specific previously missed opening burst while the separate 100-second rule checks for forced inactivity.

Before the full run, candidate caps were replayed from a naturally reached pre-milestone checkpoint at second 2,047. No resources were added. A cap of 1,000 Hiawd levels per Factory I level also completed with a 71-second maximum gap, but its bonus span was 326 seconds. The selected cap of 750 spreads that span to 498 seconds. The released result above is from a fresh full run, rather than only that replay.

## Functional and visual checks

All **29 functional tests** pass, covering:

- The six unchanged base-bonus gates and their total cap; milestone 16/18 contributions.
- Gradual Hiawd credit at and between the gates, the eligible-level limit, and use of purchased levels rather than produced amounts.
- A very large Hiawd stockpile cannot cause an unbounded level-19 Widget jump or NaN.
- The Widget/sec display equals actual production, including milestone 17; production before milestone 17 retains its original factors.
- Existing save balances and purchased levels, staff conservation/reload, original layers, Chemistry prices/endpoint, and unlock notes.
- Orange update headings and explicit white body lines. The live browser is also checked before delivery.

## Scope and limitations

This is one active-play route and one seed, plus boundary/save checks. It does not prove the same maximum wait for every earlier layer, allocation strategy, imported save, or Extreme Mode. Durations are simulated game time; browser updates are finer than the one-second audit ticks.

Existing saves may already hold large Widget balances from an earlier release. Those resources are retained; the new rule controls subsequent production and does not undo past purchases or earned resources.

## Reproduce

```sh
npm test
npm run check:pacing
```

The audit fails if the endpoint is not reached, the maximum meaningful gap exceeds 100 seconds, or the opening-burst checks fail. It writes `work/pacing-report.json`; GitHub Actions runs both commands. Future updates must audit affected checkpoints and record failures and coverage limits before release.
