import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Cookies from 'js-cookie';
import Select from 'react-select';
function InvoiceForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    console.log("Menu toggle clicked");
    setMenuOpen(!menuOpen);
  };
  const [selectedCustomer, setSelectedCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem('selectedCustomer');
    return savedCustomer ? JSON.parse(savedCustomer) : null;
  });
  const fetchPreviousInvoice = async () => {
    try {
      const response = await fetch('http://localhost:3001/get-previous-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inv_no: invoiceNumber }),
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
          product_name: item.product_name,
          product_code: item.product_code,
          qty: item.qty,
          rate: item.rate,
          discount: item.discount,
          i_cost: item.i_cost,
          i_retail: item.i_retail,
          total:(item.rate - item.discount) * item.qty,
        }));
     
        setItems(fetchedProducts);
        setDummy(fetchedProducts.length);
        console.log("length"+fetchedProducts.length);
          console.log("Fetched products:", fetchedProducts);

        setInvoiceNumber(previousInvoice[0].inv_no);
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
        // setSelectedCustomer(previousInvoice[0].cust_name);
        setSelectedCustomer({
          value: previousInvoice[0].cust_code,
          label: previousInvoice[0].cust_name,
          // terms: previousInvoice[0].cust_terms,
          balance: previousInvoice[0].prv_balance 
        });
        const inv_type = previousInvoice[0].inv_type;
        if(inv_type==1){
          setCustomerTerms("CASH");
        }
        else if(inv_type==2){
          setCustomerTerms("CREDIT");
        }
        else{}
      
        // setCustomerTerms(previousInvoice[0].cust_terms);
        setSearchCustomer(previousInvoice[0].cust_name);
        setCustomer(previousInvoice[0].cust_name);
        setCurrentBalance(previousInvoice[0].prv_balance);
  
        const dateFromDatabase = new Date(previousInvoice[0].inv_date);
        const formattedDate = dateFromDatabase.toISOString().slice(0, 10);
        setCurrentDate(formattedDate);
        setCurrentDateTime(previousInvoice[0].inv_datetime);
        setBankAmount(previousInvoice[0].bank_amount);
        setCashAmount(previousInvoice[0].bank_cash_amount);
       
        
       setSelectedBank( previousInvoice[0].bank_name)
        setCashReceive(previousInvoice[0].cash_amount);
        setCust_ref(previousInvoice[0].cust_ref);
      
      }
    } catch (error) {
      console.error('Error fetching previous invoice:', error);
    }
  };
  const fetchForwardInvoice = async () => {
    try {
      const response = await fetch('http://localhost:3001/get-next-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inv_no: invoiceNumber }),
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
          total: (item.rate - item.discount) * item.qty,
        }));
        setItems(fetchedProducts);
        console.log("Fetched products:", fetchedProducts);
        setDummy(fetchedProducts.length);
        setInvoiceNumber(nextInvoice[0].inv_no);
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
        setSelectedCustomer({
          value: nextInvoice[0].cust_code,
          label: nextInvoice[0].cust_name,
          // terms: nextInvoice[0].cust_terms,
          balance: nextInvoice[0].prv_balance 
        });
        const inv_type = nextInvoice[0].inv_type;
        if(inv_type==1){
          setCustomerTerms("CASH");
        }
        else if(inv_type==2){
          setCustomerTerms("CREDIT");
        }
        else{}
      
        //setSelectedCustomer(nextInvoice[0].cust_name);
        setSearchCustomer(nextInvoice[0].cust_name);
        // setCustomerTerms(nextInvoice[0].cust_terms);
        setCustomer(nextInvoice[0]);
        setCurrentBalance(nextInvoice[0].prv_balance);
      
        const dateFromDatabase = new Date(nextInvoice[0].inv_date);
        const formattedDate = dateFromDatabase.toISOString().slice(0, 10);
        setCurrentDate(formattedDate);
        setCurrentDateTime(nextInvoice[0].inv_datetime);
        setBankAmount(nextInvoice[0].bank_amount);
        setCashAmount(nextInvoice[0].bank_cash_amount);
        setSelectedBank( nextInvoice[0].bank_name)
        setCashReceive(nextInvoice[0].cash_amount);
        setCust_ref(nextInvoice[0].cust_ref);
      }
    } catch (error) {
      console.error('Error fetching next invoice:', error);
    }
  };
  
  const [fixQty,setFixQty]=useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  // const [selectedCustomer, setSelectedCustomer] = useState(localStorage.getItem('selectedCustomer'));
  const [currentDate, setCurrentDate] = useState(localStorage.getItem('currentDate') || '');
  const [itemDescriptions, setItemDescriptions] = useState([]);
  const [searchItem, setSearchItem] = useState(localStorage.getItem('searchItem') || '');
  const [searchCustomer, setSearchCustomer] = useState(localStorage.getItem('searchCustomer') || '');
  const [customerTerms, setCustomerTerms] = useState(localStorage.getItem('customerTerms') || " ");
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('items')) || []);
const[dummy,setDummy]=useState('');  
  const [totals, setTotals] = useState(JSON.parse(localStorage.getItem('totals')) || { subTotal: 0, discountTotal: '', freightTotal: 0, expenseTotal: 0 });
  const [salesman, setSalesman] = useState(localStorage.getItem('salesman') || '');
  const [customer, setCustomer] = useState(localStorage.getItem('customer') || '');
 
  const [cust_ref, setCust_ref] = useState(localStorage.getItem('cust_ref') || '');
  const [invoiceNumber, setInvoiceNumber] = useState(Number(localStorage.getItem('invoiceNumber')) || 0);
  const [salesmenOptions, setSalesmenOptions] = useState([]);
  const [customersOptions, setCustomersOptions] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(localStorage.getItem('currentBalance') || 0);
   const [cashAmount, setCashAmount] = useState(localStorage.getItem('cashAmount')||'');
   const [bankAmount, setBankAmount] = useState(localStorage.getItem('bankAmount')||'');
  const [netTotal, setNetTotal] = useState(Number(localStorage.getItem('netTotal')) || 0);
  const [cashReceive, setCashReceive] = useState(localStorage.getItem('cashReceive') || '');
  const [cashReceivetotal, setCashReceivetotal] = useState(localStorage.getItem('cashReceive') || 0);
  const [cashRemaining, setCashRemaining] = useState(localStorage.getItem('cashRemaining') || '');
  const [customerCode, setCustomerCode] = useState(Number(localStorage.getItem('customerCode')) || 0);
  const [salesmanCode, setSalesmanCode] = useState(Number(localStorage.getItem('salesmanCode')) || 0);
  const [selectedSalesman, setSelectedSalesman] = useState(() => {
    const savedSalesman = localStorage.getItem('salesman'); // Retrieve salesman from localStorage
    return savedSalesman ? { label: savedSalesman, value: null } : null; // Set the salesman name if found
});

  const [selectedItem, setSelectedItem] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(''); 
  const itemRefs = useRef([]);
  const [searchTerm, setSearchTerm] = useState('');
 const [itemNames, setItemNames] = useState([]);
 const [bank, setBank] = useState();
 //const [bankOptions, setBankOptions] = useState([]);
 const [error, setError] = useState(''); 
 const [selectedBank, setSelectedBank] = useState('');
 
 const bankOptions = [
  { value: '', label: 'Select Bank' },
  { value: 'MCB', label: 'MCB' },
  { value: 'HBL', label: 'HBL' },
  { value: 'UBL', label: 'UBL' }
];
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
  });
  
  const handleBankSelectionChange = (selectedOption) => {
    if (selectedOption?.value) {
      setSelectedBank(selectedOption.value);
      setBank(selectedOption.value);
    } else {
      setSelectedBank('');
      setBank('');
    }
  };
  
  
    // const handleBankSelectionChange = (selectedOption) => {
    //   if (selectedOption && selectedOption.value) {
    //     setSelectedBank(selectedOption.value);
    //     setBank(selectedOption.value);
    //     console.log(bank)
    //   } else {
    //     setSelectedBank('');  // Default to empty if no selection
    //     setBank('');           // Reset bank if no selection
    //   }
    // };
    
    // const handleBankSelectionChange = (selectedOption) => {
    //   if (selectedOption && selectedOption.value) {
    //     setSelectedBank(selectedOption.value);
    //     setBank(selectedOption.value);
    //     console.log("Selected Bank: ", selectedOption.value);
    //   } else {
    //     setSelectedBank('');  // Default to empty if no selection
    //     setBank('');           // Reset bank if no selection
    //     console.log("Bank reset");
    //   }
    // };
    
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
 
    localStorage.setItem('cust_ref',cust_ref);
    localStorage.setItem('netTotal', netTotal);
    localStorage.setItem('customerCode', customerCode);
    localStorage.setItem('salesmanCode', salesmanCode);
    localStorage.setItem('cashReceive', cashReceive);
    localStorage.setItem('cashRemaining', cashRemaining);
    localStorage.setItem('newItem', JSON.stringify(newItem));
    localStorage.setItem('selectedCustomer', JSON.stringify(selectedCustomer));


  }, [currentDate, searchItem, searchCustomer, customerTerms, items, totals, salesman, customer, invoiceNumber,netTotal, currentBalance, cashAmount, bankAmount, netTotal,customerCode, salesmanCode,cashReceive,cashRemaining,newItem]);
  
  // const filteredOptions = salesmenOptions.filter(option =>
  //   option.emp_name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
  const filteredCustomerOptions = customersOptions.filter(option =>
    option.cust_name.toLowerCase().includes(searchCustomer.toLowerCase())
  );
const options = filteredCustomerOptions.map((option) => ({
  value: option.cust_code,
  label: option.cust_name,
  terms: option.cust_terms, // Ensure this exists in the data
  balance: option.cust_current_bal // Ensure this exists in the data
}));
const handleChange = (selectedOption) => {
  setSelectedCustomer(selectedOption);
  if (selectedOption) {
    setCustomerCode(selectedOption.value);
    setCustomer(selectedOption.label);
    setSearchCustomer(selectedOption.label);
    setCustomerTerms(selectedOption.terms);
    setCurrentBalance(selectedOption.balance);

    // Additional logic to set current balance, customer code, etc.
  } else {
    setSearchCustomer('');
    setCustomer('');
    setCurrentBalance(0);
    setCustomerCode('');
    setCustomerTerms('');
  }
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
  useEffect(() => {
    // if (totals.discountTotal > totals.subTotal) {
    //   //alert('Error: Discount Total cannot be greater than Sub Total.');
      
    //   // Focus on the discount input field to prompt correction
    //   const discountInput = document.querySelector('input[placeholder="0"][class="form-control"]');
    //   if (discountInput) {
    //     discountInput.focus();
    //   }
    //   setTotals({ ...totals, discountTotal: '' });
    //   return; // Stop execution if the condition is met
    // }
  
    const calculatedFinal = totals.subTotal - totals.discountTotal + totals.freightTotal + totals.expenseTotal;
    setNetTotal(calculatedFinal);
  if(calculatedFinal<=0){
    setCashReceive('');
    setCashRemaining('');

  }
  // if(cashReceive===""||(cashAmount=="" && bankAmount=="")){
  //   setCashRemaining("");
  // }
  if(cashAmount==="" ||bankAmount===""){
  const totalAmount = parseFloat(cashAmount ||0 ) + parseFloat(bankAmount ||0);
  
setCashReceivetotal(totalAmount);
}
else if(cashAmount!=="" ||bankAmount!==""){
  const totalAmount = parseFloat(cashAmount ||0 ) + parseFloat(bankAmount ||0);
  
  setCashReceivetotal(totalAmount);
}

 if( (cashAmount==0) && (bankAmount==0) ){
  setError('');
}
   }, [totals,cashRemaining,cashAmount, bankAmount,customerTerms,netTotal,currentBalance,customer,cashReceive,cashReceivetotal]);
  useEffect(() => {
    if (document.getElementById('mycash') && cashAmount == 0 && bankAmount == 0) {
    let newCashRemaining = 0;
  //setCashRemaining('');
    if (customerTerms === "CASH") {
      // newCashRemaining = parseFloat(cashReceive) - parseFloat(netTotal);
      newCashRemaining = parseFloat(cashReceive)-parseFloat(netTotal) ;
    } else if (customerTerms === "CREDIT") {
      newCashRemaining = parseFloat(netTotal) + parseFloat(currentBalance) - parseFloat(cashReceive);
      //setCashRemaining(parseFloat(netTotal) + parseFloat(currentBalance) - parseFloat(cashReceive));
    }
    setCashRemaining(newCashRemaining);
  }}, [cashReceive,customerTerms, netTotal,currentBalance,customer,cashRemaining]);
  useEffect(() => {
    if ((cashReceivetotal != netTotal) && (customerTerms === 'CREDIT')) {   
      const count = parseFloat(currentBalance) + parseFloat(netTotal) - parseFloat(bankAmount) - parseFloat(cashAmount);
    setCashRemaining(count)
  } else if((cashReceivetotal != netTotal) && (customerTerms === 'CASH')){
   setError("Enter Amount doesn't match Net Total!");
 setCashRemaining(parseFloat(netTotal)-parseFloat(cashReceivetotal));
 console.log(parseFloat(cashReceivetotal)-parseFloat(netTotal));
  }
   else if((cashReceivetotal == netTotal) && (customerTerms === 'CASH'))  {
    setError('');
    setCashRemaining(parseFloat(netTotal)-parseFloat(cashReceivetotal));
    console.log(parseFloat(cashReceivetotal)-parseFloat(netTotal));
  
  
  }
  
}, [cashReceivetotal,customer,customerTerms]);
  const handleCashReceiveChange = (e) => {
    const newCashReceive = parseFloat(e.target.value) || 0;
    setCashReceive(newCashReceive);
  };
 
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
      // fetch('http://localhost:3001/bank')
      // .then(response => response.json())
      // .then(data => setBankOptions(data));
      fetch('http://localhost:3001/customers')
      .then(response => response.json())
      .then(data => setCustomersOptions(data))
      .catch(error => console.error('Error fetching customers:', error));
    }, []);
    const handleInputChange = (e, type) => {
      const value = parseFloat(e.target.value) || 0;
    
      if (type === 'cash') {
        setCashAmount(value);
      } else if (type === 'bank') {
        setBankAmount(value);
      }}
  
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
      setTotals({ subTotal: 0, discountTotal: '', freightTotal: 0, expenseTotal: 0 });
      setSalesman('');
      setSelectedCustomer('');
      setCustomer('');
      setInvoiceNumber('');
      setSalesmenOptions([]);
      setCustomersOptions([]);
      setCurrentBalance('');
      setCashAmount('');
      setBankAmount('');
      setCust_ref('');
      setNetTotal(0);
      setCustomerCode(0);
      setSalesmanCode(0);
      setNewItem({ product_name: '', product_code:'',qty: 0, rate: 0, discount: 0, i_cost: 0, i_retail: 0 ,total:0});
      setSearchTerm('');
      setBank('');
      // setBankOptions([]);
      setError('');
      setCashReceive('');
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
      inv_code:invoiceNumber,
      s_no:1,
      inv_no:invoiceNumber,
      salesman_name:salesman,
      inv_date: currentDate,
      inv_datetime: currentDateTime,
      cust_name:customer,
      cust_code: customerCode,  
      cust_ref: cust_ref,
      salesman_code:salesmanCode,
      bank_name:bank,
      g_discount:totals.discountTotal || 0,
      prv_balance:currentBalance,
      bank_amount: bankAmount ||0,
      bank_cash_amount:cashAmount ||0,
      cash_amount:cashReceive||0,
      //g_amount:netTotal,
      g_amount:totals.subTotal || 0,
      inv_type: inv_type,
      items:items
    };
    saveInvoice(invoiceData);
  localStorage.clear();
  console.log('Invoice Data:'+invoiceData);
 

  };
  // useEffect(() => {
  //   // Check if cashAmount or bankAmount is modified and set the disabled state
  //   if (cashAmount !== 0 || bankAmount !== 0) {
  //     setIsDisabled(true);
  //   } 
  //   else if (cashAmount !== '' || bankAmount !== ''){
  //     setIsDisabled(false);
  //   }
  //   else {
  //     setIsDisabled(false);
  //   }
   
  // }, [cashAmount, bankAmount]);
  
  const handleDelete = (index) => {
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
  const handleModify = () => {

    const inv_type = customerTerms === 'CASH' ? 1 : customerTerms === 'CREDIT' ? 2 : 0;
  

    const invoiceData = {
      inv_code:invoiceNumber,
      inv_no: invoiceNumber,
      items: items, // Include all necessary fields
      // s_no:dummy,
      s_no:1,
      salesman_name:salesman,
      inv_date: currentDate,
      inv_datetime: currentDateTime,
      cust_name:customer,

      cust_code: customerCode,  
      cust_ref: cust_ref,
      salesman_code:salesmanCode,
      bank_name:bank,
      g_discount:totals.discountTotal || 0,
      prv_balance:currentBalance,
      bank_amount: bankAmount ||0,
      bank_cash_amount:cashAmount ||0,
      cash_amount:cashReceive||0,
      // g_amount:netTotal,
      g_amount:totals.subTotal,
      inv_type: inv_type,
    };
    modifyInvoice(invoiceData);
  };
  async function modifyInvoice(formData) {
    try {
      const response = await fetch('http://localhost:3001/modify-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Invoice modified successfully.');
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
      <button className="btn btn-secondary" 
       onClick={fetchPreviousInvoice}
      >
          <i className="bi bi-arrow-left fs-5 fw-bold"></i>
        </button>
        <button className="btn btn-secondary" 
         onClick={fetchForwardInvoice}
        >
          <i className="bi bi-arrow-right fs-5 fw-bold"></i>
        </button>
        <button className="btn btn-dark text-white">Load</button>
        <button className="btn btn-danger">
          <i className="bi bi-list-ol text-white px-2"></i> List
        </button>
        
        <button className="btn dark-blue text-white" onClick={handleModify}>
          <i className="bi bi-pencil-square text-white px-2"></i> Modify
        </button>
        <button className="btn btn-info text-white" onClick={() => window.print()}>
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
  <div className="row mb-3 d-flex gap-2 align-items-center">  {/* Adjusted distance */}
  <div className="col-md-5 d-flex gap-2 align-items-center">
  <label className="text-nowrap bold">INV NO</label>
  <input
    type="text"
    className="form-control mx-6 ms-5"
    value={invoiceNumber}
    onChange={(e) => setInvoiceNumber(e.target.value)}
  />
</div>
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
  <hr className="my-4"/>
  <div className="row mb-3 d-flex gap-2 align-items-center">
     <div className="col-md-5 d-flex gap-2 align-items-center">
          <label className="text-nowrap fw-bold" style={{ minWidth: "100px" }}>Salesman</label>
          <div className="position-relative w-100">

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
    {/* Invoice Date Field */}
    <div className="col-md-5 d-flex gap-2 align-items-center">
      <label className="text-nowrap fw-bold" style={{ minWidth: "100px" }}>Cust Ref</label>
      <input
        type="text"
        className="form-control"
        value={cust_ref}
        onChange={(e)=>setCust_ref(e.target.value)}
        // value={currentDate}
        // onChange={(e) => setCurrentDate(e.target.value)}
      />
    </div>
  </div>
  {/* Row 2 */}
  <div className="row mb-3 d-flex gap-2 align-items-center">  
  <div className="col-md-5 d-flex gap-2 align-items-center">
  <label className="text-nowrap fw-bold" style={{ minWidth: "100px" }}>Customer</label>
  <div className="position-relative w-100">
      <Select
        value={selectedCustomer}
        onChange={handleChange}
        options={options}
        placeholder="Search Customer"
        isClearable
        classNamePrefix="react-select"
           className="color-border"
           styles={customStyles}
      />
    </div>
</div>
    <div className="col-md-5 d-flex gap-2 align-items-center">
      <label className="text-nowrap fw-bold" style={{ minWidth: "100px" }}>Terms</label>
      <div className="position-relative w-100">
          <select className="form-control" value={customerTerms} readOnly> 
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
          <p className="text-muted">Previous Balance: {currentBalance}</p>
        </div>
      )}
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
</div>
<div className="d-flex justify-content-between w-100 px-5 my-5 endSection">
  
  {/* LEFT SECTION */}
  <div className="d-flex my-3 py-3 box align-items-center" style={{ width: "45%", border: "2px solid #98198e", borderRadius: "20px",
     padding: "0 30px" }}>
   

    {/* Bank Name */}
    <div className="d-flex gap-2 align-items-start" style={{flexDirection:"column"}}>
      <label className="text-wrap fw-bold txt-dec" style={{ minWidth: "100px" }}>Bank Name</label>
      <div className="position-relative w-100">
      <Select
        value={bankOptions.find(option => option.value === selectedBank)}
        onChange={handleBankSelectionChange}
        options={bankOptions}
        placeholder="Select Bank"
        classNamePrefix="react-select-bank"
        className='color-border'

        isClearable
      />
        {/* <select
          className="form-control"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
         >
          <option value="MCB">Select Bank</option>
          <option value="MCB">MCB</option>
          <option value="HBL">HBL</option>
          <option value="UBL">UBL</option>
        </select> */}

      </div>
    <div className="row w-100 mt-4">
      <div className="col d-flex gap-4 align-items-center">
        <label className="fw-bold text-nowrap txt-dec" style={{ whiteSpace: "normal" }}>Bank</label>
        <input
          type="number"
          step="0.01"
          min='0'
          className="form-control"
           placeholder="0"
          value={bankAmount }
          onChange={(e) => handleInputChange(e, 'bank')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              document.getElementById('cashInput').focus();
            }
          }}
        />
      </div>

      <div className="col d-flex gap-4 align-items-center">
        <label className="fw-bold txt-dec">Cash</label>
        <input
        step="0.01"
        min='0'
placeholder='0'
          type="number"
          className="form-control"
          id="cashInput"
          value={cashAmount}
          onChange={(e) => handleInputChange(e, 'cash')}
        />
      </div>
    </div>
    {(cashAmount != 0 || bankAmount !=0) && error && <div style={{ color: 'red' }}>{error}</div>}

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
            <td>
            <input
          type="number"
          // style={{width:'5vw'}}
          // step='2'
          className="form-control"
          min='0'
          placeholder="0"
          value={totals.discountTotal}
          onChange={(e) => setTotals({ ...totals, discountTotal: e.target.value })}

        /></td>
            {/* <td><div className="bold">{totals.discountTotal}</div></td> */}
          </tr>
          {/* <tr>
            <td className="txt-dec">Freight Total:</td>
            <td><div className="bold">{totals.freightTotal}</div></td>
          </tr> */}
          <tr>
            <td className="txt-dec">Expense Total:</td>
            <td><div className="bold">{totals.expenseTotal}</div></td>
          </tr>
          <br/>
          
          <tr style={{ background: "#800080", color: "white" }}>
            <td><strong>Net Total:</strong></td>
            <td ><div><strong>{netTotal}</strong></div></td>
            <br/>
         
          </tr>
          <br/>
          <hr  className='mx-5'/>
          
          <div className="d-flex mt-4 gap-4 w-100" >
      <div className="col-6 d-flex gap-4 align-items-center w-50">
        <label className="fw-bold  txt-dec">Cash Received</label>
        <input
          type="number"
          step='2'
          className="form-control "
          placeholder="0"
           value={cashReceive}
           id="mycash"

          onChange={handleCashReceiveChange}
           disabled={cashAmount != 0 || bankAmount != 0} 
          // disabled={isDisabled}
          
        />
      </div>

      <div className="col-6 d-flex gap-2 align-items-center w-50">
        <label className="fw-bold txt-dec">Remaining Balance</label>
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
    <br/>
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
