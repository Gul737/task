import React, { useState, useEffect } from 'react';
import './App.css';
import Cookies from 'js-cookie';
function InvoiceForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const toggleMenu = () => {
    console.log("Menu toggle clicked");
    setMenuOpen(!menuOpen);
  };
  

  const [currentDate, setCurrentDate] = useState(localStorage.getItem('currentDate') || '');
  const [itemDescriptions, setItemDescriptions] = useState([]);
  const [searchItem, setSearchItem] = useState(localStorage.getItem('searchItem') || '');
  const [searchCustomer, setSearchCustomer] = useState(localStorage.getItem('searchCustomer') || '');
  const [termsOptions, setTermsOptions] = useState([]);
  const [customerTerms, setCustomerTerms] = useState(localStorage.getItem('customerTerms') || '');
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);
  const [totals, setTotals] = useState(JSON.parse(localStorage.getItem('totals')) || { subTotal: 0, discountTotal: 0, freightTotal: 0, expenseTotal: 0 });
  const [salesman, setSalesman] = useState(localStorage.getItem('salesman') || '');
  const [customer, setCustomer] = useState(localStorage.getItem('customer') || '');
  const [invoiceNumber, setInvoiceNumber] = useState(Number(localStorage.getItem('invoiceNumber')) || 0);
  const [salesmenOptions, setSalesmenOptions] = useState([]);
  const [customersOptions, setCustomersOptions] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(localStorage.getItem('currentBalance') || 0);
  const [cashAmount, setCashAmount] = useState(Number(localStorage.getItem('cashAmount')) || 0);
  const [bankAmount, setBankAmount] = useState(localStorage.getItem('bankAmount') || 0);
  const [netTotal, setNetTotal] = useState(Number(localStorage.getItem('netTotal')) || 0);
  const [cashReceive, setCashReceive] = useState(localStorage.getItem('cashReceive') || 0);
  const [cashRemaining, setCashRemaining] = useState(localStorage.getItem('cashRemaining') || 0);
  const [customerCode, setCustomerCode] = useState(Number(localStorage.getItem('customerCode')) || 0);
  const [salesmanCode, setSalesmanCode] = useState(Number(localStorage.getItem('salesmanCode')) || 0);
  const [newItem, setNewItem] = useState(() => {
    const savedItem = localStorage.getItem('newItem');
    return savedItem
      ? JSON.parse(savedItem)
      : { itemName: '', qty: 0, rate: 0, discount: 0, cost: 0, retail: 0 };
  });
  //const [newItem, setNewItem] = useState((localStorage.getItem('newItem')||{ itemName: '', qty: 0, rate: 0, discount: 0 ,cost:0,retail:0}));
  const selectedEmployee = Cookies.get('selectedEmployee');
  const [currentDateTime, setCurrentDateTime] = useState(''); 
  
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); 
    setCurrentDate(today);

  }, []);
  useEffect(() => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8); 
    setCurrentDateTime(`${currentDate} ${time}`);
  }, [currentDate]);
  useEffect(() => {
    // if (netTotal > 0) {
      setCashRemaining(netTotal - cashReceive);
    // }
  }, [netTotal, cashReceive]);
  

   const [searchTerm, setSearchTerm] = useState('');
  const [itemNames, setItemNames] = useState([]);
  const [bank, setBank] = useState('');
  const [bankOptions, setBankOptions] = useState([]);
  const [error, setError] = useState(''); 
  useEffect(() => {
    localStorage.setItem('currentDate', currentDate);
    localStorage.setItem('searchItem', searchItem);
    localStorage.setItem('searchCustomer', searchCustomer);
    localStorage.setItem('customerTerms', customerTerms);
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('totals', JSON.stringify(totals));
    localStorage.setItem('salesman', salesman);
    localStorage.setItem('customer', customer);
    localStorage.setItem('invoiceNumber', invoiceNumber);
    localStorage.setItem('currentBalance', currentBalance);
    localStorage.setItem('cashAmount', cashAmount);
    localStorage.setItem('bankAmount', bankAmount);
    localStorage.setItem('netTotal', netTotal);
    localStorage.setItem('customerCode', customerCode);
    localStorage.setItem('salesmanCode', salesmanCode);
    localStorage.setItem('cashReceive', cashReceive);
    localStorage.setItem('cashRemaining', cashRemaining);
    localStorage.setItem('newItem', JSON.stringify(newItem));

  }, [currentDate, searchItem, searchCustomer, customerTerms, items, totals, salesman, customer, invoiceNumber, currentBalance, cashAmount, bankAmount, netTotal,customerCode, salesmanCode,cashReceive,cashRemaining,newItem]);
  
  const filteredOptions = salesmenOptions.filter(option =>
    option.emp_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

   
  const handleSalesmanSelect = (selectedSalesman) => {
    setSalesman(selectedSalesman.emp_name);
    setSearchTerm('');
    setSelectedIndex(-1); // Reset index after selection
  };
//  const handleSalesmanSelect = (selectedSalesman) => {
//   setSalesman(selectedSalesman.emp_name);
  
//   setSearchTerm(''); 
//   setSalesmanCode(selectedSalesman.emp_code);
// };
const filteredCustomerOptions = customersOptions.filter(option =>
  option.cust_name.toLowerCase().includes(searchCustomer.toLowerCase())
);
// const handleCustomerSelect = (selectedCustomer) => {
//   setCustomer(selectedCustomer.cust_name);
//   setSearchCustomer('');
//   setSelectedIndex(-1); // Reset index after selection
 
// };
const handleCustomerSelect = (selectedCustomer) => {
  setCustomer(selectedCustomer.cust_name);
  setSearchCustomer('');
  handleCustomerChange({ target: { value: selectedCustomer.cust_code } });
   setSelectedIndex(-1);
 // setSearchTerm(''); 
  setCustomerCode(selectedCustomer.cust_code);
};
const filteredItemOptions = itemDescriptions.filter(option =>
  option.product_desc.toLowerCase().includes(searchItem.toLowerCase())
);

// const handleItemSelect = (selectedItem) => {
//   setSearchItem(selectedItem.product_desc);
//   setSelectedIndex(-1); // Reset index after selection
// };

const handleKeyDown = (e, options, handleSelect) => {
  if (e.key === 'ArrowDown') {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % options.length);
  } else if (e.key === 'ArrowUp') {
    setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : options.length - 1));
  } else if (e.key === 'Enter' && selectedIndex >= 0) {
    handleSelect(options[selectedIndex]);
  } else if (e.key === 'Backspace' && !e.target.value) {
    
    setSelectedIndex(-1); // Reset index on backspace
  }
};
// Handle item selection from dropdown
const handleItemSelect = (selectedItem) => {
  setNewItem({
    itemName: selectedItem.product_desc,
    qty: selectedItem.case_qty,
    rate: selectedItem.cost,
    discount: selectedItem.item_disc,
    cost: selectedItem.cost,
    retail: selectedItem.retail,
  });
   setSearchTerm('');
  //  setSearchItem(selectedItem.product_desc);
   setSearchItem('');
  setSelectedIndex(-1); // Reset index after selection
  //setItems(selectedItem.product_desc);
  //setSearchItem(''); // Clear search term after selecting
   
};
useEffect(() => {
  console.log('Salesman Code:', salesmanCode); // This will log whenever salesmanCode changes
}, [salesmanCode]);

  useEffect(() => {
    const calculatedFinal = totals.subTotal - totals.discountTotal + totals.freightTotal + totals.expenseTotal;
    setNetTotal(calculatedFinal);
  
    // Check if cash and bank amounts match the net total
    const totalAmount = parseFloat(cashAmount || 0) + parseFloat(bankAmount || 0);
    if (totalAmount !== calculatedFinal) {
      setError("Enter Amount doesn't match Net Total!");
    } else {
      setError('');
    }
  // }, [totals, cashAmount, bankAmount]);
}, [ cashAmount, bankAmount]);
  useEffect(() => {
  
    fetch('http://localhost:3001/invoice', {
      method: 'POST', // Make sure the method matches your backend
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ /* Add any necessary data here if required */ })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log(data); // Check if data contains invoice_number
      setInvoiceNumber(data.invoice_number); // Set the invoice number in state
  })
  .catch(error => console.error('Error:', error));
 // Fetch item descriptions
 fetch('http://localhost:3001/item_descriptions')
 .then(response => response.json())
 .then(data => setItemDescriptions(data))
 .catch(error => console.error('Error fetching item descriptions:', error));
    fetch('http://localhost:3001/salesmen')
      .then(response => response.json())
      .then(data => setSalesmenOptions(data));
      fetch('http://localhost:3001/bank')
      .then(response => response.json())
      .then(data => setBankOptions(data));
      fetch('http://localhost:3001/customers')
      .then(response => response.json())
      .then(data => setCustomersOptions(data))
      .catch(error => console.error('Error fetching customers:', error));
    }, []);
    const handleCustomerChange = (e) => {
      const selectedCustomerCode = e.target.value;

      fetch(`http://localhost:3001/customers/balance?cust_code=${selectedCustomerCode}`)
        .then(response => response.json())
        .then(data => {
          setCurrentBalance(data.balance); 
          setCustomerTerms(data.terms); 
        })
        .catch(error => console.error('Error fetching customer balance:', error));
    };
    // const handleItemChange = (e) => {
    //   const selectedItem = itemDescriptions.find(item => item.product_desc === e.target.value);
    //   if (selectedItem) {
    //     setNewItem({
    //       itemName: selectedItem.product_desc,
    //       qty: selectedItem.case_qty,
    //       rate:0,
    //       discount: selectedItem.item_disc,
    //       cost: selectedItem.cost,
    //       retail: selectedItem.retail
    //     });
    //   }
    // };
    const handleInputChange = (e, type) => {
      const value = parseFloat(e.target.value) || 0;
    
      if (type === 'cash') {
        setCashAmount(value);
      } else if (type === 'bank') {
        setBankAmount(value);
      }
    };
    async function saveInvoice(formData) {
      try {
        const response = await fetch('http://localhost:3001/save-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
    
        const data = await response.json();
        if (data.success) {
          alert(data.message);
          localStorage.clear();
           //setCurrentDate('');
      setItemDescriptions([]);
      setSearchItem('');
      setSearchCustomer('');
      setCustomerTerms('');
      setItems([]);
      setTotals({ subTotal: 0, discountTotal: 0, freightTotal: 0, expenseTotal: 0 });
      setSalesman('');
      setCustomer('');
      setInvoiceNumber('');
      setSalesmenOptions([]);
      setCustomersOptions([]);
      setCurrentBalance(0);
      setCashAmount(0);
      setBankAmount('');
      setNetTotal(0);
      setCustomerCode(0);
      setSalesmanCode(0);
      setNewItem({ itemName: '', qty: 0, rate: 0, discount: 0, cost: 0, retail: 0 });
      setSearchTerm('');
      setBank('');
      setBankOptions([]);
      setError('');
      setCashReceive(0);
      setCashRemaining(0);
      //setCurrentDateTime(''); 
        } else {
          alert('Failed to save invoice: ' + data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Server error.');
      }
    }
    
  const handleSave = () => {
    const inv_type = customerTerms === 'CASH' ? 1 : customerTerms === 'CREDIT' ? 2 : 0;
    const invoiceData = {
      inv_no:invoiceNumber,
      salesman_name:salesman,
      inv_date: currentDate,
      inv_datetime: currentDateTime,
      cust_name:customer,
      cust_code: customerCode,  
      salesman_code:salesmanCode,
      g_discount:totals.discountTotal,
      // customerTerms,
      prv_balance:currentBalance,
      // items,
      bank_amount: bankAmount,
      cash_amount:cashAmount,
      // totals,
      g_amount:netTotal,
      inv_type: inv_type,
    };
    saveInvoice(invoiceData);
  localStorage.clear();
  console.log('Invoice Data:'+invoiceData);
 

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
    setNewItem({ itemName: '', qty: 0, rate: 0, discount: 0,cost:0,retail:0 });
    // setNewItem({ itemName: '', qty: 0, bonus: 0, rate: 0, discount: 0 });
  };

  return (
    <div className="ap_container">
        <div className="ap_wrap">
     

    <div className="container-fluid bg-l " 
    >
     <div className="container-fluid p-3 last top-navbar fixed-top">
      {/* Hamburger icon for mobile */}
      <div className="d-md-none hamburger-icon" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Menu buttons */}
    
      <div className={`menu-buttons ${menuOpen ? "show" : ""} `} >
      <div className='d-flex flex-wrap justify-content-end gap-3 responsive'>
      {/* <div className="d-flex flex-wrap justify-content-end gap-3 responsive"> */}
        <button className="btn btn-dark text-white">Load</button>
        <button className="btn btn-danger">
          <i className="bi bi-list-ol text-white px-2"></i> List
        </button>
        <button className="btn btn-secondary">
          <i className="bi bi-arrow-right fs-5 fw-bold"></i>
        </button>
        <button className="btn dark-blue text-white">
          <i className="bi bi-pencil-square text-white px-2"></i> Modify
        </button>
        <button className="btn btn-info text-white">
          <i className="bi bi-printer px-2 text-white"></i> Print
        </button>
        <button className="btn btn-success" onClick={handleSave}>
          <i className="bi bi-check"></i> Save
        </button>
      
    </div> 
    </div>
    </div>
<div className="container d-flex justify-content-center align-items-center flex-column inv-layout" >
      {/* Invoice Information */}
      <div>
<div>
  {/* First Row */}
  <div className="row ">  {/* Adjusted distance */}
  <div className="col-md-4 d-flex position-relative">
  <label className="text-nowrap bold">INV NO</label>
  <input
    type="text"
    className="form-control mx-5"
    value={invoiceNumber}
    onChange={(e) => setInvoiceNumber(e.target.value)}
  />
</div>
  </div>
  <hr className="my-5"/>
  <div className="row mb-3 d-flex gap-2 align-items-center">
     <div className="col-md-5 d-flex gap-2 align-items-center">
          <label className="text-nowrap fw-bold" style={{ minWidth: "100px" }}>Salesman</label>
          <div className="position-relative w-100">
            <input
              type="text"
              className="form-control"
              placeholder="Search Salesman"
              value={searchTerm || salesman}
              // onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, filteredOptions, handleSalesmanSelect)}
              onChange={(e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setSalesman(''); // Reset the field to placeholder if empty
    }
  }}
            />

            {/* Dropdown for search results */}
            {/* {searchTerm && (
              <div className="dropdown-menu w-100" style={{ maxHeight: '200px', overflowY: 'auto', display: 'block' }}>
                {filteredOptions.map((option, index) => (
                  <button
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleSalesmanSelect(option)}
                  >
                    {option.emp_name}
                  </button>
                ))}
              </div>
            )} */}
               {searchTerm && (
              <div className="dropdown-menu w-100 show">
                {filteredOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`dropdown-item ${index === selectedIndex ? 'active' : ''}`}
                    onClick={() => handleSalesmanSelect(option)}
                  >
                    {option.emp_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
    {/* Invoice Date Field */}
    <div className="col-md-5 d-flex gap-2 align-items-center">
      <label className="text-nowrap fw-bold" style={{ minWidth: "100px" }}>Invoice Date</label>
      <input
        type="date"
        className="form-control"
        value={currentDate}
        onChange={(e) => setCurrentDate(e.target.value)}
      />
    </div>
  </div>
  {/* Row 2 */}
  <div className="row mb-3 d-flex gap-2 align-items-center">  
  <div className="col-md-5 d-flex gap-2 align-items-center">
  <label className="text-nowrap fw-bold" style={{ minWidth: "100px" }}>Customer</label>
  <div className="position-relative w-100">
    <input
      type="text"
      className="form-control"
      placeholder="Search Customer"
      value={searchCustomer || customer}
      // onChange={(e) => setSearchCustomer(e.target.value)}
      onKeyDown={(e) => handleKeyDown(e, filteredCustomerOptions, handleCustomerSelect)}
      onChange={(e) => {
    setSearchCustomer(e.target.value);
    if (e.target.value === '') {
      setCustomer(''); // Reset the field to placeholder if empty
setCurrentBalance(0);
setCustomerCode(''
);
setCustomerTerms('');
    }
  }}
    />

    {/* Dropdown for search results */}
    {/* {searchCustomer && (
      <div className="dropdown-menu w-100" style={{ maxHeight: '200px', overflowY: 'auto', display: 'block' }}>
        {filteredCustomerOptions.map((option, index) => (
          <button
            key={index}
            className="dropdown-item"
            onClick={() => handleCustomerSelect(option)}
          >
            {option.cust_name} 
            
          </button>
        ))}
      </div>
    )} */}
    {searchCustomer && (
              <div className="dropdown-menu w-100 show">
                {filteredCustomerOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`dropdown-item ${index === selectedIndex ? 'active' : ''}`}
                    onClick={() => handleCustomerSelect(option)}
                  >
                    {option.cust_name}
                  </button>
                ))}
              </div>
            )}
  </div>
</div>
    <div className="col-md-5 d-flex gap-2 align-items-center">
      <label className="text-nowrap fw-bold" style={{ minWidth: "100px" }}>Terms</label>
      <div className="position-relative w-100">
          <select className="form-control" value={customerTerms}> 
            <option>
          {customerTerms}
          </option>
         </select>  
      
        {/* Dropdown icon */}
        <span
          className="position-absolute"
          style={{ right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        >
          &#x25BC;
        </span>
      </div>
    </div>
  </div>
</div>
   {currentBalance !== null && (
        <div className="row mb-3">
          <p className="text-muted">Current Balance: {currentBalance}</p>
        </div>
      )}
      <hr className="my-5 nextTask"/>
<table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
  <thead>
    <tr style={{ backgroundColor: 'purple', color: 'white', textAlign: 'center' }}>
      <th style={{ padding: '10px' }}>Item Name</th>
      <th style={{ padding: '10px' }}>Qty</th>
      {/* <th style={{ padding: '10px' }}>Bonus</th> */}
      <th style={{ padding: '10px' }}>Rate</th>
      <th style={{ padding: '10px' }}>Discount</th>
      <th style={{ padding: '10px' }} className='d-none'>Cost</th>
      <th style={{ padding: '10px' }} className='d-none'>Retail</th>
      <th style={{ padding: '10px' }}>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
    <td style={{ padding: '10px', width: "35%" }}>
  <div className="position-relative w-100">
    <input
      type="text"
      className="form-control"
      placeholder="Search Item"
      value={searchItem || newItem.itemName}
      // onChange={(e) => setSearchItem(e.target.value)}
      onKeyDown={(e) => handleKeyDown(e, filteredItemOptions, handleItemSelect)}
      onChange={(e) => {
    setSearchItem(e.target.value);
    if (e.target.value === '') {
         setNewItem({
    itemName: '',
    qty: 0,
    rate: 0,
    discount: 0,
    cost: 0,
    retail: 0,
  });
    }
  }}
    />

    {/* Dropdown for filtered item options */}
    {/* {searchItem && (
      <div
        className="dropdown-menu w-100"
        style={{
          maxHeight: '200px',
          overflowY: 'auto',
          display: 'block',
        }}
      >
        {filteredItemOptions.map((option, index) => (
          <button
            key={index}
            className="dropdown-item"
            onClick={() => handleItemSelect(option)}
          >
            {option.product_desc}
          </button>
        ))}
      </div>
    )} */}
        {searchItem && (
              <div className="dropdown-menu w-100 show" style={{
          maxHeight: '200px',
          overflowY: 'auto',
          display: 'block',
        }}>
                {filteredItemOptions.map((option, index) => (
                  <button
                    key={index}
                    className={`dropdown-item ${index === selectedIndex ? 'active' : ''}`}
                    onClick={() => handleItemSelect(option)}
                  >
                    {option.product_desc}
                  </button>
                ))}
              </div>
            )}
  </div>
</td>
      <td style={{ padding: '10px' }}>
         <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={newItem.qty}
                    onChange={(e) => setNewItem({ ...newItem, qty: parseFloat(e.target.value) })}
                    placeholder="Quantity"
                  />
      </td>
      <td style={{ padding: '10px' }}>
        <input
          type="number"
             step="0.01"
          className="form-control"
          value={newItem.rate}
          onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) })}
          placeholder="Rate"
        />
      </td>
      <td style={{ padding: '10px' }}>
         <input
                    type="number"
                       step="0.01"
                    className="form-control"
                    value={newItem.discount}
                    onChange={(e) => setNewItem({ ...newItem, discount: parseFloat(e.target.value) })}
                    placeholder="Discount"
                  />
      </td>
      <td style={{ padding: '10px' }} className='d-none'>
        <input
          type="number"
             step="0.01"
          className="form-control"
          value={newItem.cost}
          onChange={(e) => setNewItem({ ...newItem, cost: parseFloat(e.target.value) })}
          placeholder="Cost"
        />
      </td>
      <td style={{ padding: '10px' }} className='d-none'>
         <input
                    type="number"
                       step="0.01"
                    className="form-control "
                    value={newItem.retail}
                    onChange={(e) => setNewItem({ ...newItem, retail: parseFloat(e.target.value) })}
                    placeholder="Retail"
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
<div className="row mx-1">
          <p className="text-muted">Current Quantity: {newItem.qty} </p>
        </div>
      {/* Items Table */}
      {items.length > 0 && (
      <table className="mt-5">
      <thead>

          <tr >
            <th></th>
            <th>No</th>
            <th>Description</th>
            <th>Qty</th>
            {/* <th>Bonus</th> */}
            <th>Rate</th>
            <th>Discount</th>
            <th className='d-none'>Cost</th>
            <th className='d-none'>Retail</th>
            <th>Total</th>
          </tr>
        </thead>
        <br/>
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
              {/* <td>{item.bonus}</td> */}
              <td>{item.rate}</td>
              <td>{item.discount}</td>
              <td className='d-none'>{item.cost}</td>
              <td className='d-none'>{item.retail}</td>
              <td>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
</div>
<div className="d-flex justify-content-between w-100 px-5 my-5 endSection">
  
  {/* LEFT SECTION */}
  <div className="row my-3 py-3 box" style={{ width: "45%", border: "2px solid #98198e", borderRadius: "20px", padding: "0 20px" }}>
   
  <div className="row w-100">
    {/* Bank Name */}
    <div className="d-flex gap-2 align-items-center">
      <label className="text-wrap fw-bold txt-dec" style={{ minWidth: "100px" }}>Bank Name</label>
      <div className="position-relative w-100">
        <select
          className="form-control"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
        >
          <option value=""></option>
          {/* {bankOptions.map((option, index) => (
    <option key={index} value={option.bank_name}>{option.bank_name}</option>
  ))} */}
        </select>
        <span className="position-absolute" style={{ right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>&#x25BC;</span>
      </div>
    </div> 
{/* logically */}
    {/* Bank Amount and Cash */}
    <div className="row w-100 mt-2">
      <div className="col d-flex gap-4 align-items-center">
        <label className="fw-bold text-nowrap txt-dec" style={{ whiteSpace: "normal" }}>Bank</label>
        <input
          type="text"
          className="form-control"
          placeholder="0"
          value={bankAmount}
          onChange={(e) => handleInputChange(e, 'bank')}
        />
      </div>

      <div className="col d-flex gap-4 align-items-center">
        <label className="fw-bold txt-dec">Cash</label>
        <input
          type="number"
          className="form-control"
          value={cashAmount}
          onChange={(e) => handleInputChange(e, 'cash')}
        />
      </div>
    </div>
    {error && <div style={{ color: 'red' }}>{error}</div>}
  </div>
</div>
  {/* TOTAL BILL CALCULATE */}
  <div className="row my-3 py-3 box" style={{ width: "45%", border: "2px solid #98198e", borderRadius: "20px", padding: "0 20px" }}>
    {/* Totals */}
    <div className="d-flex justify-content-end">
      <table className="mt-4" style={{ backgroundColor: '#e0e0e0', borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          <tr>
            <td className="txt-dec">Sub Total:</td>
            <td><div className="bold">{totals.subTotal}</div></td>
          </tr>
          <tr>
            <td className="txt-dec">Discount Total:</td>
            <td><div className="bold">{totals.discountTotal}</div></td>
          </tr>
          {/* <tr>
            <td className="txt-dec">Freight Total:</td>
            <td><div className="bold">{totals.freightTotal}</div></td>
          </tr> */}
          <tr>
            <td className="txt-dec">Expense Total:</td>
            <td><div className="bold">{totals.expenseTotal}</div></td>
          </tr>
          <tr style={{ background: "#800080", color: "white" }}>
            <td><strong>Net Total:</strong></td>
            <td ><div><strong>{netTotal}</strong></div></td>
          </tr>
          <hr/>
          <div className="row w-100 mt-2">
      <div className="col d-flex gap-4 align-items-center">
        <label className="fw-bold text-wrap txt-dec" style={{ whiteSpace: "normal" }}>Cash Received</label>
        <input
          type="number"
          step='2'
          className="form-control"
          placeholder="0"
          value={cashReceive}
          onChange={(e) => {
            const newCashReceive = parseFloat(e.target.value) || 0;
            setCashReceive(newCashReceive);
            setCashRemaining(netTotal - newCashReceive);
          }}
        />
      </div>

      <div className="col d-flex gap-4 align-items-center">
        <label className="fw-bold txt-dec">Cash Remaining</label>
        <input
      
    type="number"
    step='2'
          className="form-control"
          placeholder='0'
           value={cashRemaining}
           readOnly
        />
      </div>
    </div>
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
