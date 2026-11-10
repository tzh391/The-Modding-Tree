# Development rules

- Keep game-facing text in English. Reply to this user in Chinese.
- Preserve the original Human, Researcher, and earlier progression unless the user specifically requests a mechanic change. Extend the existing Chemistry format and systems.
- Normal Mode changelog headings use orange (`#CC6600`); their body text uses white (`#FFFFFF`), per the 2.070.3 user correction.
- Before every release, run the functional tests and `npm run check:pacing`. For changes affecting Hydrogen XVI–XX or either of the first two Tokens, also run `npm run check:hydrogen-pacing`.
- Audit representative checkpoints and bottlenecks affected by the change. A reasonably informed player should normally have a meaningful progression opportunity within 100 simulated seconds: an upgrade, a useful buyable level, a milestone/challenge completion, a productive allocation target, or the patch endpoint.
- A cosmetic click, repeatedly swapping the same staff, or buying an irrelevant item does not count as progression. Do not claim a full-game pacing guarantee from a few synthetic checkpoints.
- Also audit clustered progression: numerical upgrades, milestones, and factory-base rewards should not chain together immediately. Use actual affordability and native production, without inserting artificial purchase delays to pass the audit. Report minimum reward spacing as well as maximum waits.
- Keep supplied save contents local; publish only aggregate audit results, not the raw save.
- Record the scenarios, longest wait, assumptions, failures, and coverage limits in `docs/PACING-CHECK.md`. Investigate a new or affected forced wait over 100 seconds before publishing; do not silently label a failed audit as balanced.
- Implement only the approved release. For 2.071, present suitable directions and wait for the user's choice before implementing that medium update.
