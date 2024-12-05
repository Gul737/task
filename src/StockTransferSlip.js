
import './App.css';
import React, { useState, useEffect} from 'react';
import Select from 'react-select';
function StockTransferSlip() {
    const customStyles = { 
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused || state.isSelected ? '#98198E' : base.backgroundColor, // Set background color when focused or selected
          color: state.isSelected ? 'white' : 'black', // Text color when selected
          '&:hover': {
            backgroundColor: '#98198E', 
            color: 'white', 
          },
        }),
      };  
      const [salesmenOptions, setSalesmenOptions] = useState([]);    
      const [selectedSalesman, setSelectedSalesman] = useState(() => {
        const savedSalesman = localStorage.getItem('salesman'); // Retrieve salesman from localStorage
        return savedSalesman ? { label: savedSalesman, value: null } : null; // Set the salesman name if found
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [salesmanCode, setSalesmanCode] = useState(Number(localStorage.getItem('salesmanCode')) || 0);
    const [salesman, setSalesman] = useState(localStorage.getItem('salesman') || '');
    const optionssale = salesmenOptions.map((option) => ({
      value: option.emp_code, // assuming `emp_code` is the unique identifier
      label: option.emp_name,
    }));
 
      const handleSalesmanChange = (selectedOption) => {
        setSelectedSalesman(selectedOption);
        if (selectedOption) {
          setSearchTerm(selectedOption.label);
          localStorage.setItem('salesman', selectedOption.label);
          setSalesmanCode(selectedOption.value); // Save salesman_code
          setSalesman(selectedOption.label);
        } else {
          //setSalesmanCode(''); // Reset the code if no option is selected
          //localStorage.removeItem('salesman'); // Remove the salesman from localStorage
          // setSearchTerm('');
          // setSalesmanCode(''); // Reset the code if no option is selected
        }
      };
      const [selectedItem, setSelectedItem] = useState(null);
      const onItemSelectChange = (selectedOption) => {
        setSelectedItem(selectedOption);
       
        if (selectedOption) {
          setSearchItem(selectedOption.label);
          setFixQty(selectedOption.fixq);
          console.log('Qty set to:', selectedOption.qty);
          setNewItem({
            product_name: selectedOption.label,
            ...selectedOption.details,
          });
         
        
        }  else {
          setSearchItem('');
          setNewItem({
            product_name: '',
            product_code:'',
            qty: '',
            rate: '',
            discount: '',
            i_cost: '',
            i_retail: '',
          });
        }
      };
      const [newItem, setNewItem] = useState(() => {
        const savedItem = localStorage.getItem('newItem');
        return savedItem
          ? JSON.parse(savedItem)
          : { product_name: '', product_code:'',qty: '', rate: '', discount: '', i_cost: '', i_retail: '' ,total:''};
      });  const handleDelete = (index) => {
        const deletedItem = items[index];
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    
        const newSubTotal = totals.subTotal - deletedItem.total;
        // const newDiscountTotal = totals.discountTotal - parseFloat(deletedItem.discount);
    
        setTotals({ ...totals, subTotal: newSubTotal});
        // , discountTotal: newDiscountTotal });
      };
    
      const handleAddItem = () => {
        if (newItem.discount > newItem.rate) {
          alert('Error: Discount cannot be greater than the rate.');
          const discountInput = document.querySelector('input[placeholder="0"][type="number"][value="' + newItem.discount + '"]');
          if (discountInput) {
            discountInput.focus();
          }
          return; // Stop execution if discount is invalid
        }
        const total = (newItem.rate - newItem.discount) * newItem.qty;
        setItems([...items, { ...newItem, total }]);
    
        const subTotal = totals.subTotal + total;
        setTotals({ ...totals, subTotal});
        setNewItem({ product_name: '',product_code:'', qty: 0, rate: 0, discount: 0,i_cost:0,i_retail:0,total:0 });
        setSelectedItem(null);
        setFixQty(0);
      };
      const [searchItem, setSearchItem] = useState(localStorage.getItem('searchItem') || '');
      const [totals, setTotals] = useState(JSON.parse(localStorage.getItem('totals')) || { subTotal: 0, discountTotal: '', freightTotal: 0, expenseTotal: 0 });
      const [fixQty,setFixQty]=useState(0);
      const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);
      
      const [itemDescriptions, setItemDescriptions] = useState([]);
      const optionsitem = itemDescriptions.map((option) => ({
        value: option.product_code, // assuming `item_code` is the unique identifier
        label: option.product_desc,
        fixq:option.case_qty,
        details: {
          product_code:option.product_code,
          qty: option.case_qty,
          rate: option.cost,
          discount: option.item_disc,
          i_cost: option.cost,
          i_retail: option.retail,
        },
      }));
      const [voucherNumber, setVoucherNumber] = useState(Number(localStorage.getItem('voucherNumber')) || 0);const [currentDate, setCurrentDate] = useState(localStorage.getItem('currentDate') || '');
      const [currentDateTime, setCurrentDateTime] = useState(''); 
      const [currentDateMonth, setCurrentDateMonth] = useState(0); 
      const [currentDateyear, setCurrentDateYear] = useState(0); 
  
      
      useEffect(() => {
        // const today = new Date().toISOString().slice(0, 10); 
        // setCurrentDate(today);
        // const now = new Date();
        // const time = now.toTimeString().slice(0, 8); 
        // setCurrentDateTime(`${currentDate} ${time}`);
        // const month = now.toLocaleString('default', { month: 'long' }); // Get full month name
        // const year = now.getFullYear(); // Get year
        // setCurrentDateMonth(month);
        // setCurrentDateYear(year);
        const today = new Date().toISOString().slice(0, 10); 
  setCurrentDate(today);
  
  const now = new Date();
  const time = now.toTimeString().slice(0, 8); 
  setCurrentDateTime(`${currentDate} ${time}`);
  
  // Get month as an integer (0-11) and add 1 to make it 1-12
  const month = now.getMonth() + 1; // Get month as integer (1-12)
  const year = now.getFullYear(); // Get year as integer
  setCurrentDateMonth(month); // Will now store the month as an integer
  setCurrentDateYear(year); // Year is already an integer
  
      }, []);
      useEffect(() => {
  
        fetch('http://localhost:3001/slip', {
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
          setVoucherNumber(data.invoice_number); // Set the invoice number in state
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
         
        }, []);

    return (
        <div className="ap_container " >
            <div className="ap_wrap">
         
           
        <div className="container-fluid " 
        >
            <div className="last w-100 d-flex voch-rec-header ">
            <div className="d-flex gap-4 w-75 p-4 ms-5 voch-rec-header-inner justify-content-center align-items-center"  >
            <h3 style={{ textAlign: "start" }} className='bg-p py-3 px-3 text-white w-100' >Stock Transfer Slip</h3>
        
       
                  </div>
                    <div className="d-flex gap-4 w-50 p-4 voch-rec-header-inner justify-content-end "  >
                       <div className="d-flex gap-4 w-50">
                               
                       <button  className="btn btn-success  bg-white txt-dec fix-btn-size " id="modify"   >Modify</button>
              
    
  
          <button className="btn btn-success  bg-white txt-dec px-4 fix-btn-size "  id="btn-prev" > 
             <i className="bi bi-arrow-left fs-5 fw-bold"></i>
              </button>
       
                    <button className="btn btn-success  bg-white txt-dec px-4 fix-btn-size " id="btn-next"   >  <i className="bi bi-arrow-right fs-5 fw-bold"></i></button>
              
                      </div>
           </div>
           
       </div>
    <div className="container-fluid d-flex flex-column p-1 w-100 my-4" style={{maxWidth:'1500px'}} >
    <div className="row mb-3">
  <div className="col-md-4">
    <div className="mb-3 d-flex align-items-center">
      <label htmlFor="vouc-no-field" className="w-50 txt-dec text-left pe-2">Slip No:</label>
      <input
        type="text"
        id="vouc-no-field"
        className="form-control w-75"
        value={voucherNumber}
        onChange={(e) => setVoucherNumber(e.target.value)}
      />
    </div>
    <div className="mb-3 d-flex align-items-center">
      <label htmlFor="salesman" className="w-50 fw-bold text-left pe-2  txt-dec">Salesman:</label>
      <div className="w-75">
        
      <Select
            value={selectedSalesman}
            onChange={handleSalesmanChange}
            options={optionssale}
            placeholder="Search Salesman"
            isClearable
            classNamePrefix="react-select"
               className="color-border"
               styles={customStyles}
          />
      </div>
    </div>
  </div>
  <div className="col-md-4">
    <div className="mb-3 d-flex align-items-center">
      <label htmlFor="date" className="w-50 txt-dec text-left pe-2">Date:</label>
      <input
        type="date"
        id="date"
        className="form-control w-75"
        value={currentDate}
        onChange={(e) => setCurrentDate(e.target.value)}
      />
    </div>
    <div className="mb-3 d-flex align-items-center">
      <label htmlFor="remarks" className="w-50 fw-bold text-left pe-2  txt-dec">Remarks:</label>
      <input
        type="text"
        id="remarks"
        className="form-control w-75"
      />
    </div>
  </div>
</div>

  
    
     <div> 
        
      
    </div>
  
    </div>
  
    </div>
    <hr className="my-3 nextTask"/>
<table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
  <thead>
    <tr style={{ backgroundColor: 'purple', color: 'white', textAlign: 'center' }}>
      <th style={{ padding: '10px' }}>Item Name</th>
      <th style={{ padding: '10px' }}>Qty</th>
      {/* <th style={{ padding: '10px' }}>Bonus</th> */}
      <th style={{ padding: '10px' }}>Rate</th>
      <th style={{ padding: '10px' }}>Discount</th>
     
      <th style={{ padding: '10px' }}>Action</th>
      <th style={{ padding: '10px' }} className='d-none'>Cost</th>
      <th style={{ padding: '10px' }} className='d-none'>Retail</th>
    </tr>
  </thead>
  <tbody>
    <tr>
    <td style={{ padding: '10px', width: "35%" }}>
  <div className="position-relative w-100">
  <Select
          value={selectedItem}
          onChange={onItemSelectChange} 
          //onChange={(option, actionMeta) => onItemSelectChange(option, actionMeta?.event)}
          options={optionsitem}
          placeholder="Search Item"
          isClearable
          classNamePrefix="react-select"
             className="color-border"
             styles={customStyles}
            //  onKeyDown={(e) => {
            //   if (e.key === 'Enter') {
            //     e.preventDefault();
            //     const nextElement = e.target.closest('td')?.nextElementSibling?.querySelector('input');
            //     if (nextElement) {
            //       nextElement.focus();  // Move focus to next input field (Qty)
            //     }
            //   }
            // }}
        />
  </div>
</td>
      <td style={{ padding: '10px' }}>
         <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={newItem.qty}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault(); 
                        const nextElement = e.target.closest('td')?.nextElementSibling?.querySelector('input');
                        if (nextElement) {
                          nextElement.focus();
                        }
                      }
                    }}
                    onChange={(e) => setNewItem({ ...newItem, qty: parseFloat(e.target.value) })}
                    placeholder="0"
                    min="0" 
                  />
      </td>
      <td style={{ padding: '10px' }}>
        <input
          type="number"
             step="0.01"
          className="form-control"
          value={newItem.rate}
          min="0" 
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevent form submission or any default behavior
              //handleKeyDown(e, filteredItemOptions, handleItemSelect); // Call your existing keydown logic
              const nextElement = e.target.closest('td')?.nextElementSibling?.querySelector('input');
              if (nextElement) {
                nextElement.focus();
              }
            }
          }}
          // onKeyDown={(e) => handleKeyDown(e, filteredItemOptions, handleItemSelect)}
          onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) })}
          placeholder="0"
        />
      </td>
      <td style={{ padding: '10px' }}>
         <input
                    type="number"
                       step="0.01"
                    className="form-control"
                    min="0" 
                    value={newItem.discount}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault(); // Prevent default behavior
                        const nextElement = e.target.closest('td')?.nextElementSibling?.querySelector('input, button');
                        if (nextElement) {
                          nextElement.focus();
                        }
                      }
                    }}
                    onChange={(e) => setNewItem({ ...newItem, discount: parseFloat(e.target.value) })}
                    placeholder="0"
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
      <td style={{ padding: '10px' }} className='d-none'>
        <input
          type="number"
             step="0.01"
          className="form-control"
          value={newItem.i_cost}
          onChange={(e) => setNewItem({ ...newItem, i_cost: parseFloat(e.target.value) })}
          placeholder="Cost"
        />
      </td>
      <td style={{ padding: '10px' }} className='d-none'>
         <input
                    type="number"
                       step="0.01"
                    className="form-control "
                    value={newItem.i_retail}
                    onChange={(e) => setNewItem({ ...newItem, i_retail: parseFloat(e.target.value) })}
                    placeholder="Retail"
                  />
      </td>
    </tr>
  </tbody>
</table>
<div className="row mx-1">
          <p className="text-muted">Current Quantity : {fixQty}


          </p>
        </div>
      {/* Items Table */}
      {items.length > 0 && (
      <table className="mt-4">
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
              <td>{item.product_name}</td>
              <td>{item.qty}</td>
              {/* <td>{item.bonus}</td> */}
              <td>{item.rate}</td>
              <td>{item.discount}</td>
              <td className='d-none'>{item.i_cost}</td>
              <td className='d-none'>{item.i_retail}</td>
              <td>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}

    <div className="form-actions last mt-2 fixed-bottom last-form-action-with-total">
    <div className="card p-3 w-25">
       
       <div className="d-flex justify-content-between mb-2">
         <span className='txt-dec'>Total:</span>
         <span>{totals.subTotal}</span>
       </div>
     
       </div>
       <div className="d-flex justify-content-end mb-2 w-25 gap-3 align-items-center ft-btns">
          <button className="btn btn-success  bg-white txt-dec" id="save-btn" >Save </button>
                    
                    <button className="btn btn-secondary bg-white txt-dec"  
                    id="edit" >Edit</button>
                    </div>
                    </div>
    </div>
        </div>
      );
}

export default StockTransferSlip;