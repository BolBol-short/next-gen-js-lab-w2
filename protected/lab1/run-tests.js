#!/usr/bin/env node
/* ================================================================
   JavaScript — Week 2 — Lab 1 · Test Runner (instructor tool)
   ----------------------------------------------------------------
   Runs every student exercise in a sandboxed Node `vm` context,
   then asserts on the variables the exercise asked for.

   Usage:
     npm test                          → grade assignment/lab1
     npm run test:solutions            → self-check against solutions/
     node protected/lab1/run-tests.js --verify-solutions

   Assignment 4 (prompt) is NOT auto-graded. prompt() only exists in
   a real browser, so those exercises are marked MANUAL and trainees
   verify them with live preview.
   ================================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..", "..");
const ASSIGNMENT_DIR = path.join(ROOT, "assignment", "lab1");
const SOLUTIONS_DIR = path.join(__dirname, "solutions");
const VERIFY_SOLUTIONS = process.argv.includes("--verify-solutions");

/* ------------------------------------------------------------------
   Test configuration — one entry per exercise.
   `vars` are probed out of the student's file after it runs.
   Each check is [javascriptExpression, humanReadableDescription].
   Expressions may use:
     - any name from `vars`
     - ALERTS   → array of every alert() message the file showed
     - PROMPTED → array of every prompt() question the file asked
------------------------------------------------------------------ */
const EXERCISES = [
  {
    id: "Assignment 1 · Exercise 1",
    title: "let vs const",
    relPath: "assignment1/exercise1.js",
    vars: ["score", "LEVEL"],
    checks: [
      ["score === 25 && typeof score === 'number'", "score reassigned to 25"],
      ["LEVEL === 'gold' && typeof LEVEL === 'string'", 'LEVEL changed to "gold"'],
    ],
  },
  {
    id: "Assignment 1 · Exercise 2",
    title: "use variables together",
    relPath: "assignment1/exercise2.js",
    vars: ["price", "qty", "bill"],
    checks: [
      ["bill === 12", "bill equals price * qty (12)"],
      ["typeof bill === 'number'", "bill holds a number"],
    ],
  },
  {
    id: "Assignment 2 · Exercise 1",
    title: "typeof",
    relPath: "assignment2/exercise1.js",
    vars: ["typeText", "typeNum", "typeBool"],
    checks: [
      ["typeText === 'string'", 'typeText is "string"'],
      ["typeNum === 'number'", 'typeNum is "number"'],
      ["typeBool === 'boolean'", 'typeBool is "boolean"'],
    ],
  },
  {
    id: "Assignment 2 · Exercise 2",
    title: "undefined, null, conversion",
    relPath: "assignment2/exercise2.js",
    vars: ["notSet", "empty", "fromText"],
    checks: [
      ["notSet === undefined", "notSet is undefined (declared with no value)"],
      ["empty === null", "empty is null"],
      ["fromText === 50 && typeof fromText === 'number'", 'fromText is the number 50'],
    ],
  },
  {
    id: "Assignment 3 · Exercise 1",
    title: "for loop",
    relPath: "assignment3/exercise1.js",
    vars: ["sumTen"],
    checks: [
      ["sumTen === 55", "sumTen equals 55 (1+2+...+10)"],
      ["typeof sumTen === 'number'", "sumTen holds a number"],
    ],
  },
  {
    id: "Assignment 3 · Exercise 2",
    title: "while loop",
    relPath: "assignment3/exercise2.js",
    vars: ["countdown", "n"],
    checks: [
      ["countdown === '54321'", 'countdown is exactly "54321"'],
      ["typeof countdown === 'string'", "countdown is built as a string"],
      ["n === 0", "loop counted n all the way down to 0"],
    ],
  },
  {
    id: "Assignment 4 · Exercise 1",
    title: "prompt capture text (MANUAL)",
    relPath: "assignment4/exercise1.js",
    manual: true,
    hint: "Open this file with Live Preview — answer the pop-up yourself.",
  },
  {
    id: "Assignment 4 · Exercise 2",
    title: "prompt convert to number (MANUAL)",
    relPath: "assignment4/exercise2.js",
    manual: true,
    hint: "Open this file with Live Preview — answer the pop-up yourself.",
  },
  {
    id: "Assignment 5 · Exercise 1",
    title: "alert build a message",
    relPath: "assignment5/exercise1.js",
    vars: ["city"],
    checks: [["ALERTS[0] === 'Hello, Phnom Penh!'", 'alerts exactly "Hello, Phnom Penh!"']],
  },
  {
    id: "Assignment 5 · Exercise 2",
    title: "ternary decision",
    relPath: "assignment5/exercise2.js",
    vars: ["temp"],
    checks: [
      ["ALERTS.length > 0", "an alert was shown"],
      ["(temp > 25 ? ALERTS[0] === 'Hot' : ALERTS[0] === 'Cool')", 'alerts "Hot" when temp > 25, else "Cool"'],
    ],
  },
];

/* ------------------------------------------------------------------
   Sandbox helpers
------------------------------------------------------------------ */
function makeSandbox() {
  const captured = { alerts: [], prompts: [] };
  const sandbox = {
    console: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
    alert: (...args) => captured.alerts.push(args.map(String).join(" ")),
    prompt: (...args) => {
      captured.prompts.push(args.length ? String(args[0]) : "");
      return "test";
    },
  };
  return { sandbox, captured };
}

/**
 * Runs one exercise file inside a vm context and returns its top-level
 * variables. Top-level `let`/`const` never land on the context's global
 * object, so we append a __probe__ call to the SAME script body — code
 * in that scope can still see them.
 */
function runExerciseFile(filePath, ex) {
  const source = fs.readFileSync(filePath, "utf8");
  const { sandbox, captured } = makeSandbox();

  let probeError = null;
  sandbox.__probe__ = (values) => {
    sandbox.__exported__ = values;
  };
  sandbox.__probeError__ = (e) => {
    probeError = e;
  };

  const probeLine = ex.vars && ex.vars.length
    ? `\n;try { __probe__({ ${ex.vars.join(", ")} }); } catch (e) { __probeError__(e); }\n`
    : "\n;__probe__({});\n";

  const context = vm.createContext(sandbox);
  try {
    vm.runInContext(source + probeLine, context, { filename: filePath });
  } catch (err) {
    return { ok: false, error: err.message, exported: {}, captured };
  }

  if (probeError) {
    // A requested variable no longer exists (renamed/deleted by the student).
    return { ok: false, error: `variable missing or renamed: ${probeError.message}`, exported: {}, captured };
  }

  return { ok: true, error: null, exported: sandbox.__exported__ || {}, captured };
}

/** Evaluates one check expression against the exported values + captures. */
function evaluateCheck(expr, exported, captured) {
  const env = Object.assign({}, exported, {
    ALERTS: captured.alerts,
    PROMPTED: captured.prompts,
  });
  try {
    const result = vm.runInNewContext(`(${expr})`, env);
    return { pass: result === true, got: formatValue(exported) };
  } catch (e) {
    return { pass: false, got: e.message };
  }
}

function formatValue(v) {
  if (v === undefined) return "undefined";
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch (_) {
    return String(v);
  }
}

/* ------------------------------------------------------------------
   Output helpers (leetcode-style)
------------------------------------------------------------------ */
const PASS = "\u2713 PASS";
const FAIL = "\u2717 FAIL";
const LINE = "─".repeat(58);

function printReport(results) {
  console.log();
  console.log("═".repeat(60));
  console.log(`  JavaScript — Week 2 — Lab 1${VERIFY_SOLUTIONS ? "  [VERIFYING SOLUTIONS]" : ""}`);
  console.log("═".repeat(60));

  for (const r of results) {
    console.log();
    console.log(`${r.ex.id}  (${r.ex.title})`);
    if (r.status === "manual") {
      console.log(`  ⚠ MANUAL — not auto-graded. ${r.ex.hint || "Verify via live preview."}`);
      continue;
    }
    if (r.status === "error") {
      console.log(`  ${FAIL} Could not run the file: ${r.error}`);
      continue;
    }
    for (const c of r.checks) {
      if (c.pass) {
        console.log(`  ✓ ${c.desc}`);
      } else {
        console.log(`  ✗ ${c.desc}`);
        console.log(`      → ${c.got}`);
      }
    }
  }

  const graded = results.filter((r) => r.status !== "manual");
  const passedExercises = graded.filter((r) => r.status === "ok").length;
  const totalChecks = graded.reduce((n, r) => n + (r.checks ? r.checks.length : 0), 0);
  const passedChecks = graded.reduce((n, r) => n + (r.checks ? r.checks.filter((c) => c.pass).length : 0), 0);
  const manuals = results.length - graded.length;

  console.log();
  console.log(LINE);
  console.log(
    `  RESULT: passed ${passedExercises}/${graded.length} exercises  ` +
      `(${passedChecks}/${totalChecks} checks)` +
      (manuals ? `  ·  ${manuals} manual (live preview)` : "")
  );
  console.log(LINE);
  console.log();

  return passedChecks === totalChecks && passedExercises === graded.length;
}

/* ------------------------------------------------------------------
   Main
------------------------------------------------------------------ */
function main() {
  const baseDir = VERIFY_SOLUTIONS ? SOLUTIONS_DIR : ASSIGNMENT_DIR;
  const results = [];

  for (const ex of EXERCISES) {
    const filePath = path.join(baseDir, ex.relPath);

    if (!fs.existsSync(filePath)) {
      results.push({ ex, status: "error", error: `file not found: ${ex.relPath}` });
      continue;
    }
    if (ex.manual) {
      // Still execute it once so syntax errors surface, but don't grade.
      runExerciseFile(filePath, { vars: [] });
      results.push({ ex, status: "manual" });
      continue;
    }

    const run = runExerciseFile(filePath, ex);
    if (!run.ok) {
      results.push({ ex, status: "error", error: run.error });
      continue;
    }
    const checks = ex.checks.map(([expr, desc]) => ({
      desc,
      ...evaluateCheck(expr, run.exported, run.captured),
    }));
    const allPass = checks.every((c) => c.pass);
    results.push({ ex, status: allPass ? "ok" : "fail", checks });
  }

  const allGreen = printReport(results);
  process.exitCode = allGreen ? 0 : 1;
}

main();
