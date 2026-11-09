# Pacing check — 2.070.1

## Release rule

A reasonably informed active player should normally have a meaningful next progression opportunity within 100 simulated seconds. This is a limit on forced inactivity, not a claim that every large upgrade must be purchased within 100 seconds of the previous large upgrade. Factory levels and other productive purchases can bridge those upgrades.

Every future release must run the functional suite and the pacing audit, investigate failures, and record the tested route and limitations. Cosmetic clicks and repeated staff shuffling do not count.

## Audited route and method

- Start from the unmodified built-in **Group 3 unlock** save: approximately 1.36e7 Researchers and 20 total Chemists.
- Normal Mode, deterministic random seed 391, actual game loop and native purchases, one simulated second per tick.
- No resources, factory levels, upgrades, milestones, or element amounts are granted by the audit.
- Discover the original third-period elements using the original worker/building/scientist flow, then maintain productive scientist assignments.
- Allocate only genuinely available or newly recruited Chemists; do not repeatedly shuffle staff to generate audit events.
- Use the original Human Bulk operation as part of the existing Researcher/Widget loop. A cooldown click counts only when it increases actual Human buyable levels.
- Purchase available Research/Chemistry upgrades and useful factories. All native costs and prerequisites apply.
- Continue through the 2.070 Chemistry endpoint.

## Result

**PASS: longest recorded gap between meaningful progression operations was 54 seconds.**

The route reached the endpoint after **3,489 simulated seconds**, with 1,381 progression events, all five Chemistry upgrades, the three K/Ca progression milestones, and approximately 1.37e24 current Researchers. The longest gap was between actual Human buyable improvements through Bulk at seconds 1,987 and 2,041.

| Event | Simulated second |
| --- | ---: |
| Research IV | 730 |
| Research V | 2,471 |
| Chemistry I | 2,917 |
| Chemistry II | 3,342 |
| Chemistry III | 3,442 |
| Chemistry IV | 3,465 |
| Chemistry V | 3,484 |
| Patch endpoint | 3,489 |

These are major-event timestamps. Factory purchases, productive staff assignments, and Human buyable improvements continue between them; the Chemistry I-to-II interval is not a forced idle interval.

## Findings corrected during the check

1. The initial audit policy omitted the original Human Bulk operation and recorded a 351-second gap. That incomplete policy was corrected rather than treated as evidence to add arbitrary speed multipliers.
2. Researcher milestone 17's text specifies Factory I levels 20/22/24/26/28/30, but its implementation used 200/202/204/206/208/2200. Version 2.070.1 fixes the implementation to match the existing description. The earlier policy with Bulk had short interaction gaps but did not reach the endpoint within the one-hour audit window; the corrected milestone implementation does.
3. The new sliders are free QoL at 20 total Chemists and add no mandatory production wait. Assignment conservation, zero/max endpoints, large Decimal populations, and save reloads are tested separately.
4. The displayed Widget rate is checked against the actual Widget increment over one simulated second, before and after factory changes.

## Scope and limitations

This is one active-play route and one random seed, beginning at an existing Chemistry checkpoint. It does not prove that every allocation strategy, every earlier layer, every save, or Extreme Mode has the same maximum wait. The production model is sampled at one-second ticks; real browser updates are finer. Runtime and playtime are different: the 3,489 seconds above are simulated game time.

For the next approved medium update, add relevant boundary checkpoints and audit any newly introduced progression gates. Do not claim the whole game is fully balanced from this report alone.

## Reproduce

```sh
npm test
npm run check:pacing
```

The script exits with failure if the route does not reach its endpoint within the audit window or if a recorded forced gap exceeds 100 seconds. Its machine-readable report is written to the ignored `work/pacing-report.json`. GitHub Actions runs both checks before release.
