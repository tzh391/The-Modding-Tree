function loadContinuation() {
    installChemistryContinuation();
    document.title = "The Tree of Life — Chemistry Continued";
    // A separate key protects original saves and the retired experimental preview.
    // The default route starts at the unchanged beginning of the game.
    if (new URLSearchParams(location.search).get("start") === "chemistry") {
        modInfo.id = "tree_of_life_chemistry_checkpoint";
        if (!localStorage.getItem(modInfo.id)) {
            const seed = JSON.parse(atob(CUSTOM_SAVES["Group 3 unlock"]));
            seed.tab = "chem"; seed.navTab = "tree-tab";
            seed.paused = false; seed.hasNaN = false; seed.autosave = true;
            seed.time = Date.now(); seed.keepGoing = false; seed.versionType = modInfo.id;
            localStorage.setItem(modInfo.id, btoa(unescape(encodeURIComponent(JSON.stringify({ set: "chemistry", chemistry: seed })))));
        }
    }
    load();
}
