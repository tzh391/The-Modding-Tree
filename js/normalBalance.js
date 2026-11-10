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
    // Actual Life Point costs: index 0 is Token 1, index 1 is Token 2.
    const tokenPrices = ["1e6600", "1e7760"];
    const normalTokenPrice = () => normal() && tmp.tokens.getMinusEffectiveTokens.eq(0)
        ? tokenPrices[player.tokens.total.toString()] : undefined;
    const originalNextAt = tokenNextAt;
    tokenNextAt = function () {
        const price = normalTokenPrice();
        return price === undefined ? originalNextAt() : new Decimal(price);
    };
    // Permit exact equality for the two adjusted Normal Mode Token prices.
    const originalTokenGain = layers.tokens.getResetGain;
    layers.tokens.getResetGain = function () {
        const price = normalTokenPrice();
        if (price !== undefined) return new Decimal(tmp.tokens.baseAmount.gte(price) ? 1 : 0);
        return originalTokenGain();
    };
}
