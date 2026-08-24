/* ================================================================
   JavaScript — Week 2 — Lab 2 · Dice Roller · SOLUTION
   ----------------------------------------------------------------
   INSTRUCTOR REFERENCE — answer key for assignment/lab2/script.js.
   Do not distribute. Do not peek until you've tried!
================================================================= */
"use strict";

/* ================================================================
   PART A — PROVIDED CODE (identical to the starter)
================================================================= */

console.log("Dice Roller loaded — trace your functions here.");

let correctGuesses = 0;

const dieEl          = document.getElementById("die");
const reactionEl     = document.getElementById("reaction");
const multiResultEl  = document.getElementById("multi-result");
const guessResultEl  = document.getElementById("guess-result");
const streakEl       = document.getElementById("streak");

const FACE_PIPS = {
    1: ["c"],
    2: ["tl", "br"],
    3: ["tl", "c", "br"],
    4: ["tl", "tr", "bl", "br"],
    5: ["tl", "tr", "c", "bl", "br"],
    6: ["tl", "tr", "ml", "mr", "bl", "br"],
};

function displayRoll(roll) {
    console.log("displayRoll:", roll);
    const pips = document.querySelectorAll("#die [data-pip]");
    for (const pip of pips) {
        if (FACE_PIPS[roll].indexOf(pip.dataset.pip) !== -1) {
            pip.style.opacity = "1";
        } else {
            pip.style.opacity = "0";
        }
    }
}

function updateStreak() {
    streakEl.textContent = "Correct guesses: " + correctGuesses;
}

document.getElementById("roll-btn").addEventListener("click", function () {
    const roll = rollOneDie();
    rollAnimation(dieEl);
    displayRoll(roll);
    reactionEl.textContent = getRollMessage(roll);
});

document.getElementById("multi-roll-btn").addEventListener("click", function () {

    /* ==== TODO 4 — SOLUTION ==================================== */
    const raw = prompt("How many times do you want to roll?");

    if (raw === null) {                       // player pressed Cancel
        return;
    }

    const count = Number(raw);

    if (raw === "" || isNaN(count) || count < 1) {
        alert("Please enter a whole number of 1 or more.");
        return;
    }

    multiResultEl.textContent = count + " rolls: " + rollMultiple(count);
});

document.getElementById("guess-btn").addEventListener("click", playGuessGame);

/* ================================================================
   PART B — SOLUTIONS for TODO 1 to TODO 5
================================================================= */

/* ---- TODO 1 ------------------------------------------------- */
function rollOneDie() {
    return Math.floor(Math.random() * 6) + 1;
}

/* ---- TODO 2 ------------------------------------------------- */
function getRollMessage(roll) {
    if (roll === 6) {
        return "🔥 Lucky roll!";
    } else if (roll === 1) {
        return "😬 Ouch, snake eyes.";
    } else if (roll % 2 === 0) {
        return "Nice, an even number.";
    } else {
        return "Odd roll — try again!";
    }
}

/* ---- TODO 3 ------------------------------------------------- */
function rollMultiple(count) {
    let results = "";
    for (let i = 0; i < count; i++) {
        results += rollOneDie();
        if (i < count - 1) {
            results += " ";
        }
    }
    return results;
}

/* ---- TODO 5 ------------------------------------------------- */
function playGuessGame() {
    const raw = prompt("Guess a number between 1 and 6:");
    const guess = Number(raw);

    const roll = rollOneDie();

    if (guess === roll) {
        alert("🎉 Correct! It was " + roll);
        correctGuesses++;
        updateStreak();
    } else if (guess < roll) {
        alert("Too low! It was " + roll);
    } else {
        alert("Too high! It was " + roll);
    }

    displayRoll(roll);
    guessResultEl.textContent =
        "You guessed " + guess + " — the die showed " + roll + ".";
}
