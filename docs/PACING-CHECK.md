# Pacing check — 2.071.1, second Token adjustment

## Requested behavior

Normal Mode's first two Token thresholds are 1e6600 and **1e7760 Life Points**. Both permit equality. Their values are together in `js/normalBalance.js` as `const tokenPrices = ["1e6600", "1e7760"]`. Existing progress is retained. Token 3 onward and other difficulties retain their original formulas. In particular, the third original threshold is still 1e7630, lower than the newly requested second threshold; this patch does not choose another third price.

Hydrogen XVI–XX remain 7.77e777 / 1e800 / 1e1000 / 1e1040 / 1e1319 H. No content, effect, or prerequisite is added. [Editing and submitting prices](EDITING-PRICES.md) explains the original exponent table, the current overrides, and the development/publishing paths.

## Functional checks of the changed threshold

All **49 functional tests** pass. With one Token already acquired, a native game at 1e7759 Life Points cannot reset for the second Token; at exactly 1e7760 it can. `doReset('tokens')` increments the native Token total to two and the next threshold returns to the original `10^7630` formula. This is a payment/threshold test, not a timed second-Token replay.

The first threshold also has an exact-boundary native prestige test. Other tests retain Hydrogen payment and prerequisite checks, Easy/Hard/Extreme prices, effective-Token modifiers, saved resources/purchases, Chemistry progression, factories, automation, migration and loading-order checks.

## Completed native pacing routes

| Route | Completion time | Longest useful-operation gap | Minimum targeted numerical-reward gap |
| --- | ---: | ---: | ---: |
| Original e300 Hydrogen → actual first Token reset | 3113 s | 15 s | 73 s |
| Original Group 3 → Chemistry endpoint | 8246 s | 92 s | 10 s |

Both completed routes pass the 100-second maximum wait and 10-second targeted reward-spacing checks. See [early replay data](pacing-2.071.1-hydrogen.json) and [Chemistry data](pacing-2.071.1-chemistry.json). The Chemistry endpoint and event times remain identical to the preceding price-only release.

### First-Token native policy and targets

Use the original e300 Hydrogen checkpoint, no extra resources, one-second native ticks. Buy available H/C/O/mini upgrades and useful mini buyables as soon as affordable. Refresh temporary data after each upgrade purchase so a mutually exclusive prerequisite is not bought using a stale UI state. Stop after the native first-Token reset. The target rewards are the five repriced Hydrogen upgrades and the first Token; earlier unchanged upgrades are not claimed to have ten-second spacing.

| Target | Seconds from checkpoint |
| --- | ---: |
| Hydrogen XVI | 1510 |
| Hydrogen XVII | 1586 |
| Hydrogen XVIII | 2044 |
| Hydrogen XIX | 2184 |
| Hydrogen XX | 3040 |
| First Token reset | 3113 |

The previous audit did not refresh the temporary upgrade predicates between same-tick purchases. Correcting that policy changes the first-route timings; it is a test-driver change, not an additional game rebalance. [The initial 2.071.1 report](PACING-2.071.1-initial.md) preserves the older measurements.

## Investigation and coverage limits

Extended second/third-Token replay attempts exposed shortcomings in the audit policy's handling of the original post-reset Hydrogen/minigame progression. One initial attempt bought both mutually exclusive branches using stale temporary predicates and stalled; it was stopped and corrected. Other attempts spent the first Token on different native production bonuses but did not establish a validated complete post-reset policy. They are not reported as passing pacing tests or used to claim second/third-Token timing guarantees.

The default early audit therefore remains the original first-Token route. Optional `--tokens 2` / `--tokens 3` are diagnostic extensions, prioritize the native Microwaves buyable, and have limited minigame handling. They do not add resources or insert artificial purchase delays. The raw local checkpoint they generate stays under ignored `work/`.

These completed routes and exact-boundary tests do not guarantee every post-reset strategy or save has an operation within 100 seconds. A representative near-second-Token save would permit a more focused timing audit without substituting an incomplete general minigame policy. This release follows the explicit second-Token price and leaves the unrelated original progression unchanged.

```sh
npm test
npm run check:hydrogen-pacing
npm run check:pacing
```

GitHub Actions runs these three checks. No private supplied save is committed.
