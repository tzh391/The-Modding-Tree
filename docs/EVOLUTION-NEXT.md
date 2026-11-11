# The Tree of Life — Chemistry Continued (v2.071.2)

This branch continues the original `evolution` game. The original layers remain in use; 2.071.1 changes only the documented Normal Mode Hydrogen and first-Token prices in the early game. Researcher mechanics are preserved except for the documented milestone-17 threshold fix, factory-base balance, gradual Widget reward, the 2.070.4 progression/QoL adjustments, and the 2.070.5 Normal Mode Research V price. The separate cognition/legacy/reaction experiment has been removed from the playable version.

## 2.071.2 editable Token table

Normal Mode Token prices now read directly from **TOKEN_COSTS** in `js/utils/tokenSupport.js`. Its first entries are **6600 / 7760 / 7780 / 8160 / 8350**, meaning Token 1 requires 1e6600 Life Points, Token 2 requires 1e7760, and Token 3 requires 1e7780. Position N controls Token N. Later entries keep the existing values.

The first/second price overrides have been removed from `js/normalBalance.js`. `TOKEN_COSTS_LEGACY` independently preserves Easy/Hard prices, and `TOKEN_COSTS_EXTREME` preserves Extreme prices. Native effective-Token reductions and tetration/bulk mechanics are retained. Normal table prices are represented at their exact listed exponents and are affordable at equality.

Tests derive Normal Mode boundary expectations from the table, so later manual edits do not need duplicated literal prices in test code. They also validate finite increasing values and preserve the number of entries. See [editing and publishing prices](EDITING-PRICES.md) for the development/publishing file paths, GitHub commits, checks, and cache refresh.

No new content is added. Existing Hydrogen XVI–XX prices stay 7.77e777 / 1e800 / 1e1000 / 1e1040 / 1e1319 H; XIV/XV retain their original prices. The Chemistry endpoint remains Chemistry V, best K/Ca55, and 1e32 current Researchers. Existing purchases and resources are retained.

## Play and saves

- Normal start: https://tzh391.github.io/The-Modding-Tree/next/
- Existing Chemistry checkpoint: https://tzh391.github.io/The-Modding-Tree/next/?start=chemistry
- Development branch: `evolution-next`.
- Options also accepts a local exported text file and imports it into a new save slot, preserving existing slots.
- The normal route starts at the original beginning. Use Options to export an original save, then import it into this preview to continue an existing run.
- Preview saves use `tree_of_life_continuation`. The optional checkpoint uses `tree_of_life_chemistry_checkpoint`. Neither route writes the original `tree_of_life` save or the previous experimental saves.
- The checkpoint is the original built-in “Group 3 unlock” save, with no added resources or Chemistry upgrades.

## Chemistry continuation

The original 18 elements, workers, scientists, buildings, amount decay, nitrogen recruitment, and element-level formula remain in use. New content starts after the existing late-game Researcher milestones.

| Upgrade | Cost in Researchers | Unlock requirements | Effect |
| --- | --- | --- | --- |
| Chemistry I | 1e25 | Researcher milestone 18; 3 Factory VI levels; 1e25 best Researchers | Unlock K/Ca; double worker speed |
| Chemistry II | 1e29 | I; 51 best K levels; 1e29 best Researchers | Double scientist speed |
| Chemistry III | 1e30 | II; 53 best Ca levels; 1e30 best Researchers | Double worker speed |
| Chemistry IV | 1e31 | III; 54 best K/Ca levels; 1e31 best Researchers | Double scientist speed |
| Chemistry V | 8e31 | IV; 54 best K/Ca levels; 8e31 best Researchers | Double worker and scientist speed |

Potassium multiplies worker speed by 1.05 per current level, capped at 100 levels. Calcium applies the same bonus to scientist speed. Their building production uses the original `B * 1.1^B` formula and the same decay calculation as the existing elements.

Three numerical milestones use best element amounts: 50 K levels doubles worker speed; 52 Ca and 51 K levels doubles scientist speed; 55 levels in both plus Chemistry V halves decay after Sulfur's effect. The normal patch endpoint is Chemistry V, that third milestone at 55 best K/Ca levels, and 1e32 current Researchers. Extreme Mode retains its original 298 Chromosome endpoint.

These are additions to existing mechanics. No new Human currency, replacement Researcher system, or chemical reaction system is introduced. Late-game pacing still needs feedback from original endgame saves.

## 2.070.5 milestone toggle, outlines, and prices

- Auto H–Ne is now the native ON/OFF toggle inside the **40 total Chemists** milestone. Its button uses `tmp.chem.color` (#AA0456), like other milestone automation. It is included in the native automation milestone display filters.
- While ON, the first ten unlocked elements have a gold inner outline. Toggling OFF removes their outlines and effective full staffing. The actual staff pool and existing saved toggle value are preserved.
- Normal Mode Research V retains its 44 Factory I prerequisite and now requires 5e22 best Researchers and costs 5e22 current Researchers. Its Extreme Mode cost and unlock condition stay original.
- The Chemistry table above lists the new prices and element prerequisites. The 50/52/55 numerical milestones are unchanged. The final 8e31 price separates Chemistry V from the final milestone while remaining near the 1e32 stage.
- The current endpoint is **Chemistry V, 55 best K/Ca levels, and 1e32 current Researchers**. Previously purchased upgrades are retained without charging the price difference.
- Completed older saves can migrate before temporary layer data exists. The latest supplied save already meets this endpoint and is used as a preservation check, not presented as a progression replay.
- See [the release pacing check](PACING-CHECK.md) and [proposed next directions](NEXT-DIRECTIONS.md). No 2.071 mechanics are implemented.

## 2.070.4 layout, full staffing, and progression (historical)

- The original compressed periodic-table layout uses eight fixed columns. K is directly below Na and Ca directly below Mg, on the fourth row; narrow panels can scroll horizontally rather than wrap elements into different columns.
- At 40 total Chemists, milestone 5 unlocks **Auto H–Ne**, initially OFF. In 2.070.4 the switch was directly above the periodic table; 2.070.5 moves it into the milestone. When ON, each of the first ten unlocked elements has effective workers and scientists equal to total Chemists. Existing manual staff in those elements return to the free pool. Na–Ar, K and Ca remain manual. The actual Chemist pool remains conserved; automatic Nitrogen production recruits through its native formula.
- Chemistry II–V require K46 / Ca49 / both51 / both54 in addition to their existing prices and sequence. Numerical milestones require K50 / Ca52 with K51 / both55 with Chemistry V. These targets separate the reward steps even when the Researcher bank is large.
- Existing free Chemistry milestone flags are revalidated on update. Resources, buildings, best element amounts, and purchased upgrades are retained. That release used **Chemistry V, 55 best K/Ca levels, and 1e24 current Researchers**; see 2.070.5 above for the current price and endpoint.
- Researcher milestone 17 now requires **22 Factory I levels**. Its six +.07 base bonuses move to **24/27/30/33/36/39**. Hiawd credit is limited to 750 levels per Factory I level above 21. Milestone 16 adds a bounded Widget ramp at Factory I levels 19–21: x1.5 per level, at most x3.375. The original Mastery VI exponent reward still belongs to milestone 17.
- Chemistry I now needs the **third Factory VI level**, so it follows milestone 18 at two levels rather than appearing at the same instant.
- Exact element-level boundaries use a comparison correction for floating-point logarithm rounding.
- See [the current pacing report](PACING-CHECK.md) for maximum waits, minimum reward spacing, the local reference-save replay, and coverage limits.

## 2.070.3 gradual Factory I milestone reward (historical)

- Normal Mode changelog headings are orange (`#CC6600`) and body text is white (`#FFFFFF`), including the 2.070/2.070.1/2.070.2 entries.
- The milestone at 19 purchased Factory I levels no longer applies the whole existing Hiawd stockpile to Widget production immediately.
- Only Hiawd levels above 14,000 are eligible, as before. Count at most **750 eligible Hiawd levels per purchased Factory I level above 18**:
  `counted = min(max(Hiawd - 14000, 0), 750 * max(floor(Factory I levels) - 18, 0))`.
- The Widget bonus remains `1.001 ^ counted`. At Factory I level 19 it is at most about **2.12x**; further purchased levels gradually increase the cap. Produced Factory I amounts do not increase this cap.
- This release kept the original six +.07 base gates; their current positions are specified in the 2.070.4 section above.
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
