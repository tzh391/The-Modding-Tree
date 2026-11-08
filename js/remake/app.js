import { DEFAULT_LOCALE } from './config.js';
import { messages } from './i18n.js';
import { SAVE_KEY, CLOUD_COST, createState, rates, advance, pulse, formCloud, restoreSave, applyOffline } from './simulation.js';

const $ = (id) => document.getElementById(id);
let locale = DEFAULT_LOCALE;
let state = createState();
let storageBlocked = false;
let corruptRaw = null;
let offlineSeconds = 0;
let canvas, context, observer;
let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
try {
  const queryLocale = new URLSearchParams(location.search).get('lang');
  const preference = localStorage.getItem(`${SAVE_KEY}-locale`);
  locale = ['zh', 'en'].includes(queryLocale) ? queryLocale : ['zh', 'en'].includes(preference) ? preference : DEFAULT_LOCALE;
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) {
    try { state = restoreSave(JSON.parse(raw)); offlineSeconds = applyOffline(state); }
    catch { corruptRaw = raw; }
  }
} catch { storageBlocked = true; }

const t = (key) => messages[locale][key];
const number = (n, digits = 1) => n.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });

function save() {
  if (corruptRaw !== null) return;
  state.savedAt = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); storageBlocked = false; }
  catch { storageBlocked = true; }
  if ($('save-status')) $('save-status').textContent = t(storageBlocked ? 'saveFail' : 'saveOk');
}

function notify(text) {
  $('notice').textContent = text;
  $('notice').hidden = false;
}

function render() {
  observer?.disconnect();
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  document.title = t('title');
  $('app').innerHTML = `
    <header class="topbar">
      <a class="brand" href="./" aria-label="${t('brand')}"><span class="brand-mark" aria-hidden="true">✳</span><strong>${t('brand')}</strong><span class="edition">${t('edition')}</span></a>
      <div class="top-actions"><span class="live-status"><i id="live-dot"></i><span id="live-status"></span></span><button id="pause" class="quiet"></button><button id="language" class="language" aria-label="${t('localeLabel')}">${locale === 'zh' ? 'EN' : '中文'} <span aria-hidden="true">↗</span></button></div>
    </header>
    <div class="shell">
      <aside class="journey"><p class="eyebrow">${t('journey')}</p><ol class="path">${t('roadmap').map((name, i) => `<li class="${i === 0 ? 'current' : 'future'}" ${i === 0 ? 'aria-current="step"' : ''}><span class="path-dot">${i === 0 ? 'H' : String(i + 1).padStart(2, '0')}</span><span>${name}${i > 0 ? `<small>${t('future')}</small>` : '<small>01 / 07</small>'}</span>${i === 0 ? '<span class="path-arrow" aria-hidden="true">↗</span>' : ''}</li>`).join('')}</ol><div class="journey-end"><span class="tiny-orbit" aria-hidden="true">◎</span><p>${t('footer')}</p></div></aside>
      <main>
        <div id="notice" class="notice" role="status" hidden></div>
        <section class="intro"><div><p class="eyebrow">${t('chapter')}</p><h1>${t('headline')}</h1><p class="intro-copy">${t('intro')}</p></div><div class="element-tile" aria-hidden="true"><span>1</span><strong>H</strong><small>1.008</small></div></section>
        <div class="workspace">
          <section class="experiment" aria-labelledby="chamber-heading">
            <div class="panel-top"><div><h2 id="chamber-heading">${t('chamber')}</h2><p>${t('chamberSub')}</p></div><span class="coordinate">H · 01</span></div>
            <div class="chamber"><canvas id="particles" role="img" aria-label="${t('canvasLabel')}"></canvas><div class="chamber-tag">${t('symbol')}</div><div class="atom-caption"><strong>H</strong><span>${t('composition')}</span></div><span class="chamber-scale" aria-hidden="true">└── 1 u</span></div>
            <div class="resources"><div><span class="resource-label">${t('atomLabel')} <b>H</b></span><strong id="atoms">0.0</strong><small><span id="capture-rate"></span> ${t('perSecond')}</small><p>${t('atomHelp')}</p></div><div><span class="resource-label">${t('moleculeLabel')} <b>H₂</b></span><strong id="molecules">0.0</strong><small><span id="synthesis-rate"></span> ${t('perSecond')}</small><p>${t('moleculeHelp')}</p></div></div>
            <div class="pulse-row"><div><button id="pulse" class="primary">${t('pulse')} <span aria-hidden="true">↗</span></button><small>${t('pulseHelp')}</small></div><span id="pulse-status" class="mono"></span></div>
          </section>
          <aside class="research-panel">
            <section class="objective" aria-labelledby="objective-title"><p class="eyebrow"><span class="status-spark" aria-hidden="true">✧</span> ${t('objective')}</p><h2 id="objective-title">${t('cloudTitle')}</h2><p>${t('cloudDesc')}</p><div class="progress-label"><span>H₂</span><strong id="cloud-count">0 / 32</strong></div><div id="cloud-progress" class="progress" role="progressbar" aria-label="${t('cloudTitle')}" aria-valuemin="0" aria-valuemax="32"><div id="cloud-fill"></div></div><button id="cloud" class="cloud-button"></button><small id="cloud-help"></small></section>
            <section class="notes"><div class="notes-title"><h2>${t('notes')}</h2><span aria-hidden="true">↙</span></div><p id="note-empty">${t('noteEmpty')}</p><ol>${[['atom', 'noteAtom', 'noteAtomBody'], ['bond', 'noteBond', 'noteBondBody'], ['cloud', 'noteCloud', 'noteCloudBody']].map(([id, title, body], i) => `<li id="note-${id}" hidden><span class="note-number">0${i + 1}</span><div><h3>${t(title)}</h3><p>${t(body)}</p></div></li>`).join('')}</ol></section>
          </aside>
          <section class="controls" aria-labelledby="control-title"><div class="control-copy"><p class="eyebrow">02 / CONTROL</p><h2 id="control-title">${t('control')}</h2><p>${t('controlHelp')}</p></div><div class="allocation"><div class="allocation-labels"><label for="allocation">${t('capture')} <strong id="capture-share">60%</strong></label><span>${t('synthesis')} <strong id="bond-share">40%</strong></span></div><input id="allocation" type="range" min="0" max="100" step="1" value="${Math.round(state.allocation * 100)}" aria-label="${t('control')}"><div class="presets">${t('presets').map((label, i) => `<button data-preset="${[85, 50, 20][i]}">${label}</button>`).join('')}</div><div class="reaction-line"><span>${t('equation')}</span><span>${t('efficiency')} <b id="efficiency"></b></span></div></div><div class="thermal"><div class="thermal-label"><span>${t('temperature')}</span><strong id="heat"></strong></div><div class="heat-track"><div id="heat-fill"></div></div><p id="reaction-hint"></p></div></section>
        </div>
        <section id="completion" class="completion" role="status" hidden><span aria-hidden="true">✳</span><div><h2>${t('completeTitle')}</h2><p>${t('completeDesc')}</p></div></section>
        <footer><div><span class="saved-dot"></span><span id="save-status">${t('saveOk')}</span><span class="save-location"> · ${t('localSave')}</span></div><div class="save-actions"><button id="export">${t('export')}</button><button id="import">${t('import')}</button><button id="reset">${t('reset')}</button></div></footer>
        <p class="footnote">${t('abstract')}</p>
      </main>
    </div>
    <dialog id="save-dialog" aria-labelledby="dialog-title"><form method="dialog"><button class="dialog-close quiet" aria-label="${t('close')}">×</button></form><p class="eyebrow">TREE OF LIFE / SAVE</p><h2 id="dialog-title"></h2><p id="dialog-help"></p><label id="save-label" for="save-data">${t('saveText')}</label><textarea id="save-data" rows="7" spellcheck="false"></textarea><p id="dialog-error" class="error" role="alert" hidden></p><div class="dialog-actions"><button id="dialog-cancel" class="quiet">${t('cancel')}</button><button id="dialog-action" class="primary"></button></div></dialog>`;
  $('language').addEventListener('click', () => {
    locale = locale === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem(`${SAVE_KEY}-locale`, locale); } catch { /* Game still works without storage. */ }
    const url = new URL(location.href); url.searchParams.set('lang', locale); history.replaceState(null, '', url);
    save(); render();
  });
  $('pause').addEventListener('click', () => { state.paused = !state.paused; save(); update(); });
  $('pulse').addEventListener('click', () => { if (pulse(state)) { save(); update(); } });
  $('cloud').addEventListener('click', () => { if (formCloud(state)) { save(); update(); } });
  $('allocation').addEventListener('input', (event) => { state.allocation = Number(event.target.value) / 100; update(); });
  $('allocation').addEventListener('change', save);
  document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
    state.allocation = Number(button.dataset.preset) / 100; $('allocation').value = button.dataset.preset; save(); update();
  }));
  for (const action of ['export', 'import', 'reset']) $(action).addEventListener('click', () => openDialog(action));
  $('dialog-cancel').addEventListener('click', () => $('save-dialog').close());
  canvas = $('particles'); context = canvas.getContext('2d');
  observer = new ResizeObserver(() => {
    const rect = canvas.getBoundingClientRect(); const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * scale); canvas.height = Math.round(rect.height * scale);
    context?.setTransform(scale, 0, 0, scale, 0, 0);
  });
  observer.observe(canvas);
  update();
  if (corruptRaw !== null) notify(t('corruptSave'));
  else if (offlineSeconds >= 10) { notify(t('offline').replace('{n}', number(offlineSeconds, 0))); offlineSeconds = 0; }
}

function update() {
  const current = rates(state);
  $('atoms').textContent = number(state.atoms);
  $('molecules').textContent = number(state.molecules);
  $('capture-rate').textContent = `+${number(state.paused ? 0 : current.capture, 2)}`;
  $('synthesis-rate').textContent = `+${number(state.paused ? 0 : current.synthesis, 2)}`;
  $('capture-share').textContent = `${Math.round(state.allocation * 100)}%`;
  $('bond-share').textContent = `${100 - Math.round(state.allocation * 100)}%`;
  $('efficiency').textContent = `${Math.round(current.efficiency * 100)}%`;
  $('heat').textContent = `${number(state.heat, 0)}°`;
  $('heat-fill').style.width = `${state.heat}%`;
  $('heat-fill').classList.toggle('hot', state.heat > 72);
  $('pulse').disabled = state.paused || state.pulseCooldown > 0;
  $('pulse-status').textContent = state.pulseCooldown > 0 ? `${number(state.pulseCooldown)} ${t('seconds')}` : t('pulseReady');
  $('pause').textContent = t(state.paused ? 'resume' : 'pause');
  $('live-status').textContent = t(state.paused ? 'paused' : 'live');
  $('live-dot').classList.toggle('paused', state.paused);
  $('allocation').disabled = state.paused;
  document.querySelectorAll('[data-preset]').forEach(button => { button.disabled = state.paused; button.setAttribute('aria-pressed', String(Math.abs(Number(button.dataset.preset) / 100 - state.allocation) < 0.001)); });
  const progress = state.completed ? CLOUD_COST : Math.min(CLOUD_COST, state.molecules);
  $('cloud-count').textContent = `${number(progress, 1)} / ${CLOUD_COST}`;
  $('cloud-fill').style.width = `${progress / CLOUD_COST * 100}%`;
  $('cloud-progress').setAttribute('aria-valuenow', progress.toFixed(1));
  $('cloud').disabled = state.paused || state.completed || state.molecules < CLOUD_COST;
  $('cloud').textContent = t(state.completed ? 'completed' : 'formCloud');
  $('cloud-help').textContent = state.completed ? '✓' : t('needMolecules').replace('{n}', number(Math.max(0, CLOUD_COST - state.molecules)));
  $('completion').hidden = !state.completed;
  $('note-atom').hidden = state.captured < 8;
  $('note-bond').hidden = state.formed < 1;
  $('note-cloud').hidden = !state.completed;
  $('note-empty').hidden = state.captured >= 8 || state.formed >= 1 || state.completed;
  const hint = state.allocation >= 0.99 ? 'collecting' : state.heat > 72 ? 'hot' : current.synthesis + 0.01 < current.capacity ? 'lowAtoms' : 'balanced';
  $('reaction-hint').textContent = t(hint);
  $('save-status').textContent = t(storageBlocked ? 'saveFail' : 'saveOk');
}

function openDialog(mode) {
  save();
  const field = $('save-data');
  const isReset = mode === 'reset';
  $('dialog-title').textContent = t(`${mode}Title`);
  $('dialog-help').textContent = t(`${mode}Help`);
  $('save-label').hidden = isReset; field.hidden = isReset;
  field.readOnly = mode === 'export';
  field.value = mode === 'export' ? (corruptRaw ?? JSON.stringify(state, null, 2)) : '';
  $('dialog-error').hidden = true;
  const button = $('dialog-action');
  button.hidden = mode === 'export';
  button.textContent = t(mode === 'import' ? 'importAction' : 'resetAction');
  button.onclick = () => {
    if (isReset) {
      state = createState(); corruptRaw = null;
      $('notice').hidden = true;
    } else {
      try { const imported = restoreSave(JSON.parse(field.value)); applyOffline(imported); state = imported; corruptRaw = null; }
      catch { $('dialog-error').textContent = t('invalidSave'); $('dialog-error').hidden = false; return; }
    }
    $('allocation').value = Math.round(state.allocation * 100);
    save(); update(); $('save-dialog').close();
    if (!isReset) notify(t('imported'));
  };
  $('save-dialog').showModal();
  if (mode === 'export') { field.focus(); field.select(); }
}

function draw(time) {
  if (!context) return;
  const { width: w, height: h } = canvas.getBoundingClientRect();
  const ctx = context; ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2 - 8, radius = Math.min(w * 0.26, h * 0.37);
  const clock = state.paused || reducedMotion ? 0 : time / 1000;
  const glow = ctx.createRadialGradient(cx, cy, 3, cx, cy, radius * 1.5);
  glow.addColorStop(0, 'rgba(172,207,157,.25)'); glow.addColorStop(1, 'rgba(172,207,157,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
  const point = (x, y, size, color) => { ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); };
  const count = Math.min(26, Math.floor(state.captured / 3));
  for (let i = 0; i < count; i++) {
    const angle = i * 2.399 + clock * (i % 2 ? 0.018 : -0.018);
    const distance = radius * (1.45 + (i % 5) / 8);
    const x = cx + Math.cos(angle) * distance, y = cy + Math.sin(angle) * distance * 0.66;
    point(x, y, 2.5, 'rgba(73,115,93,.5)');
    if (i < Math.floor(state.formed / 2)) {
      ctx.strokeStyle = 'rgba(82,123,104,.25)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 9, y + 4); ctx.stroke();
      point(x + 9, y + 4, 2.5, 'rgba(73,115,93,.5)');
    }
  }
  for (let i = 0; i < 3; i++) {
    const angle = i * Math.PI / 3;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
    ctx.strokeStyle = 'rgba(72,109,87,.23)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(0, 0, radius, radius * 0.37, 0, 0, Math.PI * 2); ctx.stroke();
    if (i === 0) {
      const x = Math.cos(clock * 0.9) * radius, y = Math.sin(clock * 0.9) * radius * 0.37;
      ctx.shadowBlur = 16; ctx.shadowColor = '#718f53'; point(x, y, 5, '#74894d'); ctx.shadowBlur = 0;
    }
    ctx.restore();
  }
  point(cx, cy, 19, 'rgba(132,171,107,.15)'); point(cx, cy, 11, '#709451');
  point(cx - 3, cy - 3, 4, 'rgba(221,239,197,.55)');
  ctx.font = '11px ui-monospace, monospace'; ctx.fillStyle = '#869081';
  ctx.fillText('p⁺', cx + 24, cy + 4);
  ctx.fillText('e⁻', cx + radius + 11, cy + 4);
  ctx.strokeStyle = 'rgba(100,120,100,.22)';
  ctx.setLineDash([3, 6]); ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, h - 38); ctx.stroke(); ctx.setLineDash([]);
}

render();
let lastFrame = performance.now(), lastUpdate = 0, lastSave = lastFrame;
function frame(now) {
  if (!document.hidden) {
    advance(state, Math.max(0, (now - lastFrame) / 1000));
    if (now - lastUpdate > 100) { update(); lastUpdate = now; }
    if (now - lastSave > 5000) { save(); lastSave = now; }
    draw(now);
  }
  lastFrame = now;
  requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) save();
  else { if (corruptRaw === null) offlineSeconds = applyOffline(state); lastFrame = performance.now(); update(); }
});
window.addEventListener('pagehide', save);
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => { reducedMotion = event.matches; });
requestAnimationFrame(frame);
