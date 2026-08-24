/* ================================================================
   Dice Roller — Week 2 Lab · provided animation helper (do not edit)
   ----------------------------------------------------------------
   Adds the "rolling" CSS class to the die so it shakes/tumbles.
   The class and its keyframes live in style.css.
================================================================= */

function rollAnimation(el) {
  el.classList.remove("rolling");

  // Force the browser to register the removal so the animation
  // can restart even if the button is clicked twice in a row.
  void el.offsetWidth;

  el.classList.add("rolling");
}
