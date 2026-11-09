# The-Modding-Tree

An incremental game engine based on The Prestige Tree. It still requires programming knowledge, but it's mostly pretty easy things and copy/pasting.

[Look here for a tutorial on getting started with modding with TMT](docs/tutorials/getting-started.md)

You can look in the [documentation](docs/!general-info.md) for more information on how it all works, or look at the code in layers.js to see what it all looks like.

## Chemistry continuation

The `evolution-next` branch preserves the original game and continues the unfinished Chemistry layer in English. [Play the continuation](https://tzh391.github.io/The-Modding-Tree/next/) or read [the continuation notes](docs/EVOLUTION-NEXT.md). Hidden upgrades and buyables show small next-unlock notes.

Version 2.070.1 adds Widget gain/sec, Chemistry assignment sliders at 20 total Chemists, and a regression check for progression opportunities within 100 seconds. See [the pacing report](docs/PACING-CHECK.md).

Version 2.070.2 reduces each milestone-17 factory-base bonus to +.07 (max +.42) and explicitly colors both update headings and body text orange. Existing saves keep their resources and purchased levels.

Version 2.070.3 makes the milestone-17 Hiawd/Widget bonus gradual: each purchased Factory I level above 18 allows 750 eligible Hiawd levels to count. Normal Mode update headings are orange and body text is white. The six base-bonus gates and the Chemistry endpoint remain unchanged.
