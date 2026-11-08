// Pure hydrogen equations. TMT owns player data, Decimal resources, ticks and saves.
var HydrogenSimulation = (function () {
// Deterministic, DOM-free hydrogen simulation. Quantities are game units.
const CLOUD_COST = 32;
const OFFLINE_LIMIT = 4 * 60 * 60;
const STEP = 0.1;
const LIMIT = 1e12;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function createState() {
  return { atoms: 0, molecules: 0, captured: 0,
    formed: 0, heat: 18, allocation: 0.6, pulseCooldown: 0,
    elapsed: 0, completed: false, paused: false };
}

function rates(state) {
  const capture = 0.2 + state.allocation * 2.2;
  // High input power collects faster but heats the chamber and inhibits bonding.
  const efficiency = clamp(1 - Math.max(0, state.heat - 28) / 85, 0.12, 1);
  const capacity = (1 - state.allocation) * 1.4 * efficiency;
  // Atom supply also limits the actual rate; include incoming atoms for this step.
  const synthesis = Math.min(capacity, (state.atoms / STEP + capture) / 2);
  return { capture, capacity, synthesis, efficiency, netAtoms: capture - 2 * synthesis };
}

function advance(state, seconds) {
  if (state.paused || !Number.isFinite(seconds) || seconds <= 0) return state;
  let remaining = Math.min(seconds, OFFLINE_LIMIT);
  while (remaining > 1e-8) {
    const dt = Math.min(STEP, remaining);
    const { capture, capacity } = rates(state);
    const incoming = capture * dt;
    state.atoms = Math.min(LIMIT, state.atoms + incoming);
    state.captured = Math.min(LIMIT, state.captured + incoming);
    const bonded = Math.min(capacity * dt, state.atoms / 2, LIMIT - state.molecules);
    state.atoms = Math.max(0, state.atoms - bonded * 2);
    state.molecules += bonded;
    state.formed = Math.min(LIMIT, state.formed + bonded);
    const targetHeat = 12 + state.allocation * 88 + (bonded / dt) * 5;
    state.heat = clamp(targetHeat + (state.heat - targetHeat) * Math.exp(-dt / 12), 0, 100);
    state.pulseCooldown = Math.max(0, state.pulseCooldown - dt);
    state.elapsed += dt;
    remaining -= dt;
  }
  return state;
}

function pulse(state) {
  if (state.paused || state.pulseCooldown > 0) return false;
  state.atoms = Math.min(LIMIT, state.atoms + 4);
  state.captured = Math.min(LIMIT, state.captured + 4);
  state.heat = Math.min(100, state.heat + 8);
  state.pulseCooldown = 4;
  return true;
}

function formCloud(state) {
  if (state.paused || state.completed || state.molecules + 1e-9 < CLOUD_COST) return false;
  state.molecules = Math.max(0, state.molecules - CLOUD_COST);
  state.completed = true;
  return true;
}


return { createState, rates, advance, pulse, formCloud, CLOUD_COST, OFFLINE_LIMIT };
})();
