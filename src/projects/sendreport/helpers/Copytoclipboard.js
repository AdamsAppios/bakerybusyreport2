import React, { useRef } from 'react';

function Copytoclipboard({ stringReport, handleEraseAll, copyButtonLabel, eraseButtonLabel }) {
  const textAreaRef = useRef(null);

  const isIOS = () => /iPad|iPhone|iPod/i.test(navigator.userAgent);

  // Plain-text copy via a temporary textarea (works reliably on iOS)
  const legacyCopy = (txt) => {
    const ta = document.createElement('textarea');
    ta.value = txt;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);

    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length); // iOS needs explicit range

    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(ta);
      // Clear any selection
      const sel = window.getSelection && window.getSelection();
      if (sel && sel.removeAllRanges) sel.removeAllRanges();
    }
  };

  const handleCopy = async () => {
    const text = textAreaRef.current?.value ?? '';

    // iOS path: force legacy plain-text copy to avoid URL-encoded paste
    if (isIOS()) {
      legacyCopy(text);
      return;
    }

    // Other platforms: use modern API, fall back if blocked
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        legacyCopy(text);
      }
    } catch {
      legacyCopy(text);
    }
  };

  return (
    <div className="report-header">
      <textarea
        ref={textAreaRef}
        className="report-textarea"
        rows={12}
        value={stringReport}
        readOnly
      />
      <div className="report-toolbar" role="group" aria-label="Report actions">
        <button onClick={handleCopy}>{copyButtonLabel}</button>
        <button onClick={handleEraseAll}>{eraseButtonLabel}</button>
      </div>
    </div>
  );
}

export default Copytoclipboard;
