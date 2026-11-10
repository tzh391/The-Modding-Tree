# Pacing check — 2.070.5

## Release requirements and scope

Use native production and buy upgrades/factories as soon as affordable. The audit must reach the endpoint, have no useful-operation gap above 100 simulated seconds, and have no consecutive numerical rewards less than 10 seconds apart. Staff shuffling and cosmetic clicks are not useful operations. Utility milestones are tracked as actions but are not numerical rewards.

This release changes Normal Mode Research V to 5e22 Researchers (unlock and cost, retaining Factory I 44). Chemistry I–V require and cost 1e25 / 1e29 / 1e30 / 1e31 / 8e31 Researchers, with element gates K51 / Ca53 / both54 / both54 for II–V. Chemistry I keeps Researcher milestone 18 and Factory VI 3. The numerical Chemistry milestones stay at K50 / Ca52 with K51 / both55 with Chemistry V. The endpoint now also requires 1e32 current Researchers.

Auto H–Ne uses the native 40-Chemist milestone toggle and Chemistry button color; gold inner outlines identify elements currently managed by full staffing. Effective production, manual staff conservation, and factory rewards remain as in 2.070.4. No 2.071 content is implemented.

## Native policy

Normal Mode, seed 391, one simulated second per tick, same allocation/purchase policy as 2.070.4. The original Group 3 checkpoint has no extra resources. Establish production in the original 18 elements, keep useful science and construction, enable full staffing once 40 Chemists are available, and assign available staff to K/Ca science once Chemistry I opens. Native Human Bulk counts only when it actually improves buyable levels. No artificial purchase delays or resource grants are inserted.

Both supplied files are read locally. Their paused states are resumed for progression checks. Raw saves are not published. The latest save already owns all five Chemistry upgrades, all three numerical milestones, K56/Ca55 best levels, and enough Researchers for the new endpoint. Its zero-second result verifies preservation, not the pacing of a new playthrough.

## Results

| Route | Endpoint time | Longest useful-operation gap | Minimum numerical-reward gap |
| --- | ---: | ---: | ---: |
| Original Group 3 unlock | 8246 s | 92 s | 10 s |
| Earlier supplied save (6.73e20 R) | 232 s | 4 s | 10 s |
| Latest supplied save (6.82e33 R) | 0 s | 0 s | N/A — already complete |

All three checks pass. The two actual progression routes have no clustered numerical rewards under the 10-second audit criterion. See [full-route data](pacing-2.070.5.json), [earlier reference summary](pacing-2.070.5-previous-reference-summary.json), and [latest preservation summary](pacing-2.070.5-current-reference-summary.json).

## Numerical rewards on the progression routes

| Reward | Original route (s) | Earlier supplied save (s) |
| --- | ---: | ---: |
| Buy r upgrade 15 | 7855 | Already owned |
| Buy chem upgrade 11 | 7947 | Already owned |
| Earn chem:1 | 8036 | 74 |
| Buy chem upgrade 12 | 8089 | 114 |
| Earn chem:2 | 8131 | 146 |
| Buy chem upgrade 13 | 8160 | 169 |
| Buy chem upgrade 14 | 8211 | 208 |
| Buy chem upgrade 15 | 8231 | 219 |
| Earn chem:3 | 8241 | 229 |

## Failures investigated

- Changing only the Researcher prices left Chemistry III too close to milestone 2: 7 seconds on the original route and 4 on the earlier supplied save. Chemistry II/III/IV element gates were moved to K51/Ca53/both54; the free milestone targets were retained.
- With the revised element gates but Chemistry V at 1e32, the earlier supplied route still put V only 9 seconds before the final milestone. Moving V to 8e31 separates both late numerical rewards by at least 10 seconds on both tested routes. The endpoint still requires 1e32 current Researchers.
- Revalidating an already completed older save called `hasUpgrade` before `tmp.chem` existed. The migration-safe final milestone checks the saved purchased-upgrade list directly. The latest real supplied save and a cold-load regression test now pass.

## Functional verification

All **43 functional tests** pass. Added checks cover the native milestone toggle with immediate staff refunds, unaffected other automation toggles, exact Research/Chemistry resource gates and payments, unchanged Extreme Mode Research V price, and a completed old save loaded before temporary data exists. Earlier progression, staff conservation, recruitment, native factories, milestone thresholds, unlock notes, save import, and color checks also pass.

Live visual verification covers the milestone's Chemistry-colored ON/OFF button, outline changes on exactly the automated unlocked elements, and removal of the old periodic-table toolbar. The original root game remains separate from the published `next/` subtree.

## Limits and reproduction

These are representative Normal Mode routes, not a guarantee for every allocation strategy, difficulty, or save. They enable Auto H–Ne at 40 Chemists; leaving it OFF changes the timing. Existing resource stockpiles and purchases are retained. An already completed save cannot provide a new progression timing test.

```sh
npm test
npm run check:pacing
npm run check:pacing -- --save /path/to/local-save.txt --output work/reference-report.json
```

GitHub Actions runs the functional tests and original full route. Supplied-save checks remain local. [The 2.070.4 report](PACING-2.070.4.md) preserves the prior results. [Next directions](NEXT-DIRECTIONS.md) await the user's choice.
