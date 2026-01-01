import React, { useRef, useState, useRef as useRefAlias, useEffect } from 'react';

function Copytoclipboard({ stringReport, handleEraseAll, copyButtonLabel, eraseButtonLabel }) {
  const textAreaRef = useRef(null);

  // --- tiny toast state ---
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('Copied!');
  const [toastKind, setToastKind] = useState('ok'); // 'ok' | 'err'
  const hideTimerRef = useRefAlias(null);

  const showToast = (msg = 'Copied!', kind = 'ok') => {
    setToastMsg(msg);
    setToastKind(kind);
    setToastOpen(true);
    // auto-hide after 1.6s
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setToastOpen(false), 1600);
  };

  useEffect(() => () => hideTimerRef.current && clearTimeout(hideTimerRef.current), []);

  const isIOS = () => /iPad|iPhone|iPod/i.test(navigator.userAgent);

  // Plain-text copy via a temporary textarea (reliable for iOS)
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
      const sel = window.getSelection && window.getSelection();
      if (sel && sel.removeAllRanges) sel.removeAllRanges();
    }
  };

  const handleCopy = async () => {
    const text = textAreaRef.current?.value ?? '';

    // iOS path: force legacy plain-text copy to avoid URL-encoded paste
    if (isIOS()) {
      legacyCopy(text);
      showToast('Copied to clipboard');
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        legacyCopy(text);
      }
      showToast('Copied to clipboard');
    } catch {
      legacyCopy(text);
      showToast('Copy failed', 'err');
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

      {/* Tiny Android-friendly toast */}
      <div
        className={`copy-toast ${toastOpen ? 'show' : ''} ${toastKind}`}
        role="status"
        aria-live="polite"
        onClick={() => setToastOpen(false)} // tap to dismiss early
      >
        {toastMsg}
      </div>
    </div>
  );
}

export default Copytoclipboard;
