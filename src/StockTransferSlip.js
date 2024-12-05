
import './App.css';
import React, { useState, useEffect} from 'react';
import Select from 'react-select';
function StockTransferSlip() {
  const [isModifyClicked, setIsModifyClicked] = useState(false);
   // Event handler for Modify button
   const handleModifyClick = () => {
    setIsModifyClicked(true);
  };
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
      const [wkNo, setWkNo] = useState(localStorage.getItem('wkNo') || ''); // wkNo state
const [remarks, setRemarks] = useState(localStorage.getItem('remarks') || ''); // remarks state

      const [branches, setBranches] = useState([]);
const [selectedFromBranch, setSelectedFromBranch] = useState(null);
const [selectedToBranch, setSelectedToBranch] = useState(null);
const [branchFrom, setBranchFrom] = useState(null);
const [branchTo, setBranchTo] = useState(null);
const [branchFromDesc, setBranchFromDesc] = useState('');
const [branchToDesc, setBranchToDesc] = useState('');

useEffect(() => {
  fetch('http://localhost:3001/branch_info')
      .then((response) => response.json())
      .then((data) => setBranches(data))
      .catch((error) => console.error('Error fetching branch data:', error));
}, []);
const branchOptions = branches.map((branch) => ({
  value: branch.branch_code, // Using branch_code as the value
  label: branch.branch_name, // Showing branch_name as the label
}));
const[dummy,setDummy]=useState('');  
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
             product_desc: selectedOption.label,
            ...selectedOption.details,
          });
         
        
        }  else {
          setSearchItem('');
          setNewItem({
             product_desc: '',
            product_code:'',
            qty: '',
            rate: '',
            discount: '',
            cost: '',
            i_retail: '',
          });
        }
      };
      const [newItem, setNewItem] = useState(() => {
        const savedItem = localStorage.getItem('newItem');
        return savedItem
          ? JSON.parse(savedItem)
          : {  product_desc: '', product_code:'',qty: '', rate: '', discount: '', cost: '', i_retail: '' ,total:''};
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
          const discountInput = document.querySelector('input[placeholder="0"][type="number"][value="' + newItem.i_retail + '"]');
          if (discountInput) {
            discountInput.focus();
          }
          return; // Stop execution if discount is invalid
        }
        const total = (newItem.rate - newItem.discount) * newItem.qty;
        setItems([...items, { ...newItem, total }]);
    
        const subTotal = totals.subTotal + total;
        setTotals({ ...totals, subTotal});
        setNewItem({  product_desc: '',product_code:'', qty: 0, rate: 0, discount: 0,cost:0,i_retail:0,total:0 });
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
          cost: option.cost,
          i_retail: option.retail,
        },
      }));
     
      async function saveInvoice(formData) {
        try {
          const response = await fetch('http://localhost:3001/save-slip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
      
          const data = await response.json();
          if (data.success) {
            alert(data.message);
            localStorage.clear();
            window.location.reload();
              
          } else {
            alert('Failed to save invoice: ' + data.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Server error.');
        }
      }
      const handleSave = () => {
      
        const invoiceData = {
          slip_code:voucherNumber,
          branch_from: branchFrom,
          branch_to: branchTo,
          branch_from_desc: branchFromDesc,
          branch_to_desc: branchToDesc,
          branch_id:'000',
          d_branch_from: branchFromDesc,
          d_branch_to:branchToDesc,
          wk_no: wkNo,
          remarks: remarks,
          //remarks
        
          //wk_no
          s_no:1,
          slip_no:voucherNumber,
          salesman_name:salesman,
          slip_date: currentDate,
          slip_datetime: currentDateTime,
        
          salesman_code:salesmanCode,
         
      
          g_amount:totals.subTotal || 0,
         
          items: items
        };
        saveInvoice(invoiceData);
      localStorage.clear();
      console.log('Invoice Data:'+invoiceData);
     
    
      };
      
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
        const fetchPreviousSlip = async () => {
          try {
            const response = await fetch('http://localhost:3001/get-previous-slip', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ slip_no: voucherNumber }),
            });
        
            if (!response.ok) {
              throw new Error('Failed to fetch previous invoice');
            }
        
            const data = await response.json();
        
            // Log the complete response to check its structure
            console.log("Complete response data:", data);
        
            if (data.success) {
              let previousInvoice = data.invoice;
        
              // Check if previousInvoice is an array of products or a single object
              if (!Array.isArray(previousInvoice) && previousInvoice.products) {
                // If products are nested, use them
                previousInvoice = previousInvoice.products;
              } else if (!Array.isArray(previousInvoice)) {
                // If previousInvoice is not an array and products aren't nested, wrap it in an array
                previousInvoice = [previousInvoice];
              }
        
              // Log previousInvoice after the transformation
              console.log("Processed previousInvoice data:", previousInvoice);
        
              // Map each product item to fit your `newItem` structure
              const fetchedProducts = previousInvoice.map(item => ({
                product_desc: item.product_desc,
                product_code: item.product_code,
                qty: item.qty,
                rate: item.rate,
                discount: item.discount,
                cost: item.cost,
                // i_retail: item.i_retail,
                total:item.rate * item.qty,
              }));
           
              setItems(fetchedProducts);
              setDummy(fetchedProducts.length);
              console.log("length"+fetchedProducts.length);
                console.log("Fetched products:", fetchedProducts);
      
              setVoucherNumber(previousInvoice[0].slip_no);
              setRemarks(previousInvoice[0].remarks);
              setWkNo(previousInvoice[0].wk_no);
              setSelectedFromBranch({
                value: previousInvoice[0].branch_from, // Update based on fetched slip data
                label:  previousInvoice[0].branch_from_desc,
            });
            setSelectedToBranch({
                value:  previousInvoice[0].branch_to, 
                label: previousInvoice[0].branch_to_desc,
            });
            
              setTotals({
                subTotal: previousInvoice[0].g_amount,
                discountTotal: previousInvoice[0].g_discount,
                freightTotal: previousInvoice[0].freight_amount,
                expenseTotal: previousInvoice[0].exp_amount,
              });
              
              //setNetTotal(previousInvoice[0].g_amount);
              setSelectedSalesman({
                value: previousInvoice[0].salesman_code,
                label: previousInvoice[0].salesman_name,
              })
            
                setSearchTerm(previousInvoice[0].salesman_name);
                localStorage.setItem('salesman', previousInvoice[0].salesman_name);
                setSalesmanCode(previousInvoice[0].salesman_code); // Save salesman_code
                setSalesman(previousInvoice[0].salesman_name);
            
            
            
           
            
            }
          } catch (error) {
            console.error('Error fetching previous invoice:', error);
          }
        };
        const fetchForwardSlip = async () => {
          try {
            const response = await fetch('http://localhost:3001/get-next-slip', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ slip_no: voucherNumber }),
            });
        
            if (!response.ok) {
              throw new Error('Failed to fetch next invoice');
            }
        
            const data = await response.json();
        
            // Log the complete response to check its structure
            console.log("Complete response data:", data);
        
            if (data.success) {
              let nextInvoice = data.invoice;
        
              // Check if nextInvoice is an array of products or a single object
              if (!Array.isArray(nextInvoice) && nextInvoice.products) {
                // If products are nested, use them
                nextInvoice = nextInvoice.products;
              } else if (!Array.isArray(nextInvoice)) {
                // If nextInvoice is not an array and products aren't nested, wrap it in an array
                nextInvoice = [nextInvoice];
              }
        
              // Log nextInvoice after the transformation
              console.log("Processed nextInvoice data:", nextInvoice);
        
              // Map each product item to fit your `newItem` structure
              const fetchedProducts = nextInvoice.map(item => ({
                product_name: item.product_name,
                product_code: item.product_code,
                qty: item.qty,
                rate: item.rate,
                discount: item.discount,
                i_cost: item.i_cost,
                i_retail: item.i_retail,
                total: item.rate* item.qty,
              }));
              setItems(fetchedProducts);
              console.log("Fetched products:", fetchedProducts);
              setDummy(fetchedProducts.length);
              setVoucherNumber(nextInvoice[0].slip_no);
              setRemarks(nextInvoice[0].remarks);
              setWkNo(nextInvoice[0].wk_no);
              setSelectedFromBranch({
                value: nextInvoice[0].branch_from, // Update based on fetched slip data
                label:  nextInvoice[0].branch_from_desc,
            });
            setSelectedToBranch({
                value:  nextInvoice[0].branch_to, 
                label: nextInvoice[0].branch_to_desc,
            });
            
              setTotals({
                //netTotal: nextInvoice[0].g_amount,
                 subTotal: nextInvoice[0].g_amount,
                discountTotal: nextInvoice[0].g_discount,
                freightTotal: nextInvoice[0].freight_amount,
                expenseTotal: nextInvoice[0].exp_amount,
              });
              //setNetTotal(nextInvoice[0].g_amount);
              setSelectedSalesman({
                value: nextInvoice[0].salesman_code,
                label: nextInvoice[0].salesman_name,
              })
            
                setSearchTerm(nextInvoice[0].salesman_name);
                localStorage.setItem('salesman', nextInvoice[0].salesman_name);
                setSalesmanCode(nextInvoice[0].salesman_code); // Save salesman_code
                setSalesman(nextInvoice[0].salesman_name);
          
             
            }
            else{
              window.location.reload();
              localStorage.clear();
           
               
            }
          } catch (error) {
            console.error('Error fetching next invoice:', error);
      
          }
        };
        const handleModify = () => {

        
          const invoiceData = {
            slip_code:voucherNumber,
            branch_from: branchFrom,
            branch_to: branchTo,
            branch_from_desc: branchFromDesc,
            branch_to_desc: branchToDesc,
            branch_id:'000',
            d_branch_from: branchFromDesc,
            d_branch_to:branchToDesc,
            wk_no: wkNo,
            remarks: remarks,
            //remarks
          
            //wk_no
            s_no:1,
            slip_no:voucherNumber,
            salesman_name:salesman,
            slip_date: currentDate,
            slip_datetime: currentDateTime,
          
            salesman_code:salesmanCode,
           
        
            g_amount:totals.subTotal || 0,
           
            items: items
          };
          modifyInvoice(invoiceData);
        };
        async function modifyInvoice(formData) {
          try {
            const response = await fetch('http://localhost:3001/modify-slip', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
            });
        
            const data = await response.json();
            if (data.success) {
              alert('Invoice modified successfully.');
              localStorage.clear(); 
         
              window.location.reload();
              // Reset states or perform any needed actions after modification
            } else {
              alert('Failed to modify invoice: ' + data.message);
            }
          } catch (error) {
            console.error('Error modifying invoice:', error);
            alert('Server error.');
          }
        }
        

    return (
        <div className="ap_container " >
            <div className="ap_wrap">
         
            <div className="container-fluid">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center text-white p-3 bg-p">
        <h3 className="mb-0">Stock Transfer Slip</h3>
        <div className="d-flex gap-2 align-items-center">
          {/* Location From & To in one row */}
          <div className="d-flex gap-3 p-2 bg-white rounded align-items-center">
            <div className="d-flex align-items-center">
              <label htmlFor="locationFrom" className="form-label mb-0 pe-2 txt-dec text-nowrap">Location From:</label>
              <Select
        value={selectedFromBranch}
        onChange={(selectedOption) => {
            setSelectedFromBranch(selectedOption);
            if (selectedOption) {
                // Save the selected branch code and name
                setBranchFrom(selectedOption.value);  // branch_from code
                setBranchFromDesc(selectedOption.label);  // branch_from_desc name
            }
        }}
        options={branchOptions}
        placeholder="Branch Name"
        isClearable
        className=" color-border"
        styles={customStyles}
    
    />
            </div>
            <div className="d-flex align-items-center">
              <label htmlFor="locationTo" className="form-label mb-0 pe-2 txt-dec text-nowrap">Location To:</label>
              <Select
        value={selectedToBranch}
        onChange={(selectedOption) => {
            setSelectedToBranch(selectedOption);
            if (selectedOption) {
                // Save the selected branch code and name
                setBranchTo(selectedOption.value);  // branch_to code
                setBranchToDesc(selectedOption.label);  // branch_to_desc name
            }
        }}
        options={branchOptions}
        placeholder="Branch Name"
        isClearable
        className="color-border"
        styles={customStyles}
    />
            </div>
          </div>

          {/* Date and Buttons */}
          <label htmlFor="date" className="form-label mb-0 pe-2"></label>
          <input
            type="date"
            id="date"
            className="form-control form-control-sm w-auto py-3"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
          />
          <button className="btn btn-success bg-white txt-dec fix-btn-size"onClick={handleModifyClick}>Modify</button>
          <button className="btn btn-success bg-white txt-dec fix-btn-size"   onClick={fetchPreviousSlip} >
          {/* disabled={!isModifyClicked} */}
            <i className="bi bi-arrow-left"></i>
          </button>
          <button className="btn btn-success bg-white txt-dec fix-btn-size"   onClick={fetchForwardSlip}>
          {/* disabled={!isModifyClicked} */}
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="container-fluid mt-3" style={{ maxWidth: "1200px" }}>
        {/* First Row */}
        <div className="row mb-3">
          <div className="col-md-3 d-flex align-items-center">
            <label htmlFor="slipNo" className="form-label w-50">Slip No:</label>
            <input
              type="text"
              id="slipNo"
              className="form-control"
              value={voucherNumber}
              onChange={(e) => setVoucherNumber(e.target.value)}
              disabled={!isModifyClicked}
            />
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <label htmlFor="salesman" className="form-label w-50">Salesman:</label>
            <Select
               value={selectedSalesman}
               onChange={handleSalesmanChange}
               options={optionssale}
               placeholder="Search Salesman"
               isClearable
               classNamePrefix="react-select"
                  className="color-border w-100"
         
            />
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <label htmlFor="branch" className="form-label w-50">Branch #:</label>
            <input type="text" id="branch" className="form-control" value={'000'} readOnly/>
          </div>
        </div>

        {/* Second Row */}
        <div className="row mb-3">
          <div className="col-md-3 d-flex align-items-center">
            <label htmlFor="grn" className="form-label w-50">Grn#:</label>
            <input type="text" id="grn" className="form-control" />
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <label htmlFor="wht" className="form-label w-50">Wk#:</label>
            <input type="text" id="wht" className="form-control"   onChange={(e) => setWkNo(e.target.value)} value={wkNo} />
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <label htmlFor="remarks" className="form-label w-50">Remarks:</label>
            <input type="text" id="remarks" className="form-control"   onChange={(e) => setRemarks(e.target.value)} value={remarks}/>
          </div>
        </div>
      </div>
    </div>
    <hr className="my-3 nextTask"/>
<table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
  <thead>
    <tr style={{ backgroundColor: 'purple', color: 'white', textAlign: 'center' }}>
      <th style={{ padding: '10px' }}>Product Name</th>
      <th style={{ padding: '10px' }}>Qty</th>
      {/* <th style={{ padding: '10px' }}>Bonus</th> */}
      <th style={{ padding: '10px' }}>Rate</th>
      {/* <th style={{ padding: '10px' }}>Discount</th> */}
      <th style={{ padding: '10px' }} >Cost</th>
      <th style={{ padding: '10px' }} >Retail</th>
      <th style={{ padding: '10px' }}>Action</th>
   
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
          placeholder="Search Product"
          isClearable
          classNamePrefix="react-select"
             className="color-border"
             styles={customStyles}
           
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
      {/* <td style={{ padding: '10px' }}>
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
   */}
     <td style={{ padding: '10px' }} >
        <input
          type="number"
             step="0.01"
          className="form-control"
          value={newItem.cost}
          onChange={(e) => setNewItem({ ...newItem, cost: parseFloat(e.target.value) })}
          placeholder="0"
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
        />
      </td>
      <td style={{ padding: '10px' }} >
         <input
                    type="number"
                       step="0.01"
                    className="form-control "
                    value={newItem.i_retail}
                    onChange={(e) => setNewItem({ ...newItem, i_retail: parseFloat(e.target.value) })}
                    placeholder="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault(); // Prevent default behavior
                        const nextElement = e.target.closest('td')?.nextElementSibling?.querySelector('input, button');
                        if (nextElement) {
                          nextElement.focus();
                        }
                      }
                    }}
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
            {/* <th>Discount</th> */}
            <th>Cost</th>
            <th>Retail</th>
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
              <td>{item. product_desc}</td>
              <td>{item.qty}</td>
              {/* <td>{item.bonus}</td> */}
              <td>{item.rate}</td>
              {/* <td>{item.discount}</td> */}
              <td>{item.cost}</td>
              <td>{item.i_retail}</td>
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
          <button className="btn btn-success  bg-white txt-dec" id="save-btn"onClick={ handleSave} disabled={isModifyClicked}>Save </button>
                    
                    <button className="btn btn-secondary bg-white txt-dec"  
                    id="edit"disabled={!isModifyClicked} onClick={handleModify}  >Update</button>
                    </div>
                    </div>
    </div>
        </div>
      );
}

export default StockTransferSlip;