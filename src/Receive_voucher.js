import React, { useState, useEffect} from 'react';
import './App.css';
import Select from 'react-select';
function Receive_voucher() {
    const [selectedName, setSelectedName] = useState(null); 
  const [selectedOption, setSelectedOption] = useState("customer");
  const [isModifyClicked, setIsModifyClicked] = useState(false);

  // Event handler for Modify button
  const handleModifyClick = () => {
    setIsModifyClicked(true);
  };
  useEffect(() => {
    // Default option is customer
    setSelectedOption("customer");
    
    // Fetch customer data and preselect first option
    const fetchInitialData = async () => {
      const masterCode = 401; // Default master code for customer
      const response = await fetch(`http://localhost:3001/getPaymentsLedger?masterCode=${masterCode}`);
      const result = await response.json();
      const nameList = result.map(item => ({
        value: item.code,
        label: item.name,
        current_balance: item.current_balance,
        branch_id: item.branch_id,
      }));
      setNames(nameList);
  
      // Automatically select the first option if available
      if (nameList.length > 0) {
        handleNameChange(nameList[0]);
      }
    };
  
    fetchInitialData();
  }, []); // Runs only once when the component mounts
  

  const fetchData = async (masterCode) => {
    const response = await fetch(`http://localhost:3001/getPaymentsLedger?masterCode=${masterCode}`);
   const result = await response.json();
   const nameList = result.map(item => ({
     value: item.code,   // Name value for select option
     label: item.name,   // Name label to show
     current_balance: item.current_balance ,// Balance corresponding to name
     branch_id:item.branch_id,
   }));
   setNames(nameList);
 
  };
  useEffect(() => {
    const fetchAccountMaster = async () => {
      try {
        const response = await fetch('http://localhost:3001/accountmaster');
        const data = await response.json();
        setAccountMaster(data);
  
        // Automatically set the first option as the default
        if (data.length > 0) {
          const defaultOption = {
            value: data[0].account_code,
            label: data[0].account_name,
          };
          setFormData((prevData) => ({
            ...prevData,
            last_account_no: defaultOption.value,
            last_title: defaultOption.label,
          }));
        }
      } catch (error) {
        console.error('Error fetching account master:', error);
      }
    };
  
    fetchAccountMaster();
  }, []);
  
  const [formData, setFormData] = useState({
        
    last_account_no: 0,
    last_debit:0,
    last_title:'',
    last_credit:0,
    last_discount:0
    
  });

  
    const handleOptionChange = (e) => {
      const value = e.target?.value || e; // Check if value is coming from event or manual call
      setSelectedOption(value);
  
        setSelectedOption(e.target.value);
        // Reset relevant fields
    setSelectedName(null);
    setCurrentBalance(0);
    setCode(0);
    setbranch_id('000');
    setTitle('');
    setNewItem({
        ...newItem,
        account_no: 0,
        title: '',
        particular: 'Cash Received',
        debit: 0,
        credit: 0,
        ref_doc_no: 0,
        branch_id: '000',
        discount: 0,
        prv_balance: 0,
    });

        let masterCode;
        if (e.target.value === "customer") {
          masterCode = 401; // For customer
        } else if (e.target.value === "supplier") {
          masterCode = 201; // For supplier
        } else {
          masterCode = 301; // For other
        }
        fetchData(masterCode); // Fetch filtered data based on selected option
      };

      const handleNameChange = (selectedOption) => {
        setCurrentBalance(selectedOption ? selectedOption.current_balance : 0); // Set the balance corresponding to selected name

       setTitle(selectedOption ? selectedOption.label : 0)
       setCode(selectedOption ? selectedOption.value : 0)
       setbranch_id(selectedOption ? selectedOption.branch_id : '000')
       setSelectedName(selectedOption); 
       const updatedItem = {
        ...newItem,
        branch_id: selectedOption ? selectedOption.branch_id : '000',
        account_no: selectedOption ? selectedOption.value : 0,
        title: selectedOption ? selectedOption.label : '',
        prv_balance:selectedOption?selectedOption.current_balance:0,
    };

    setNewItem(updatedItem); // Update newItem state immutably

      };

    const [accountMaster, setAccountMaster] = useState([]);
    const handleSelectChange = (name, selectedOption) => {
        // setFormData((prevData) => ({
        //   ...prevData,
        //   [name]: selectedOption,
         
        // }));
        setFormData((prevData) => {
          const updatedData = {
              ...prevData,
              [name]: selectedOption,
          };
          return updatedData;
      });

      };
  //    useEffect(() => {
  //       alert(formData.account_no);
  // }, [formData.account_no]);
    
      
   
  
    const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);
   const [title,setTitle]=useState('');
    const [voucherNumber, setVoucherNumber] = useState(Number(localStorage.getItem('voucherNumber')) || 0);
    const [names, setNames] = useState([]); 
    const [currentBalance, setCurrentBalance] = useState(localStorage.getItem('currentBalance') || 0);
    const [code, setCode] = useState();
    const [branch_id, setbranch_id] = useState(localStorage.getItem('branch_id') || 0);
const handleAddItem = () => {
  const updatedDebit = formData.last_debit + newItem.credit;
  const updatedDiscount = formData.last_discount + newItem.discount;

  // Set the updated debit value in formData
  setFormData(prevFormData => ({
      ...prevFormData,
      last_debit: updatedDebit,
      last_discount: updatedDiscount 
  }));

  // Add the new item to the items array
  setItems([
      ...items,
      newItem
  ]);

    // setItems([
    //     ...items,
    //     {
    //         ...newItem
    //     }
    // ]);
    setNewItem({
       
         discount: 0,
        title: '',
       particular: 'Cash Received',
        credit: 0,
        debit:0,
        ref_doc_no:0,
         branch_id:'000'
    });
  
    setCurrentBalance(0);
    setCode(0);
    setSelectedName(null);
};

  
  
    const [newItem, setNewItem] = useState({
     
    account_no:0,
        particular: 'Cash Received',    
        title: '',   
        debit:0,
        ref_doc_no:0,
        credit: 0   ,
        branch_id:'000',
        discount: 0,
        prv_balance:0
    });
    
    const [currentDate, setCurrentDate] = useState(localStorage.getItem('currentDate') || '');
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
      // const now = new Date();
      // const time = now.toTimeString().slice(0, 8); 
      // setCurrentDateTime(`${currentDate} ${time}`);
      // const month = now.toLocaleString('default', { month: 'long' }); // Get full month name
      // const year = now.getFullYear(); // Get year
      // setCurrentDateMonth(month);
      // setCurrentDateYear(year);


      //alert(currentDate+currentDateTime+currentDateMonth+currentDateyear)
    }, []);
 
      
  const [allData, setAllData] = useState({
        
    // voucher_no: voucherNumber ||0,
       voucher_type:4,
       wk_no:1,
  dt_date:currentDate,

items: [] 
    });
    useEffect(() => {
      setAllData((prevData) => ({
        ...prevData,
        items: items, // Update items in allData whenever items change
      }));
    }, [items]);
 
  const customStyles = { 
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused || state.isSelected ? '#98198E' : base.backgroundColor, // Set background color for hover/selection
      color: state.isSelected ? 'white' : 'black', // Text color when selected
      '&:hover': {
        backgroundColor: '#98198E', // Hover background color
        color: 'white', // Hover text color
      },
    }),
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#98198E' : '#ced4da', // Border color based on focus
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(152, 25, 142, 0.25)' : 'none', // Add focus shadow like Bootstrap
      borderRadius: '4px', // Rounded edges
      minHeight: 'calc(1.5em + 0.75rem + 2px)', // Match Bootstrap input height
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999, // Prevent overlapping issues
    }),
  };
  
   
    useEffect(() => {
    
      fetch('http://localhost:3001/voucher', {
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
        setVoucherNumber(data.voucher_number); // Set the invoice number in state
    })
    .catch(error => console.error('Error:', error));
      fetch('http://localhost:3001/accountmaster')
        .then(response => response.json())
        .then(data => 
            
            
            setAccountMaster(data)
        
        
        );
       
      }, []);
    
    

    const handleDelete = (index) => {
       // Get the credit value of the item being deleted
    const creditToSubtract = items[index].credit;
    const discountToSubtract = items[index].discount;

    // Subtract the credit value from the current formData.debit
    setFormData(prevFormData => ({
        ...prevFormData,
        last_debit: prevFormData.last_debit - creditToSubtract  // Decrease the debit by the credit of the deleted item
        ,   last_discount: prevFormData.last_discount - discountToSubtract 
    }));

    // Remove the item from the items array
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    
        // const newItems = items.filter((_, i) => i !== index);
        // setItems(newItems);
    

      };
      const handleSave = async () => {
        //alert(allData+formData.last_account_no)
        try {
          const response = await fetch("http://localhost:3001/saveVoucher", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify(allData, last_account_no:formData.last_account_no, last_debit:formData.last_debit,
            //   last_title:formData.last_title
            // ), // Send allData directly
            body: JSON.stringify({
              ...allData, // Spread the allData object
              voucher_no:voucherNumber,
              last_account_no: formData.last_account_no,
              last_debit: formData.last_debit,
              last_title: formData.last_title,
              last_discount:formData.last_discount,
              voucher_year:currentDateyear,
voucher_month:currentDateMonth,
dt_datetime:currentDateTime,
            }),
            
          });
      
          if (response.ok) {
            const result = await response.json();
            alert(result.message); // Success message
            window.location.reload();
          } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
          }
        } catch (error) {
          console.error("Error saving voucher data:", error);
          alert("Failed to save voucher data.");
        }
      };
   
    
    // const handleNext = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:3001/voucher?voucher_no=${voucherNumber}&direction=next`);
    //         if (response.ok) {
    //             const data = await response.json();
    //             setVoucherNumber(data.voucher_no);
    //             setFormData({
    //                 last_account_no: data.last_account_no,
    //                 last_title: data.last_title,
    //                 last_debit: data.last_debit,
    //                 last_discount: data.last_discount,
    //             });
    //             setItems(data.items);
    //         } else {
    //             alert('No next vouchers found.');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching next voucher:', error);
    //     }
    // };
    const handleNext = async (voucherNumber) => {
    
      try {
          const response = await fetch(`http://localhost:3001/nextVoucher?voucher_no=${voucherNumber}`);
       
          if (response.ok) {
            
            
            const data = await response.json();
            // console.log("NEXT"+data);
            let findRecord= data;
            const lastRecord = findRecord[findRecord.length - 1]; // Get the last record
              // Set formData using the last record
          
              setVoucherNumber(lastRecord.voucher_no);
  setFormData({
    last_account_no: lastRecord.account_no,
    last_debit: lastRecord.debit,
    last_title: lastRecord.title,
    last_credit: lastRecord.credit,
    last_discount: lastRecord.discount,
  });

            findRecord = findRecord.slice(0, -1); // Removes the last item from the array

            //alert(findRecord.length); 
            const fetchedProducts = findRecord.map(item => ({
              title: item.title,
              account_no: item.account_no,
              branch_id: item.branch_id,
              particular: item.particular,
              debit: item.debit,
              ref_doc_no:item.ref_doc_no,
              credit: item.credit,
              prv_balance: item.prv_balance,
              discount:item.discount
              // total:(item.rate - item.discount) * item.qty,
            }));
            setItems([]); // Clear old items
            setItems(fetchedProducts);
           // alert(fetchedProducts)
     
       
        }
        
        
        else {
            alert('Voucher not found.');
        }
          // if (response.ok) {
          //       const data = await response.json();
           
          //   //alert('Voucher found.'+ data);
           
          //     // setFormData({
          //     //     last_account_no: data.last_account_no,
          //     //     last_title: data.last_title,
          //     //     last_debit: data.last_debit,
          //     //     last_discount: data.last_discount,
          //     // });
          //      setItems(data.items);
          //      setVoucherNumber(data.voucher_no); 
          // } else {
          //     alert('Voucher not found.');
          // }
      } catch (error) {
          console.error('Error fetching voucher:', error);
          alert('An error occurred while fetching the voucher.');
      }
  };
  
  const handlePrevious = async (voucherNumber) => {
    setVoucherNumber(voucherNumber-1);
    try {
        const response = await fetch(`http://localhost:3001/previousVoucher?voucher_no=${voucherNumber}`);
        
        if (response.ok) {
          const data = await response.json();
  
          let findRecord= data;
          const lastRecord = findRecord[findRecord.length - 1]; // Get the last record
            // Set formData using the last record
            setVoucherNumber(lastRecord.voucher_no); 
setFormData({
  last_account_no: lastRecord.account_no,
  last_debit: lastRecord.debit,
  last_title: lastRecord.title,
  last_credit: lastRecord.credit,
  last_discount: lastRecord.discount,
});

          findRecord = findRecord.slice(0, -1); // Removes the last item from the array

          //alert(findRecord.length); 
          const fetchedProducts = findRecord.map(item => ({
            title: item.title,
            account_no: item.account_no,
            branch_id: item.branch_id,
            particular: item.particular,
            debit: item.debit,
            ref_doc_no:item.ref_doc_no,
            credit: item.credit,
            prv_balance: item.prv_balance,
            discount:item.discount
            // total:(item.rate - item.discount) * item.qty,
          }));
          setItems([]); // Clear old items
          setItems(fetchedProducts);
         // alert(fetchedProducts)
   
     
      }
      
      
      else {
          alert('Voucher not found.');
      }
        // if (response.ok) {
        //       const data = await response.json();
         
        //   //alert('Voucher found.'+ data);
         
        //     // setFormData({
        //     //     last_account_no: data.last_account_no,
        //     //     last_title: data.last_title,
        //     //     last_debit: data.last_debit,
        //     //     last_discount: data.last_discount,
        //     // });
        //      setItems(data.items);
        //      setVoucherNumber(data.voucher_no); 
        // } else {
        //     alert('Voucher not found.');
        // }
    } catch (error) {
        console.error('Error fetching voucher:', error);
        alert('An error occurred while fetching the voucher.');
    }
};

    const fetchVoucher = async (voucherNumber) => {
      try {
          const response = await fetch(`http://localhost:3001/searchVoucher?voucher_no=${voucherNumber}`);
          if (response.ok) {
            const data = await response.json();
            let findRecord= data;
            const lastRecord = findRecord[findRecord.length - 1]; // Get the last record
              // Set formData using the last record
              setVoucherNumber(voucherNumber);
  setFormData({
    last_account_no: lastRecord.account_no,
    last_debit: lastRecord.debit,
    last_title: lastRecord.title,
    last_credit: lastRecord.credit,
    last_discount: lastRecord.discount,
  });

            findRecord = findRecord.slice(0, -1); // Removes the last item from the array

            //alert(findRecord.length); 
            const fetchedProducts = findRecord.map(item => ({
              title: item.title,
              account_no: item.account_no,
              branch_id: item.branch_id,
              particular: item.particular,
              debit: item.debit,
              ref_doc_no:item.ref_doc_no,
              credit: item.credit,
              prv_balance: item.prv_balance,
              discount:item.discount
              // total:(item.rate - item.discount) * item.qty,
            }));
         
            setItems(fetchedProducts);
           // alert(fetchedProducts)
     
       
        }
        
        
        else {
            alert('Voucher not found.');
        }
          // if (response.ok) {
          //       const data = await response.json();
           
          //   //alert('Voucher found.'+ data);
           
          //     // setFormData({
          //     //     last_account_no: data.last_account_no,
          //     //     last_title: data.last_title,
          //     //     last_debit: data.last_debit,
          //     //     last_discount: data.last_discount,
          //     // });
          //      setItems(data.items);
          //      setVoucherNumber(data.voucher_no); 
          // } else {
          //     alert('Voucher not found.');
          // }
      } catch (error) {
          console.error('Error fetching voucher:', error);
          alert('An error occurred while fetching the voucher.');
      }
  };
  
  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/editVoucher`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({

          items,
          ...allData, // Spread the allData object
          voucher_no:voucherNumber,
          last_account_no: formData.last_account_no,
          last_debit: formData.last_debit,
          last_title: formData.last_title,
          last_discount:formData.last_discount,
          voucher_year:currentDateyear,
voucher_month:currentDateMonth,
dt_datetime:currentDateTime,

dt_date:currentDate,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Success message
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error editing voucher:", error);
      alert("Failed to update voucher.");
    }
  };
    
  
    return (
      <div className="ap_container " >
          <div className="ap_wrap">
       
         
      <div className="container-fluid " 
      >
          <div className="last w-100 d-flex voch-rec-header ">

         <div className="d-flex gap-4 w-75 p-4 ms-5 voch-rec-header-inner"  >
             <Select
         id="accountMaster"
         options={(accountMaster || []).map(option => ({
           value: option.account_code,
           label: option.account_name,
         }))}
        value={
            accountMaster
              .filter((option) => option.account_code === formData.last_account_no)
              .map((option) => ({
                value: option.account_code,
                label: option.account_name,
              }))[0] || null 
          }
          
  //        onChange={(selectedOption) => {
  //         handleSelectChange('last_account_no', selectedOption.value);  // Assuming `selectedOption` has a `value` property for account_no
         
  //  handleSelectChange('last_title', selectedOption.label);   // Assuming `selectedOption` has a `label` property for title

  //     }}
  onChange={(selectedOption) => {
    if (selectedOption) {
      handleSelectChange('last_account_no', selectedOption.value);
      handleSelectChange('last_title', selectedOption.label);
    } else {
      handleSelectChange('last_account_no', null);
      handleSelectChange('last_title', null);
    }
  }}
         
              placeholder=" "
              isClearable
              classNamePrefix="react-select"
                 className="color-border w-50"
                 styles={customStyles}
            />
          <input
      type="text"
      className="form-control w-25"
      value={voucherNumber}
      onChange={(e) => setVoucherNumber(e.target.value)
      
      }
        id="vouc-no-field"
        onKeyDown={(e) => e.key === 'Enter' && fetchVoucher(voucherNumber)} 
        disabled={!isModifyClicked}
    />
   
      <input
          type="date"
          className="form-control w-50 "
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
        />
       
                  </div>
                  <div className="d-flex gap-4 w-50 p-4 voch-rec-header-inner justify-content-end "  >
                     <div className="d-flex gap-4 w-50">
                               {/* onClick={() => fetchVoucher(voucherNumber)}    */}
                                  {/* onClick={handlePrevious(voucherNumber)} */}
                                        {/* onClick={() => handleNext(voucherNumber)} */}
                     <button  className="btn btn-success  bg-white txt-dec fix-btn-size " id="modify"  onClick={handleModifyClick} >Modify</button>
            
  

        <button className="btn btn-success  bg-white txt-dec px-4 fix-btn-size "  id="btn-prev" onClick={() => handlePrevious(voucherNumber)}     disabled={!isModifyClicked} > 
           <i className="bi bi-arrow-left fs-5 fw-bold"></i>
            </button>
     
                  <button className="btn btn-success  bg-white txt-dec px-4 fix-btn-size " id="btn-next"  onClick={() => handleNext(voucherNumber)}     disabled={!isModifyClicked} >  <i className="bi bi-arrow-right fs-5 fw-bold"></i></button>
            
                    </div>
         </div>
         
     </div>
  <div className="container-fluid d-flex flex-column p-1 w-100" style={{maxWidth:'1500px'}} >
 


  <div class="d-flex align-items-center gap-4 mt-3">

<div class="form-check">
  <input class="form-check-input custom-radio " type="radio" name="type" id="customer" value="customer"    checked={selectedOption === "customer"}    onChange={handleOptionChange}/>
  <label class="form-check-label" for="customer">Customer</label>
</div>
<div class="form-check">
  <input class="form-check-input custom-radio " type="radio" name="type" id="supplier" value="supplier"          checked={selectedOption === "supplier"}    onChange={handleOptionChange} />
  <label class="form-check-label" for="supplier">Supplier</label>
</div>
<div class="form-check">
  <input class="form-check-input custom-radio " type="radio" name="type" id="other" value="other"     checked={selectedOption === "Other"} />
  <label class="form-check-label" for="other">Other</label>
</div>

</div>
   <div> 
        <hr className=" nextTask"/>
  <table style={{width:'75%'}} className='heading-table'>
  
      <tr >
        <th className='txt-dec'style={{ paddingLeft: '10px' }}  >Name</th>
        <th className='txt-dec' style={{ paddingLeft: '10px' }} >Particular</th>
        <th  className='txt-dec' style={{ paddingLeft: '10px' }} >Amount</th>
        <th  className='txt-dec'style={{ paddingLeft: '10px' }}  >Discount</th>
       
     <th  className='txt-dec' style={{ paddingLeft: '10px' }} >Action</th> 

      </tr>
  
    <tbody>
      <tr>
      <td  className='w-25'>
    {/* <div className="position-relative w-100"> */}
    <Select
            
            placeholder=" "
            isClearable
            classNamePrefix="react-select"
            id="selectedName"
               className="color-border w-100"
               styles={customStyles}
               options={names} // Options for dropdown
               onChange={handleNameChange} // When a name is selected
               //getOptionLabel={(e) => e.label} // How to render the label in select
             
               //value={names[0]}
               value={selectedName }
          />
    {/* </div> */}
  </td>
        <td style={{ padding: '10px' }}  className='w-25'>
           <input
           type='text'
                      className="form-control"
                    
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault(); 
                          const nextElement = e.target.closest('td')?.nextElementSibling?.querySelector('input');
                          if (nextElement) {
                            nextElement.focus();
                          }
                        }
                      }}
                      value={newItem.particular}
                      onChange={(e) => setNewItem({ ...newItem, particular: e.target.value })}
                      placeholder=" "
                      min="0" 
                    />
        </td>
        <td style={{ padding: '10px' }}  className='w-25'>
          <input
            type="number"
               step="0.01"
            className="form-control"
    
            min="0" 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission or any default behavior
                const nextElement = e.target.closest('td')?.nextElementSibling?.querySelector('input');
                if (nextElement) {
                  nextElement.focus();
                }
              }
            }}
    
            value={newItem.credit}
            onChange={(e) => setNewItem({ ...newItem, credit: parseFloat(e.target.value) })}
            placeholder=" "
          />
        </td>
        <td style={{ padding: '10px' }} className='w-25'>
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
                      placeholder=" "
                    />
        </td>
    
        <td style={{ padding: '10px' }} className='w-25'>
          <button
            className="btn last text-white add"
            onClick={handleAddItem}
        
          >
            <i className="bi bi-plus" style={{ fontSize: '20px' }}></i>
          </button>
        </td>
  
      </tr>
    </tbody>
  </table>
          <div className="row mb-3">
            <p className=" txt-dec">Current Balance: {currentBalance}</p>
          </div>
        {/* )} */}
        {/* Items Table */}
        <hr className="my-3 nextTask"/>
    
         {items.length > 0 && ( 
          <table style={{ width: '100%' }} className="responsive-table">
          <thead>
            <tr style={{ padding: '10px' }}>
              <th className="doc text-nowrap" >Sr No</th>
              <th className="p-set " style={{ width: '10%', textAlign: 'left' }}>Account Code</th>
              <th className="p-set">Particular</th>
              <th className="p-set" style={{ width: '20%' }}>Title</th>
              <th className="p-set">Debit</th>
              <th className="p-set">Credit</th>
              <th className="text-nowrap">Doc #</th>
              <th className="p-set">Branch</th>
              <th className="p-set">Disc</th>
              <th>Delt</th>
            </tr>
          </thead>
          <br />
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {/* <td>{formData.account_no}</td> */}
                <td>{item.account_no}</td>
                <td>{item.particular}</td>
                <td>{item.title}</td>
                <td>{item.debit}</td>
                <td>{item.credit}</td>
                <td>{item.ref_doc_no}</td>
                <td>{item.branch_id}</td>
                <td>{item.discount}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        

         )} 
  
 
 
    
    
  </div>

  </div>

  </div>
  <div className="form-actions last mt-2 fixed-bottom last-form-action-with-total">
  <div className="card p-3 w-25">
     
     <div className="d-flex justify-content-between mb-2">
       <span className='txt-dec'>Total:</span>
       <span>{formData.last_debit}</span>
     </div>
     <div className="d-flex justify-content-between">
       <span className='txt-dec'>Total Discount:</span>
       <span>{formData.last_discount}</span>
     </div>
     </div>
     <div className="d-flex justify-content-end mb-2 w-25 gap-3 align-items-center ft-btns">
        <button className="btn btn-success  bg-white txt-dec" id="save-btn" onClick={handleSave}  disabled={isModifyClicked}>Save </button>
                  
                  <button className="btn btn-secondary bg-white txt-dec"  disabled={!isModifyClicked} onClick={handleEdit} 
                  id="edit" >Edit</button>
                  </div>
                  </div>
  </div>
      </div>
    );
  }


export default Receive_voucher;