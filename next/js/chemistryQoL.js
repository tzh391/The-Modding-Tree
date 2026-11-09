/* Shared assignment helpers: moving staff never creates or spends Chemists. */
var ChemistryQoL = (function () {
    function unlocked() { return player.chem.unlocked && player.chem.total.gte(20); }
    function valid(role, element) {
        return ["workers", "scientists"].includes(role) && Object.prototype.hasOwnProperty.call(player.chem[role], element) &&
            (!["K", "Ca"].includes(element) || hasUpgrade("chem", 11));
    }
    function limit(role, element) {
        return valid(role, element) ? player.chem.points.plus(player.chem[role][element]).floor().max(0) : new Decimal(0);
    }
    function assign(role, element, target) {
        if (!unlocked() || !valid(role, element) || !["number", "string", "object"].includes(typeof target) || target === null) return false;
        if (typeof target === "string" && !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(target.trim())) return false;
        if (typeof target === "object" && !(target instanceof Decimal)) return false;
        let desired;
        try { desired = new Decimal(target); } catch (_) { return false; }
        if (!Number.isFinite(desired.mag) || !Number.isFinite(desired.layer) || !Number.isFinite(desired.sign)) return false;
        desired = desired.floor().max(0).min(limit(role, element));
        const previous = player.chem[role][element];
        player.chem.points = player.chem.points.plus(previous).sub(desired);
        player.chem[role][element] = desired;
        return true;
    }
    function sliderMax(role, element) { return Math.max(1, limit(role, element).min(1000).toNumber()); }
    function sliderValue(role, element) {
        const pool = limit(role, element);
        if (pool.eq(0)) return 0;
        return player.chem[role][element].div(pool).times(sliderMax(role, element)).round().toNumber();
    }
    function slide(role, element, position) {
        const maximum = sliderMax(role, element);
        if (!Number.isFinite(Number(position))) return false;
        const value = Math.max(0, Math.min(maximum, Number(position)));
        const pool = limit(role, element);
        return assign(role, element, value === maximum ? pool : pool.times(value).div(maximum).floor());
    }
    function widgetRate() { return hasMilestone("r", 15) ? tmp.r.widgets.getResetGain : new Decimal(0); }
    return { unlocked, limit, assign, sliderMax, sliderValue, slide, widgetRate };
})();
