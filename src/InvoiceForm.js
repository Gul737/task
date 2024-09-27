import React, { useState, useEffect } from 'react';
import './App.css';

  

function InvoiceForm() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Get current date in yyyy-mm-dd format
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
  }, []);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemName: '', qty: 0, bonus: 0, rate: 0, discount: 0 });
  const [totals, setTotals] = useState({ subTotal: 0, discountTotal: 0, freightTotal: 0, expenseTotal: 0 });
  const [salesman, setSalesman] = useState('');
  const [customer, setCustomer] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const [salesmenOptions, setSalesmenOptions] = useState([]);
  const [customersOptions, setCustomersOptions] = useState([]);
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  const [itemNames, setItemNames] = useState([]);

  useEffect(() => {
    // Fetch invoice numbers from Invoice Master Table
    fetch('http://localhost:3001/invoice') // corrected to fetch from Invoice Master table
      .then(response => response.json())
      .then(data => setInvoiceNumbers(data));

    // Fetch salesmen from Employee Table
    fetch('http://localhost:3001/salesmen')
      .then(response => response.json())
      .then(data => setSalesmenOptions(data));

    // Fetch customers from Customer Table
    fetch('http://localhost:3001/customers')
      .then(response => response.json())
      .then(data => setCustomersOptions(data));

    // Fetch item names from Product Table
    fetch('http://localhost:3001/items') // corrected to fetch from Product table
      .then(response => response.json())
      .then(data => setItemNames(data));
  }, []);

  const handleDelete = (index) => {
    const deletedItem = items[index];
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);

    const newSubTotal = totals.subTotal - deletedItem.total;
    const newDiscountTotal = totals.discountTotal - parseFloat(deletedItem.discount);

    setTotals({ ...totals, subTotal: newSubTotal, discountTotal: newDiscountTotal });
  };

  const handleAddItem = () => {
    const total = (newItem.qty * newItem.rate) - newItem.discount;
    setItems([...items, { ...newItem, total }]);

    const subTotal = totals.subTotal + total;
    const discountTotal = totals.discountTotal + parseFloat(newItem.discount);
    setTotals({ ...totals, subTotal, discountTotal });

    setNewItem({ itemName: '', qty: 0, bonus: 0, rate: 0, discount: 0 });
  };

 
  return (
    <div className="container " style={{ background: '#4674a6' ,maxWidth:"2000px"}}>

      <div className="row mb-3">
  <div className="col d-flex justify-content-end" style={{flex:"1 1 60%"}}>
    <div className="col-auto mx-2">
      <button className="btn dark-blue text-white">Load</button>
    </div>
    <div className="col-auto mx-2">
      <button className="btn btn-success">
        <i className="bi bi-arrow-right fs-5 fw-bold"></i>
      </button>
    </div>
    <div className="col-auto mx-2">
      <button className="btn btn-primary">
        <i className="bi bi-printer px-2"></i> Print
      </button>
    </div>
    <div className="col-auto mx-2">
      <button className="btn btn-danger">
        <i className="bi bi-list-ol text-white px-2"></i> List
      </button>
    </div>
  </div>
  
  <div className="col d-flex justify-content-end" style={{flex:"1 1 10%"}}>
    <div className="col-auto mx-2">
      <button className="btn btn-success">
        <i className="bi bi-check"></i> Save
      </button>
    </div>
    <div className="col-auto mx-2">
      <button className="btn dark-blue text-white">
        <i className="bi bi-pencil-square text-white px-2"></i> Modify
      </button>
    </div>
  </div>
</div>
<div className="container d-flex justify-content-center align-items-center flex-column" >
      {/* Invoice Information */}
      <div>
<div>
  {/* First Row */}
  <div className="row mb-3">  {/* Adjusted distance */}
    <div className="col-md-4 d-flex position-relative">
      <label className="text-nowrap" style={{flex: "1 1 30%", marginRight: "5px"}}>INV NO</label>
      <div style={{flex: "1 1 65%", position: "relative"}}>
        <select className="form-control" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} style={{width: "100%", paddingRight: "30px", appearance: "none"}}>
          <option value="">Select Invoice</option>
          {invoiceNumbers.map((inv, index) => (
            <option key={index} value={inv.invoice_number}>{inv.invoice_number}</option>
          ))}
        </select>
      </div>
    </div>
  </div>

  {/* Second Row */}
  <div className="row mb-3">  {/* Adjusted distance */}
    <div className="col-md-4 d-flex position-relative">
      <label className="text-nowrap" style={{flex: "1 1 30%", marginRight: "5px"}}>Salesman</label>
      <div style={{flex: "1 1 65%", position: "relative"}}>
        <select className="form-control" style={{width: "100%", backgroundColor: "lightgrey", paddingRight: "30px", appearance: "none"}} value={salesman} onChange={(e) => setSalesman(e.target.value)}>
          <option value="">Select Salesman</option>
          {salesmenOptions.map((option, index) => (
            <option key={index} value={option.emp_name}>{option.emp_name}</option>
          ))}
        </select>
        {/* Dropdown icon */}
        <span className="dropdown-icon" style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", pointerEvents: "none"}}>&#x25BC;</span>
      </div>
    </div>

    {/* Invoice Date */}
    <div className="col-md-3 d-flex" style={{marginLeft: "10%", alignItems: "center"}}>
      <label className="text-nowrap" style={{flex: "1 1 30%", marginRight: "5px"}}>Invoice Date</label>
      <input type="date" className="form-control" value={currentDate} style={{flex: "1 1 65%"}} readOnly />
    </div>
  </div>

  {/* Third Row */}
  <div className="row mb-3">  {/* Adjusted distance */}
    <div className="col-md-4 d-flex position-relative">
      <label className="text-nowrap" style={{flex: "1 1 30%", marginRight: "5px"}}>Customer</label>
      <div style={{flex: "1 1 65%", position: "relative"}}>
        <select className="form-control" style={{width: "100%", paddingRight: "30px", appearance: "none"}} value={customer} onChange={(e) => setCustomer(e.target.value)}>
          <option value="">Select Customer</option>
          {customersOptions.map((option, index) => (
            <option key={index} value={option.cust_name}>{option.cust_name}</option>
          ))}
        </select>
        {/* Dropdown icon */}
        <span className="dropdown-icon" style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", pointerEvents: "none"}}>&#x25BC;</span>
      </div>
    </div>

    {/* Terms */}
    <div className="col-md-3 d-flex" style={{marginLeft: "10%", alignItems: "center"}}>
      <label className="text-nowrap" style={{flex: "1 1 30%", marginRight: "5px"}}>Terms</label>
      <div style={{flex: "1 1 65%", position: "relative"}}>
        <select className="form-control" style={{width: "100%", paddingRight: "30px", appearance: "none"}}>
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
        </select>
        {/* Dropdown icon */}
        <span className="dropdown-icon" style={{position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", pointerEvents: "none"}}>&#x25BC;</span>
      </div>
    </div>
  </div>
</div>

      <hr className="bg-white py-1 mt-5 mb-5" style={{ borderTop: "1px solid white" }} />
   
      <div className="row mb-4">
  <div className="col-md-3 position-relative">
    <label>Item Name</label>
    <div style={{ position: 'relative' }}>
      <select
        className="form-control"
        style={{ paddingRight: '30px' }} // Add padding to make space for the icon
        value={newItem.itemName}
        onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
      >
        <option value="">Select Item</option>
        {itemNames.map((item, index) => (
          <option key={index} value={item.product_name}>
            {item.product_name}
          </option>
        ))}
      </select>
      <i
        className="bi bi-chevron-down"
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      ></i>
    </div>
  </div>

  <div style={{ flex: "0 0 10%", maxWidth: "10%", marginRight: "1%" }}>
  <label>Qty</label>
  <input
    type="number"
    className="form-control"
    value={newItem.qty}
    onChange={(e) => setNewItem({ ...newItem, qty: parseInt(e.target.value) })}
    placeholder="Quantity"
  />
</div>
<div style={{ flex: "0 0 10%", maxWidth: "10%", marginRight: "1%" }}>
  <label>Bonus</label>
  <input
    type="number"
    className="form-control"
    value={newItem.bonus}
    onChange={(e) => setNewItem({ ...newItem, bonus: parseInt(e.target.value) })}
    placeholder="Bonus"
  />
</div>
<div style={{ flex: "0 0 10%", maxWidth: "10%", marginRight: "1%" }}>
  <label>Rate</label>
  <input
    type="number"
    className="form-control"
    value={newItem.rate}
    onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) })}
    placeholder="Rate"
  />
</div>
<div style={{ flex: "0 0 10%", maxWidth: "10%", marginRight: "1%" }}>
  <label>Discount</label>
  <input
    type="number"
    className="form-control"
    value={newItem.discount}
    onChange={(e) => setNewItem({ ...newItem, discount: parseFloat(e.target.value) })}
    placeholder="Discount"
  />
</div>

  <div className="col-md-2">
    <label>Remarks</label>
    <input type="text" className="form-control" placeholder="Remarks" />
  </div>

  <div className="col-md-1">
    <button
      className="btn btn-success mt-4"
      onClick={handleAddItem}
      style={{ fontSize: '1rem', fontWeight: 'bold' }} // Increase the size and bold the plus icon
    >
      <i className="bi bi-plus"></i>
    </button>
  </div>
</div>


      {/* Items Table */}
      {items.length > 0 && (
      <table className="table table-bordered mt-5">
      <thead style={{ backgroundColor: 'grey !important' }}>

          <tr>
            <th></th>
            <th>No</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Bonus</th>
            <th>Rate</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
              <td>{index + 1}</td>
              <td>{item.itemName}</td>
              <td>{item.qty}</td>
              <td>{item.bonus}</td>
              <td>{item.rate}</td>
              <td>{item.discount}</td>
              <td>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
</div>

    <div className="row mt-3" style={{width:"100%"}}>
  <div className="col">
    <label>Remarks</label>
    <textarea className="form-control" rows="3" placeholder="Enter remarks"></textarea>
  </div>

  {/* Totals */}
  <div className="col-md-4 d-flex justify-content-end">
    {/* <table className="table">
      <tbody>
        <tr>
          <td>Sub Total:</td>
          <td>{totals.subTotal}</td>
        </tr>
        <tr>
          <td>Discount Total:</td>
          <td>{totals.discountTotal}</td>
        </tr>
        <tr>
          <td>Freight Total:</td>
          <td>{totals.freightTotal}</td>
        </tr>
        <tr>
          <td>Expense Total:</td>
          <td>{totals.expenseTotal}</td>
        </tr>
        <tr>
          <td><strong>Total Amount:</strong></td>
          <td><strong>{totals.subTotal - totals.discountTotal + totals.freightTotal + totals.expenseTotal}</strong></td>
        </tr>
      </tbody>
    </table> */}
    <table className="table" style={{ backgroundColor: '#f0f0f0' }}>
  <tbody>
    <tr>
      <td>Sub Total:</td>
      <td style={{ backgroundColor: '#d3d3d3', border: '1px solid #000', padding: '10px' }}>
        <div style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>
          {totals.subTotal}
        </div>
      </td>
    </tr>
    <tr>
      <td>Discount Total:</td>
      <td style={{ border: '1px solid #000', padding: '10px' }}>
        <div style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>
          {totals.discountTotal}
        </div>
      </td>
    </tr>
    <tr>
      <td>Freight Total:</td>
      <td style={{ border: '1px solid #000', padding: '10px' }}>
        <div style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>
          {totals.freightTotal}
        </div>
      </td>
    </tr>
    <tr>
      <td>Expense Total:</td>
      <td style={{ border: '1px solid #000', padding: '10px' }}>
        <div style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>
          {totals.expenseTotal}
        </div>
      </td>
    </tr>
    <tr>
      <td><strong>Total Amount:</strong></td>
      <td style={{ backgroundColor: '#b0b0b0', border: '1px solid #000', padding: '10px' }}>
        <div style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>
          <strong>{totals.subTotal - totals.discountTotal + totals.freightTotal + totals.expenseTotal}</strong>
        </div>
      </td>
    </tr>
  </tbody>
</table>

  </div>
</div>
</div>

    </div>
  );
}

export default InvoiceForm;
