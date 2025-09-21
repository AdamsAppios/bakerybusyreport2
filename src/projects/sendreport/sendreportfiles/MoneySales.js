import React from 'react';
import { Button, Form, Table } from 'react-bootstrap';

const MoneySales = ({ formData, handleInputChange, onClearMoney }) => {
  // step helper: +/- 1 with floor at 0
  const step = (name, delta) => {
    const cur = Number(formData[name]) || 0;
    const next = Math.max(0, cur + delta);
    handleInputChange({ target: { name, value: String(next) } });
  };

  const renderMoneyRow = (labelText, name, denomination) => {
    const qty = Number(formData[name]) || 0;
    const total = denomination * qty;

    return (
      <tr key={name}>
        <td>
          <Form.Label>{labelText}</Form.Label>
        </td>
        <td>
          <div className="stepper">
            <Button
              variant="light"
              className="step-btn"
              onClick={() => step(name, -1)}
              disabled={qty <= 0}
              aria-label={`decrement ${labelText}`}
            >
              –
            </Button>

            <Form.Control
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min="0"
              step="1"
              name={name}
              placeholder={''}
              value={formData[name]}
              onChange={handleInputChange}
              onWheel={(e) => e.currentTarget.blur()} // avoid accidental scroll changes on desktop
              className="money-input"
            />

            <Button
              variant="light"
              className="step-btn"
              onClick={() => step(name, +1)}
              aria-label={`increment ${labelText}`}
            >
              +
            </Button>
          </div>
        </td>

        <td className="money-label-cell">{`${denomination} x ${qty} = ${total}`}</td>
      </tr>
    );
  };

  return (
    <>
      {/* Existing, non-sticky header total (kept as requested) */}
      <h3 className="total-cash">Total Cash: {formData.totalCash}</h3>
      <h4 className="fill-up">Fill up below:</h4>
      <Button variant="secondary" className="mb-3 clear-button" onClick={onClearMoney}>
        Clear Money Inputs
      </Button>

      <Form className="money-sales-form">
        <Table size="sm" borderless>
          <tbody>
            <tr>
              <td><Form.Label>Date</Form.Label></td>
              <td colSpan="2">
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  lang="en-US"
                  placeholder="mm/dd/yyyy"
                />
              </td>
            </tr>
            <tr>
              <td><Form.Label>Time</Form.Label></td>
              <td colSpan="2">
                <Form.Control
                  type="text"
                  name="time"
                  placeholder="Oras"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td><Form.Label>Cashier</Form.Label></td>
              <td colSpan="2">
                <Form.Control
                  type="text"
                  name="cashier"
                  placeholder="Pangan sa Cashier"
                  value={formData.cashier}
                  onChange={handleInputChange}
                />
              </td>
            </tr>

            {renderMoneyRow('Cash 1000', 'cash1000', 1000)}
            {renderMoneyRow('Cash 500', 'cash500', 500)}
            {renderMoneyRow('Cash 200', 'cash200', 200)}
            {renderMoneyRow('Cash 100', 'cash100', 100)}
            {renderMoneyRow('Cash 50', 'cash50', 50)}
            {renderMoneyRow('Cash 20', 'cash20', 20)}
            {renderMoneyRow('Coins 10', 'coins10', 10)}
            {renderMoneyRow('Coins 5', 'coins5', 5)}
            {renderMoneyRow('Coins 1', 'coins1', 1)}
          </tbody>
        </Table>
      </Form>

      {/* NEW: floating sticky Total Cash – only rendered on Money Sales tab */}
      <div
        className="floating-total-cash"
        aria-live="polite"
        role="status"
      >
        <span className="floating-total-label">Total Cash:</span>
        <span className="floating-total-amount">{formData.totalCash}</span>
      </div>
    </>
  );
};

export default MoneySales;
