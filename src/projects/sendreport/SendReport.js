import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import './SendReport.css';
import MoneySales from './sendreportfiles/MoneySales';
import OtherSales from './sendreportfiles/OtherSales';
import CoffeeSales from './sendreportfiles/CoffeeSales';
import Copytoclipboard from './helpers/Copytoclipboard';
import CalcTab from './sendreportfiles/CalcTab';
import POS from './sendreportfiles/POS';

// Helper function to get the current date in Manila (Philippine) time as "YYYY-MM-DD"
const getPhilippineDate = () => {
  const now = new Date();
  const manilaString = now.toLocaleString("en-US", { timeZone: "Asia/Manila" });
  const manilaDate = new Date(manilaString);
  const year = manilaDate.getFullYear();
  const month = (manilaDate.getMonth() + 1).toString().padStart(2, '0');
  const day = manilaDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format "YYYY-MM-DD" to "September 7, 2025" using PH timezone
const formatDatePHLong = (yyyyMmDd) => {
  if (!yyyyMmDd) return '';
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  const asUTC = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  return asUTC.toLocaleDateString('en-US', {
    timeZone: 'Asia/Manila',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const SendReport = () => {
  const [tabValue, setTabValue] = useState('moneySales');
  const [reportText, setReportText] = useState('Date: \nCashier: \nTotal: 0');

  const [formData, setFormData] = useState({
    date: getPhilippineDate(),
    time: '',
    cashier: '',
    cash1000: '',
    cash500: '',
    cash200: '',
    cash100: '',
    cash50: '',
    cash20: '',
    coins10: '',
    coins5: '',
    coins1: '',
    totalCash: 0,
    totalSales: '',
    sb: '',
    coins: '',
    toasted: '',
    nsSale: '',
    nsStocks: '',
    sd: '',
    mineral: '',
    mantika: '',
    plasticSB: '',
    plasticLoaf: '',
    loaf: '',
    plastic3: '',
    plastic6: '',
    plasticTiny: '',
    plasticMedium: '',
    plasticLarge: '',
    pullouts: '',
    accounts: '',
    workers: '',
    expenses: '',
    totalExpenses: 0,
    coffeeDate: '',
    halin: '',
    capuccino: '',
    threeInOne: '',
    caramel: '',
    cupsBeg: '',
    cupsEnd: '',
    coffeeReport: 'Good PM Sales sa coffee\ndate: '
  });

  /* ---------- Overflowing tab strip logic ---------- */
  const stripRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateArrows = () => {
    const el = stripRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 1;
    setHasOverflow(overflow);
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollByDir = (dir) => {
    const el = stripRef.current;
    if (!el) return;
    const amount = Math.max(120, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
    // re-evaluate after the smooth scroll
    setTimeout(updateArrows, 350);
  };

  useEffect(() => {
    updateArrows();
    const onResize = () => updateArrows();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Keep the active tab visible/centered
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const btn = el.querySelector(`[data-tab="${tabValue}"]`);
    if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    updateArrows();
  }, [tabValue]);

  /* ---------- Inputs / totals ---------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const moneyFields = [
      'cash1000','cash500','cash200','cash100','cash50','cash20','coins10','coins5','coins1'
    ];
    if (moneyFields.includes(name)) {
      if (/^[0-9+]*$/.test(value)) setFormData(prev => ({ ...prev, [name]: value }));
      return;
    }

    if (name === 'expenses') {
      const sum = value
        .split(/\n+/)
        .map(line => {
          const idx = line.lastIndexOf('=');
          if (idx === -1) return 0;
          const num = parseFloat(line.slice(idx + 1).replace(/[^0-9.\-]/g, '').trim());
          return isNaN(num) ? 0 : num;
        })
        .reduce((a, b) => a + b, 0);
      setFormData(prev => ({ ...prev, expenses: value, totalExpenses: sum }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearMoneyInputs = () => {
    const todayPH = getPhilippineDate();
    setFormData(prev => ({
      ...prev,
      date: todayPH,
      time: '',
      cashier: '',
      cash1000: '',
      cash500: '',
      cash200: '',
      cash100: '',
      cash50: '',
      cash20: '',
      coins10: '',
      coins5: '',
      coins1: '',
      totalCash: 0,
    }));
  };

  useEffect(() => {
    const calculateReport = () => {
      let totalCash = 0;
      let report = '';
      if (formData.cash1000 > 0) {
        const qty = Number(formData.cash1000) || 0;
        const subtotal = 1000 * qty;
        report += `1000x${qty} = ${subtotal}\n`;
        totalCash += subtotal;
      }
      if (formData.cash500 > 0) {
        const qty = Number(formData.cash500) || 0;
        const subtotal = 500 * qty;
        report += `500x${qty} = ${subtotal}\n`;
        totalCash += subtotal;
      }
      if (formData.cash200 > 0) {
        const qty = Number(formData.cash200) || 0;
        const subtotal = 200 * qty;
        report += `200x${qty} = ${subtotal}\n`;
        totalCash += subtotal;
      }
      if (formData.cash100 > 0) {
        const qty = Number(formData.cash100) || 0;
        const subtotal = 100 * qty;
        report += `100x${qty} = ${subtotal}\n`;
        totalCash += subtotal;
      }
      if (formData.cash50 > 0) {
        const qty = Number(formData.cash50) || 0;
        const subtotal = 50 * qty;
        report += `50x${qty} = ${subtotal}\n`;
        totalCash += subtotal;
      }
      if (formData.cash20 > 0) {
        const qty = Number(formData.cash20) || 0;
        const subtotal = 20 * qty;
        report += `20x${qty} = ${subtotal}\n`;
        totalCash += subtotal;
      }
      if (formData.coins10 > 0) {
        const qty = Number(formData.coins10) || 0;
        const subtotal = 10 * qty;
        report += `10x${qty} = ${subtotal}\n`;
        totalCash += subtotal;
      }
      if (formData.coins5 > 0) {
        const qty = Number(formData.coins5) || 0;
        const subtotal = 5 * qty;
        report += `5x${qty} = ${subtotal}\n`;
        totalCash += subtotal;
      }
      if (formData.coins1 > 0) {
        const qty = Number(formData.coins1) || 0;
        const subtotal = 1 * qty;
        report += `1x${qty} = ${subtotal}\n`;
        totalCash += subtotal;
      }

      setFormData(prevData => ({ ...prevData, totalCash }));

      let otherSalesReport = '';
      if (formData.totalSales) otherSalesReport += `Total_Sales = ${formData.totalSales}\n`;
      if (formData.sb) otherSalesReport += `SB = ${formData.sb}\n`;
      if (formData.coins) otherSalesReport += `Coins = ${formData.coins}\n`;
      if (formData.toasted) otherSalesReport += `Toasted = ${formData.toasted}\n`;
      if (formData.nsSale) otherSalesReport += `NSSale = ${formData.nsSale}\n`;
      if (formData.nsStocks) otherSalesReport += `NSStocks = ${formData.nsStocks}\n`;
      if (formData.sd) otherSalesReport += `SD = ${formData.sd}\n`;
      if (formData.mineral) {
        const m = Number(formData.mineral) || 0;
        otherSalesReport += `Mineral=${m}x15 = ${m * 15}\n`;
      }
      if (formData.mantika) otherSalesReport += `Mantika = ${formData.mantika}\n`;
      if (formData.plasticSB) otherSalesReport += `Plastic SB = ${formData.plasticSB}\n`;
      if (formData.plasticLoaf) otherSalesReport += `Plastic Loaf = ${formData.plasticLoaf}\n`;
      if (formData.loaf) otherSalesReport += `Loaf = ${formData.loaf}\n`;
      if (formData.plastic3) otherSalesReport += `Plastic_No3 = ${formData.plastic3}\n`;
      if (formData.plastic6) otherSalesReport += `Plastic_No6 = ${formData.plastic6}\n`;
      if (formData.plasticTiny) otherSalesReport += `Plastic Tiny = ${formData.plasticTiny}\n`;
      if (formData.plasticMedium) otherSalesReport += `Plastic Medium = ${formData.plasticMedium}\n`;
      if (formData.plasticLarge)  otherSalesReport +=`Plastic Large = ${formData.plasticLarge}\n`;
      if (formData.pullouts) otherSalesReport += `\nPullouts = \n${formData.pullouts}\n\n`;
      if (formData.accounts) otherSalesReport += `Accounts = \n${formData.accounts}\n\n`;
      if (formData.workers) otherSalesReport += `Workers = \n${formData.workers}\n`;
      const hasExpText = !!(formData.expenses && formData.expenses.trim().length > 0);
      const totalExp = Number(formData.totalExpenses || 0);
      if (hasExpText) {
        otherSalesReport += `\nExpenses\n${formData.expenses}\nTotal Expenses: ${totalExp}\n`;
      }

      let coffeeSalesReport = '';
      if (formData.halin) coffeeSalesReport += `Halin = ${formData.halin}\n`;
      if (formData.capuccino) coffeeSalesReport += `Capuccino = ${formData.capuccino}\n`;
      if (formData.threeInOne) coffeeSalesReport += `3in1 = ${formData.threeInOne}\n`;
      if (formData.caramel) coffeeSalesReport += `Caramel = ${formData.caramel}\n`;
      if (formData.cupsBeg) coffeeSalesReport += `Cups Beginning = ${formData.cupsBeg}\n`;
      if (formData.cupsEnd) coffeeSalesReport += `Cups Ending = ${formData.cupsEnd}\n`;

      const combinedReport =
        `Date: ${formatDatePHLong(formData.date)}\nCashier: ${formData.cashier} - ${formData.time}\n${report}Total: ${totalCash}` +
        (otherSalesReport ? `\n\n${otherSalesReport}` : '') +
        (coffeeSalesReport ? `\n\n${coffeeSalesReport}` : '');

      setReportText(combinedReport);
    };

    calculateReport();
  }, [formData]);

  const handleCopyReport = async () => {
    const modifiedText = reportText.replace(/\n/g, "\n\u200B");
    try {
      await navigator.clipboard.writeText(modifiedText);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleEraseAll = () => {
    setFormData({
      date: getPhilippineDate(),
      time: '',
      cashier: '',
      cash1000: '',
      cash500: '',
      cash200: '',
      cash100: '',
      cash50: '',
      cash20: '',
      coins10: '',
      coins5: '',
      coins1: '',
      totalCash: 0,
      totalSales: '',
      sb: '',
      coins: '',
      toasted: '',
      nsSale: '',
      nsStocks: '',
      sd: '',
      mineral: '',
      mantika: '',
      plasticSB: '',
      plasticLoaf: '',
      loaf: '',
      plastic3: '',
      plastic6: '',
      plasticTiny: '',
      plasticMedium: '',
      plasticLarge: '',
      pullouts: '',
      accounts: '',
      workers: '',
      coffeeDate: '',
      halin: '',
      capuccino: '',
      threeInOne: '',
      caramel: '',
      cupsBeg: '',
      cupsEnd: '',
      coffeeReport: 'Good PM Sales sa coffee\ndate: ',
      expenses: '',
      totalExpenses: 0,
    });
  };

  /* ---------------- UI ---------------- */
  const tabs = [
    { key: 'moneySales', label: 'Money Sales' },
    { key: 'otherSales', label: 'Other Sales' },
    { key: 'coffeeSales', label: 'Coffee Sales' },
    { key: 'calc',        label: 'Calc' },       // 👈 new tab here
    { key: 'pos', label: 'POS' }
  ];

    // keep panes mounted; only toggle visibility
  const paneStyle = (name) => ({
    display: tabValue === name ? 'block' : 'none',
  });
  return (
    <Container>
      <Copytoclipboard
        stringReport={reportText}
        handleEraseAll={handleEraseAll}
        copyButtonLabel="Copy Report"
        eraseButtonLabel="Erase All"
      />

      {/* Overflowing tab strip with arrows */}
      <div className="tabstrip-shell">
        {hasOverflow && (
          <button
            className="tab-arrow left"
            aria-label="Scroll tabs left"
            onClick={() => scrollByDir(-1)}
            disabled={!canLeft}
          >
            ‹
          </button>
        )}
        <div className="tabstrip" ref={stripRef} onScroll={updateArrows}>
          {tabs.map(t => (
            <button
              key={t.key}
              data-tab={t.key}
              className={`tab-btn ${tabValue === t.key ? 'active' : ''}`}
              onClick={() => setTabValue(t.key)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
        {hasOverflow && (
          <button
            className="tab-arrow right"
            aria-label="Scroll tabs right"
            onClick={() => scrollByDir(1)}
            disabled={!canRight}
          >
            ›
          </button>
        )}
      </div>

    {/* Tab contents (always mounted; we only hide/show them) */}
    <div style={paneStyle('moneySales')} aria-hidden={tabValue !== 'moneySales'}>
      <MoneySales
        formData={formData}
        handleInputChange={handleInputChange}
        onClearMoney={clearMoneyInputs}
      />
    </div>

    <div style={paneStyle('otherSales')} aria-hidden={tabValue !== 'otherSales'}>
      <OtherSales
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </div>

    <div style={paneStyle('coffeeSales')} aria-hidden={tabValue !== 'coffeeSales'}>
      <CoffeeSales
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </div>
    <div style={paneStyle('calc')} aria-hidden={tabValue !== 'calc'}>
      <CalcTab />
    </div>
    <div style={paneStyle('pos')} aria-hidden={tabValue !== 'pos'}>
      <POS />
    </div>

    </Container>
  );
};

export default SendReport;
