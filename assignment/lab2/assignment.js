/* ================================================================
   JavaScript — Week 2 — Lab 2 · Console Calculator
   ----------------------------------------------------------------
   Build a calculator that supports:  +  -  *  /  %  ^  !
     ^  = power       (2 ^ 10 = 1024)
     !  = factorial   (5 ! = 120)  ← uses only the FIRST number
     /  = divide, but dividing by zero is impossible — handle it

   Only this week's tools: variables, operators, if/else, switch,
   loops, prompt / console.log.  No functions, no DOM, no alert.

   INPUT is asked with prompt(); OUTPUT is printed to the console.
   The input and output are provided — you write the calculation.
   Run: open index.html with Live Server, then press F12 for the console.
   ================================================================ */
"use strict";

let count = 0;
let keepGoing = true;

console.log("Console Calculator started. Press F12 to see the console.");

while (keepGoing === true) {

    /* ---- PROVIDED: input — do not edit ------------------------ */
    const aStr = prompt("First number (or press Cancel to quit):");
    if (aStr === null) {
        keepGoing = false;
    } else {
        const a = Number(aStr);
        const op = prompt("Operator:  +   -   *   /   %   ^   !");
        let b = null;
        if (op !== "!") {
            b = Number(prompt("Second number:"));
        }
        /* ---- END PROVIDED ------------------------------------- */

        let result;

        /* =============================================================
           YOUR CODE — set `result` using a, op, and b.

           Support these operators:
             "+"  ->  a + b          "-"  ->  a - b
             "*"  ->  a * b          "%"  ->  a % b
             "^"  ->  a ** b   (power)
             "/"  ->  a / b, BUT if b is 0 -> "Cannot divide by zero"
             "!"  ->  factorial of a  (1*2*3*...*a, and 0! = 1)
                      use a loop; for "!" only `a` is used (b is null)
           Anything else -> "Unknown operator: " + op

           Examples:  12 + 4 -> 16    2 ^ 10 -> 1024    5 ! -> 120
           ============================================================= */



        /* ---- PROVIDED: output (console only) — do not edit -------- */
        const shown = (op === "!") ? (a + "!") : (a + " " + op + " " + b);
        console.log(shown + " = " + result);
        count = count + 1;
    }
}

console.log("Calculator closed after " + count + " calculation(s).");