import React, { useState } from 'react';
import Select from 'react-select';
import { FaSave, FaEdit, FaPlus } from 'react-icons/fa';
import './form.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const Customer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    return (
        <div className="container form-container">
            <div className="header">
                <h1 className='fw-bold txt-dec my-4' style={{fontSize:"200%"}}>Accounts Receivable (Customer)</h1>
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
                <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                        <div className="form-group-row">
                            <label>Code</label>
                            <input type="text" className="form-control" placeholder="401000017" />
                        </div>
                        <div className="form-group-row">
                            <label>Search</label>
                            <input type="text" className="form-control" placeholder="Search" />
                        </div>
                        <div className="form-group-row">
                            <label>Name</label>
                            <input type="text" className="form-control" placeholder="Name" />
                        </div>
                        <div className="form-group-row">
                            <label>Mobile</label>
                            <input type="text" className="form-control" placeholder="Mobile" />
                        </div>
                        <div className="form-group-row">
                            <label>Phone No</label>
                            <input type="text" className="form-control" placeholder="Phone No" />
                        </div>
                        <div className="form-group-row">
                            <label>Email</label>
                            <input type="email" className="form-control" placeholder="Email" />
                        </div>
                        <div className="form-group-row">
                            <label>Type</label>
                            <Select
                                options={[{ value: 'WHOLESALE', label: 'WHOLESALE' }]}
                                placeholder="WHOLESALE"
                                isClearable
                                classNamePrefix="react-select"
                                 className='dropdown color-border'
                                 
               styles={customStyles}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Terms</label>
                            <Select
                                options={[{ value: 'CASH & CREDIT', label: 'CASH & CREDIT' }]}
                                placeholder="CASH & CREDIT"
                                isClearable
                                classNamePrefix="react-select"
                                 className='dropdown color-border'
                                 styles={customStyles}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>Disc (%)</label>
                            <input type="number" className="form-control" placeholder="0" />
                            <label className='ms-2'>P. Level</label>
                            <input type="number" className="form-control" placeholder="15" />
                        </div>
                        <div className="form-group-row">
                            <label>Credit Limit</label>
                            <input type="number" className="form-control" placeholder="0" />
                            <label  className='ms-2'>Cr. Days</label>
                            <input type="number" className="form-control" placeholder="0" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                        <div className="form-group-row">
                            <label>Branch Code</label>
                            <Select
                                value={selectedBranch}
                                onChange={handleBranchChange}
                                options={branchOptions}
                                placeholder="Main Branch"
                                isClearable
                                classNamePrefix="react-select"
                                className='dropdown color-border'
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
                                 className='dropdown color-border'
                                 styles={customStyles}
                            />
                        </div>
                        <div className="form-group-row">
                            <label>CNIC</label>
                            <input type="text" className="form-control" placeholder="CNIC" />
                        </div>
                        <div className="form-group-row">
                            <label>Fax No.</label>
                            <input type="text" className="form-control" placeholder="Fax No." />
                        </div>
                        <div className="form-group-row">
                            <label>Area</label>
                            <Select options={[]} placeholder="Select Area" isClearable classNamePrefix="react-select"   styles={customStyles}  className='dropdown color-border' />
                        </div>
                        <div className="form-group-row">
                            <label>City</label>
                            <Select options={[]} placeholder="Select City" isClearable classNamePrefix="react-select"   styles={customStyles}  className='dropdown color-border'/>
                        </div>
                        <div className="form-group-row">
                            <label>Country</label>
                            <Select options={[]} placeholder="Select Country" isClearable classNamePrefix="react-select"   styles={customStyles}  className='dropdown color-border'/>
                        </div>
                        <div className="form-group-row">
                            <label>Address 1</label>
                            <input type="text" className="form-control" placeholder="Address 1" />
                        </div>
                        <div className="form-group-row">
                            <label>Address 2</label>
                            <input type="text" className="form-control" placeholder="Address 2" />
                        </div>
                        <div className="form-group-row">
                            <label>Remarks</label>
                            <input type="text" className="form-control" placeholder="Remarks" />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                    <button className="btn btn-info text-white"><FaSave /> Save</button>
                    <button className="btn btn-secondary"><FaEdit /> Edit</button>
                    <button className="btn btn-success"><FaPlus /> Add</button>
                </div>
            </div>
        </div>
    );
};

export default Customer;
