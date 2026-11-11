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
}
