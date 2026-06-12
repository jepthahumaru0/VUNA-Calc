// ============================================================
// VUNA-Calc — UI / DOM wiring
// Depends on calculator.js being loaded first.
// ============================================================

// ── Theme toggle ────────────────────────────────────────────
function toggleTheme() {
  var body = document.body;
  var btn  = document.getElementById('theme-toggle');

  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    btn.innerHTML = '☀️';
    btn.title = 'Switch to light mode';
    localStorage.setItem('theme', 'dark');
  } else {
    btn.innerHTML = '🌙';
    btn.title = 'Switch to dark mode';
    localStorage.setItem('theme', 'light');
  }
}

window.addEventListener('DOMContentLoaded', function () {
  var theme = localStorage.getItem('theme');
  var body  = document.body;
  var btn   = document.getElementById('theme-toggle');

  if (btn) {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      btn.innerHTML = '☀️';
      btn.title = 'Switch to light mode';
    } else {
      btn.innerHTML = '🌙';
      btn.title = 'Switch to dark mode';
    }
  }
});

// ── Display helper ───────────────────────────────────────────
function updateDisplay() {
  document.getElementById('result').value = currentExpression || '0';
  clearPercentInsight();
}

// ── Button handlers ──────────────────────────────────────────
function appendToResult(value) {
  currentExpression += value.toString();
  updateDisplay();
}

function backspace() {
  clearEntry();          // updates currentExpression via calculator.js
  updateDisplay();
}

function clearResult() {
  clearAll();            // updates currentExpression via calculator.js
  updateDisplay();
  clearPercentInsight();
}

function clearEntryResult() {
  backspace();
}

function operatorToResult(value) {
  currentExpression += value;
  updateDisplay();
}

// ── CE button (clear last entry = last char) ─────────────────
function ceResult() {
  clearEntry();
  updateDisplay();
}

// ── Calculate ────────────────────────────────────────────────
function calculateResult() {
  if (!currentExpression) { return; }

  try {
    var result = evaluateExpression(currentExpression);
    LAST_RESULT = result;
    currentExpression = result.toString();
    updateDisplay();
    clearPercentInsight();
  } catch (_) {
    currentExpression = 'Error';
    updateDisplay();
    setTimeout(function () {
      currentExpression = '';
      updateDisplay();
    }, 1000);
  }
}

// ── Custom Feature: % of Total ───────────────────────────────
// Shows "X is Y% of Z" live insight below the display.
// Triggered by the "%" button.
function showPercentInsight() {
  var insight = document.getElementById('percent-insight');
  if (!currentExpression || !insight) { return; }

  // Expect pattern  NUMBER/NUMBER  e.g. "25/200"
  var match = currentExpression.match(/^(-?[0-9.]+)\/(-?[0-9.]+)$/);
  if (!match) {
    insight.textContent = '';
    return;
  }

  var part  = parseFloat(match[1]);
  var total = parseFloat(match[2]);

  try {
    var pct = percentOf(part, total);
    insight.textContent = part + ' is ' + pct.toFixed(2) + '% of ' + total;
  } catch (_) {
    insight.textContent = 'Cannot divide by zero';
  }
}

function clearPercentInsight() {
  var insight = document.getElementById('percent-insight');
  if (insight) { insight.textContent = ''; }
}

function triggerPercentInsight() {
  showPercentInsight();
}

// ── Keyboard support ─────────────────────────────────────────
window.addEventListener('keydown', function (e) {
  var key = e.key;

  if ('0123456789'.includes(key))   { appendToResult(key); return; }
  if (key === '+')                   { operatorToResult('+'); return; }
  if (key === '-')                   { operatorToResult('-'); return; }
  if (key === '*')                   { operatorToResult('*'); return; }
  if (key === '/')                   { e.preventDefault(); operatorToResult('/'); return; }
  if (key === '.')                   { appendToResult('.'); return; }
  if (key === 'Enter' || key === '=') { calculateResult(); return; }
  if (key === 'Backspace')           { backspace(); return; }
  if (key === 'Escape')              { clearResult(); return; }
  if (key === 'Delete')              { ceResult(); return; }
  if (key === '%')                   { triggerPercentInsight(); return; }
});
