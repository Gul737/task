import React, { useState, useEffect } from 'react';
import './App.css';
import Cookies from 'js-cookie';

  

function InvoiceForm() {
  const selectedEmployee = Cookies.get('selectedEmployee');
  const [currentDate, setCurrentDate] = useState('');
  const [itemDescriptions, setItemDescriptions] = useState([]); // Add this line


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
  //const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  const [itemNames, setItemNames] = useState([]);

  useEffect(() => {
    // Fetch invoice numbers from Invoice Master Table
    // fetch('http://localhost:3001/invoice') // corrected to fetch from Invoice Master table
    //   .then(response => response.json())
    //   .then(data => setInvoiceNumbers(data));
     // Fetch invoice numbers from Invoice Master Table
    //  fetch('http://localhost:3001/invoice')
    //  .then(response => response.json())
    //  .then(data => {
    //      console.log('Fetched Invoice Numbers:', data); // Log the fetched data
    //      setInvoiceNumbers(data);
    //  })
    //  .catch(error => console.error('Error fetching invoice numbers:', error));
  //   fetch('http://localhost:3001/invoice')
  //   .then(response => response.json())
  //   .then(data => {
  //       //console.log('Fetched Invoice Number:', data.invoice_number); // Log the fetched invoice number
  //      //setInvoiceNumber(data.invoice_number); // Assuming `setInvoiceNumber` is your state handler
  //     // setInvoiceNumber(1029);
  //   //})
  //   //.then(invoiceNumber => {
  //     console.log('Fetched Invoice Number:', invoiceNumber); // Log the fetched invoice number
  //     setInvoiceNumber(invoiceNumber); // Set the fetched invoice number
  // })
  //   .catch(error => console.error('Error fetching invoice number:', error));
  fetch('http://localhost:3001/invoice')
  .then(response => {
      if (!response.ok) {
          return response.text().then(text => {
              throw new Error(text); // Throw an error with the response text
          });
      }
      return response.json();
  })
  .then(data => {
      console.log('Fetched Invoice Data:', data);
      if (data.invoice_number !== undefined) {
          setInvoiceNumber(data.invoice_number);
      } else {
          console.error('Invoice number is null or undefined');
      }
  })
  .catch(error => console.error('Error fetching invoice number:', error));


    // Fetch salesmen from Employee Table
    fetch('http://localhost:3001/salesmen')
      .then(response => response.json())
      .then(data => setSalesmenOptions(data));

    // Fetch customers from Customer Table
    fetch('http://localhost:3001/customers')
      .then(response => response.json())
      .then(data => setCustomersOptions(data));

      const fetchItems = async () => {
        try {
          const response = await fetch('http://localhost:3001/items');
          const data = await response.json();
          setItemDescriptions(data); 
        } catch (error) {
          console.error('Error fetching item descriptions:', error);
        }
      };
  
      fetchItems();
    }, []);
  const handleSave = () => {
    const invoiceData = {
      items,
      salesman,
      customer,
      invoiceNumber,
      invoiceDate: currentDate,
    };
  
    console.log('Invoice Data:', invoiceData); // Log the data being sent
  
    fetch('http://localhost:3001/invoice/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setItems([]);
        setSalesman('');
        setCustomer('');
        setInvoiceNumber('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  
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
    <div class="ap_container">
        <div class="ap_wrap">
    <div className="container bg-l" style={{ maxWidth:"2000px"}}>
     <p>Selected Branch: {selectedEmployee}</p>

      {/* <div className="row"> */}
  {/* <div className="col d-flex justify-content-end" style={{flex:"1 1 60%"}}>
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
      {/* <button className="btn btn-success">
        <i className="bi bi-check"></i> Save
      </button> 
      <button className="btn btn-success" onClick={handleSave}>
  <i className="bi bi-check"></i> Save
</button>
    </div>
    <div className="col-auto mx-2">
      <button className="btn dark-blue text-white">
        <i className="bi bi-pencil-square text-white px-2"></i> Modify
      </button>
    </div>
  </div> */}
{/* </div> */}
<div className="container d-flex justify-content-center align-items-center flex-column inv-layout" >
      {/* Invoice Information */}
      <div>
<div>
  {/* First Row */}
  <div className="row ">  {/* Adjusted distance */}
    <div className="col-md-4 d-flex position-relative">
      <label className="text-nowrap txt-dec">INV NO</label>
      <span className='txt-dec px-4'>{invoiceNumber}3</span>
      {/* <div style={{flex: "1 1 65%", position: "relative"}}>
        {/* <select className="form-control" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} style={{width: "100%", paddingRight: "30px", appearance: "none"}}>
          <option value="">Select Invoice</option>
          {invoiceNumbers.map((inv, index) => (
            <option key={index} value={inv.invoice_number}>{inv.invoice_number}</option>
          ))}
        </select> 
        <div className="" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} style={{width: "100%", paddingRight: "30px", appearance: "none"}}>
    
    <option value="">Select Invoice</option>
    {invoiceNumbers.map((inv, index) => (
        <option key={index} value={inv.invoice_number}>{inv.invoice_number}</option> // Ensure this matches your fetched data structure
    ))}
</div>

      </div> */}
    </div>
  </div>
  
  <div className="row mb-3">  {/* Adjusted distance */}
    <div className="col-md-4 d-flex position-relative">
      <label className="text-nowrap txt-dec">Invoice Date</label>
      <span className="txt-dec px-4">{currentDate}</span>
    </div>
      
      {/* <span className='txt-dec px-4'>{invoiceNumber}1</span>
      </div> */}
      </div>
  <hr className="my-5"/>
  {/* Second Row */}
  <div className="row mb-3">  {/* Adjusted distance */}
    <div className="col-md-4 d-flex position-relative">
      <label className="text-nowrap bold" style={{flex: "1 1 30%", marginRight: "5px"}}>Salesman</label>
      <div style={{flex: "1 1 65%", position: "relative"}}>
        <select className="form-control" style={{width: "100%", paddingRight: "30px", appearance: "none"}} value={salesman} onChange={(e) => setSalesman(e.target.value)}>
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
    {/* <div className="col-md-3 d-flex" style={{marginLeft: "10%", alignItems: "center"}}>
      <label className="text-nowrap" style={{flex: "1 1 30%", marginRight: "5px"}}>Invoice Date</label>
      <input type="date" className="form-control" value={currentDate} style={{flex: "1 1 65%"}} readOnly />
    </div> */}
  </div>

  {/* Third Row */}
  <div className="row mb-3">  {/* Adjusted distance */}
    <div className="col-md-4 d-flex position-relative">
      <label className="text-nowrap bold" style={{flex: "1 1 30%", marginRight: "5px"}}>Customer</label>
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
      <label className="text-nowrap bold" style={{flex: "1 1 30%", marginRight: "5px"}}>Terms</label>
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

      <hr className="my-5"/>
{/*    
      <div className="row mb-4">
  <div className="col-md-3 position-relative">
    <label className='bold'>Item Name</label>
    <div style={{ position: 'relative' }}>
      {/* <select
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
      <select
  className="form-control mt-3"
  style={{ paddingRight: '30px' }} // Add padding to make space for the icon
  value={newItem.itemName}
  onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })} 
>
  <option value="">Select Item</option>
  {itemDescriptions.map((item, index) => ( // Update itemNames to itemDescriptions
    <option key={index} value={item.product_desc}>
      {item.product_desc} 
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
  <label className='bold'>Qty</label>
  <input
    type="number"
    className="form-control mt-3"
    value={newItem.qty}
    onChange={(e) => setNewItem({ ...newItem, qty: parseInt(e.target.value) })}
    placeholder="Quantity"
  />
</div>
<div style={{ flex: "0 0 10%", maxWidth: "10%", marginRight: "1%" }}>
  <label className='bold'>Bonus</label>
  <input
    type="number"
    className="form-control mt-3"
    value={newItem.bonus}
    onChange={(e) => setNewItem({ ...newItem, bonus: parseInt(e.target.value) })}
    placeholder="Bonus"
  />
</div>
<div style={{ flex: "0 0 10%", maxWidth: "10%", marginRight: "1%" }}>
  <label className='bold'>Rate</label>
  <input
    type="number"
    className="form-control mt-3"
    value={newItem.rate}
    onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) })}
    placeholder="Rate"
  />
</div>
<div style={{ flex: "0 0 10%", maxWidth: "10%", marginRight: "1%" }}>
  <label className='bold'>Discount</label>
  <input
    type="number"
    className="form-control mt-3"
    value={newItem.discount}
    onChange={(e) => setNewItem({ ...newItem, discount: parseFloat(e.target.value) })}
    placeholder="Discount"
  />
</div>

  <div className="col-md-2">
    <label className='bold'>Remarks</label>
    <input type="text" className="form-control mt-3" placeholder="Remarks" />
  </div>

  <div className="col-md-1">
    <button
      className="btn btn-success"
      onClick={handleAddItem}
      style={{ fontSize: '1rem', fontWeight: 'bold',marginTop:"40px" }} // Increase the size and bold the plus icon
    >
      <i className="bi bi-plus"></i>
    </button>
  </div>
</div> */}

{/* <table>
  <thead>
    <tr>
      <th>Item Name</th>
      <th>Qty</th>
      <th>Bonus</th>
      <th>Rate</th>
      <th>Discount</th>
      <th>Remarks</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <select
          className="form-control"
          value={newItem.itemName}
          onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
        >
          <option value="">Select Item</option>
          {itemDescriptions.map((item, index) => (
            <option key={index} value={item.product_desc}>
              {item.product_desc}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          value={newItem.qty}
          onChange={(e) => setNewItem({ ...newItem, qty: parseInt(e.target.value) })}
          placeholder="Quantity"
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          value={newItem.bonus}
          onChange={(e) => setNewItem({ ...newItem, bonus: parseInt(e.target.value) })}
          placeholder="Bonus"
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          value={newItem.rate}
          onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) })}
          placeholder="Rate"
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          value={newItem.discount}
          onChange={(e) => setNewItem({ ...newItem, discount: parseFloat(e.target.value) })}
          placeholder="Discount"
        />
      </td>
      <td>
        <input
          type="text"
          className="form-control"
          placeholder="Remarks"
        />
      </td>
      <td>
        <button
          className="btn btn-success"
          onClick={handleAddItem}
          style={{ fontSize: '1rem', fontWeight: 'bold' }}
        >
          <i className="bi bi-plus"></i>
        </button>
      </td>
    </tr>
  </tbody>
</table> */}
<table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
  <thead>
    <tr style={{ backgroundColor: 'purple', color: 'white', textAlign: 'center' }}>
      <th style={{ padding: '10px' }}>Item Name</th>
      <th style={{ padding: '10px' }}>Qty</th>
      <th style={{ padding: '10px' }}>Bonus</th>
      <th style={{ padding: '10px' }}>Rate</th>
      <th style={{ padding: '10px' }}>Discount</th>
      <th style={{ padding: '10px' }}>Remarks</th>
      <th style={{ padding: '10px' }}>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{ padding: '10px' }}>
        <select
          className="form-control"
          value={newItem.itemName}
          onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
        >
          <option value="">Select Item</option>
          {itemDescriptions.map((item, index) => (
            <option key={index} value={item.product_desc}>
              {item.product_desc}
            </option>
          ))}
        </select>
      </td>
      <td style={{ padding: '10px' }}>
        <input
          type="number"
          className="form-control"
          value={newItem.qty}
          onChange={(e) => setNewItem({ ...newItem, qty: parseInt(e.target.value) })}
          placeholder="Quantity"
        />
      </td>
      <td style={{ padding: '10px' }}>
        <input
          type="number"
          className="form-control"
          value={newItem.bonus}
          onChange={(e) => setNewItem({ ...newItem, bonus: parseInt(e.target.value) })}
          placeholder="Bonus"
        />
      </td>
      <td style={{ padding: '10px' }}>
        <input
          type="number"
          className="form-control"
          value={newItem.rate}
          onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) })}
          placeholder="Rate"
        />
      </td>
      <td style={{ padding: '10px' }}>
        <input
          type="number"
          className="form-control"
          value={newItem.discount}
          onChange={(e) => setNewItem({ ...newItem, discount: parseFloat(e.target.value) })}
          placeholder="Discount"
        />
      </td>
      <td style={{ padding: '10px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Remarks"
        />
      </td>
      <td style={{ padding: '10px' }}>
        <button
          className="btn btn-success"
          onClick={handleAddItem}
          style={{ fontSize: '1rem', fontWeight: 'bold' }}
        >
          <i className="bi bi-plus"></i>
        </button>
      </td>
    </tr>
  </tbody>
</table>

      {/* Items Table */}
      {items.length > 0 && (
      <table className="mt-5">
      <thead>

          <tr >
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
        <tbody className='my-4'>
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
<div className='d-flex justify-content-end w-100 px-5 my-5'>
    <div className="row my-3 py-3" style={{width:"55%",border:"2px solid #98198e",borderRadius:"20px",padding:"0 20px",zIndex:"1"}}>
  {/* <div className="col">
    <label>Remarks</label>
    <textarea className="form-control mt-2" rows="3" placeholder="Enter remarks"></textarea>
  </div> */}

  {/* Totals */}
  <div className=" d-flex justify-content-end">
    
  <table className="mt-4" style={{ backgroundColor: '#e0e.0e0', borderCollapse: 'collapse', width: '100%' }}>
  <tbody>
    <tr>
      <td className='txt-dec'>Sub Total:</td>
      <td>
        <div className='bold'
        // style={{ border: '1px solid grey', display: 'inline-block', width: '150px', textAlign: 'center', 
        //   padding: '5px', borderRadius: '5px', backgroundColor: '#d3d3d3' }}
          >
          {totals.subTotal}
        </div>
      </td>
    </tr>
    <tr>
      <td className='txt-dec'>Discount Total:</td>
      <td>
        <div className='bold'
        // style={{ border: '1px solid grey', display: 'inline-block', width: '150px', textAlign: 'center', 
        //   padding: '5px', borderRadius: '5px', }}
          >
          {totals.discountTotal}
        </div>
      </td>
    </tr>
    <tr>
      <td className='txt-dec'>Freight Total:</td>
      <td>
        <div
        className='bold'
        //  style={{ border: '1px solid grey', display: 'inline-block', width: '150px', textAlign: 'center', padding: '5px',
        //    borderRadius: '5px',}}
           >
          {totals.freightTotal}
        </div>
      </td>
    </tr>
    <tr>
      <td className='txt-dec'>Expense Total:</td>
      <td>
        <div className='bold'
        // style={{ border: '1px solid grey', display: 'inline-block', width: '150px',
        //    textAlign: 'center', padding: '5px', borderRadius: '5px',  }}
           >
          {totals.expenseTotal}
        </div>
      </td>
    </tr>
    <hr/>
    <tr style={{background:"#800080",color:"white",margin:"1% 5%"}}>
      
      <td><strong>Net Total:</strong></td>
      <td>
        <div 
        // style={{  display: 'inline-block', width: '150px'
        //   , textAlign: 'center', padding: '5px'}}
          
          >
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
</div>
</div>
    </div>
  );
}

export default InvoiceForm;
