import React, { useState,useEffect } from 'react';
import Select from 'react-select';

import { FaSave, FaEdit, FaPlus, FaPencilAlt } from 'react-icons/fa';
import './form.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const Customer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [maxCustCode, setMaxCustCode] = useState('');

  // Fetch max cust_code when the component mounts


  // Format date to display as "Day, Month Date, Year"
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
    const [selectedSalesman, setSelectedSalesman] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    
    const handleSalesmanChange = (option) => setSelectedSalesman(option);
    const handleBranchChange = (option) => setSelectedBranch(option);
  
    const salesmanOptions = [{ value: 'admin', label: 'admin' }];
    const branchOptions = [{ value: 'Main Branch', label: 'Main Branch' }];
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
    const [areaOptions, setAreaOptions] = useState([
        { value: 'Downtown', label: 'Downtown' },
        { value: 'Uptown', label: 'Uptown' },
      ]);
      const [cityOptions, setCityOptions] = useState([
        { value: 'New York', label: 'New York' },
        { value: 'Los Angeles', label: 'Los Angeles' },
      ]);
      const [countryOptions, setCountryOptions] = useState([
        { value: 'USA', label: 'USA' },
        { value: 'Canada', label: 'Canada' },
      ]);
    
      // States for adding new values
      const [newArea, setNewArea] = useState('');
      const [newCity, setNewCity] = useState('');
      const [newCountry, setNewCountry] = useState('');
    
      // Handle adding new area/city/country
      const handleAddNewValue = (type, value) => {
        if (value.trim() === '') return;
    
        switch (type) {
          case 'area':
            setAreaOptions((prev) => [...prev, { value, label: value }]);
            setCustomerData((prev) => ({ ...prev, cust_area: value }));
            setNewArea('');
            break;
          case 'city':
            setCityOptions((prev) => [...prev, { value, label: value }]);
            setCustomerData((prev) => ({ ...prev, cust_city: value }));
            setNewCity('');
            break;
          case 'country':
            setCountryOptions((prev) => [...prev, { value, label: value }]);
            setCustomerData((prev) => ({ ...prev, cust_country: value }));
            setNewCountry('');
            break;
          default:
            break;
        }
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
        cust_disc_per: 0,
        price_level: 15,
        cust_credit_limit: 0,
        cust_credit_days: 0,
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
        cust_joining_date:''
      });
      const handleSave = async () => {
        try {
          const response = await fetch('http://localhost:3001/add-customer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
          });
          if (response.ok) {
            alert('Customer added successfully');
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
                cust_disc_per: 0,
                price_level: 15,
                cust_credit_limit: 0,
                cust_credit_days: 0,
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
                price_level:0
            });
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

    return (
        <div className="container-fluid form-container setPurple py-2">
            <div className='container setPurple'>
            <div className="header">
                <h1 className='fw-bold text-white my-4' style={{fontSize:"200%"}}>Accounts Receivable (Customer)</h1>
                <div style={{ display: 'flex', alignItems: 'center', background: '#F5F5F5', padding: '5px 10px', borderRadius: '5px' }}>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="eeee, MMMM d, yyyy" // Day, Month Date, Year
        customInput={<CustomInput dateText={formattedDate} 
        
        
        
        />}
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
                            <input type="text" className="form-control bg-yellow border border-white" />
                        </div>
                        <div className="form-group-row">
                            <label>Name</label>
                            <input type="text" className="form-control border border-white"  name="cust_name"
                  value={customerData.cust_name}
                  onChange={handleInputChange} />
                        </div>
                        <div className="form-group-row">
                            <label>Mobile</label>
                            <input type="text" className="form-control border border-white" name="cust_mob_no"
                  value={customerData.cust_mob_no}
                  onChange={handleInputChange} 
                  />
                        </div>
                        <div className="form-group-row">
                            <label>Phone No</label>
                            <input type="text" className="form-control border border-white" name="cust_ph_no"
                  value={customerData.cust_ph_no}
                  onChange={handleInputChange} />
                        </div>
                        <div className="form-group-row">
                            <label>Email</label>
                            <input type="email" className="form-control border border-white" name="cust_email"
                  value={customerData.cust_email}
                  onChange={handleInputChange} />
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

                            {/* <Select
                                options={[{ value: 'WHOLESALE', label: 'WHOLESALE' },{ value: 'WHOLESALE2', label: 'WHOLESALE2' }]} 
                                placeholder="WHOLESALE"
                                isClearable
                                classNamePrefix="react-select"
                                 className='dropdown border border-white'
                                 name="cust_type"
                                 value={customerData.cust_type ? { value: customerData.cust_type, label: customerData.cust_type } : null}
                                 onChange={(option) => handleInputChange(option, { name: 'cust_type' })}
                                 
               styles={customStyles}
                            /> */}
                        </div>
                        <div className="form-group-row">
                            <label>Terms</label>
                            <Select
  options={[
    { value: 'CASH', label: 'CASH' },
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
                            {/* <Select
  options={[
    { value: 'CASH', label: 'CASH' },
    { value: 'CASH & CREDIT', label: 'CASH & CREDIT' }
  ]}
  placeholder="CASH"
  isClearable
  classNamePrefix="react-select"
  className="dropdown border border-white"
  styles={customStyles}
  name="cust_terms"
  value={customerData.cust_terms}
  onChange={(selectedOption) => {
    console.log(selectedOption);
    handleInputChange({ target: { name: 'cust_terms', value: selectedOption ? selectedOption.value : '' } });
//   onChange={(selectedOption) =>
//     handleInputChange({ target: { name: 'cust_terms', value: selectedOption ? selectedOption.value : '' } })
  }}
/> */}

                            {/* <Select
                                options={[{ value: 'CASH', label: 'CASH' },{ value: 'CASH & CREDIT', label: 'CASH & CREDIT' }]}
                                placeholder="CASH"
                                isClearable
                                classNamePrefix="react-select"
                                 className='dropdown border border-white'
                                 styles={customStyles}
                                 name="cust_terms"
                  value={customerData.cust_terms}
                  onChange={handleInputChange} 
                            /> */}
                        </div>
                        <div className="form-group-row">
                            <label>Disc (%)</label>
                            <input type="number" className="form-control border border-white" placeholder="0" min="0" 
                            name="cust_disc_per"
                            value={customerData.cust_disc_per}
                            onChange={handleInputChange} 
                            />
                            <label className='ms-2'>P. Level</label>
                            <input type="number" className="form-control border border-white" placeholder="15" min="0"
                            name="price_level"
                            value={customerData.price_level}
                            onChange={handleInputChange} 
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Credit Limit</label>
                            <input type="number" className="form-control border border-white" placeholder="0" min="0" 
                            name="cust_credit_limit"
                            value={customerData.cust_credit_limit}
                            onChange={handleInputChange} />
                            <label  className='ms-2'>Cr. Days</label>
                            <input type="number" className="form-control border border-white" placeholder="0" min="0"
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
                                value={selectedBranch}
                                onChange={handleBranchChange}
                                options={branchOptions}
                                placeholder="Main Branch"
                                isClearable
                                classNamePrefix="react-select"
                                className='dropdown border border-white'
                                styles={customStyles}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Salesman</label>
                            <Select
                                value={selectedSalesman}
                                onChange={handleSalesmanChange}
                                options={salesmanOptions}
                                placeholder="admin"
                                isClearable
                                classNamePrefix="react-select"
                                 className='dropdown border border-white'
                                 styles={customStyles}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>CNIC</label>
                            <input type="text" className="form-control border border-white" 
                              name="cust_cnic"
                              value={customerData.cust_cnic}
                              onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Fax No.</label>
                            <input type="text" className="form-control border border-white"
                              name="cust_fax"
                              value={customerData.cust_fax}
                              onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Area</label>
                            <Select options={[]} isClearable classNamePrefix="react-select"   styles={customStyles}  className='dropdown border border-white'
                            
                            name="cust_area"
                            value={customerData.cust_area}
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>City</label>
                            <Select options={[]}  isClearable classNamePrefix="react-select"   styles={customStyles}  className='dropdown border border-white'
                              name="cust_city"
                              value={customerData.cust_city}
                              onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Country</label>
                            <Select options={[]}  isClearable classNamePrefix="react-select"   styles={customStyles}  className='dropdown border border-white'
                              name="cust_country"
                              value={customerData.cust_country}
                              onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Address 1</label>
                            <input type="text" className="form-control border border-white" 
                            
                            name="cust_address1"
                            value={customerData.cust_address1}
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Address 2</label>
                            <input type="text" className="form-control border border-white" 
                              name="cust_address2"
                              value={customerData.cust_address2}
                              onChange={handleInputChange}/>
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
              
            </div>
            <div className="form-actions bg-white mt-2">
                    <button className="btn btn-success text-white" onClick={handleSave}><FaSave  size="29"/> </button>
                    {/* <button className="btn btn-secondary"><FaEdit /></button> */}
                    <button className="btn btn-secondary"><FaPencilAlt  size="29"/></button>
                    <button className="btn btn-warning"><FaPlus  size="29" /></button>
                </div>
        </div>
        </div>
    );
};

export default Customer;
