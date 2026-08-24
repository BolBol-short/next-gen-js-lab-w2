# JavaScript — Week 2 Labs

**Course:** JavaScript · **Department:** Computer Science
**Topics:** variables, data types, operators, control flow, loops, `console.log()` / `alert()` / `prompt()`

## Repository layout

```
assignment/          <- trainees work here
  lab1/              drills: assignment1..5, two exercises each
  lab2/              Dice Roller project (index.html + script.js)
protected/           <- instructor only (solutions & tooling)
  lab1/
    run-tests.js     auto-grader for Lab 1
    solutions/       reference answers for every Lab 1 exercise
  lab2/
    Assets/ CSS/ JS/ provided styling, SVG die, animation helper,
    test/            smoke test for the Lab 2 solution
```

## For trainees

### Lab 1 — Drills

Complete the `TODO` in each exercise file under `assignment/lab1/<assignmentN>/`.
Do **not** rename any variable.

Check your work from the repo root:

```
npm test
```

You get a pass/fail line per exercise, leetcode-style. Assignment 4 uses
`prompt()` which only works in a real browser — those exercises are marked
`MANUAL`; open them with Live Preview and answer the pop-up yourself.

### Lab 2 — Dice Roller

Open `assignment/lab2/index.html` with Live Preview and write your logic in
`assignment/lab2/script.js`, following `TODO 1` – `TODO 5`. All page wiring
(DOM) is already provided in Part A of the script — you don't need it until Week 4.

Watch the browser console (F12) to trace `console.log()` output.

## For instructors

| Command | What it does |
|---|---|
| `npm test` | Auto-grade the student files in `assignment/lab1/` |
| `npm run test:solutions` | Self-check: runs the grader against `protected/lab1/solutions/` |
| `node protected/lab2/test/check-solution.js` | Smoke-test the Lab 2 answer key |

Lab 1 grading: each exercise runs in a sandboxed Node `vm` context with
`alert()` captured and `prompt()` stubbed; top-level `let`/`const` values are
probed out of each script and asserted.

Lab 2 is graded manually in the browser (per the grading checklist in the lab
handout); `check-solution.js` exists only to validate the answer key itself.
