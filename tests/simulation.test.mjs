import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, advance, pulse, rates, formCloud, restoreSave, applyOffline, CLOUD_COST, OFFLINE_LIMIT } from '../js/remake/simulation.js';
import { messages } from '../js/remake/i18n.js';
import { DEFAULT_LOCALE } from '../js/remake/config.js';

test('the first chapter is completable passively and preserves every hydrogen atom', () => {
  const s = createState();
  advance(s, 180);
  assert.ok(s.molecules >= CLOUD_COST);
  assert.ok(Math.abs(s.captured - s.atoms - 2 * s.molecules) < 1e-6);
  assert.ok(formCloud(s));
  assert.ok(!formCloud(s));
  assert.equal(s.completed, true);
  assert.ok(Math.abs(s.captured - s.atoms - 2 * (s.molecules + CLOUD_COST)) < 1e-6);
  assert.deepEqual(restoreSave(JSON.parse(JSON.stringify(s))), s);
});

test('power endpoints cannot create free molecules or negative resources', () => {
  for (const allocation of [0, 0.2, 0.5, 0.85, 1]) {
    const s = createState(); s.allocation = allocation; advance(s, 300);
    assert.ok(s.atoms >= 0 && s.molecules >= 0);
    assert.ok(Math.abs(s.captured - s.atoms - 2 * s.molecules) < 1e-6);
    assert.ok(Number.isFinite(s.heat) && s.heat >= 0 && s.heat <= 100);
    if (allocation === 1) assert.equal(s.molecules, 0);
  }
});

test('high temperature inhibits bonding; low collection power lets the chamber cool', () => {
  const s = createState(); s.atoms = 100; s.heat = 90;
  const hot = rates(s).capacity; s.heat = 20;
  assert.ok(rates(s).capacity > hot);
  s.heat = 90; s.allocation = 0.2; advance(s, 60);
  assert.ok(s.heat < 40);
});

test('capture pulse has a real cooldown; pause stops all player actions and production', () => {
  const s = createState(); assert.ok(pulse(s)); assert.equal(s.atoms, 4);
  assert.ok(!pulse(s)); advance(s, 4.1); assert.ok(pulse(s));
  s.paused = true; const snapshot = structuredClone(s);
  advance(s, 60); assert.deepEqual(s, snapshot);
  assert.ok(!pulse(s)); s.molecules = 100; assert.ok(!formCloud(s));
});

test('large elapsed intervals give the same production as smaller steps', () => {
  const a = createState(), b = structuredClone(a);
  advance(a, 120);
  for (let i = 0; i < 1200; i++) advance(b, 0.1);
  for (const key of ['atoms', 'molecules', 'heat', 'elapsed']) assert.ok(Math.abs(a[key] - b[key]) < 1e-6);
});

test('offline advancement is capped and respects paused saves', () => {
  const s = createState(); s.savedAt = 1000;
  assert.equal(applyOffline(s, 1000 + 1000 * OFFLINE_LIMIT * 2), OFFLINE_LIMIT);
  assert.ok(Math.abs(s.elapsed - OFFLINE_LIMIT) < 1e-6);
  assert.ok(Number.isFinite(s.molecules));
  const paused = createState(); paused.paused = true; paused.savedAt = 1000;
  assert.equal(applyOffline(paused, 100000), 0); assert.equal(paused.elapsed, 0);
  const future = createState(); future.savedAt = 100000;
  assert.equal(applyOffline(future, 1000), 0);
});

test('invalid and original-game saves are rejected without repairing them into valid progress', () => {
  for (const raw of [null, {}, { version: 2 }, { ...createState(), heat: NaN }, { ...createState(), atoms: -1 }, { ...createState(), allocation: 2 }, { ...createState(), completed: 'yes' }, { ...createState(), molecules: 32 }]) {
    assert.throws(() => restoreSave(raw));
  }
});

test('both locales cover every label and default locale is supported', () => {
  assert.deepEqual(Object.keys(messages.zh).sort(), Object.keys(messages.en).sort());
  assert.ok(messages[DEFAULT_LOCALE]);
  assert.equal(messages.zh.roadmap.length, messages.en.roadmap.length);
});
