#!/usr/bin/env node
/* ================================================================
   Lab 2 · Dice Roller — solution smoke test (instructor tool)
   ----------------------------------------------------------------
   Loads protected/lab2/JS/script.SOLUTION.js inside a sandbox with
   a fake browser environment (document / prompt / alert) and checks
   the pure logic functions plus the two button handlers.

   Usage:  node protected/lab2/test/check-solution.js
   ================================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SOLUTION_PATH = path.join(__dirname, "..", "JS", "script.SOLUTION.js");

/* ---------------- fake browser environment ---------------- */

function makeElement(id) {
    const el = {
        id,
        textContent: "",
        listeners: {},
        style: {},
        dataset: {},
        offsetWidth: 100,
        classList: {
            _set: new Set(),
            add(c) { this._set.add(c); },
            remove(c) { this._set.delete(c); },
            contains(c) { return this._set.has(c); },
        },
        addEventListener(event, fn) {
            (el.listeners[event] = el.listeners[event] || []).push(fn);
        },
    };
    return el;
}

function makeEnvironment() {
    const elements = {};
    const ids = ["die", "reaction", "multi-result", "guess-result", "streak",
                 "roll-btn", "multi-roll-btn", "guess-btn"];
    ids.forEach((id) => { elements[id] = makeElement(id); });

    // The die has seven pips
    const pips = ["tl", "tr", "ml", "mr", "bl", "br", "c"].map((name) => {
        const pip = makeElement("pip-" + name);
        pip.dataset.pip = name;
        return pip;
    });

    const captured = { alerts: [], prompts: [] };
    const doc = {
        getElementById: (id) => elements[id] || null,
        querySelectorAll: () => pips,
    };

    return { elements, doc, captured };
}

let currentRandom = 0.999;

function loadSolution(env) {
    const source = fs.readFileSync(SOLUTION_PATH, "utf8");
    const sandbox = {
        document: env.doc,
        console: { log: () => {} },
        alert: (...a) => env.captured.alerts.push(a.map(String).join(" ")),
        prompt: (...a) => {
            env.captured.prompts.push(a.length ? String(a[0]) : "");
            return nextPromptAnswer === undefined ? null : nextPromptAnswer;
        },
        // Overridable randomness: Math.floor etc. still work via prototype
        Math: Object.assign(Object.create(Math), { random: () => currentRandom }),
    };
    let nextPromptAnswer;
    sandbox.__setNextAnswer = (v) => { nextPromptAnswer = v; };
    vm.createContext(sandbox);
    vm.runInContext(source, sandbox, { filename: SOLUTION_PATH });
    return sandbox;
}

/* ---------------- tiny assertion helpers ---------------- */

let passed = 0;
let failed = 0;

function check(desc, condition, extra) {
    if (condition) {
        passed++;
        console.log("  \u2713 " + desc);
    } else {
        failed++;
        console.log("  \u2717 " + desc + (extra ? "\n      -> " + extra : ""));
    }
}

/** roll for a chosen face: Math.floor(r*6)+1 === n  =>  r in [n-1)/6, n/6) */
function randomForFace(n) {
    return (n - 0.5) / 6;
}

/* ---------------- tests ---------------- */

console.log("\nLab 2 · Dice Roller — checking SOLUTION\n");

// --- TODO 1 ---
console.log("TODO 1 · rollOneDie()");
{
    const env = makeEnvironment();
    const api = loadSolution(env);
    let ok = true;
    for (let i = 0; i < 500 && ok; i++) {
        const r = api.rollOneDie();
        if (!Number.isInteger(r) || r < 1 || r > 6) ok = false;
    }
    check("always returns an integer 1–6 over 500 rolls", ok);
}

// --- TODO 2 ---
console.log("\nTODO 2 · getRollMessage()");
{
    const env = makeEnvironment();
    const api = loadSolution(env);
    check('roll 6   -> "🔥 Lucky roll!"', api.getRollMessage(6) === "\u{1F525} Lucky roll!");
    check("roll 1   -> snake-eyes message", api.getRollMessage(1) === "\u{1F62C} Ouch, snake eyes.");
    check("roll 4   -> even-number message", api.getRollMessage(4) === "Nice, an even number.");
    check("roll 2   -> even-number message", api.getRollMessage(2) === "Nice, an even number.");
    check('roll 3   -> "Odd roll — try again!"', api.getRollMessage(3) === "Odd roll \u2014 try again!");
}

// --- TODO 3 ---
console.log("\nTODO 3 · rollMultiple()");
{
    const env = makeEnvironment();
    const api = loadSolution(env);
    const five = api.rollMultiple(5);
    const parts = String(five).split(" ");
    check("returns a string of 5 space-separated rolls",
        typeof five === "string" && parts.length === 5 &&
        parts.every((p) => Number(p) >= 1 && Number(p) <= 6),
        JSON.stringify(five));
    check("rollMultiple(1) has no spaces", String(api.rollMultiple(1)).indexOf(" ") === -1);
}

// --- TODO 4 ---
console.log("\nTODO 4 · multi-roll button handler");
{
    // valid input
    let env = makeEnvironment();
    let api = loadSolution(env);
    api.__setNextAnswer("3");
    env.elements["multi-roll-btn"].listeners.click[0]();
    const shown = env.elements["multi-result"].textContent;
    const nums = String(shown).match(/\d+/g) || [];
    check('prompt "3" displays 3 valid rolls', nums.length >= 4 && Number(nums[0]) === 3 &&
        nums.slice(-3).every((n) => +n >= 1 && +n <= 6), JSON.stringify(shown));

    // invalid inputs
    for (const bad of ["abc", "", "0"]) {
        env = makeEnvironment();
        api = loadSolution(env);
        api.__setNextAnswer(bad);
        env.elements["multi-roll-btn"].listeners.click[0]();
        const warned = env.captured.alerts.length === 1 &&
            /whole number/i.test(env.captured.alerts[0]);
        check(`invalid input ${JSON.stringify(bad)} triggers a warning alert`, warned,
            JSON.stringify(env.captured.alerts));
    }

    // cancelled prompt does nothing
    env = makeEnvironment();
    api = loadSolution(env);
    api.__setNextAnswer(null);
    env.elements["multi-roll-btn"].listeners.click[0]();
    check("Cancel does nothing (no alerts)", env.captured.alerts.length === 0);
}

// --- TODO 5 ---
console.log("\nTODO 5 · guessing game");
{
    // force the die to show 4 every time
    currentRandom = randomForFace(4);

    // too low
    let env = makeEnvironment();
    let api = loadSolution(env);
    api.__setNextAnswer("2");
    env.elements["guess-btn"].listeners.click[0]();
    check('guess 2 vs roll 4 -> "Too low! It was 4"',
        env.captured.alerts[0] === "Too low! It was 4", JSON.stringify(env.captured.alerts));
    check("die face shows the roll (4)", env.doc.querySelectorAll().every((p) =>
        ["tl", "tr", "bl", "br"].includes(p.dataset.pip)
            ? p.style.opacity === "1"
            : p.style.opacity === "0"));

    // too high
    env = makeEnvironment();
    api = loadSolution(env);
    api.__setNextAnswer("6");
    env.elements["guess-btn"].listeners.click[0]();
    check('guess 6 vs roll 4 -> "Too high! It was 4"',
        env.captured.alerts[0] === "Too high! It was 4", JSON.stringify(env.captured.alerts));

    // correct guess increments the streak counter
    env = makeEnvironment();
    api = loadSolution(env);
    api.__setNextAnswer("4");
    env.elements["guess-btn"].listeners.click[0]();
    check('guess 4 vs roll 4 -> "🎉 Correct! It was 4"',
        env.captured.alerts[0] === "\u{1F389} Correct! It was 4", JSON.stringify(env.captured.alerts));
    check("streak counter updates to 1",
        env.elements.streak.textContent.indexOf("1") !== -1,
        JSON.stringify(env.elements.streak.textContent));
}

/* ---------------- summary ---------------- */

console.log("\n" + "-".repeat(50));
console.log(`  RESULT: ${passed} passed, ${failed} failed`);
console.log("-".repeat(50) + "\n");
process.exitCode = failed === 0 ? 0 : 1;
