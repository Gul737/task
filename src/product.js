import React, { useState } from "react";
import Select from "react-select";
import './form.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSave, FaEdit, FaPlus, FaPencilAlt } from 'react-icons/fa';


const Product = () => {
  const [urduInput, setUrduInput] = useState("");


 

  // Sample options for dropdowns
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());


   // Format date to display as "Day, Month Date, Year"
   const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }}
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
    <div className="container-fluid form-container setPurple py-2">
    <div className='container setPurple'>
    <div className="header">
        <h1 className='fw-bold text-white my-4' style={{fontSize:"200%"}}>Product Defination</h1>
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
      <form className="form-body">
        <div className="row">
          {/* Left Section */}
          <div className="col-md-6">
        <div className="row mb-3">
          <label htmlFor="code" className="col-3 col-form-label  ">
            Code:
          </label>
          <div className="col-9">
            <input
              type="text"
              id="code"
              className="form-control bg-info border border-white"
              value="98"
              readOnly
            
            />
          </div>
        </div>

        {/* Barcode */}
        <div className="row mb-3">
          <label htmlFor="barcode" className="col-3 col-form-label">
            Barcode:
          </label>
          <div className="col-9">
            <input
              type="text"
              id="barcode"
              className="form-control  bg-yellow border border-white"
              value="98"
              readOnly
         
            />
          </div>
        </div>

        {/* Urdu Description */}
        <div className="row mb-3">
          <label   className="col-3 col-form-label  "></label>
          {/* <label
            htmlFor="urduDescription"
            className="col-3 col-form-label  "
            style={{ direction: "rtl" }}
          >
            اردو تفصیل:
          </label> */}
          <div className="col-9">
            <input
              type="text"
              id="urduDescription"
              className="form-control border border-white"
              style={{ direction: "rtl", fontFamily: "Noto Nastaliq Urdu, serif" }}
              value={urduInput}
              onChange={(e) => setUrduInput(e.target.value)}
              placeholder="اردو میں ٹائپ کریں"
            />
          </div>
        </div>

        {/* Product Name */}
        <div className="row mb-3">
          <label htmlFor="productName" className="col-3 col-form-label  ">
            Product Name:
          </label>
          <div className="col-9">
            <input type="text" id="productName" className="form-control border border-white" />
          </div>
        </div>

        {/* Make */}
        <div className="row mb-3">
          <label htmlFor="make" className="col-3 col-form-label  ">
            Make:
          </label>
          <div className="col-9">
            <input type="text" id="make" className="form-control border border-white" />
          </div>
        </div>

        {/* Design Model */}
        <div className="row mb-3">
          <label htmlFor="designModel" className="col-3 col-form-label  ">
            Design Model:
          </label>
          <div className="col-9">
            <input type="text" id="designModel" className="form-control border border-white" />
          </div>
        </div>

        {/* Dropdowns */}
        {[
          { label: "Bin Location", id: "binLocation" },
          { label: "Category", id: "category" },
          { label: "Item Type", id: "itemType" },
          { label: "Product Group", id: "productGroup" },
          { label: "UOM", id: "uom" },
        ].map((dropdown) => (
          <div className="row mb-3" key={dropdown.id}>
            <label htmlFor={dropdown.id} className="col-3 col-form-label  ">
              {dropdown.label}:
            </label>
            <div className="col-9">
              <Select
                id={dropdown.id}
                options={options}
               placeholder="Select an option"
              />
            </div>
          </div>
        ))}
        </div>


         {/* rightside */}
           <div className="col-md-6">
        <div className="row mb-3">
          <div className="col-12 text-end">
            <label htmlFor="imageUpload" className=" custom-upload-button">
              {/* Upload Image */}
            </label>
            <input
              type="file"
              id="imageUpload"
              // className="form-control"
              onChange={handleImageChange}
              style={{
                display: 'none', // Hide the default input file element
              }}
                // style={{
                //     height: "232px",
                //     width: "640px",
                //     border: "1px solid #ccc",
                //     backgroundColor:"#fff"
                //   }}
            />
            {/* {selectedImage && (
              <div className="mt-3">
                <img
                  src={selectedImage}
                  alt="Selected"
                  // style={{
                  //   height: "150px",
                  //   width: "auto",
                  //   border: "1px solid #ccc",
                  // }}
                />
              </div>
            )} */}
          </div>
        </div>

        {/* First Row: Tax Code and Sale Tax */}
        <div className="row">
          <div className="col-6 form-group-row">
            <label htmlFor="taxCode" className="form-label">
              Tax Code:
            </label>
            <Select
              id="taxCode"
              options={options}
              placeholder="Select Tax Code"
               className='border border-white dropdown2'
             
            />
          </div>
          <div className="col-6 form-group-row">
            <label htmlFor="saleTax" className="form-label">
              Sale Tax:
            </label>
            <input type="number" id="saleTax" className="form-control border border-white" min="0" placeholder="0" />
          </div>
        </div>

        {/* Second Row: Pack Qty and Disc (%) */}
        <div className="row">
          <div className="col-6 form-group-row">
            <label htmlFor="packQty" className="form-label">
              Pack Qty:
            </label>
            <input type="number" id="packQty" className="form-control border border-white" placeholder="1" min="0"/>
          </div>
          <div className="col-6 form-group-row">
            <label htmlFor="discount" className="form-label">
              Disc (%):
            </label>
            <input type="number" id="discount" className="form-control border border-white" placeholder="0" min="0"/>
          </div>
        </div>

        {/* Third Row: Cost and Retail */}
        <div className="row">
          <div className="col-6 form-group-row form-group-row">
            <label htmlFor="cost" className="form-label">
              Cost:
            </label>
            <input type="number" id="cost" className="form-control border border-white" placeholder="0" min="0" />
          </div>
          <div className="col-6 form-group-row">
            <label htmlFor="retail" className="form-label">
              Retail:
            </label>
            <input type="number" id="retail" className="form-control border border-white"  placeholder="0" min="0"/>
          </div>
        </div>
        <div className="row">
          <div className="col-6 form-group-row form-group-row">
            {/* <label htmlFor="cost" className="form-label">
              Cost:
            </label> */}
            {/* <input type="number" id="cost" className="form-control" /> */}
          </div>
          <div className="col-6 form-group-row">
            <label htmlFor="rate" className="form-label">
              W.Rate
            </label>
            <input type="number" id="rate" className="form-control border border-white" placeholder="0" min="0" />
          </div>
        </div>
        <div className="row align-items-center py-2  ms-auto me-1 justify-content-center " style={{ backgroundColor: '#0077a3' ,width:"80%"}}>
          
      <div className="col-2" style={{ color: '#ffffff', fontWeight: 'bold' }}>
        Margin
      </div>
      <div className="col-3">
        <input
          type="text"
          className="form-control border border-2 border-white"
          defaultValue="0"
          style={{ backgroundColor: '#004f73', color: '#ffffff', textAlign: 'center' }}
        />
      </div>
      <div className="col-2" style={{ color: '#ffffff', fontWeight: 'bold' }}>
        %
      </div>
      <div className="col-3">
        <input
          type="text"
          className="form-control border border-2 border-white "
          defaultValue="0"
          style={{ backgroundColor: '#004f73', color: '#ffffff', textAlign: 'center' }}
        />
      </div>
    </div>
        {/* Fourth Row: Margin and Max Retail Level */}
        <div className="row mt-3 ">
          <div className="col-6 form-group-row">
            <label htmlFor="minRetail" className="form-label">
            Min R Level:
            </label>
            <input
              type="number"
              id="minRetail"
              className="form-control border border-white bg-warning text-white"
              placeholder="0"
              min="0"
              // style={{ backgroundColor: "#E6F7FF" }}
            />
          </div>
          <div className="col-6 form-group-row">
            <label htmlFor="maxRetail" className="form-label">
              Max R Level:
            </label>
            <input
              type="number"
              id="maxRetail"
              className="form-control border border-white  bg-warning"
              placeholder="0"
           min="0"
            />
          </div>
        </div>

        {/* Current Date with Dropdown */}
        {/* <div className="row mb-3">
          <div className="col-6">
            <label htmlFor="currentDate" className="form-label">
              Current Date:
            </label>
            <input
              type="text"
              id="currentDate"
              className="form-control"
              value={new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              readOnly
              style={{ backgroundColor: "#F5F5F5" }}
            />
          </div>
          <div className="col-6">
            <label htmlFor="branchCode" className="form-label">
              Branch Code:
            </label>
            <Select
              id="branchCode"
              options={options}
              placeholder="Select Branch"
            />
          </div>
        </div> */}

        {/* Final Row: Open Qty */}
        <div className="d-flex justify-content-end align-items-end">
        <div className="py-4 px-4" style={{padding:"0 30px",width:"80%",
          background: '#F5F5F5',}}>
        <div className="row md-2">
        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '5px 10px' }}>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="eeee, MMMM d, yyyy" // Day, Month Date, Year
        customInput={<CustomInput dateText={formattedDate} 
        
        
        />}
      />
    </div>
    </div>
         <div className="row">
        
          <div className="form-group-row ">
            <label htmlFor="branchCode" className="form-label">
              Branch Code:
            </label>
            <Select
              id="branchCode"
              options={options}
              placeholder="Select Branch"
              className="dropdown"
            />
          </div>
        </div>
        <div className="row">
        <div className="form-group-row">
          <label htmlFor="openQty" className="col-form-label  ">
            Open Qty:
          </label>
       
            <input type="number" id="openQty" className="form-control border border-grey" />
       
          </div>
        </div>
        </div>
        </div>
        </div>
        </div>
      </form>
      <div className="form-actions bg-white mt-2">
                    <button className="btn btn-success text-white" ><FaSave  size="29"/> </button>
                    {/* <button className="btn btn-secondary"><FaEdit /></button> */}
                    <button className="btn btn-secondary"><FaPencilAlt  size="29"/></button>
                    <button className="btn btn-warning"><FaPlus  size="29" /></button>
                </div>
    </div>
    </div>
  );
};

export default Product;
