import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { FaSave, FaEdit, FaPlus, FaPencilAlt } from 'react-icons/fa';
import './form.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';


const List = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [radioValue, setRadioValue] = useState('online'); // Default to 'online'
    const [data, setData] = useState([]); // Table data
    const [productCode, setProductCode] = useState(''); // Store corresponding product code
    const [selectedProductCode, setSelectedProductCode] = useState(null);
    const navigate = useNavigate();
    // Fetch all data initially
    useEffect(() => {
        fetch('http://localhost:3001/api/get-items') // Adjust API endpoint as needed
            .then((response) => response.json())
            .then((result) => setData(result))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Handle search input change
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Fetch filtered data dynamically based on product_desc
        fetch(`http://localhost:3001/api/search-items?product_desc=${value}`)
            .then((response) => response.json())
            .then((result) => {
                setData(result);
                // Update productCode if results are returned
                if (result.length > 0) {
                    setProductCode(result[0].product_code);
                }
            })
            .catch((error) => console.error('Error searching data:', error));
    };
  //   const handleRowDoubleClick = (productCode) => {
  //     setSelectedProductCode(productCode); // Set selected product code
 
  // };
  const handleRowDoubleClick = (productCodeM) => {
    //alert(productCodeM)
    navigate(`/product`, { state: { productCodeM } }); // Navigate to /product with productCode
};


    return (
        <div className="ap_container">
            <div className="ap_wrap ">
                <div className="container-fluid ">
                    <div className="container-fluid p-3 last top-navbar fixed-top  bg-p " style={{height:"100vw"}}>
                    <div className="container mt-4 p-4">
  <div className="d-flex align-items-center flex-wrap gap-4" >
    {/* Search Input */}
    <h5
      htmlFor="searchBox"
      className="fw-bold  txt-dec"
    //   style={{ minWidth: '80px' }} // Label width
    >
      Search:
    </h5>
    <input
      type="text"
      id="searchBox"
      placeholder="Enter product description..."
      value={searchTerm}
      onChange={handleSearch}
      className="form-control"
      style={{ maxWidth: '300px' }} // Adjust width as needed
    />

    {/* Radio Buttons */}
    <label className="font-weight-bold d-flex align-items-center">
      <input
        type="radio"
        value="online"
        checked={radioValue === 'online'}
        onChange={() => setRadioValue('online')}
        className="mr-2"
      />
      Online
    </label>
    <label className="font-weight-bold d-flex align-items-center">
      <input
        type="radio"
        value="offline"
        checked={radioValue === 'offline'}
        onChange={() => setRadioValue('offline')}
        className="mr-2"
      />
      Offline
    </label>
  </div>
</div>
<div className="container-fluid bg-l2 mt-4 p-4">
<div style={{ overflowX: 'auto'}}>

            {/* Data Table  maxHeight: '500px', overflowY: 'auto' */}
            <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: 'purple', color: 'white', textAlign: 'center'}}  >
                        <th style={{ padding: '20px' }}>Product Code</th>
                        <th style={{ padding: '20px' }}>Barcode</th>
                        <th style={{ padding: '20px',width: '20%',textAlign: 'left'}} >Product Name</th>
                        <th style={{ padding: '20px' }}>اردو تفصیل</th> 
                        <th style={{ padding: '20px' }}>Category</th>
                        <th style={{ padding: '20px' }}>Item Type</th> 
                        <th style={{ padding: '20px' }}>Cost</th>
                        <th style={{ padding: '20px' }}>Retail</th>
                        <th style={{ padding: '20px' }}>Qty</th>
                        <th style={{ padding: '20px' }}>Discount</th>
                        <th style={{ padding: '20px' }}>Group</th>
                        <th style={{ padding: '20px' }}>Branch</th>
                        
                        <th style={{ padding: '20px' }}>Sale Tax</th>
                        {/* <th style={{ padding: '20px' }}>Tax Code</th> */}
                        <th style={{ padding: '20px' }}>Max Retail</th>
                        <th style={{ padding: '20px' }}>Min Retail</th>
                        {/* <th style={{ padding: '20px' }}>Make</th>
                        <th style={{ padding: '20px' }}>Design Model</th>
                        <th style={{ padding: '20px' }}>Bin Location</th> */}
                        <th style={{ padding: '20px' }}>UOM</th>
                        {/* <th style={{ padding: '20px' }}>Date Of Joining</th>
                         */}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}  onDoubleClick={() => handleRowDoubleClick(item.product_code)} // Double-click event
                        style={{ cursor: 'pointer' }}>
                            <td>{item.product_code}</td>
                            <td>{item.barcode}</td>
                            <td style={{textAlign: 'left' }}>{item.product_desc}</td>
                            <td>{item.urdu_desc}</td> 
                            <td>{item.category_code}</td> 
                            <td  style={{textAlign: 'left' }}>{item.sub_category}</td> 
                            <td>{item.cost}</td> 
                            <td>{item.retail}</td> 
                            <td>{item.case_qty}</td> 
                            <td>{item.item_disc}</td> 
                            <td>{item.group_code}</td> 
                            <td>{item.branch_id}</td> 
                            
                            <td>{item.sale_tax}</td> 
                            {/* <td>{item.tax_code}</td>  */}
                            <td>{item.retail_max}</td> 
                            <td>{item.retail_min}</td> 
                            {/* <td>{item.make}</td> 
                            <td>{item.design_model}</td> 
                            <td>{item.bin_location}</td>  */}
                            <td>{item.uom}</td> 
                            {/* <td>{item.joining_date}</td>  */}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* {productCode && <p>Selected Product Code: {productCode}</p>} */}

</div>
        </div>
        </div>
                </div>
            </div>
        </div>
        
    );
};

export default List;
