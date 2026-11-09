# The Tree of Life — Chemistry Continued (v2.070.3)

This branch continues the original `evolution` game. Human and earlier layers remain intact. Researcher mechanics are preserved except for the documented milestone-17 threshold fix, factory-base balance, and gradual Widget reward. The separate cognition/legacy/reaction experiment has been removed from the playable version.

## Play and saves

- Normal start: https://tzh391.github.io/The-Modding-Tree/next/
- Existing Chemistry checkpoint: https://tzh391.github.io/The-Modding-Tree/next/?start=chemistry
- Development branch: `evolution-next`.
- The normal route starts at the original beginning. Use Options to export an original save, then import it into this preview to continue an existing run.
- Preview saves use `tree_of_life_continuation`. The optional checkpoint uses `tree_of_life_chemistry_checkpoint`. Neither route writes the original `tree_of_life` save or the previous experimental saves.
- The checkpoint is the original built-in “Group 3 unlock” save, with no added resources or Chemistry upgrades.

## Chemistry continuation

The original 18 elements, workers, scientists, buildings, amount decay, nitrogen recruitment, and element-level formula remain in use. New content starts after the existing late-game Researcher milestones.

| Upgrade | Cost in Researchers | Unlock requirements | Effect |
| --- | --- | --- | --- |
| Chemistry I | 1e20 | Researcher milestone 18; 1e20 best Researchers | Unlock K/Ca; double worker speed |
| Chemistry II | 1e21 | I; 10 best K levels; 1e21 best Researchers | Double scientist speed |
| Chemistry III | 1e22 | II; 10 best Ca levels; 1e22 best Researchers | Double worker speed |
| Chemistry IV | 1e23 | III; 20 best K/Ca levels; 1e23 best Researchers | Double scientist speed |
| Chemistry V | 1e24 | IV; 30 best K/Ca levels; 1e24 best Researchers | Double worker and scientist speed |

Potassium multiplies worker speed by 1.05 per current level, capped at 100 levels. Calcium applies the same bonus to scientist speed. Their building production uses the original `B * 1.1^B` formula and the same decay calculation as the existing elements.

Three milestones use best element amounts: 20 K levels doubles worker speed, 20 Ca levels doubles scientist speed, and 40 levels in both halves decay after Sulfur's effect. The normal patch endpoint is Chemistry V, that third milestone, and 1e24 current Researchers. Extreme Mode retains its original 298 Chromosome endpoint.

These are additions to existing mechanics. No new Human currency, replacement Researcher system, or chemical reaction system is introduced. Late-game pacing still needs feedback from original endgame saves.

## 2.070.3 gradual Factory I milestone reward

- Normal Mode changelog headings are orange (`#CC6600`) and body text is white (`#FFFFFF`), including the 2.070/2.070.1/2.070.2 entries.
- The milestone at 19 purchased Factory I levels no longer applies the whole existing Hiawd stockpile to Widget production immediately.
- Only Hiawd levels above 14,000 are eligible, as before. Count at most **750 eligible Hiawd levels per purchased Factory I level above 18**:
  `counted = min(max(Hiawd - 14000, 0), 750 * max(floor(Factory I levels) - 18, 0))`.
- The Widget bonus remains `1.001 ^ counted`. At Factory I level 19 it is at most about **2.12x**; further purchased levels gradually increase the cap. Produced Factory I amounts do not increase this cap.
- The existing six factory-base rewards remain at 20/22/24/26/28/30, each +.07 (max +.42). Mastery VI and all other milestone rewards retain their formulas.
- No new save fields or timers are needed. Existing resources and purchased levels are retained. Actual Widget production and its per-second display use the same formula.
- The pacing audit now checks both the 100-second maximum interaction gap and the opening factory burst. See [the current report](PACING-CHECK.md) and [the previous release report](PACING-2.070.2.md).

## 2.070.2 factory balance and update colors

- Milestone 17 retains its six Factory I thresholds at 20/22/24/26/28/30, but each adds **.07** to the shared factory base instead of .1. The total bonus is capped at **+.42**, down from +.6.
- Factory effects raise this shared base to purchased levels. With 17 Researcher milestones and no milestone-18 bonus, the six threshold rewards alone multiply the Factory I level-30 effect by about **201.93x**, down from **1,515.66x** in 2.070.1. This comparison holds all other factors fixed; it is not a claim about whole-chain output.
- The milestone reward text matches the new values. Milestones 16/18 and other milestone-17 rewards retain their formulas.
- 2.070.2 introduced shared update-note styling. The current 2.070.3 styling uses orange headings and white body text.
- Existing Widgets, factory amounts, purchased levels, and Chemistry progress are retained on load. Production rates use the balanced formula immediately.
- See [the pacing report](PACING-CHECK.md) for the active-play route and boundary checks. The endgame requirements are unchanged.

## 2.070.1 quality of life

- The Factories tab shows the actual Widget gain per second.
- Assignment sliders unlock at 20 total Chemists, without a purchase or a late-game requirement. They operate on the currently selected element, preserve other assignments, and retain the original +/-1 controls for precise adjustments.
- Up to 1,000 available staff, slider positions correspond to exact staff counts. Larger pools use proportional steps while keeping Decimal-safe integer allocations and exact zero/max endpoints.
- Slider arrow keys adjust staff without triggering the original layer/tab navigation hotkeys.
- Normal Mode entries share the update-note styling described above.
- Researcher milestone 17 now uses its existing described Factory I thresholds: 20/22/24/26/28/30. The base implementation incorrectly used 200/202/204/206/208/2200.
- The progression endpoint is unchanged from 2.070: Chemistry V, best K/Ca level 40, and 1e24 current Researchers.

## Next-unlock notes

Small English notes below upgrade and buyable sections show the next hidden item and its actual unlock condition. They distinguish unlock requirements from purchase costs and include resource amounts, prerequisite upgrades, milestone requirements, and challenge completions.

The read-only parser covers the original unlock predicates, including difficulty-dependent thresholds and retired content. It does not alter unlock logic, grant resources, or use `eval`/`Function`. A note can point to another section after the current section has no remaining hidden entries. Explicitly unavailable placeholders are skipped.

## Technical scope

- `js/layers.js` is identical to the original evolution version.
- `js/chemistryContinuation.js` extends Chemistry, adds the Widget rate display, and applies the documented Researcher milestone-17 balance and gradual Hiawd bonus.
- `js/chemistryQoL.js` provides read-only rate and conservative staff-assignment helpers.
- `js/unlockHints.js` describes the existing unlock rules.
- `js/components.js` adds the notes and the next two periodic-table entries using the original components.
- The original stylesheet remains in use; the added CSS styles unlock notes, assignment controls, and Normal Mode update colors.
- Script loading is ordered after engine dependencies. Save text supports UTF-8. A zero-decay guard prevents the existing Sulfur endpoint from producing NaN.

Run `npm test` for original-layer regression, Chemistry progression/payment, save migration, assignment/production, parser agreement, and unlock-note tests. The original game is preserved at the site root; publication only replaces the `next/` preview directory.

Run `npm run check:pacing` for the active-play pacing audit. See [the pacing report](PACING-CHECK.md) and [release rules](../AGENTS.md). Work on 2.071 waits for the user to select a direction.
