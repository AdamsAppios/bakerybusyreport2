import React, { useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

// Manila date as YYYY-MM-DD (for <input type="date">)
const getPhilippineDate = () => {
  const now = new Date();
  const manila = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
  const y = manila.getFullYear();
  const m = String(manila.getMonth() + 1).padStart(2, '0');
  const d = String(manila.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// For the textarea line: "Sep 3 2025"
const formatDisplayDate = (yyyyMmDd) => {
  const dt = new Date(yyyyMmDd);
  if (isNaN(dt)) return '';
  return dt
    .toLocaleDateString('en-US', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric' })
    .replace(',', '');
};

const CoffeeSales = () => {
  // default date: today in PH
  const [coffeeDate, setCoffeeDate] = useState(getPhilippineDate());

  const greeting = () => {
    const hrs = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Manila' });
    return Number(hrs) < 12 ? 'Good AM Sales sa coffee' : 'Good PM Sales sa coffee';
  };

  const [localCoffeeReport, setLocalCoffeeReport] = useState(
    `${greeting()}\n` +
    `date: ${formatDisplayDate(getPhilippineDate())}\n` +
    `halin: \n` +
    `caramel: \n` +
    `capuccino: \n` +
    `3in1: \n` +
    `cupsBeg: \n` +
    `cupsEnd: \n` +
    `Cups Used: 0`
  );

  const handleLocalInputChange = (e) => {
    const { name, value } = e.target;
    const lines = localCoffeeReport.split('\n');

    // numbers-only guard for cupsBeg/cupsEnd
    if ((name === 'cupsBeg' || name === 'cupsEnd') && !/^\d*$/.test(value)) return;

    if (name === 'coffeeDate') {
      setCoffeeDate(value);
      lines[1] = `date: ${formatDisplayDate(value)}`;
    }
    if (name === 'halin')       lines[2] = `halin: ${value}`;
    if (name === 'caramel')     lines[3] = `caramel: ${value}`;
    if (name === 'capuccino')   lines[4] = `capuccino: ${value}`;
    if (name === 'threeInOne')  lines[5] = `3in1: ${value}`;

    if (name === 'cupsBeg') {
      const beg = Number(value) || 0;
      lines[6] = `cupsBeg: ${value}`;
      const end = Number((lines[7].split(': ')[1] || '').trim()) || 0;
      lines[8] = `Cups Used: ${Math.max(0, beg - end)}`;
    }

    if (name === 'cupsEnd') {
      const end = Number(value) || 0;
      lines[7] = `cupsEnd: ${value}`;
      const beg = Number((lines[6].split(': ')[1] || '').trim()) || 0;
      lines[8] = `Cups Used: ${Math.max(0, beg - end)}`;
    }

    setLocalCoffeeReport(lines.join('\n'));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(localCoffeeReport);
    } catch (err) {
      // Fallback for very old browsers
      const ta = document.createElement('textarea');
      ta.value = localCoffeeReport;
      ta.style.position = 'fixed';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  const eraseLocalCoffeeReport = () => {
    // Clear text inputs but keep date controlled by state
    document
      .querySelectorAll('input[type="text"]')
      .forEach((input) => (input.value = ''));

    const todayPH = getPhilippineDate();
    setCoffeeDate(todayPH);
    setLocalCoffeeReport(
      `${greeting()}\n` +
      `date: ${formatDisplayDate(todayPH)}\n` +
      `halin: \n` +
      `caramel: \n` +
      `capuccino: \n` +
      `3in1: \n` +
      `cupsBeg: \n` +
      `cupsEnd: \n` +
      `Cups Used: 0`
    );
  };

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={6}
          value={localCoffeeReport}
          readOnly
          className="report-textarea"
        />
      </Form.Group>

      <div className="mb-3">
        <Button variant="primary" className="me-2" onClick={copyToClipboard}>
          Copy Coffee Report
        </Button>
        <Button variant="danger" onClick={eraseLocalCoffeeReport}>
          Erase Coffee All
        </Button>
      </div>

      <Form className="coffee-sales-form">
        <Table size="sm" borderless>
          <tbody>
            <tr>
              <td><Form.Label>Date</Form.Label></td>
              <td>
                <Form.Control
                  type="date"
                  name="coffeeDate"
                  value={coffeeDate}                  // default + controlled
                  onChange={handleLocalInputChange}
                />
              </td>
            </tr>
            <tr>
              <td><Form.Label>halin</Form.Label></td>
              <td><Form.Control type="text" name="halin" placeholder="Halin Sa Coffee" onChange={handleLocalInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>capuccino</Form.Label></td>
              <td><Form.Control type="text" name="capuccino" placeholder="Capuccino End" onChange={handleLocalInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>3in1</Form.Label></td>
              <td><Form.Control type="text" name="threeInOne" placeholder="3in1 End" onChange={handleLocalInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>caramel</Form.Label></td>
              <td><Form.Control type="text" name="caramel" placeholder="Caramel End" onChange={handleLocalInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>cupsBeg</Form.Label></td>
              <td>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="0"
                  step="1"
                  name="cupsBeg"
                  placeholder="Cups Beg"
                  onChange={handleLocalInputChange}
                />
              </td>
            </tr>
            <tr>
              <td><Form.Label>cupsEnd</Form.Label></td>
              <td>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="0"
                  step="1"
                  name="cupsEnd"
                  placeholder="Cups End"
                  onChange={handleLocalInputChange}
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Form>
    </>
  );
};

export default CoffeeSales;
