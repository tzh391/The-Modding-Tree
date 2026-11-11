# Editing and publishing Token prices — 2.071.2

## The single Normal Mode price source

Edit **TOKEN_COSTS** at the top of `js/utils/tokenSupport.js`:

```js
var TOKEN_COSTS = [6600, 7760, 7780, 8160, 8350, /* ... */];
```

Entries are exponents: position 1 is Token 1 at 1e6600 Life Points; position 2 is Token 2 at 1e7760; position 3 is Token 3 at 1e7780. For example, to price the fourth Token at 1e8200, change the fourth number from 8160 to 8200. This example is not applied in the release.

Enter **7780**, not `e7780`, `1e7780`, or a quoted price string. Keep commas and the existing number of entries. Prices must be finite, positive and strictly increasing. The table is the direct source for all ordinary Normal Mode Token prices; existing effective-Token reductions and the later tetration progression still apply.

`TOKEN_COSTS_LEGACY` is the independent original Easy/Hard schedule; `TOKEN_COSTS_EXTREME` is the Extreme schedule. Change `TOKEN_COSTS` when balancing Normal Mode. There are no remaining Token price overrides in `js/normalBalance.js`; that file now only handles Hydrogen prices. The old 6390 is retained only in the legacy schedule.

## Recommended GitHub website workflow

1. Open the **development source**:
   https://github.com/tzh391/The-Modding-Tree/blob/evolution-next/js/utils/tokenSupport.js#L5
2. Click the pencil (**Edit this file**). Edit the desired numbers in `TOKEN_COSTS`, review the diff, then **Commit changes…** with a short message such as `Balance Token 4 and 5 prices`. Commit to `evolution-next`, or merge a pull request into it if required.
3. Open **Actions → Chemistry continuation checks** for that commit. It runs the functional tests and native pacing replays. The boundary tests read the price table; ordinary price edits do not require duplicating the numbers in test code. A non-increasing table fails validation. The replays cover the documented scenarios, not every possible Token reset strategy.
4. To publish `/next/`, put the **same table changes** into the publishing copy and commit to `evolution`:
   https://github.com/tzh391/The-Modding-Tree/blob/evolution/next/js/utils/tokenSupport.js#L5
   The publishing path includes **next/**. A development-branch commit alone does not publish the site. Keeping both copies synchronized also prevents later full publications from replacing a live-only edit.
5. Wait for the publishing commit's **pages build and deployment** action to succeed. Hard-refresh the game (Mac: Command+Shift+R; Windows: Ctrl+Shift+R) and check the displayed price. Existing saves stay in place.

For a release that immediately invalidates the script cache for all players, increment the `?v=` value on the `js/utils/tokenSupport.js` script in both copies of `index.html` as well. This release uses `2.071.2-table.1`. Change only that cache token; price numbers remain solely in `tokenSupport.js`.

## Local development checks

```sh
npm test
npm run check:hydrogen-pacing
npm run check:pacing
```

The tests validate table order, runtime edits, exact threshold purchases, native resets, other difficulty isolation, and advanced Token formulas. The default early replay ends at the first Token. Complete second/third-reset timing remains outside its validated coverage; optional `--tokens 2` / `--tokens 3` runs are diagnostic and use a limited minigame policy.

Official GitHub instructions:
- https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
