// Robust calculator logic that works even when script loads before the DOM
(function () {
  'use strict';

  // Always fetch the display when needed (avoids null if script runs before markup)
  function getDisplay() {
    return document.getElementById('display');
  }

  // Helper to get all calculator buttons (by ids used in markup)
  function allButtons() {
    return Array.from(document.querySelectorAll('#input-key, #operator, #operator2'));
  }

  // Append the button's text or a provided value to the display
  // HTML currently calls appendToDisplay() without passing a value; we will infer it from the button label
  window.appendToDisplay = function appendToDisplay(value) {
    const display = getDisplay();
    if (!display) return; // DOM not ready or element missing

    let toAdd = value;
    if (typeof toAdd === 'undefined') {
      // Infer from the triggering button's text
      const btn = (typeof event !== 'undefined' && event && event.currentTarget) ? event.currentTarget : null;
      if (btn) {
        const text = btn.textContent.trim();
        // Special-case the parentheses key labeled "()" to insert balanced parentheses progressively
        if (text === '()') {
          toAdd = chooseParen(display.value);
        } else {
          toAdd = text;
        }
      } else {
        toAdd = '';
      }
    } else if (toAdd === '()') {
      // If caller passed the special token explicitly
      toAdd = chooseParen(display.value);
    }

    display.value += String(toAdd);
  };

  // Decide whether to insert '(' or ')' based on current balance
  function chooseParen(expr) {
    const open = (expr.match(/\(/g) || []).length;
    const close = (expr.match(/\)/g) || []).length;
    return open > close ? ')' : '(';
  }

  // Clear the display (AC)
  window.cleardisplay = function cleardisplay() {
    const display = getDisplay();
    if (display) display.value = '';
  };

  // Delete last character (DEL)
  window.deletenumber = function deletenumber() {
    const display = getDisplay();
    if (display) display.value = display.value.slice(0, -1);
  };

  // Turn OFF: disable all keys and clear display
  window.shuttdown = function shuttdown() {
    const display = getDisplay();
    if (display) display.value = '';
    allButtons().forEach(b => {
      // Keep ON button enabled to allow re-activation
      if (b.getAttribute('onclick') && b.getAttribute('onclick').includes('start()')) return;
      b.disabled = true;
    });
  };

  // Turn ON: enable all keys
  window.start = function start() {
    allButtons().forEach(b => {
      b.disabled = false;
    });
  };

  // Calculate expression safely for calculator use
  window.calculate = function calculate() {
    const display = getDisplay();
    if (!display) return;
    const expr = display.value;
    if (!expr.trim()) return;
    try {
      // Replace percentage: interpret trailing % as /100; also allow e.g. 50%*2 -> (50/100)*2
      const normalized = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + normalized + ')')();
      display.value = String(result);
    } catch (e) {
      display.value = 'Error';
    }
  };
})();
