import React, { useMemo, useState } from 'react';

/**
 * Phone-friendly calculator used in the Calc tab.
 * - Stores a clean JS expression internally (+ - * / . ( ) and %)
 * - The display renders × and ÷ instead of * and /
 * - Repeated operator taps replace the last operator
 * - "=" auto-closes unbalanced parentheses before evaluation
 */
const CalcTab = () => {
  // we keep the RAW expression here (operators are + - * /)
  const [expr, setExpr] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  // pretty version for the screen (×, ÷)
  const pretty = useMemo(
    () => expr.replace(/\*/g, '×').replace(/\//g, '÷'),
    [expr]
  );

  const isOp = (c) => /[+\-*/]/.test(c);

  const handlePress = (key) => {
    // map visible keys to raw tokens
    const map = { '×': '*', '÷': '/', '−': '-' };
    const k = map[key] ?? key;

    if (k === 'AC') {
      setExpr('');
      setJustEvaluated(false);
      return;
    }
    if (k === '⌫') {
      setExpr((s) => (s.length ? s.slice(0, -1) : s));
      setJustEvaluated(false);
      return;
    }

    if (k === '=') {
      try {
        const balanced = autoClose(expr);
        const value = evaluate(balanced);
        if (value !== '' && !Number.isNaN(value)) {
          setExpr(String(value));
          setJustEvaluated(true);
        }
      } catch {
        /* ignore */
      }
      return;
    }

    // normal character
    setExpr((s0) => {
      let s = s0;

      // if we just showed an answer and a digit/decimal arrives -> start new
      if (justEvaluated && /[0-9.]/.test(k)) {
        s = '';
      }
      setJustEvaluated(false);

      // percent is postfix: ignore if expression is empty or ends with operator/(
      if (k === '%') {
        if (!s || isOp(s.at(-1)) || s.at(-1) === '(') return s;
        return s + k;
      }

      // parentheses
      if (k === '(') return s + k;
      if (k === ')') {
        // only allow if there is an unmatched '('
        const opens = (s.match(/\(/g) || []).length;
        const closes = (s.match(/\)/g) || []).length;
        return opens > closes ? s + k : s;
      }

      // numbers / dot
      if (/[0-9.]/.test(k)) {
        // avoid two dots in the same number chunk
        if (k === '.') {
          const lastChunk = s.split(/[+\-*/()]/).pop();
          if (lastChunk?.includes('.')) return s;
        }
        return s + k;
      }

      // operators + - * /
      if (isOp(k)) {
        // start with minus is allowed (negative), others are not
        if (!s) return k === '-' ? k : s;

        // if last char is "(" then allow only "-" (for negative)
        if (s.at(-1) === '(') return k === '-' ? s + k : s;

        // replace a tail of one or more operators with the new one
        return s.replace(/[+\-*/]+$/, '') + k;
      }

      return s; // fallback
    });
  };

  const preview = useMemo(() => {
    try {
      const val = evaluate(autoClose(expr));
      return expr && String(val) !== expr && val !== '' ? `= ${val}` : '';
    } catch {
      return '';
    }
  }, [expr]);

  return (
    <div className="calc-wrap">
      {/* Sticky display */}
      <div className="calc-display">
        <textarea
          className="calc-screen"
          value={pretty}
          readOnly
          rows={2}
          aria-label="Calculator display"
        />
        <div className="calc-preview" aria-live="polite">
          {preview || '\u00A0'}
        </div>      
      </div>

      {/* keypad */}
      <div className="calc-grid">
        {[
          ['AC', '⌫', '%', '÷'],
          ['7', '8', '9', '×'],
          ['4', '5', '6', '−'],
          ['1', '2', '3', '+'],
          ['(', '0', '.', ')'],
          ['='],
        ].map((row, i) => (
          <div key={i} className="calc-row">
            {row.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => handlePress(k)}
                aria-label={`Calculator key ${k}`}
                className={`calc-btn ${
                  k === 'AC'
                    ? 'danger'
                    : k === '='
                    ? 'primary'
                    : /[÷×−+%]/.test(k)
                    ? 'op'
                    : ''
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- helpers ---------- */

// close missing right parentheses: "(1+2+2" -> "(1+2+2)"
function autoClose(s) {
  const open = (s.match(/\(/g) || []).length;
  const close = (s.match(/\)/g) || []).length;
  return close < open ? s + ')'.repeat(open - close) : s;
}

// Safe-ish evaluator for arithmetic
function evaluate(raw) {
  if (!raw || !raw.trim()) return '';

  // raw is with JS ops (+ - * /), but it may contain % which is postfix
  // 12% -> (12/100)
  let code = raw.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

  // accept only digits, allowed ops, dot, parentheses and spaces
  if (!/^[0-9+\-*/().\s]+$/.test(code)) return '';

  // eslint-disable-next-line no-new-func
  const fn = new Function(`"use strict"; return (${code});`);
  const val = fn();
  const normalized = Math.abs(val) < 1e-12 ? 0 : val;
  return Number.isFinite(normalized) ? normalized : '';
}

export default CalcTab;
