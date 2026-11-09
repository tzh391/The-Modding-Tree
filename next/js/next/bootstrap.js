function loadNext() {
    // A separate key for each starting route; never read/write tree_of_life.
    const life = new URLSearchParams(location.search).get("start") === "life";
    modInfo.id = life ? "tree_of_life_next_life" : "tree_of_life_next_human";
    if (!localStorage.getItem(modInfo.id)) {
        if (!life) {
            const seed = JSON.parse(atob(CUSTOM_SAVES["Pre-human"]));
            seed.hu2 = Object.assign(layers.hu2.startData(), { unlocked: true });
            seed.hu2.arc.active = true;
            seed.tab = "hu2"; seed.navTab = "tree-tab";
            seed.paused = false; seed.hasNaN = false; seed.autosave = true;
            seed.time = Date.now(); seed.keepGoing = true;
            // Keep the checkpoint's version so the engine applies its save migrations.
            seed.versionType = modInfo.id;
            localStorage.setItem(modInfo.id, btoa(unescape(encodeURIComponent(JSON.stringify({ set: "human", human: seed })))));
        } else {
            layoutInfo.startTab = "none";
        }
    }
    document.title = "生命树 · 人类与化学";
    load();
}
