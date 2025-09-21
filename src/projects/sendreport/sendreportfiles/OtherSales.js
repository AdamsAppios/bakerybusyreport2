import React from 'react';
import { Form, Table } from 'react-bootstrap';

const OtherSales = ({ formData, handleInputChange }) => {
  const autoGrow = (e) => {
  e.target.style.height = 'auto';
  e.target.style.height = `${e.target.scrollHeight}px`;
  };
  return (
    <>
      <h4 className="fill-up">Fill up inig 6pm ug 6am</h4>
      <Form className="other-sales-form">
        <Table size="sm" borderless>
          <tbody>
            <tr>
              <td><Form.Label>Total Sales</Form.Label></td>
              <td><Form.Control type="number" inputMode="numeric" pattern="[0-9]*" min="0" step="1"
                      name="totalSales" placeholder="Total Sales (add sa imo duty)"
                      value={formData.totalSales} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>SB</Form.Label></td>
              <td><Form.Control type="text" name="sb" placeholder="SB Example : 100 in 45" value={formData.sb} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>Coins</Form.Label></td>
              <td><Form.Control type="text" name="coins" placeholder="Coins Putos" value={formData.coins} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>Toasted</Form.Label></td>
              <td><Form.Control type="number" inputMode="numeric" pattern="[0-9]*" min="0" step="1"
                name="toasted" placeholder="Toasted"
                value={formData.toasted} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>NS Sale</Form.Label></td>
              <td><Form.Control type="text" name="nsSale" placeholder="NS Sale" value={formData.nsSale} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>NS Stocks</Form.Label></td>
              <td><Form.Control type="text" name="nsStocks" placeholder="NS Stocks" value={formData.nsStocks} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>SD</Form.Label></td>
              <td><Form.Control type="number" inputMode="numeric" pattern="[0-9]*" min="0" step="1"
                name="sd" placeholder="SD"
                value={formData.sd} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>Mineral (for 6pm report)</Form.Label></td>
              <td>
                <div className="inline-calc">
                  <Form.Control
                    type="number"
                    name="mineral"
                    placeholder="Mineral"
                    inputMode="numeric" 
                    pattern="[0-9]*" 
                    min="0" 
                    step="1"
                    value={formData.mineral}
                    onChange={handleInputChange}
                  />
                  <span className="calc-pill">
                    {(Number(formData.mineral) || 0)} x 15 = {(Number(formData.mineral) || 0) * 15}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2"><h4 className="fill-up">Stocks Remaining:</h4></td>
            </tr>
            <tr>
              <td><Form.Label>Mantika</Form.Label></td>
              <td><Form.Control type="text" name="mantika" placeholder="stocks sa mantika" value={formData.mantika} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>Plastic SB</Form.Label></td>
              <td><Form.Control type="text" name="plasticSB" placeholder="stocks sa SB plastic" value={formData.plasticSB} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>Plastic Loaf</Form.Label></td>
              <td><Form.Control type="text" name="plasticLoaf" placeholder="stocks sa loaf plastic" value={formData.plasticLoaf} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>Loaf</Form.Label></td>
              <td>
                <Form.Control
                  type="text"
                  name="loaf"
                  placeholder="Loaf stocks left"
                  value={formData.loaf}
                  onChange={handleInputChange}
              />
              </td>
            </tr>
            <tr>
              <td><Form.Label>Plastic #3</Form.Label></td>
              <td><Form.Control type="text" name="plastic3" placeholder="stocks plastic #3" value={formData.plastic3} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>Plastic #6</Form.Label></td>
              <td><Form.Control type="text" name="plastic6" placeholder="stocks plastic #6" value={formData.plastic6} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>Plastic Tiny</Form.Label></td>
              <td><Form.Control type="text" name="plasticTiny" placeholder="stocks plastic tiny" value={formData.plasticTiny} onChange={handleInputChange} /></td>
            </tr>
            <tr>
              <td><Form.Label>Pullouts</Form.Label></td>
              <Form.Control as="textarea" name="pullouts" rows={3} placeholder="Mga Pullout"
                value={formData.pullouts} onChange={handleInputChange}
                className="expandable-textarea" onInput={autoGrow} />
            </tr>
            <tr>
              <td><Form.Label>Accounts</Form.Label></td>
              <Form.Control as="textarea" name="accounts" rows={3} placeholder="Mga Accounts"
                 value={formData.accounts} onChange={handleInputChange}
                 className="expandable-textarea" onInput={autoGrow} />
            </tr>
            <tr>
              <td><Form.Label>Workers</Form.Label></td>
              <Form.Control as="textarea" name="workers" rows={3} placeholder="Mga Workers (Including Absences)"
                  value={formData.workers} onChange={handleInputChange}
                  className="expandable-textarea" onInput={autoGrow} />
            </tr>
            {/* Expenses */}
           <tr>
            <td><Form.Label>Expenses (for 6pm report)</Form.Label></td>
            <td>
              <div className="expenses-wrap">
              <div className="exp-label">Total Expenses = {Number(formData.totalExpenses || 0)}</div>
              <Form.Control
                as="textarea"
                rows={3}
                name="expenses"
                placeholder={
                  'Example FA 5 persons = 275\n' +
                  'Fare Dina SM= 30\n' +
                  'Grocery = 875'
                }
                value={formData.expenses}
                onChange={handleInputChange}
                className="expandable-textarea"
                onInput={autoGrow}
                  />
              </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </Form>
    </>
  );
};

export default OtherSales;