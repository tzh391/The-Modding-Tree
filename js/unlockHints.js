/* Read-only descriptions of the existing unlock predicates. No evaluation of source strings. */
var UnlockHints = (function () {
    const cache = new WeakMap();
    function parse(fn) {
        if (cache.has(fn)) return cache.get(fn);
        const source = fn.toString().replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
        const body = source.slice(source.indexOf("{") + 1, source.lastIndexOf("}"));
        const tokens = body.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[A-Za-z_$][\w$]*|>=|<=|===|!==|&&|\|\||[(){}\[\].,;!?:<>+=-]/gi) || [];
        let i = 0;
        const take = value => tokens[i] === value ? (++i, true) : false;
        const expect = value => { if (!take(value)) throw new Error("Unsupported unlock syntax: " + tokens[i]); };
        function primary() {
            let node, token = tokens[i++];
            if (token === "(") { node = expression(); expect(")"); }
            else if (token === "!") node = { type: "not", value: primary() };
            else if (token === "-") node = { type: "negative", value: primary() };
            else if (/^["']/.test(token || "")) node = { type: "literal", value: token.slice(1, -1).replace(/\\(['"\\])/g, "$1") };
            else if (/^(\d|\.\d)/.test(token || "")) node = { type: "literal", value: Number(token) };
            else if (["true", "false"].includes(token)) node = { type: "literal", value: token === "true" };
            else if (/^[A-Za-z_$][\w$]*$/.test(token || "")) node = { type: "name", value: token };
            else throw new Error("Unsupported unlock token: " + token);
            while (true) {
                if (take(".")) node = { type: "member", object: node, key: { type: "literal", value: tokens[i++] } };
                else if (take("[")) { const key = expression(); expect("]"); node = { type: "member", object: node, key }; }
                else if (take("(")) {
                    const args = [];
                    if (!take(")")) { do { args.push(expression()); } while (take(",")); expect(")"); }
                    node = { type: "call", callee: node, args };
                } else break;
            }
            return node;
        }
        function comparison() {
            let node = primary();
            if ([">=", "<=", ">", "<", "===", "!=="].includes(tokens[i])) node = { type: "binary", op: tokens[i++], left: node, right: primary() };
            return node;
        }
        function and() { let n = comparison(); while (take("&&")) n = { type: "binary", op: "&&", left: n, right: comparison() }; return n; }
        function or() { let n = and(); while (take("||")) n = { type: "binary", op: "||", left: n, right: and() }; return n; }
        function expression() {
            const n = or();
            if (!take("?")) return n;
            const yes = expression(); expect(":"); return { type: "conditional", condition: n, yes, no: expression() };
        }
        function statement() {
            if (take("{")) { const list = []; while (!take("}")) list.push(statement()); return { type: "block", list }; }
            if (take("if")) { expect("("); const condition = expression(); expect(")"); return { type: "if", condition, yes: statement() }; }
            if (take("let") || take("const") || take("var")) { const name = tokens[i++]; expect("="); const value = expression(); take(";"); return { type: "declaration", name, value }; }
            expect("return"); const value = expression(); take(";"); return { type: "return", value };
        }
        const list = []; while (i < tokens.length) list.push(statement());
        const ast = { type: "block", list }; cache.set(fn, ast); return ast;
    }
    const compare = (op, a, b) => {
        const d = new Decimal(a);
        return ({ ">=": () => d.gte(b), ">": () => d.gt(b), "<=": () => d.lte(b), "<": () => d.lt(b), "===": () => a === b, "!==": () => a !== b })[op]();
    };
    function value(n) {
        if (n.type === "literal") return n.value;
        if (n.type === "name") {
            const roots = { player, tmp, layers, hasUpgrade, hasMilestone, hasChallenge, getBuyableAmount };
            if (!(n.value in roots)) throw new Error("Unknown unlock identifier");
            return roots[n.value];
        }
        if (n.type === "member") return value(n.object)?.[value(n.key)];
        if (n.type === "not") return !value(n.value);
        if (n.type === "negative") return -value(n.value);
        if (n.type === "conditional") return value(value(n.condition) ? n.yes : n.no);
        if (n.type === "binary") {
            if (n.op === "&&") return value(n.left) && value(n.right);
            if (n.op === "||") return value(n.left) || value(n.right);
            return compare(n.op, value(n.left), value(n.right));
        }
        if (n.type === "call") {
            if (n.callee.type === "name" && ["hasUpgrade", "hasMilestone", "hasChallenge", "getBuyableAmount"].includes(n.callee.value)) return value(n.callee)(...n.args.map(value));
            if (n.callee.type === "member" && ["gte", "gt", "eq", "getGemEffect"].includes(value(n.callee.key))) return value(n.callee.object)[value(n.callee.key)](...n.args.map(value));
        }
        throw new Error("Unsupported unlock expression");
    }
    function selected(statement, locals = {}) {
        function substitute(n) {
            if (!n || typeof n !== "object") return n;
            if (Array.isArray(n)) return n.map(substitute);
            if (n.type === "name" && n.value in locals) return locals[n.value];
            return Object.fromEntries(Object.entries(n).map(([key, child]) => [key, substitute(child)]));
        }
        if (statement.type === "return") return substitute(statement.value);
        if (statement.type === "declaration") { locals[statement.name] = substitute(statement.value); return null; }
        if (statement.type === "if") return value(substitute(statement.condition)) ? selected(statement.yes, locals) : null;
        for (const child of statement.list) { const result = selected(child, locals); if (result) return result; }
        return null;
    }
    const clean = text => String(text || "").replace(/<[^>]*>/g, "").trim();
    const escape = text => String(text).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    const layerName = id => clean(layers[id]?.name || id);
    const title = (layer, kind, id) => {
        const item = layers[layer]?.[kind]?.[id];
        try { return clean(tmp[layer]?.[kind]?.[id]?.title || (typeof item?.title === "function" ? item.title() : item?.title)) || (kind === "upgrades" ? "Upgrade " : "Buyable ") + id; }
        catch (_) { return (kind === "upgrades" ? "Upgrade " : "Buyable ") + id; }
    };
    function path(n) {
        if (n.type === "name") return [n.value];
        if (n.type === "member") { const p = path(n.object); return p ? [...p, value(n.key)] : null; }
        return null;
    }
    function label(n) {
        if (n.type === "call" && n.callee.type === "name" && n.callee.value === "getBuyableAmount") return "levels of " + title(value(n.args[0]), "buyables", value(n.args[1]));
        if (n.type === "call" && n.callee.type === "member" && value(n.callee.key) === "getGemEffect") return "effect of Gem " + value(n.args[0]);
        const p = path(n);
        if (!p || p[0] !== "player") return null;
        const layer = p[1], field = p[2];
        if (field === "buyables") return "levels of " + title(layer, "buyables", p[3]);
        if (field === "challenges") return "completions of " + clean(layers[layer]?.challenges?.[p[3]]?.name || "Challenge " + p[3]) + " (" + layerName(layer) + ")";
        if (field === "upgrades" || field === "milestones") return layerName(layer) + " " + (field === "upgrades" ? "upgrades purchased" : "milestones");
        if (field === "times") return layerName(layer) + " resets";
        if (field === "grid") return layerName(layer) + " grid " + p[3] + " " + p.slice(4).join(" ");
        if (layer === "chem" && ["amount", "best_amount"].includes(field)) return (field === "best_amount" ? "best " : "") + (chemAbbrev[p[3]] || p[3]);
        const prefix = field === "best" ? "best " : field === "total" ? "total " : "";
        if (["points", "best", "total"].includes(field)) return prefix + clean(layers[layer]?.resource || layerName(layer));
        return (p[p.length - 1] === "best" ? "best " : p[p.length - 1] === "total" ? "total " : "") + field.replace(/_/g, " ");
    }
    function describe(n, owner, id) {
        if (n.type === "conditional") return describe(value(n.condition) ? n.yes : n.no, owner, id);
        if (n.type === "binary" && ["&&", "||"].includes(n.op)) {
            // Only show the unmet part of conjunctions. Keep alternatives distinct.
            const a = n.op === "&&" && value(n.left) ? null : describe(n.left, owner, id);
            const b = n.op === "&&" && value(n.right) ? null : describe(n.right, owner, id);
            return a && b ? "(" + a + (n.op === "&&" ? " and " : " or ") + b + ")" : a || b;
        }
        if (n.type === "call" && n.callee.type === "name") {
            const layer = value(n.args[0]), target = value(n.args[1]);
            if (n.callee.value === "hasUpgrade") {
                if (layer === owner && Number(target) === Number(id)) return null;
                return "purchase " + title(layer, "upgrades", target);
            }
            if (n.callee.value === "hasMilestone") {
                let requirement = "";
                try { const m = layers[layer].milestones[target]; requirement = clean(typeof m.requirementDescription === "function" ? m.requirementDescription() : m.requirementDescription); } catch (_) {}
                return layerName(layer) + " milestone " + target + (requirement ? " (" + requirement + ")" : "");
            }
            if (n.callee.value === "hasChallenge") return "complete " + clean(layers[layer]?.challenges[target]?.name || "Challenge " + target) + " (" + layerName(layer) + ")";
        }
        if (n.type === "binary") {
            const resource = label(n.left);
            if (resource) return (n.op === ">" ? "more than " : n.op === ">=" ? "at least " : n.op === "<" ? "less than " : n.op === "<=" ? "at most " : "exactly ") + format(value(n.right)) + " " + resource;
        }
        if (n.type === "call" && n.callee.type === "member" && ["gte", "gt", "eq"].includes(value(n.callee.key))) {
            const resource = label(n.callee.object);
            if (resource) return (value(n.callee.key) === "gt" ? "more than " : value(n.callee.key) === "eq" ? "exactly " : "at least ") + format(value(n.args[0])) + " " + resource;
        }
        const p = path(n);
        if (p?.[0] === "player" && p[2] === "unlocked") return "unlock " + layerName(p[1]);
        // Mode-only or retired-content predicates must not promise new content.
        return null;
    }
    function requirement(item, layer, id) {
        if (item.unlockHint) return typeof item.unlockHint === "function" ? item.unlockHint() : item.unlockHint;
        if (typeof item.unlocked !== "function") return null;
        const n = selected(parse(item.unlocked));
        if (!n || n.type === "literal" || value(n)) return null;
        function possibleInMode(node) {
            if (node.type === "conditional") return possibleInMode(value(node.condition) ? node.yes : node.no);
            if (node.type === "binary" && node.op === "&&") return possibleInMode(node.left) && possibleInMode(node.right);
            if (node.type === "binary" && node.op === "||") return possibleInMode(node.left) || possibleInMode(node.right);
            const p = path(node.type === "not" ? node.value : node);
            return p?.[0] === "player" && ["extremeMode", "hardMode", "easyMode"].includes(p[1]) ? !!value(node) : true;
        }
        if (!possibleInMode(n)) return null;
        return describe(n, layer, id);
    }
    function next(layer, kind, rows) {
        const group = layers[layer]?.[kind];
        if (!group || !tmp[layer]?.[kind]) return "";
        const all = Object.keys(group).filter(id => /^\d+$/.test(id)).sort((a, b) => a - b);
        const inSection = id => !Array.isArray(rows) || rows.includes(Math.floor(Number(id) / 10));
        const ids = all.filter(inSection).concat(all.filter(id => !inSection(id)));
        for (const id of ids) {
            if (tmp[layer][kind][id]?.unlocked) continue;
            try {
                const hint = requirement(group[id], layer, id);
                if (hint) return "Next " + (kind === "upgrades" ? "upgrade" : "buyable") + (inSection(id) ? "" : " in another section") + ": " + escape(title(layer, kind, id)) + " — unlocks after " + escape(hint) + ".";
            } catch (_) { /* Unsupported expressions are omitted rather than guessed. */ }
        }
        return "";
    }
    return { parse, selected, value, requirement, next };
})();
