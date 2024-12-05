import React, { useState, useEffect} from 'react';
import './App.css';
import Select from 'react-select';
function Select_Employee() {
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
    const [selectedTab, setSelectedTab] = useState("Sale Rights");
    const [checkboxData, setCheckboxData] = useState({
      "Sale Rights": [
        { name: "Sale", checked: false },
        { name: "Sale Modify", checked: false },
        { name: "Sale Return", checked: false },
        { name: "Sale Return Modify", checked: false },
        { name: "Modify Sale Invoice Current Date Only", checked: false },
        { name: "Change Invoice Date", checked: false },
        { name: "Make Credit Sale", checked: false },
         { name: "Quotation", checked: false },
         { name: "Quotation Modify", checked: false },
         { name: "Allow Quotation verify", checked: false },
         { name: "Invoice Receving", checked: false },

      ],
      "Purchase Rights": [
        { name: "Purchase", checked: false },
        { name: "Purchase Modify", checked: false },
        { name: "Change Purchase Date", checked: false },
        { name: "Purchase Return", checked: false },
        { name: "Purchase Return Modify", checked: false },
     
      ],
      "Voucher Rights": [
        { name: "Cash R vouchers", checked: false },
        { name: "Cash R vouchers M", checked: false },
        { name: "Change Date In Cash Rec", checked: false },
        { name: "Modify  Cash Receive Current Date Only", checked: false },
        { name: "Cash P vouchers", checked: false },
        { name: "Cash P vouchers M", checked: false },
        { name: "Change Date In Cash Pay", checked: false },
        { name: "Modify  Cash Pay Current Date Only", checked: false },
        { name: "Expense", checked: false },
        { name: "Expense Modify", checked: false },
        { name: "Change Date In Expence Voucher", checked: false },
     
     
      ],
      "Bank Rights": [
        { name: "Bank", checked: false },
        { name: "Bank R vouchers", checked: false },
        { name: "Bank R vouchers M", checked: false },
        { name: "Change Date In Bank Rec", checked: false },
        { name: "Modify  Bank Receive Current Date Only", checked: false },
        { name: "Bank P vouchers", checked: false },
        { name: "Bank P vouchers M", checked: false },
        { name: "Change Date In Bank Pay", checked: false },
        { name: "Modify  Bank Pay Current Date Only", checked: false },
     
      ],
      "JV Rights": [
        { name: "JV", checked: false },
        { name: "JV Modify", checked: false },
     
      ],
      "Stock Rights": [
        { name: "Item", checked: false },
        { name: "Item Modify", checked: false },
        { name: "Item List", checked: false },
        { name: "Costing", checked: false },
        { name: "Slips", checked: false },
        { name: "Slips Modify", checked: false },
        { name: "Verify Transfer Slips", checked: false },
        { name: "Adjustment", checked: false },
     
      ],
      "Cheque Rights": [
        { name: "Allow Cheque Manager", checked: false },
        { name: "Allow Cheque Pay", checked: false },
        { name: "Allow Cheque receive", checked: false },
    
     
      ],
      "AC Receivable / Payable": [
        { name: "Customer", checked: false },
        { name: "Customer Modify", checked: false },
        { name: "Customer List", checked: false },
        { name: "Supplier", checked: false },
        { name: "Supplier Modify", checked: false },
        { name: "Supplier List", checked: false },
     
     
      ],
      
  "New Rights": [  // Add the new rights here
    { name: "CRM", checked: false },
    { name: "Reports", checked: false },
    { name: "Accounts", checked: false },
    { name: "Purchase Order", checked: false },
    { name: "Purchase Order Modify", checked: false },
    { name: "View Others Accounts Group", checked: false },
    { name: "View Expense Group", checked: false },
    { name: "View Other Branches", checked: false },
    { name: "Fund Transfer", checked: false },
    { name: "Fund Transfer Verify", checked: false },
    { name: "Employee Group PO", checked: false },

  
  
  ]
    });
  
    const tabs = [
      "Sale Rights",
      "Purchase Rights",
      "Voucher Rights",
      "Bank Rights",
      "JV Rights",
      "Stock Rights",
      "Cheque Rights",
      "AC Receivable / Payable",
    ];
  
    const handleCheckboxChange = (tab, name, checked) => {
      setCheckboxData((prev) => ({
        ...prev,
        [tab]: prev[tab].map((item) =>
          item.name === name ? { ...item, checked } : item
        ),
      }));
    };
  
   
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
  
    // Fetch employee data from backend
    useEffect(() => {
      fetch("http://localhost:3001/get-employees")
        .then((response) => response.json())
        .then((data) => {
          const options = data.map((employee) => ({
            value: employee.emp_code,
            label: employee.emp_name,
          }));
          setEmployees(options);
        })
        .catch((error) => console.error("Error fetching employees:", error));
    }, []);
  
    const handleEmployeeChange = (selectedOption) => {
      setSelectedEmployee(selectedOption);
      console.log("Selected Employee:", selectedOption);
      // Update logic here based on selected employee
    };

const backendToCheckboxMap = {
    sale: "Sale",
    sale_modify: "Sale Modify",
    sale_return: "Sale Return",
    sale_return_modify: "Sale Return Modify",
    cr_date_only: "Modify Sale Invoice Current Date Only",
    chng_inv_date: "Change Invoice Date",
    credit_inv: "Make Credit Sale",
    quotation: "Quotation",
    quotation_m: "Quotation Modify",
    qt_verify: "Allow Quotation verify",
    inv_receiving: "Invoice Receving",

    purchase: "Purchase",
    purchase_modify: "Purchase Modify",
    pur_date: "Change Purchase Date",
    purchase_return: "Purchase Return",
    purchase_return_modify: "Purchase Return Modify",

    voucher: "Cash R vouchers",
    pay_vouchers_m: "Cash R vouchers M",
    chng_date_cr: "Change Date In Cash Rec",
    md_cr_cr_day: "Modify Cash Receive Current Date Only",
    chng_date_pay: "Cash P vouchers",
    md_pay_cr_day: "Cash P vouchers M",
    expence: "Expense",
    exp_modify: "Expense Modify",
    chng_date_exp: "Change Date In Expence Voucher",

    bank: "Bank",
    bank_rec: "Bank R vouchers",
    bank_rec_m: "Bank R vouchers M",
    chng_date_bcr: "Change Date In Bank Rec",
    md_bcr_cr_day: "Modify Bank Receive Current Date Only",
    bank_pay: "Bank P vouchers",
    bank_pay_m: "Bank P vouchers M",
    chng_date_bpay: "Change Date In Bank Pay",
    md_bpay_cr_day: "Modify Bank Pay Current Date Only",

    jv: "JV",
    jv_modify: "JV Modify",

    item: "Item",
    item_modify: "Item Modify",
    item_list: "Item List",
    cost: "Costing",
    slip: "Slips",
    slip_modify: "Slips Modify",
     rd_slip_verify: "Verify Transfer Slips",
    adjustment: "Adjustment",

     chq_manger: "Allow Cheque Manager",
    chq_pay: "Allow Cheque Pay",
    chq_rec: "Allow Cheque receive",

    customer: "Customer",
    cust_modify: "Customer Modify",
    customer_list: "Customer List",
    suplier: "Supplier",
    supp_modify: "Supplier Modify",
    supplier_list: "Supplier List",

    crm: "CRM",
    reports: "Reports",
    accounts: "Accounts",
    po: "Purchase Order",
    po_m: "Purchase Order Modify",
    view_others_accounts_group: "View Others Accounts Group",
     view_exp: "View Expense Group",
    view_other_branches: "View Other Branches",
    fund_transfer: "Fund Transfer",
    fund_transfer_verify: "Fund Transfer Verify",
    emp_grp: "Employee Group PO"
};

const fetchEmployeeRights = (emp_code) => {
  fetch(`http://localhost:3001/get-rights/${emp_code}`)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        console.log("Fetched data keys:", Object.keys(data[0])); // Debug fetched keys

        // Create a new state object for checkboxes
        const updatedCheckboxData = { ...checkboxData };

        // Loop through each key in the fetched data
        Object.keys(backendToCheckboxMap).forEach((key) => {
          const checkboxKey = backendToCheckboxMap[key];

          // Find the corresponding rights section
          for (const tab in updatedCheckboxData) {
            updatedCheckboxData[tab].forEach((item) => {
              if (item.name === checkboxKey) {
                item.checked = data[0][key] === 1; // Set to true if value is 1
              }
            });
          }
        });

        setCheckboxData(updatedCheckboxData);
      } else {
        console.error("Unexpected data format:", data);
      }
    })
    .catch((error) => console.error("Error fetching rights:", error));
};


// const fetchEmployeeRights = (emp_code) => {
//   fetch(`http://localhost:3001/get-rights/${emp_code}`)
//     .then((response) => response.json())
//     .then((data) => {
//       if (Array.isArray(data) && data.length > 0) {
//         console.log("Fetched data keys:", Object.keys(data[0])); // Debug fetched keys

//         // Create a new state object for checkboxes
//         const updatedCheckboxData = { ...checkboxData };

//         // Loop through each key in the fetched data
//         Object.keys(backendToCheckboxMap).forEach((key) => {
//           const checkboxKey = backendToCheckboxMap[key];
//           if (checkboxKey) {
//             // Check if the fetched data contains this key and set `checked` based on its value
//             updatedCheckboxData["Sale Rights"].forEach((item) => {
//               if (item.name === checkboxKey) {
//                 item.checked = data[0][key] === 1; // Set to true if value is 1
//               }
//             });
//           }
//         });

      
//         setCheckboxData(updatedCheckboxData);
//       } else {
//         console.error("Unexpected data format:", data);
//       }
//     })
//     .catch((error) => console.error("Error fetching rights:", error));
// };
useEffect(() => {
    if (selectedEmployee) {
        fetchEmployeeRights(selectedEmployee.value); 
    }
}, [selectedEmployee]);

const handleUpdate = async () => {
  if (!selectedEmployee) {
    alert('Please select an employee.');
    return;
  }

  const emp_code = selectedEmployee.value;

  const formData = {
    salesman_code: emp_code,
    sale: checkboxData["Sale Rights"][0].checked ? 1 : 0,
    sale_modify: checkboxData["Sale Rights"][1].checked ? 1 : 0,
    sale_return: checkboxData["Sale Rights"][2].checked ? 1 : 0,
    sale_return_modify: checkboxData["Sale Rights"][3].checked ? 1 : 0,
    cr_date_only: checkboxData["Sale Rights"][4].checked ? 1 : 0,
    chng_inv_date: checkboxData["Sale Rights"][5].checked ? 1 : 0,
    credit_inv: checkboxData["Sale Rights"][6].checked ? 1 : 0,
    quotation: checkboxData["Sale Rights"][7].checked ? 1 : 0,
    quotation_m: checkboxData["Sale Rights"][8].checked ? 1 : 0,
    qt_verify: checkboxData["Sale Rights"][9].checked ? 1 : 0,
    inv_receiving: checkboxData["Sale Rights"][10].checked ? 1 : 0,

    purchase: checkboxData["Purchase Rights"][0].checked ? 1 : 0,
    purchase_modify: checkboxData["Purchase Rights"][1].checked ? 1 : 0,
    pur_date: checkboxData["Purchase Rights"][2].checked ? 1 : 0,
    purchase_return: checkboxData["Purchase Rights"][3].checked ? 1 : 0,
    purchase_return_modify: checkboxData["Purchase Rights"][4].checked ? 1 : 0,

    voucher: checkboxData["Voucher Rights"][0].checked ? 1 : 0,
    pay_vouchers_m: checkboxData["Voucher Rights"][1].checked ? 1 : 0,
    chng_date_cr: checkboxData["Voucher Rights"][2].checked ? 1 : 0,
    md_cr_cr_day: checkboxData["Voucher Rights"][3].checked ? 1 : 0,
    chng_date_pay: checkboxData["Voucher Rights"][4].checked ? 1 : 0,
    md_pay_cr_day: checkboxData["Voucher Rights"][5].checked ? 1 : 0,
    expence: checkboxData["Voucher Rights"][6].checked ? 1 : 0,
    exp_modify: checkboxData["Voucher Rights"][7].checked ? 1 : 0,
    chng_date_exp: checkboxData["Voucher Rights"][8].checked ? 1 : 0,
  
    bank: checkboxData["Bank Rights"][0].checked ? 1 : 0,
    bank_rec: checkboxData["Bank Rights"][1].checked ? 1 : 0,
    bank_rec_m: checkboxData["Bank Rights"][2].checked ? 1 : 0,
    chng_date_bcr: checkboxData["Bank Rights"][3].checked ? 1 : 0,
    md_bcr_cr_day: checkboxData["Bank Rights"][4].checked ? 1 : 0,
    bank_pay: checkboxData["Bank Rights"][5].checked ? 1 : 0,
    bank_pay_m: checkboxData["Bank Rights"][6].checked ? 1 : 0,
    chng_date_bpay: checkboxData["Bank Rights"][7].checked ? 1 : 0,
    md_bpay_cr_day: checkboxData["Bank Rights"][8].checked ? 1 : 0,

    jv: checkboxData["JV Rights"][0].checked ? 1 : 0,
    jv_modify: checkboxData["JV Rights"][1].checked ? 1 : 0,
    item :checkboxData["Stock Rights"][0].checked ? 1 : 0,
    item_modify:checkboxData["Stock Rights"][1].checked ? 1 : 0,
    item_list:checkboxData["Stock Rights"][2].checked ? 1 : 0,
    cost:checkboxData["Stock Rights"][3].checked ? 1 : 0,
    slip:checkboxData["Stock Rights"][4].checked ? 1 : 0,
    slip_modify:checkboxData["Stock Rights"][5].checked ? 1 : 0,
    rd_slip_verify:checkboxData["Stock Rights"][6].checked ? 1 : 0,
    adjustment:checkboxData["Stock Rights"][7].checked ? 1 : 0,

    chq_manger: checkboxData["Cheque Rights"][0].checked ? 1 : 0,
    chq_pay: checkboxData["Cheque Rights"][1].checked ? 1 : 0,
    chq_rec: checkboxData["Cheque Rights"][2].checked ? 1 : 0,

    customer: checkboxData["AC Receivable / Payable"][0].checked ? 1 : 0,
    cust_modify: checkboxData["AC Receivable / Payable"][1].checked ? 1 : 0,
    customer_list: checkboxData["AC Receivable / Payable"][2].checked ? 1 : 0,
    suplier: checkboxData["AC Receivable / Payable"][3].checked ? 1 : 0,
    supp_modify: checkboxData["AC Receivable / Payable"][4].checked ? 1 : 0,
    supplier_list: checkboxData["AC Receivable / Payable"][5].checked ? 1 : 0,

    crm: checkboxData["New Rights"][0].checked ? 1 : 0,
    reports: checkboxData["New Rights"][1].checked ? 1 : 0,
    accounts: checkboxData["New Rights"][2].checked ? 1 : 0,
    po: checkboxData["New Rights"][3].checked ? 1 : 0,
    po_m: checkboxData["New Rights"][4].checked ? 1 : 0,
    //: checkboxData["New Rights"][6].checked ? 1 : 0,
    view_exp : checkboxData["New Rights"][6].checked ? 1 : 0,
    view_other_branches: checkboxData["New Rights"][7].checked ? 1 : 0,
    fund_transfer: checkboxData["New Rights"][8].checked ? 1 : 0,
    fund_transfer_verify: checkboxData["New Rights"][9].checked ? 1 : 0,
    emp_grp: checkboxData["New Rights"][10].checked ? 1 : 0,
   
  };

  console.log("Form Data:", formData);

  try {
    const response = await fetch('http://localhost:3001/save-rights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Rights saved successfully');
    } else {
      alert('Failed to save rights');
    }
  } catch (error) {
    console.error("Error saving rights:", error);
  }
};

      
     
  
    return(
        <div style={{ backgroundColor: "#F5F8F9" }}>
        <h3 style={{ textAlign: "start" }} className='bg-p py-3 px-3 text-white w-100' >User Rights</h3>
        <div style={{ padding: " 0px 20px", backgroundColor: "#F5F8F9" }}>
        <div className='d-flex gap-4 align-items-center my-4 selected-user'>
      <label htmlFor="employee">USER: </label>
      <Select
        id="employee"
        options={employees}
        value={selectedEmployee}
        onChange={handleEmployeeChange}
        placeholder=""
        isSearchable
        className='w-25'
        styles={customStyles}
      />
    </div>
        {/* Tabs */}
        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
          className='w-100'
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              style={{
                // padding: "10px 15px",
                padding: "7px 1PX",
                margin: "5px",
                backgroundColor: selectedTab === tab ? "#98198e" : "#ddd",
                color: selectedTab === tab ? "#fff" : "#000",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                flex: "1 1 auto",
                textAlign: "center",
              }}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
   */}
   <div
  style={{
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "20px",
  }}
  className="w-100"
>
  {tabs.map((tab) => (
    <button
      key={tab}
      style={{
        padding: "7px 15px", // You had a small value for padding, fixed it to be more consistent.
        margin: "5px",
        backgroundColor: selectedTab === tab ? "#800080" : "#ddd",
        color: selectedTab === tab ? "#fff" : "#000",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        flex: "1 1 auto",
        textAlign: "center",
      }}
      onClick={() => setSelectedTab(tab)}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#98198e";
        e.target.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        if (selectedTab !== tab) {
          e.target.style.backgroundColor = "#ddd";
          e.target.style.color = "#000";
        }
      }}
    >
      {tab}
    </button>
  ))}
</div>

        {/* Two Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // gap: "20px",
            alignItems: "center",
          }}
        >
          {/* Card 1: Rights Description */}
          <div
            style={{
              width: "100%",
              maxWidth: "1600px",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* <div
            className='w-100'
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {checkboxData[selectedTab]
                .reduce((rows, item, index) => {
                  const rowIndex = Math.floor(index / 5); // Group by 5 items
                  if (!rows[rowIndex]) {
                    rows[rowIndex] = [];
                  }
                  rows[rowIndex].push(item);
                  return rows;
                }, [])
                .map((column, colIndex) => (
                  <div
                    key={colIndex}
                    style={{ flex: "1 1 20%", maxWidth: "100%" }}
                  >
                    {column.map((item) => (
                      <div key={item.name} style={{ marginBottom: "10px" }}>
                        <label style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(e) =>
                              handleCheckboxChange(selectedTab, item.name, e.target.checked)
                            }
                            style={{ marginRight: "10px" }}
                          />
                          {item.name}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
            </div> */}
            <div
  className="w-100 gap-less"
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "0px",
    justifyContent: "center",
    alignItems: "flex-start",
  }}
>
  {checkboxData[selectedTab]
    .reduce((rows, item, index) => {
      const rowIndex = Math.floor(index / 5); // Group by 5 items
      if (!rows[rowIndex]) {
        rows[rowIndex] = [];
      }
      rows[rowIndex].push(item);
      return rows;
    }, [])
    .map((column, colIndex) => (
      <div key={colIndex} className="column-item">
        {column.map((item) => (
          <div key={item.name} style={{ marginBottom: "3px" }}>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) =>
                  handleCheckboxChange(selectedTab, item.name, e.target.checked)
                }
                style={{ marginRight: "10px" }}
              />
              {item.name}
            </label>
          </div>
        ))}
      </div>
    ))}
</div>

          </div>
  
       
        {/* Card 2: Fix */}
        {/* Card: Custom Layout */}
<div
  style={{
    width: "100%",
    maxWidth: "1600px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  }}
>
<div>
  <div className='d-flex gap-3' style={{ marginBottom: "3px" }}>
    <label >
      <input type="checkbox"  checked={checkboxData["New Rights"][0].checked}  onChange={(e) => handleCheckboxChange("New Rights", "CRM", e.target.checked)}/> CRM
    </label>
    <label>
      <input type="checkbox" checked={checkboxData["New Rights"][1].checked}   onChange={(e) => handleCheckboxChange("New Rights", "Reports", e.target.checked)}/> Reports
    </label>
  </div>


  {/* Other Checkboxes in One Column */}
 
    <label style={{ marginBottom: "3px" }}>
      <input type="checkbox" checked={checkboxData["New Rights"][2].checked}    onChange={(e) => handleCheckboxChange("New Rights", "Accounts", e.target.checked)} /> Accounts
    </label>
    <br />
    <label style={{ marginBottom: "3px" }}>
      <input type="checkbox" checked={checkboxData["New Rights"][3].checked}   onChange={(e) => handleCheckboxChange("New Rights", "Purchase Order", e.target.checked)}/> Purchase Order
    </label>
    <br />
    <label style={{ marginBottom: "3px" }}>
      <input type="checkbox" checked={checkboxData["New Rights"][4].checked}   onChange={(e) => handleCheckboxChange("New Rights", "Purchase Order Modify", e.target.checked)} /> Purchase Order Modify
    </label>
    <br />
    <label style={{ marginBottom: "3px" }}>
      <input type="checkbox" /> View Others Accounts Group
    </label>
    <br />
    <label style={{ marginBottom: "3px" }}>
      <input type="checkbox" checked={checkboxData["New Rights"][6].checked}    onChange={(e) => handleCheckboxChange("New Rights", "View Expense Group", e.target.checked)}  /> View Expense Group
    </label>
    <br />
    <label style={{ marginBottom: "3px" }}>
      <input type="checkbox"  checked={checkboxData["New Rights"][7].checked}
          onChange={(e) => handleCheckboxChange("New Rights", "View Other Branches", e.target.checked)}/> View Other Branch
    </label>
    <br />
    <label style={{ marginBottom: "3px" }}>
      <input type="checkbox"  checked={checkboxData["New Rights"][8].checked}
          onChange={(e) => handleCheckboxChange("New Rights", "Fund Transfer", e.target.checked)}
       /> Fund Transfer
    </label>
 

  {/* Fund Transfer Verify and View Employee Group on Same Line */}
  <div className='d-flex gap-3'>
    <label>
      <input type="checkbox" checked={checkboxData["New Rights"][9].checked}
        onChange={(e) => handleCheckboxChange("New Rights", "Fund Transfer Verify", e.target.checked)}
    /> Fund Transfer Verify
    </label>
    <label>
      <input type="checkbox"   checked={checkboxData["New Rights"][10].checked}
        onChange={(e) => handleCheckboxChange("New Rights", "Employee Group PO", e.target.checked)}
   /> View Employee Group
    </label>
  </div>
  </div>
  {/* Update Button */}
  {/* <div style={{ textAlign: "right", marginTop: "20px" }}>
    <button
      style={{
        padding: "10px 20px",
        // backgroundColor: "#1976d2",
        // color: "#fff",
        border: "none",
        // borderRadius: "5px",
        cursor: "pointer",
      }}
      className='bg-p text-white last-btn'
      onClick={handleUpdate}
    >
      UPDATE
    </button>
  </div> */}
</div>
<div className="form-actions last mt-2 fixed-bottom last-form-action-with-total pt-2">

     <div className="d-flex justify-content-end mb-2 w-25 gap-3 align-items-center ft-btns">
        <button className="btn btn-success  bg-white txt-dec"  onClick={handleUpdate}>UPDATE</button>
                  </div>
                  </div>
</div>

        </div>
     
        
      </div>
    );
}

export default Select_Employee;
