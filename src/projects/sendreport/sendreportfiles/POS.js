import React, { useMemo, useState } from 'react';
import { Form, Button, Modal  } from 'react-bootstrap';
import { useRef } from 'react';

/** ===== Catalogs =====
 *  Bread list is your original list.
 *  Drinks list contains common PH beverages (placeholder prices – change anytime).
 */

/* ========================
 *  BREADS (from blue-pen prices in the sheet)
 *  Names UPPERCASE. Items appear alphabetically in the UI.
 * ======================== */
const BREADS_RAW = [
  // A–E
  { name: 'BAHUG2X', price: 6 },               // from sheet
  { name: 'BINANGCAL', price: 9 },              // VERIFY (appears “10” on sheet)
  { name: 'CANADIAN SMALL', price: 20 },        // VERIFY (line visible; adjust if needed)
  { name: 'CHEESE BREAD', price: 6 },
  { name: 'CHEESE BUNS', price: 6 },
  { name: 'CHOCO CUPCAKE', price: 6 },
  { name: 'CHOCO LANAY', price: 6 },
  { name: 'CINNAMON', price: 7 },
  { name: 'CINNAMON ROLL', price: 10 },
  { name: 'CLOVER', price: 6 },
  { name: 'COCOBREAD', price: 6 },
  { name: 'CRINKLES', price: 8 },
  { name: 'DESAL', price: 5 },
  { name: 'EGG BREAD', price: 6 },             // looked like “6” on sheet
  { name: 'ELORDE', price: 5 },

  // E–M (ENSAIMADA block + others)
  { name: 'ENSAIMADA BIG', price: 12 },
  { name: 'ENSAIMADA CHEEZE', price: 10 },
  { name: 'ENSAIMADA CHOCO', price: 6 },
  { name: 'ENSAIMADA PLAIN', price: 6 },
  { name: 'ENSAIMADA RAISIN', price: 12 },      // VERIFY (if this was 13 before, change here)
  { name: 'ENSAIMADA UBE', price: 6 },
  { name: 'EVERBIG', price: 5 },               // sheet shows “Everbig”; adjust spelling if needed
  { name: 'FOODMAN', price: 6 },
  { name: 'FRANCIS', price: 5 },
  { name: 'GERMAN', price: 6 },
  { name: 'GRACIOSA', price: 20 },

  // J–P
  { name: 'KING ROLL', price: 6 },
  { name: 'MAMON', price: 6 },
  { name: 'MAMON CUPCAKE', price: 6 },         // VERIFY (sheet lists “Mamon Cupcake” row)
  { name: 'MARBLE CUPCAKE', price: 6 },
  { name: 'MUSHROOM', price: 5 },
  { name: 'PIGPIE', price: 12 },
  { name: 'PINEAPPLE', price: 6 },
  { name: 'POLVORON', price: 8 },

  // S–Z
  { name: 'RAISIN LOAF', price: 40 },

  { name: 'SLICED BREAD', price: 50 },
  { name: 'SPANISH BREAD', price: 6 },
  { name: 'SUGAR BUNS', price: 6 },
  { name: 'SUN FLOWER', price: 8 },
  { name: 'SWEETHEART', price: 6 },
  { name: 'TOASTED', price: 10 },
  { name: 'TORTA', price: 13 },
  { name: 'UBE CUPCAKE', price: 6 },
  { name: 'UBE LOAF', price: 40 },
  { name: 'UBE LOAF SMALL', price: 20 },
  { name: 'UBE TWIST', price: 6 },
  // Bottom three noted on sheet
  { name: 'UBE CREAM', price: 40 },
];

/* ========================
 *  DRINKS (from yellow note + common SKUs)
 *  - FUZETEA moved here
 *  - 1.5L clarified as Coke/Sprite/Royal 1.5L (same price)
 * ======================== */
const DRINKS_RAW = [
  // 1.5L family (price on sheet looked like “70”)
  { name: 'COKE 1.5L',   price: 70 },
  { name: 'SPRITE 1.5L', price: 70 },
  { name: 'ROYAL 1.5L',  price: 70 },

  // Singles / cans / PET (keep your existing small sizes)
  { name: 'COKE',   price: 20 },
  { name: 'SPRITE', price: 20 },
  { name: 'ROYAL',  price: 20 },
  { name: 'COKE MISMO', price: 25 }, 
  { name: 'SPRITE MISMO', price: 25 }, 
  { name: 'ROYAL MISMO', price: 25 },  
  { name: 'COKE SWAKTO', price: 16 },                // present on sheet
  { name: 'SPRITE SWAKTO', price: 16 },                // present on sheet
  { name: 'ROYAL SWAKTO', price: 16 },                // present on sheet
  // From the yellow note
  { name: 'MINERAL WATER', price: 10 },              // VERIFY (appears “10” on sheet)
  { name: 'JUICE',  price: 12 },
  { name: 'NUTRI BOOST',           price: 15 },
  { name: 'WILKINS PURE 500ML',    price: 15 },
  { name: 'WILKINS BIG 1L',       price: 25 },
  { name: 'PREDATOR',              price: 15 },

  // Tea / isotonic / energy etc.
  { name: 'FUZETEA',               price: 15},  // moved to DRINKS
];

// Sorted copies (alphabetical)
const byName = (a, b) => a.name.localeCompare(b.name, 'en');
const BREADS = [...BREADS_RAW].sort(byName);
const DRINKS = [...DRINKS_RAW].sort(byName);
const ALL_ITEMS = [...BREADS, ...DRINKS];

const peso = (n) => `₱ ${Number(n || 0).toLocaleString('en-PH')}`;
const norm = (s) => (s || '').replace(/\s+/g, '').toLowerCase();

export default function POS() {
  // UI state
  const [category, setCategory] = useState('ALL');   // 'ALL' | 'BREADS' | 'DRINKS'
  const [q, setQ] = useState('');
  const [qtyMap, setQtyMap] = useState({});         // { 'ENSAI UBE': 2, 'COKE': 1, ... }
  const [showReceipt, setShowReceipt] = useState(false);
  const searchRef = useRef(null);

  // Filter helpers
  const filterList = (list) => {
    const n = norm(q);
    if (!n) return list;
    return list.filter((item) => norm(item.name).startsWith(n));
  };

  const breadFiltered  = useMemo(() => filterList(BREADS),  [q]);
  const drinksFiltered = useMemo(() => filterList(DRINKS), [q]);

  // Which list to show when not in ALL
  const currentList =
    category === 'BREADS' ? breadFiltered :
    category === 'DRINKS' ? drinksFiltered : [];

  // Stepper +/- handlers
  const step = (name, delta) => {
    setQtyMap((m) => {
      const cur = Number(m[name] || 0);
      const next = Math.max(0, cur + delta);
      return { ...m, [name]: next };
    });
  };

  // Quantity input: digits only, strip leading zeros (keeps a single 0)
  const changeQty = (name, raw) => {
    let s = String(raw ?? '');
    s = s.replace(/\D/g, '');
    s = s.replace(/^0+(?=\d)/, '');
    const n = s === '' ? 0 : parseInt(s, 10);
    setQtyMap((m) => ({ ...m, [name]: n }));
  };

  // Total & summary count ALL items (bread + drinks), not just the visible category
  const total = useMemo(
    () => ALL_ITEMS.reduce((sum, it) => sum + (qtyMap[it.name] || 0) * it.price, 0),
    [qtyMap]
  );

  const linesChosen = useMemo(
    () =>
      ALL_ITEMS
        .filter((it) => (qtyMap[it.name] || 0) > 0)
        .map((it) => {
          const qty = qtyMap[it.name] || 0;
          const amount = qty * it.price;
          return `${it.name} — ${qty} × ${peso(it.price)} = ${peso(amount)}`;
        }),
    [qtyMap]
  );

  const summaryText = useMemo(() => {
    if (!linesChosen.length) return '';
    return [...linesChosen, ``, `Total: ${peso(total)}`].join('\n');
  }, [linesChosen, total]);

  // Clear helpers
  const clearAll = () => setQtyMap({});
  const clearSearch = () => setQ('');

  // Copy helper (no URI encoding; works well on Android & iOS)
  const copyPlain = async (text) => {
    try {
      // modern
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  const renderItem = (it) => {
    const qty = qtyMap[it.name] || 0;
    const amount = qty * it.price;
    return (
      <div key={`${it.name}`} className="pos-item">
        <div className="pos-meta">
          <div className="pos-name">{it.name}</div>
          <div className="pos-price">{peso(it.price)}</div>
        </div>

        <div className="stepper">
          <Button
            variant="light"
            className="step-btn"
            disabled={qty <= 0}
            onClick={() => step(it.name, -1)}
            aria-label={`- ${it.name}`}
          >
            –
          </Button>

          <Form.Control
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={String(qty)}
            onChange={(e) => changeQty(it.name, e.target.value)}
            className="money-input"
          />

          <Button
            variant="light"
            className="step-btn"
            onClick={() => step(it.name, +1)}
            aria-label={`+ ${it.name}`}
          >
            +
          </Button>
        </div>

        <div className="pos-amount">
          {qty > 0 ? `${qty} × ${peso(it.price)} = ` : ''}
          <strong>{peso(amount)}</strong>
        </div>
      </div>
    );
  };

  const placeholder =
    category === 'BREADS'
      ? 'Search bread… (type: e, en, ensai…)'
      : category === 'DRINKS'
      ? 'Search drinks… (type: c, co, coke…)'
      : 'Search bread & drinks… (e.g., “ensai”, “coke”)';

  const hasItems = linesChosen.length > 0;
  const receiptText = hasItems
    ? `Receipt\n\n${summaryText}`
    : '(No items yet)';

  return (
    <div className="pos-wrap">
      <div className="pos-search">
        {/* Summary (read-only, scrollable by CSS) */}
        <Form.Control
          as="textarea"
          className="pos-summary-textarea"
          rows={5}
          value={summaryText}
          readOnly
          placeholder="(summary is blank until you add items)"
        />

        {/* Category + actions row */}
        <div className="pos-search-row">
          {/* NEW: Receipt button (right of Clear POS) */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowReceipt(true)}
            disabled={!hasItems}
            title="Show receipt"
          >
            Receipt
          </Button>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Select category"
            style={{ maxWidth: 160 }}
          >
            <option value="ALL">All</option>
            <option value="BREADS">Bread</option>
            <option value="DRINKS">Drinks</option>
          </Form.Select>

          <Button variant="secondary" size="sm" onClick={clearAll}>
            Clear POS
          </Button>

        </div>

        {/* Search + clear row */}
        <div className="pos-search-row">
          <Form.Control
            ref={searchRef}
            type="text"
            value={q}
            placeholder={placeholder}
            onChange={(e) => setQ(e.target.value)}
          />

          <Button
            variant="outline-secondary"
            size="sm"
            onClick={clearSearch}
            disabled={!q}
            title="Clear search"
          >
            Clear Search
          </Button>
        </div>

        <div className="small text-muted mt-1">
          Tip: type the first letters (e.g., <strong>en</strong> → ENSAI items,
          <strong> co</strong> → COKE).
        </div>
      </div>

      {/* Item list */}
      <div className="pos-list">
        {category !== 'ALL' && currentList.map(renderItem)}

        {category === 'ALL' && (
          <>
            <div className="pos-group-title">Bread</div>
            {breadFiltered.map(renderItem)}
            <div className="pos-group-title">Drinks</div>
            {drinksFiltered.map(renderItem)}
          </>
        )}
      </div>

      {/* Floating total (all items) */}
      <div className="floating-pos-total" aria-live="polite" role="status">
        <span className="floating-total-label">Total:</span>
        <span className="floating-total-amount">{peso(total)}</span>
      </div>

      {/* ===== Modal: Receipt preview / copy ===== */}
      <Modal
        show={showReceipt}
        onHide={() => setShowReceipt(false)}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Make sure it’s easy to read & scroll on Android */}
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              margin: 0,
              maxHeight: '60vh',
              overflowY: 'auto',
              fontFamily:
                "'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              fontSize: 14,
            }}
          >
            {receiptText}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => copyPlain(receiptText)}
            disabled={!hasItems}
          >
            Copy
          </Button>
          <Button variant="secondary" onClick={() => setShowReceipt(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
