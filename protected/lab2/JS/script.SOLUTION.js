/* ================================================================
   JavaScript — Week 2 — Lab 2 · Console Calculator · SOLUTION (lean)
   ----------------------------------------------------------------
   INSTRUCTOR REFERENCE — answer key for the leaner assignment.js.
   Same PROVIDED plumbing; the YOUR CODE region is filled in.
   Pure Week 2: variables, operators, if/else, switch, loops,
   prompt / alert / console.log.  No functions, no DOM.
================================================================= */
"use strict";

let count = 0;
let keepGoing = true;

console.log("Console Calculator (SOLUTION) started.");

while (keepGoing === true) {

    /* ---- PROVIDED: input ------------------------------------- */
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
        /* ---- END PROVIDED ------------------------------------ */

        let result;

        /* ---- YOUR CODE (answer) ------------------------------ */
        if (op === "!") {
            // Factorial of a: 1 * 2 * 3 * ... * a   (0! = 1)
            let f = 1;
            for (let k = 1; k <= a; k++) {
                f = f * k;
            }
            result = f;
        } else {
            switch (op) {
                case "+": result = a + b; break;
                case "-": result = a - b; break;
                case "*": result = a * b; break;
                case "/":
                    if (b === 0) {
                        result = "Cannot divide by zero";
                    } else {
                        result = a / b;
                    }
                    break;
                case "%": result = a % b; break;
                case "^": result = a ** b; break;
                default:  result = "Unknown operator: " + op;
            }
        }
        /* ---- END YOUR CODE ----------------------------------- */

        /* ---- PROVIDED: output -------------------------------- */
        alert("Result: " + result);
        console.log("Result:", result);
        count = count + 1;
    }
}

console.log("Calculator closed after " + count + " calculation(s).");