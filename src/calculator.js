// ============================================================
// VUNA-Calc — Pure Logic (no DOM, no window, no document)
// ============================================================

var currentExpression = '';
var LAST_RESULT = 0;

// --------------------------------------------------
// evaluateExpression
// Evaluates a basic arithmetic string safely.
// Allowed characters: digits, decimal point, +  -  *  /  ( )  spaces
// Throws on division by zero or invalid input.
// --------------------------------------------------
function evaluateExpression(expr) {
  if (typeof expr !== 'string' || expr.trim() === '') {
    throw new Error('Empty expression');
  }

  // Reject anything that is not digits, operators, parens, spaces, or decimal points
  if (/[^0-9+\-*/.() ]/.test(expr)) {
    throw new Error('Invalid characters in expression');
  }

  // Tokenise and evaluate manually to avoid eval()
  var result = parseAddSub(expr.replace(/\s+/g, ''), { pos: 0 });

  if (!isFinite(result)) {
    throw new Error('Division by zero');
  }

  return result;
}

// Recursive-descent parser ─ addition / subtraction level
function parseAddSub(expr, state) {
  var left = parseMulDiv(expr, state);

  while (state.pos < expr.length) {
    var op = expr[state.pos];
    if (op !== '+' && op !== '-') { break; }
    state.pos++;
    var right = parseMulDiv(expr, state);
    if (op === '+') { left += right; } else { left -= right; }
  }

  return left;
}

// Recursive-descent parser ─ multiplication / division level
function parseMulDiv(expr, state) {
  var left = parseUnary(expr, state);

  while (state.pos < expr.length) {
    var op = expr[state.pos];
    if (op !== '*' && op !== '/') { break; }
    state.pos++;
    var right = parseUnary(expr, state);
    if (op === '*') {
      left *= right;
    } else {
      if (right === 0) { throw new Error('Division by zero'); }
      left /= right;
    }
  }

  return left;
}

// Handle unary minus and parentheses
function parseUnary(expr, state) {
  if (expr[state.pos] === '-') {
    state.pos++;
    return -parsePrimary(expr, state);
  }
  if (expr[state.pos] === '+') {
    state.pos++;
  }
  return parsePrimary(expr, state);
}

function parsePrimary(expr, state) {
  if (expr[state.pos] === '(') {
    state.pos++; // consume '('
    var val = parseAddSub(expr, state);
    if (expr[state.pos] !== ')') {
      throw new Error('Mismatched parentheses');
    }
    state.pos++; // consume ')'
    return val;
  }

  // Parse a number
  var start = state.pos;
  if (state.pos < expr.length && expr[state.pos] === '-') { state.pos++; }
  while (state.pos < expr.length && /[0-9.]/.test(expr[state.pos])) {
    state.pos++;
  }

  if (state.pos === start) {
    throw new Error('Unexpected character at position ' + start);
  }

  return parseFloat(expr.slice(start, state.pos));
}

// --------------------------------------------------
// percentOf
// Custom Feature — returns what percent `part` is of `total`.
// e.g. percentOf(25, 200) → 12.5  (25 is 12.5% of 200)
// Throws when total is zero.
// --------------------------------------------------
function percentOf(part, total) {
  if (total === 0) {
    throw new Error('Total cannot be zero');
  }
  return (part / total) * 100;
}

// --------------------------------------------------
// clearEntry — removes last character from expression
// --------------------------------------------------
function clearEntry() {
  currentExpression = currentExpression.slice(0, -1);
  return currentExpression;
}

// --------------------------------------------------
// clearAll — resets the expression
// --------------------------------------------------
function clearAll() {
  currentExpression = '';
  return currentExpression;
}

// --------------------------------------------------
// Export for Jest (Node environment only)
// --------------------------------------------------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { evaluateExpression, percentOf, clearEntry, clearAll };
}
