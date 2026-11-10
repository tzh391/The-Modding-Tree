/* User-tested price adjustments for the original Normal Mode progression. */
function installNormalBalance() {
    const normal = () => !player.easyMode && !player.hardMode && !player.extremeMode;
    const hydrogenPrices = { 61: "7.77e777", 62: "1e800", 63: "1e1000", 64: "1e1040", 65: "1e1319" };
    for (const [id, price] of Object.entries(hydrogenPrices)) {
        const originalCost = layers.h.upgrades[id].cost;
        layers.h.upgrades[id].cost = function () {
            return normal() ? new Decimal(price) : originalCost();
        };
    }
    const originalNextAt = tokenNextAt;
    const firstNormalToken = () => normal() && player.tokens.total.eq(0) && tmp.tokens.getMinusEffectiveTokens.eq(0);
    tokenNextAt = function () {
        return firstNormalToken() ? new Decimal("1e6600") : originalNextAt();
    };
    // The original custom prestige uses a strict comparison. Allow the new
    // first-token price exactly, as well as amounts above it.
    const originalTokenGain = layers.tokens.getResetGain;
    layers.tokens.getResetGain = function () {
        if (firstNormalToken() && tmp.tokens.baseAmount.gte(tmp.tokens.getNextAt)) return new Decimal(1);
        return originalTokenGain();
    };
}
