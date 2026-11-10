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

// File imports create a separate save slot and keep the active slot intact.
function importContinuationSaveAsNew(encoded) {
    let decoded;
    try { decoded = JSON.parse(decodeURIComponent(escape(atob(encoded.trim())))); }
    catch (_) { throw new Error("Invalid save file."); }
    if (!decoded || typeof decoded !== "object" || Array.isArray(decoded) || !decoded.r || !decoded.chem || !decoded.hu || decoded.points === undefined) throw new Error("This is not a Tree of Life save.");
    const previousPlayer = player, previousNaNAlert = NaNalert;
    try {
        const candidate = Object.assign(getStartPlayer(), decoded);
        candidate.versionType = modInfo.id;
        player = candidate;
        fixSave();
        versionCheck();
        if (!NaNcheck(player)) throw new Error("Invalid resource data.");
    } catch (_) {
        player = previousPlayer;
        NaNalert = previousNaNAlert;
        throw new Error("Invalid save file. Existing saves were kept.");
    }
    let number = 1;
    while (allSaves["Imported " + number] !== undefined) number++;
    const name = "Imported " + number;
    allSaves[name] = player;
    loadSave(name);
    return name;
}
