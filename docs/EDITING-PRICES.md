# Editing prices in the continuation

## Where the old e6390 comes from

The original `js/utils/tokenSupport.js`, line 3, stores exponents:

```js
var TOKEN_COSTS = [6390, 7587, 7630, /* ... */];
```

The original `tokenNextAt()` returns `Decimal.pow(10, TOKEN_COSTS[amt])` (plus the original difficulty factor). Therefore searching for the literal `e6390` does not find the price: the source contains only `6390`. The first three original Normal Mode Token thresholds are 1e6390 / 1e7587 / 1e7630 Life Points. The original table is also used by Hard Mode.

## Current Normal Mode editing point

The continuation keeps the original table intact and overrides the first two Normal Mode prices in `js/normalBalance.js`:

```js
const tokenPrices = ["1e6600", "1e7760"];
```

Index 0 is Token 1 and index 1 is Token 2. These are full price strings, not bare exponents. Keep the quotes: JavaScript numeric literals at these magnitudes overflow. The override applies only in Normal Mode with no effective-Token reduction. Other difficulties and Token 3 onward keep their original formulas.

The current third original threshold (1e7630) is lower than the second override (1e7760). This patch follows the user's second-Token request without choosing a new third price. Check the transition before changing more prices.

## GitHub website workflow

Development source:
https://github.com/tzh391/The-Modding-Tree/blob/evolution-next/js/normalBalance.js

Live `/next/` copy:
https://github.com/tzh391/The-Modding-Tree/blob/evolution/next/js/normalBalance.js

1. Open the intended file and click the pencil (Edit this file).
2. Change the desired string, review the diff, then click **Commit changes…**.
3. Enter a short commit message and commit to the selected branch, or create/merge a pull request if the branch requires it.
4. For a direct live adjustment, the publishing file is **`evolution` → `next/js/normalBalance.js`**. A commit to the development branch alone does not publish `/next/`.
5. Keep the same values in `evolution-next/js/normalBalance.js`, and update matching expected prices in `tests/normalBalance.test.cjs`. A later publication copies the development tree into `next/`, so unsynchronized live-only edits would be replaced.
6. Run/check the tests and native pacing checks. When the **pages build and deployment** action succeeds for the publishing commit, hard-refresh the game. The normal save and imported checkpoint slots are retained.

For an intentionally cache-busted release, update the `normalBalance.js?v=…` token in `js/mod.js` as well, and synchronize the publishing copy. This patch uses `2.071.1-balance.2`.

Commands for a local development checkout:

```sh
npm test
npm run check:hydrogen-pacing
npm run check:pacing
```

The default early replay covers the first Token; the second price has native threshold/reset regression tests. Optional `--tokens 2` / `--tokens 3` replays include a limited minigame policy and are diagnostic, not a complete guarantee of post-reset pacing.

Official GitHub instructions:
- https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
