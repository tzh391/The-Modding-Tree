# Pacing check — 2.071.1

## Scope

Normal Mode price-only update. No new content, altered upgrade prerequisites, or changed upgrade effects. Hydrogen XVI–XX cost 7.77e777 / 1e800 / 1e1000 / 1e1040 / 1e1319 Hydrogen. The first Token threshold is 1e6600 **Life Points**, and equality now permits the native prestige. Easy/Hard/Extreme Mode prices and later Token formulas remain original. The user clarified XIX/XX (19/20); XIV/XV are unchanged.

## Native early-game audit

Start from the original built-in **e300 Hydrogen** save: about 3.25e301 Hydrogen, 1.73e197 Life Points, and no Tokens. Load it through the normal save migration, resume play, and grant no resources. Simulate one second at a time. Buy available Hydrogen/Carbon/Oxygen/mini upgrades as soon as affordable, and buy useful unlocked mini buyables. Native autobuyers also run. Stop when Hydrogen XX is owned and the first Token is affordable. No artificial delays are inserted between purchases.

Those native buyables affect the current early-game production and count as useful operations. Cosmetic clicks and staff shuffling are not events. The targeted reward-spacing audit checks the five repriced Hydrogen upgrades and the first Token; it does not claim that every earlier unchanged upgrade is separated by ten seconds.

| Route | Endpoint time | Longest useful-operation gap | Minimum targeted numerical-reward gap |
| --- | ---: | ---: | ---: |
| e300 Hydrogen → first Token | 3342 s | 15 s | 71 s |
| Original Group 3 → Chemistry endpoint | 8246 s | 92 s | 10 s |

Both routes pass their 100-second maximum wait and 10-second minimum targeted-reward spacing checks. [Early-game data](pacing-2.071.1-hydrogen.json), [Chemistry regression data](pacing-2.071.1-chemistry.json).

### Repriced early targets

| Target | Seconds from original e300 checkpoint |
| --- | ---: |
| Hydrogen XVI | 1742 |
| Hydrogen XVII | 1813 |
| Hydrogen XVIII | 2272 |
| Hydrogen XIX | 2412 |
| Hydrogen XX | 3269 |
| First Token affordable | 3342 |

The longest gap between the target upgrades is not the longest operation wait: native buyables and Carbon/Oxygen upgrades remain useful between targets. In this policy no such operation gap exceeded 15 seconds. Resource amounts recorded after an upgrade purchase are the remaining balance, not its price.

The Chemistry regression uses the same native policy and seed 391 as 2.070.5. It reaches the same endpoint with identical event times: Chemistry V, K/Ca best55, and at least 1e32 current Researchers. Existing late-game save progress is not removed by this price patch.

## Functional checks

All **48 functional tests** pass, including five added early-balance tests. Coverage includes exact and insufficient Hydrogen payments, preservation of XIV/XV prices, unchanged prerequisites and other difficulty prices, the first Token using Life Points rather than Hydrogen, a native prestige at exactly 1e6600, later/effective Token formulas, and retention of existing purchases/resources/Token totals. Existing Chemistry, factory, automation, migration, hint, loading-order and update-color tests also pass.

The original first-Token gain check was strict (`nextAt < baseAmount`). The new Normal Mode first-Token branch permits equality; other Token gain behavior is preserved. No base Token table or original layer source is modified.

## Limits and reproduction

These are representative active-play Normal Mode routes, not guarantees for every purchase policy or save. The early route begins at e300 Hydrogen and stops at the first Token opportunity. It does not benchmark every earlier stage, every subsequent Token reset, or other difficulties. Target upgrade spacing refers to the six changed early targets; the unchanged chemistry route keeps its broader numerical reward audit.

```sh
npm test
npm run check:hydrogen-pacing
npm run check:pacing
```

GitHub Actions runs all three commands. Keep supplied saves local; neither replay requires private save contents. [Previous report](PACING-2.070.5.md).
