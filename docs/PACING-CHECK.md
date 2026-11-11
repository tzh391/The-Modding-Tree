# Pacing check — 2.071.2

## Scope and source of prices

Normal Mode reads every ordinary Token price directly from `TOKEN_COSTS` in `js/utils/tokenSupport.js`. The first three exponents are **6600 / 7760 / 7780**. The first/second price wrappers in `js/normalBalance.js` are removed. An independent `TOKEN_COSTS_LEGACY` retains original Easy/Hard prices; Extreme keeps its existing schedule.

Normal Mode represents each listed exponent exactly and accepts equality at its threshold. Existing effective-Token reductions and the native advanced tetration/bulk-gain branch are retained. No content, Hydrogen effect, milestone, or later Chemistry progression is added. See [editing and publishing prices](EDITING-PRICES.md).

## Functional checks

All **52 functional tests** pass. Tests now read Normal Mode boundary expectations from the configured table rather than freezing the first prices in test literals. They validate insufficient/exact Life Points and native resets for each of the first three Tokens, finite increasing schedules, the original number of entries, runtime edits to the first/second/third/fourth and later entries without a hidden override, independent difficulty prices, an increased price rejecting an old cached affordability state, effective-Token modifiers, and the unchanged native advanced bulk formula. Existing save, Hydrogen, factory, Chemistry, automation, and loading-order tests remain covered.

The released table was also inspected directly: `[6600, 7760, 7780, 8160, 8350, ...]`. The third Token is 1e7780; the previous inversion where Token 3 cost less than Token 2 is resolved.

## Completed native pacing routes

| Route | Completion time | Longest useful-operation gap | Minimum targeted numerical-reward gap |
| --- | ---: | ---: | ---: |
| Original e300 Hydrogen → first Token reset | 3113 s | 15 s | 73 s |
| Original Group 3 → Chemistry endpoint | 8246 s | 92 s | 10 s |

Both completed routes pass the 100-second maximum wait and 10-second targeted reward-spacing checks, with no artificial resource grants or purchase delays. Their event times are unchanged from the preceding release's corrected native policy. [Early replay data](pacing-2.071.2-hydrogen.json), [Chemistry data](pacing-2.071.2-chemistry.json).

The early route buys native H/C/O/mini upgrades and useful mini buyables as soon as affordable, updates temporary state between upgrades, then performs the actual first Token reset. The Chemistry route uses the original Group 3 checkpoint and seed 391 through the existing endpoint. Neither route loads a private supplied save.

## Coverage limits

The exact third-Token threshold and reset are tested natively, but a complete second/third-Token elapsed-time policy is not newly validated. The default early audit still ends at Token 1. Optional extended runs use limited minigame handling and are diagnostic; they are not claimed as timing passes. These representative routes do not guarantee 100-second interactions under every strategy, future manual price edit, or save. Increasing exponents alone is not proof of good pacing; manual price changes should be checked in an appropriate near-Token save as well as by the automated tests.

```sh
npm test
npm run check:hydrogen-pacing
npm run check:pacing
```

GitHub Actions runs these checks. Existing purchases, resources, and Token totals are preserved. [The previous report](PACING-2.071.1-token2.md) records the prior second-Token update and its investigation limits.
