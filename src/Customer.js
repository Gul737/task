import React, { useState,useEffect,useRef } from 'react';
import Select from 'react-select';
import { FaSave, FaEdit, FaPlus, FaPencilAlt } from 'react-icons/fa';
import './form.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const Customer = () => {
  const branchCodeRef = useRef(null);
  const [maxCustCode, setMaxCustCode] = useState('');
  const [salesmenOptions, setSalesmenOptions] = useState([]);
  const [branches, setBranches] = useState([]);
const [selectedBranchName, setSelectedBranchName] = useState("");
const [selectedBranchCode, setSelectedBranchCode] = useState("");  
const [selectedSalesman, setSelectedSalesman] = useState(null);
const [areaOptions, setAreaOptions] = useState([  ]);
const [cityOptions, setCityOptions] = useState([

]);
const [countryOptions, setCountryOptions] = useState([

]);
const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const handleBranchChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedBranchName(selectedOption.label); // Store branch name
      setSelectedBranchCode(selectedOption.value); // Store branch code
    } else {
      setSelectedBranchName(""); // Clear selection
      setSelectedBranchCode("");
    }
  };

  //  const salesmanOptions = [{ value: 'admin', label: 'admin' }];
  
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
        const fetchMaxCustCode = async () => {
          try {
            const response = await fetch('http://localhost:3001/max-cust-code');
            const data = await response.json();
            setMaxCustCode(data.maxCustCode);
            setCustomerData((prev) => ({
                ...prev,
                cust_code: data.maxCustCode, // Update cust_code after fetching maxCustCode
              }));
          } catch (error) {
            console.error('Error fetching max cust_code:', error);
          }
        };
    
        fetchMaxCustCode();
      }, []);
      useEffect(() => {
        const fetchDropdownData = async () => {
          try {
            const areaResponse = await fetch('http://localhost:3001/api/areas');
            const cityResponse = await fetch('http://localhost:3001/api/cities');
            const countryResponse = await fetch('http://localhost:3001/api/countries');
            
            const areaData = await areaResponse.json();
            const cityData = await cityResponse.json();
            const countryData = await countryResponse.json();
    
            setAreaOptions(areaData.map(item => ({ value: item.area_name, label: item.area_name })));
            setCityOptions(cityData.map(item => ({ value: item.city_name, label: item.city_name })));
            setCountryOptions(countryData.map(item => ({ value: item.country_name, label: item.country_name })));
          } catch (error) {
            console.error('Error fetching dropdown data:', error);
          }
        };
    
      
        fetchDropdownData();
      }, [maxCustCode]);
      useEffect(() => {
        fetch("http://localhost:3001/branch_info")
          .then(response => response.json())
          .then(data => {
            setBranches(data); // Store fetched branches
          })
          .catch(error => console.error("Error fetching branch info:", error));
      }, []);
      
      const [customerData, setCustomerData] = useState({
        cust_code: 0,
        cust_name: '',
        cust_ph_no: '',
        cust_mob_no: '',
        cust_address1: '',
        cust_address2: '',
        cust_email: '',
        cust_cnic: '',
        cust_area: '',
        cust_city: '',
        cust_country: '',
        remarks: '',
        cust_type: 'WHOLESALE',
        cust_terms: 'CASH',
        cust_disc_per: '',
        price_level: '',
        cust_credit_limit: '',
        cust_credit_days: '',
        branch_id: '',
        salesman_code: '' ||0,
        cust_fax: '',
        cust_cmp_name: '',
        cust_ntn_no: '',
        cust_sales_tax_reg: '',
        cust_current_bal: 0,
        target: 0,
        commission: 0,
        last_inv_type: '',
        cust_dng_type: '',
        cust_joining_date:'',
        search_code:''
      });
      const handleSave = async () => {
        try {
          if (!customerData.cust_name.trim()) {
            alert("Customer name is required.");
            return;
          }
          if (!selectedBranchCode) {
            alert("Please select a branch.");
            return;
          }
          const formattedJoiningDate = selectedDate.toISOString().split('T')[0];
          const response = await fetch('http://localhost:3001/add-customer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
           body: JSON.stringify({
            ...customerData,
            branch_id: selectedBranchCode,
            cust_joining_date: formattedJoiningDate, // Send only the date part
          }),
          });
          if (response.ok) {
            alert('Customer added successfully');
            window.location.reload();
            localStorage.clear();
           setSelectedSalesman('');
            setCustomerData({
                cust_code: maxCustCode, // Retain the fetched cust_code
                cust_name: '',
                cust_ph_no: '',
                cust_mob_no: '',
                cust_address1: '',
                cust_address2: '',
                cust_email: '',
                cust_cnic: '',
                cust_area: '',
                cust_city: '',
                cust_country: '',
                remarks: '',
                cust_type: 'WHOLESALE',
                cust_terms: 'CASH',
                cust_disc_per: '',
                price_level: '',
                cust_credit_limit: '',
                cust_credit_days: '',
                branch_id: '',
                salesman_code: '',
            
                cust_fax: '',
                cust_cmp_name: '',
                cust_ntn_no: '',
                cust_sales_tax_reg: '',
                cust_current_bal: 0,
                target: 0,
                commission: 0,
                last_inv_type: '',
                cust_dng_type: '',
                price_level:'',
                search_code:''

            }
          
          
          );
          } else {
            alert('Error adding customer');
          }
        } catch (error) {
          console.error('Error saving customer:', error);
          alert('Error saving customer');
        }
      };
    const CustomInput = ({ dateText, onClick }) => (
      <button
        type="button"
      
        onClick={onClick}
        style={{
          background: '#F5F5F5',
          border: 'none',
          color: '#333',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        {dateText}
      </button>
      
    );
     // Handle input change for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
     // Handle dropdown or select changes
  const handleSelectChange = (name, option) => {
    setCustomerData((prev) => ({
      ...prev,
      [name]: option ? option.value : '',
    }));
  };
  useEffect(() => {
  const fetchSalesmen = async () => {
    if (!selectedBranchCode) return; // Fetch only if branch_code is set

    try {
      const response = await fetch(`http://localhost:3001/salesmenByBranch?branch_code=${selectedBranchCode}`);
      const data = await response.json();
      const options = data.map((salesman) => ({
        value: salesman.emp_code, // emp_code as value
        label: salesman.emp_name, // emp_name as label
      }));
      setSalesmenOptions(options); // Update options based on branch
    } catch (error) {
      console.error('Error fetching salesmen:', error);
    }
  };

  fetchSalesmen();
}, [selectedBranchCode]); // Re-fetch when branch_code changes


  const handleSalesmanChange = (selectedOption) => {
    setSelectedSalesman(selectedOption);
    setCustomerData((prev) => ({
      ...prev,
      salesman_code: selectedOption ? selectedOption.value : '',
    }));
  };
    return (
        <div className="container-fluid form-container setPurple py-2">
            <div className='container setPurple'>
            <div className="header">
                <h1 className='fw-bold text-white my-4' style={{fontSize:"200%"}}>Accounts Receivable (Customer)</h1>
                <div style={{ display: 'flex', alignItems: 'center', background: '#F5F5F5', padding: '5px 10px', borderRadius: '5px' }}>
      <DatePicker
      
        
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setCustomerData((prev) => ({
            ...prev,
            cust_joining_date: selectedDate.toLocaleDateString('en-CA') // Update cust_joining_date when the date is picked
          }));
        }}
        dateFormat="eeee, MMMM d, yyyy"
        customInput={<CustomInput dateText={formattedDate} onClick={() => setSelectedDate(new Date())} />}
        
        
        
      />
    </div>
            </div>
            <div className="form-body">
            <div className="row gap-5 mt-3">
                {/* <div className="row gap-5 d-flex justify-content-center"> */}
                    {/* Left Column */}
                    <div className="col-md-5">
                        <div className="form-group-row">
                            <label>Code</label>
                            <input type="text" className="form-control border border-white bg-info" value={maxCustCode}  readOnly/>
                            {/* placeholder="401000017" */}
                        </div>
                        <div className="form-group-row">
                            <label>Search</label>
                            <input type="text" className="form-control bg-yellow border border-white"  name="search_code"
                  value={customerData.search_code}
                  onChange={handleInputChange} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent default Enter behavior
                      const nextElement = e.target.closest('.form-group-row')?.nextElementSibling?.querySelector('input');
                      if (nextElement) {
                        nextElement.focus(); // Focus on the next input field
                      }
                    }
                  }}
                  />
                        </div>
                        <div className="form-group-row">
                            <label>Name</label>
                            <input type="text" className="form-control border border-white"  name="cust_name"
                  value={customerData.cust_name}
                  onChange={handleInputChange} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent default Enter behavior
                      const nextElement = e.target.closest('.form-group-row')?.nextElementSibling?.querySelector('input');
                      if (nextElement) {
                        nextElement.focus(); // Focus on the next input field
                      }
                    }
                  }}
                  />
                        </div>
                        <div className="form-group-row">
                            <label>Mobile</label>
                            <input type="text" className="form-control border border-white" name="cust_mob_no"
                  value={customerData.cust_mob_no}
                  onChange={handleInputChange} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent default Enter behavior
                      const nextElement = e.target.closest('.form-group-row')?.nextElementSibling?.querySelector('input');
                      if (nextElement) {
                        nextElement.focus(); // Focus on the next input field
                      }
                    }
                  }}
                  />
                        </div>
                        <div className="form-group-row">
                            <label>Phone No</label>
                            <input type="text" className="form-control border border-white" name="cust_ph_no"
                  value={customerData.cust_ph_no}
                  onChange={handleInputChange} 
                  
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent default Enter behavior
                      const nextElement = e.target.closest('.form-group-row')?.nextElementSibling?.querySelector('input');
                      if (nextElement) {
                        nextElement.focus(); // Focus on the next input field
                      }
                    }
                  }}
                  
                  
                  />
                        </div>
                        <div className="form-group-row">
                            <label>Email</label>
                            <input type="email" className="form-control border border-white" name="cust_email"
                  value={customerData.cust_email}
                  onChange={handleInputChange} 
                  
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent default Enter behavior
                      const nextElement = e.target.closest('.form-group-row')?.nextElementSibling?.querySelector('input');
                      if (nextElement) {
                        nextElement.focus(); // Focus on the next input field
                      }
                    }
                  }}
                  
                  />
                        </div>
                        <div className="form-group-row">
                            <label>Type</label>
                            <Select
  options={[{ value: 'WHOLESALE', label: 'WHOLESALE' }, { value: 'WHOLESALE2', label: 'WHOLESALE2' }]}
  placeholder="WHOLESALE"
  isClearable
  classNamePrefix="react-select"
  className='dropdown border border-white'
  styles={customStyles}
  name="cust_type"
  value={customerData.cust_type ? { value: customerData.cust_type, label: customerData.cust_type } : null}
  onChange={(option) => handleSelectChange('cust_type', option)


  }
/>

                        </div>
                        <div className="form-group-row">
                            <label>Terms</label>
                            <Select
  options={[
    { value: 'CASH', label: 'CASH' },
    { value: 'CREDIT', label: 'CREDIT' },
    { value: 'CASH & CREDIT', label: 'CASH & CREDIT' }
 
  ]}
  placeholder="CASH"
  isClearable
  classNamePrefix="react-select"
  className="dropdown border border-white"
  styles={customStyles}
  name="cust_terms"
  value={
    customerData.cust_terms 
      ? { value: customerData.cust_terms, label: customerData.cust_terms }
      : null
  }
  onChange={(selectedOption) => {
    console.log('Selected Option:', selectedOption);
    handleInputChange({
      target: { name: 'cust_terms', value: selectedOption ? selectedOption.value : '' }
    });
  }}
/>
                        </div>
                        <div className="form-group-row">
                            <label>Disc (%)</label>
                            <input type="number" className="form-control border border-white" placeholder="0" min="0" 
                            name="cust_disc_per"
                            value={customerData.cust_disc_per}
                            onChange={handleInputChange} 
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                document.querySelector('[name="price_level"]').focus(); // Move to P. Level
                              }
                            }}
                            />
                            <label className='ms-2'>P. Level</label>
                            <input type="number" className="form-control border border-white " placeholder="15" min="0"
                            name="price_level"
                            value={customerData.price_level}
                            onChange={handleInputChange} 
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                document.querySelector('[name="cust_credit_limit"]').focus(); // Move to Credit Limit
                              }
                            }}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Credit Limit</label>
                            <input type="number" className="form-control border border-white" placeholder="0" min="0" 
                             onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                document.querySelector('[name="cust_credit_days"]').focus(); // Move to Cr. Days
                              }
                            }}
                            name="cust_credit_limit"
                            value={customerData.cust_credit_limit}
                            onChange={handleInputChange} />
                            <label  className='ms-2'>Cr. Days</label>
                            <input type="number" className="form-control border border-white" placeholder="0" min="0"
                   onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // Focus on the Branch Code Select component using the ref
                      if (branchCodeRef.current) {
                        branchCodeRef.current.focus(); 
                      }
                    }
                  }}        
                  name="cust_credit_days"
                  value={customerData.cust_credit_days}
                            onChange={handleInputChange} />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-5">
                        <div className="form-group-row">
                            <label>Branch Code</label>
                            <Select 
  options={(branches || []).map(branch => ({
    value: branch.branch_code, // The unique branch code
    label: branch.branch_name, // The branch name displayed in the dropdown
  }))}
  
  placeholder="Main Branch"
  isClearable
  classNamePrefix="react-select"
  className="dropdown border border-white"
  styles={customStyles}
  onChange={handleBranchChange} // Event handler for selection
  ref={branchCodeRef}
  required
/>

                        </div>
                        <div className="form-group-row">
                            <label>Salesman</label>
                            <Select
          options={salesmenOptions}
          value={selectedSalesman}
          onChange={handleSalesmanChange}
          placeholder="Select Salesman"
          classNamePrefix="react-select"
          className='dropdown border border-white'
          styles={customStyles}
          isClearable
        />
        
                        </div>
                        <div className="form-group-row">
                            <label>CNIC</label>
                            <input type="text" className="form-control border border-white" 
                              name="cust_cnic"
                              value={customerData.cust_cnic}
                              onChange={handleInputChange}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault(); // Prevent default Enter behavior
                                  const nextElement = e.target.closest('.form-group-row')?.nextElementSibling?.querySelector('input');
                                  if (nextElement) {
                                    nextElement.focus(); // Focus on the next input field
                                  }
                                }
                              }}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Fax No.</label>
                            <input type="text" className="form-control border border-white"
                              name="cust_fax"
                              value={customerData.cust_fax}
                              onChange={handleInputChange}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault(); // Prevent default Enter behavior
                                  const nextElement = e.target.closest('.form-group-row')?.nextElementSibling?.querySelector('input');
                                  if (nextElement) {
                                    nextElement.focus(); // Focus on the next input field
                                  }
                                }
                              }}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Area</label>
                            <Select
                options={areaOptions}
                placeholder="Select Area"
                isClearable
                className="dropdown border border-white"
                value={customerData.cust_area ? { value: customerData.cust_area, label: customerData.cust_area } : null}
                onChange={(option) => handleSelectChange('cust_area', option)}
              />
                        </div>
                        <div className="form-group-row">
                            <label>City</label>
                            <Select
                options={cityOptions}
                placeholder="Select City"
                isClearable
                className="dropdown border border-white"
                value={customerData.cust_city ? { value: customerData.cust_city, label: customerData.cust_city } : null}
                onChange={(option) => handleSelectChange('cust_city', option)}
              />
                        </div>
                        <div className="form-group-row">
                            <label>Country</label>
                            <Select
                options={countryOptions}
                placeholder="Select Country"
                isClearable
                className="dropdown border border-white"
                value={customerData.cust_country ? { value: customerData.cust_country, label: customerData.cust_country } : null}
                onChange={(option) => handleSelectChange('cust_country', option)}
              />
                        </div>
                        <div className="form-group-row">
                            <label>Address 1</label>
                            <input type="text" className="form-control border border-white" 
                            
                            name="cust_address1"
                            value={customerData.cust_address1}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault(); // Prevent default Enter behavior
                                const nextElement = e.target.closest('.form-group-row')?.nextElementSibling?.querySelector('input');
                                if (nextElement) {
                                  nextElement.focus(); // Focus on the next input field
                                }
                              }
                            }}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Address 2</label>
                            <input type="text" className="form-control border border-white" 
                              name="cust_address2"
                              value={customerData.cust_address2}
                              onChange={handleInputChange}
                              
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault(); // Prevent default Enter behavior
                                  const nextElement = e.target.closest('.form-group-row')?.nextElementSibling?.querySelector('input');
                                  if (nextElement) {
                                    nextElement.focus(); // Focus on the next input field
                                  }
                                }
                              }}
                              
                              />
                        </div>
                        <div className="form-group-row">
                            <label>Remarks</label>
                            <input type="text" className="form-control border border-white" 
                              name="remarks"
                              value={customerData.remarks}
                              onChange={handleInputChange}
                           
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
              
            </div></div>
            <div className="form-actions bg-white mt-2">
            <button className="btn btn-success text-white" onClick={handleSave}>Save </button>
            <button className="btn btn-secondary">Edit</button>
                    {/* <button className="btn btn-success text-white" onClick={handleSave}><FaSave  size="29"/> </button>
                    <button className="btn btn-secondary"><FaPencilAlt  size="29"/></button> */}
                    {/* <button className="btn btn-secondary"><FaEdit /></button> */}
                  
                    {/* <button className="btn btn-warning"><FaPlus  size="29" /></button> */}
                </div>
        
        </div>
    );
};

export default Customer;
