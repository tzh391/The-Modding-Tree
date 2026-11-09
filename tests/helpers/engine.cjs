const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = path.join(__dirname, '../..');
function engine(search = '', initialStorage = [], earlyModFiles = false) {
    const storage = new Map(initialStorage);
    const style = { setProperty() {} };
    const element = { style, classList: { add() {}, remove() {} }, appendChild() {}, removeChild() {},
        select() {}, setSelectionRange() {}, getContext() { return {}; } };
    const ctx = vm.createContext({ console, URLSearchParams, Math, Date,
        setInterval() {}, setTimeout() {}, clearInterval() {}, clearTimeout() {},
        alert(message) { throw new Error(message); }, confirm() { return false; }, prompt() { return null; },
        btoa: x => Buffer.from(x, 'binary').toString('base64'), atob: x => Buffer.from(x, 'base64').toString('binary'),
        location: { search }, navigator: { userAgent: 'node-test', platform: 'test' },
        localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) },
        window: { addEventListener() {}, innerWidth: 1440, innerHeight: 900 },
        document: { documentElement: element, body: element, head: element, createElement: () => element,
            getElementById: () => element, getElementsByClassName: () => [], addEventListener() {}, querySelector: () => element, execCommand() {} },
        Vue: { component() {}, set(object, key, value) { object[key] = value; }, observable: x => x },
    });
    const evaluate = filename => vm.runInContext(fs.readFileSync(path.join(base, filename.split("?")[0]), 'utf8'), ctx, { filename });
    const scripts = [...fs.readFileSync(path.join(base, 'index.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1].split("?")[0]);
    const modFiles = () => { for (const file of vm.runInContext('modInfo.modFiles', ctx)) evaluate('js/' + file); };
    for (const file of scripts) {
        if (file === 'js/technical/loader.js' && earlyModFiles) modFiles();
        if (!['js/vueFile.js', 'js/technical/loader.js', 'js/continuationBoot.js'].includes(file)) evaluate(file);
    }
    if (!earlyModFiles) modFiles();
    evaluate('js/continuationBoot.js');
    ctx.loadVue = () => {};
    ctx.resizeCanvas = () => {};
    return { ctx, storage, run: code => vm.runInContext(code, ctx) }; 
}

module.exports = { engine };
