/* ================================================================
   JavaScript — Week 2 — Lab 2 · Dice Roller
   ----------------------------------------------------------------
   Topics: variables, data types, operators, control flow, loops,
   prompt() / alert() / console.log().

   You do NOT need any DOM knowledge (that's Week 4). Everything
   that touches the page is written for you in PART A below.

   YOUR WORK is in PART B — complete TODO 1 to TODO 5.

   How to run:
     1. Open index.html with Live Preview (or in your browser)
     2. Press F12 → Console, to watch your console.log() output
   ================================================================ */
"use strict";

/* ================================================================
   PART A — PROVIDED CODE · do not edit
   Everything here touches the page (the DOM). Just leave it be.
================================================================= */

console.log("Dice Roller loaded — trace your functions here.");

let correctGuesses = 0; // used by the guessing game

// Shortcuts to page elements (Week 4 material — ignore for now)
const dieEl          = document.getElementById("die");
const reactionEl     = document.getElementById("reaction");
const multiResultEl  = document.getElementById("multi-result");
const guessResultEl  = document.getElementById("guess-result");
const streakEl       = document.getElementById("streak");

// Which pips (dots) are shown for each dice face
const FACE_PIPS = {
    1: ["c"],
    2: ["tl", "br"],
    3: ["tl", "c", "br"],
    4: ["tl", "tr", "bl", "br"],
    5: ["tl", "tr", "c", "bl", "br"],
    6: ["tl", "tr", "ml", "mr", "bl", "br"],
};

// Draws the rolled number on the die face
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

// Refreshes the streak counter on the page
function updateStreak() {
    streakEl.textContent = "Correct guesses: " + correctGuesses;
}

/* --- Button wiring --------------------------------------------- */

document.getElementById("roll-btn").addEventListener("click", function () {
    const roll = rollOneDie();                       // ← your TODO 1
    rollAnimation(dieEl);
    displayRoll(roll);
    reactionEl.textContent = getRollMessage(roll);   // ← your TODO 2
});

document.getElementById("multi-roll-btn").addEventListener("click", function () {

    /* ==== TODO 4 ================================================
       Ask the player how many times to roll, then show the rolls.

       1. Use prompt() to ask for a number of rolls.
       2. prompt() ALWAYS returns a string (or null if cancelled)
          — convert it to a number before using it!
       3. If the input is invalid (not a number, or less than 1),
          alert("Please enter a whole number of 1 or more.")
          and stop the handler with `return;`.
       4. Otherwise call your rollMultiple(count) function and
          display the result:
              multiResultEl.textContent = ...;
       ============================================================ */


});

document.getElementById("guess-btn").addEventListener("click", playGuessGame);

/* ================================================================
   PART B — YOUR CODE · complete TODO 1 to TODO 5 below
================================================================= */

/* ---- TODO 1 ----------------------------------------------------
   rollOneDie()
   Return a random whole number between 1 and 6.
     - Math.random() gives you a decimal between 0 and 1
     - Math.floor() rounds down to a whole number
     - Combine them so the result lands on 1, 2, 3, 4, 5 or 6
----------------------------------------------------------------- */
function rollOneDie() {

}

/* ---- TODO 2 ----------------------------------------------------
   getRollMessage(roll)
   Take the roll result and RETURN a message using if / else if / else:
     - roll is 6                → return "🔥 Lucky roll!"
     - roll is 1                → return "😬 Ouch, snake eyes."
     - roll is an even number   → return "Nice, an even number."
     - anything else            → return "Odd roll — try again!"

   Hint: the % (modulo) operator tests evenness:  roll % 2 === 0
----------------------------------------------------------------- */
function getRollMessage(roll) {

}

/* ---- TODO 3 ----------------------------------------------------
   rollMultiple(count)
   Roll the die `count` times using a loop, building one STRING
   that lists every result separated by a space, like "3 5 1 6 2".
     - Use a for loop (or while, your choice)
     - Call your rollOneDie() from TODO 1 inside the loop
     - Return the finished string

   (Same pattern as Lab 1's countdown exercise!)
----------------------------------------------------------------- */
function rollMultiple(count) {

}

/* ---- TODO 5 ----------------------------------------------------
   playGuessGame()
   The full guessing game, step by step:
     1. prompt() the player for a guess between 1 and 6
        (convert the string answer into a number)
     2. Roll the die using your rollOneDie() function
     3. Compare guess vs roll with if / else if / else:
          - match        → alert("🎉 Correct! It was " + roll)
                           and increase correctGuesses by 1,
                           then call updateStreak();
          - guess lower  → alert("Too low! It was " + roll)
          - guess higher → alert("Too high! It was " + roll)
     4. Show the actual roll on the die face by calling
        displayRoll(roll), and put a short summary line into
        guessResultEl.textContent.
----------------------------------------------------------------- */
function playGuessGame() {

}
