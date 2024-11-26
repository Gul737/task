import React, { useState,useEffect,useRef } from 'react';
import Select from "react-select";
import { useLocation } from 'react-router-dom';
import './form.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sanscript from '@indic-transliteration/sanscript';
import { useNavigate } from 'react-router-dom';


import { FaSave, FaPlus, FaPencilAlt } from 'react-icons/fa';
const NewProduct = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
  const [productCodeM, setProductCodeM] = useState(location.state?.productCodeM || 0);
  // const { productCodeM } = location.state || {}; 
   var imageSrc
  //alert(productCodeM)
    const [inputText, setInputText] = useState('');
    const binLocationRef = useRef(null);
    const handleChangeLang = (e) => {
      const romanToUrduMap = {
      "a": "ا",
    "aa": "آ",
    "b": "ب",
    "c": "ک",
    "d": "د",
    "dd": "ڈ",
    "e": "ے",
    "f": "ف",
    "g": "گ",
    "gh": "غ",
    "h": "ہ",
    "i": "ی",
    "j": "ج",
    "jj": "چ",
    "k": "ک",
    "kh": "خ",
    "l": "ل",
    "m": "م",
    "n": "ن",
    "ng": "ں",
    "o": "و",
    "p": "پ",
    "q": "ق",
    "r": "ر",
    "rr": "ڑ",
    "s": "س",
    "sh": "ش",
    "t": "ت",
    "tt": "ٹ",
    "u": "و",
    "v": "و",
    "w": "و",
    "x": "کس",
    "y": "ی",
    "z": "ز",
    "zh": "ژ",
    "ai": "ع",
    "ain": "ع",
    "th": "ث",
    "sw": "ص",
    "zw": "ض",
    "tth": "ط",
    "zth": "ظ",
      };
  
      const romanToUrdu = (romanText) => {
          return romanText
              .split('')
              .map(char => romanToUrduMap[char.toLowerCase()] || char)
              .join('');
      };
  
      const romanText = e.target.value;
      const urduText = romanToUrdu(romanText);
      setInputText(urduText);
      setFormData((prevState) => ({
        ...prevState,
        urdu_desc: urduText,
      }));
  };
  
  
    //const [ imageData, setimageData] = useState(0);
    const [binLocations, setBinLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [itemTypes, setItemTypes] = useState([]);
    const [productGroups, setProductGroups] = useState([]);
    const [uoms, setUoms] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [productCode, setProductCode] = useState(0); 
 
    const [barCode,setBarCode] = useState(""); 
    const [selectedBranchName, setSelectedBranchName] = useState("");
const [selectedBranchCode, setSelectedBranchCode] = useState("");  
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
      if (productCodeM && productCodeM !== 0) {
        setProductCode(productCodeM)
        setBarCode(productCodeM)
        fetch(`http://localhost:3001/api/get-product-by-code/${productCodeM}`)
          .then(response => response.json())
          .then(data => {
            console.log("Fetched Product Data:", data);
            if (data && data.length > 0) {
              const product = data[0]; 
              setFormData({
                product_code: product.product_code,
                product_desc: product.product_desc,
                barcode: product.barcode,
                make: product.make,
                design_model: product.design_model,
                 bin_location: product.bin_location,
               //binLocations:product.bin_location,
                category_code: product.category_code,
                sub_category: product.sub_category,
                group_code: product.group_code,
                uom: product.uom,
                retail: product.retail,
                cost: product.cost,
                qty_inhand: product.qty_inhand,
                case_qty: product.case_qty,
                sale_tax: product.sale_tax,
                item_disc: product.item_disc,
                branch_id: product.branch_id,
                joining_date: new Date(product.joining_date), 
                retail_min: product.retail_min,
                retail_max: product.retail_max,
                urdu_desc: product.urdu_desc,
                branch_id:product.branch_id
              });
              setInputText(product.urdu_desc);
// //const bufferData = JSON.stringify(product.picture)
// if (product.picture!=0) {
//   //alert("Image URL:"+ JSON.stringify(product.picture))
//   const bufferData = JSON.stringify(product.picture); // Parse buffer data

//   const blob = new Blob([new Uint8Array(bufferData)], { type: 'image/jpeg' }); // Adjust MIME type if needed
//   const imageUrl = URL.createObjectURL(blob); // Create object URL
//   setSelectedImage(imageUrl); // Set image URL in state
//   //console.log("Image URL:", imageUrl);
//   // alert("Image URL:", imageUrl)
// }

              setProductCode(product.product_code)
              setBarCode(product.barcode)
            } else {
              console.log("No product found with the provided product code");
            }
          })
          .catch(error => console.error("Error fetching product data:", error));
      }
    }, [productCodeM]); 
    useEffect(() => {
      if (productCodeM === 0){
      fetch("http://localhost:3001/api/get-max-product-code")
        .then(response => {
          console.log("Max Product Code Raw Response:", response);
          return response.json();
        })
        .then(data => {
          console.log("Max Product Code Parsed:", data);
          setProductCode(data.maxCode ? data.maxCode + 1 : 1);
          setBarCode(data.maxCode ? data.maxCode + 1 : 1);
        })
        .catch(error => console.error("Error fetching max product code:", error));
    
      // Fetch Bin Locations
     
        
      }}, []);
   
// }}, [productCodeM]);
useEffect(()=>{ fetch("http://localhost:3001/api/get-bin-locations")
  .then(response => {
    console.log("Bin Locations Raw Response:", response);
    return response.json();
  })
  .then(data => {
    console.log("Bin Locations Parsed:", data);
    setBinLocations(data);
  })
  .catch(error => console.error("Error fetching bin locations:", error));

// Fetch Categories
fetch("http://localhost:3001/api/get-categories")
  .then(response => {
    console.log("Categories Raw Response:", response);
    return response.json();
  })
  .then(data => {
    console.log("Categories Parsed:", data);
    setCategories(data);
  })
  .catch(error => console.error("Error fetching categories:", error));

// Fetch Item Types
fetch("http://localhost:3001/api/get-item-types")
  .then(response => {
    console.log("Item Types Raw Response:", response);
    return response.json();
  })
  .then(data => {
    console.log("Item Types Parsed:", data);
    setItemTypes(data);
  })
  .catch(error => console.error("Error fetching item types:", error));

// Fetch Product Groups
fetch("http://localhost:3001/api/get-product-groups")
  .then(response => {
    console.log("Product Groups Raw Response:", response);
    return response.json();
  })
  .then(data => {
    console.log("Product Groups Parsed:", data);
    setProductGroups(data);
  })
  .catch(error => console.error("Error fetching product groups:", error));

// Fetch UOMs
fetch("http://localhost:3001/api/get-uoms")
  .then(response => {
    console.log("UOMs Raw Response:", response);
    return response.json();
  })
  .then(data => {
    console.log("UOMs Parsed:", data);
    setUoms(data);
  })
  .catch(error => console.error("Error fetching UOMs:", error));

  fetch("http://localhost:3001/branch_info")
  .then(response => {
    console.log("Branch Info Raw Response:", response);
    return response.json();
  })
  .then(data => {
    console.log("Branch Info Parsed:", data);
    setBranches(data); // Store data in state
  })
  .catch(error => console.error("Error fetching branch info:", error));},[])
    // Handle image upload
    const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setSelectedImage(reader.result); // Set the base64 data URL
        };
  
        reader.readAsDataURL(file); // Convert the image file to base64
      }
    };
   
    const handleSave = async () => {
      //alert(selectedImage)
      let  imageData=null;
      if (selectedImage) {
      
        //setimageData(selectedImage.split(",")[1]);
       
        imageData = selectedImage.split(",")[1]; // Get the base64 data (remove the header)
      }
      try {
        const response = await fetch("http://localhost:3001/api/save-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Indicate that you're sending JSON
          },
          body: JSON.stringify({
            ...formData,   
            // branch_id: selectedBranchCode,
            product_code: productCode, // Send the product code
            // barcode:productCode,
            barcode:productCode.toString(),
            picture: imageData, 
          
          }),
        });
    
  
        if (response.ok) {
          alert("Product saved successfully!");
          setProductCodeM(0);
          window.location.reload();
        } else {
           alert("Error saving Product.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while saving the Product.");
      }
    };
    const handleUpdate = async () => {
      //const imageData=null;
      try {
        const response = await fetch(`http://localhost:3001/api/update-product/${productCode}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            //picture: imageData, 
          }),
        });
    
        if (response.ok) {
          setProductCodeM(0);
          alert("Product updated successfully!");
         
          // window.location.reload();
          navigate(`/list`); 
          
        } else {
          alert("Error updating product.");
        }
      } catch (error) {
        console.error("Error:", error);
        //setProductCodeM(0);
        alert("An error occurred while updating the product.");
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
      const [formData, setFormData] = useState({
        product_code: productCode,
        product_desc: '',
        // barcode: barCode,
        barcode:productCode.toString(),
        make: '',
        design_model: '',
        bin_location: '',
        category_code: 0,
        sub_category: '',
        group_code: 0,
        uom: '',

        retail: 0,
        cost: 0,
        qty_inhand: 0,
        case_qty: 1,
        sale_tax: 0,
        item_disc: 0,
        branch_id: '000',
        joining_date: new Date(),
        retail_min: 0,
        retail_max: 0,
        urdu_desc: '',
      });
      
      const handleSelectChange = (name, selectedOption) => {
        setFormData((prevData) => ({
          ...prevData,
          [name]: selectedOption.value,
        }));
      };
      
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
 
  return (
    
<div>
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
              // value="98"
              value={productCode}
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
                type="number"
                id="barcode"
                name="barcode"
                className="form-control  bg-yellow border border-white"
                min="0"
                // value="98"
                value={barCode}
                readOnly
           
              />
            </div>
          </div>
  
          {/* Urdu Description */}
          <div className="row mb-3">
            <label className="col-3 col-form-label  "></label>
            <div className="col-9">
               <input
            type="text"
            id="urduDescription"
            className="form-control border border-white urdu-description"
            style={{ direction: 'rtl', fontFamily: 'Noto Nastaliq Urdu, serif' }}
            value={inputText}
            onChange={handleChangeLang}
            lang="ur"
            placeholder="اردو میں ٹائپ کریں"
            
          />
            </div>
          </div>
  
          {/* Product Name */}
          <div className="row mb-3">
            <label htmlFor="product_desc" className="col-3 col-form-label  ">
              Product Name:
            </label>
            <div className="col-9">

           
              <input type="text" id="product_desc" name="product_desc" className="form-control border border-white"   
              value={formData.product_desc} onChange={handleInputChange}

              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.querySelector('[name="make"]').focus(); // Move to Design Model field
                }
              }}
               />
            </div>
          </div>
  
          {/* Make */}
          <div className="row mb-3">
            <label htmlFor="make" className="col-3 col-form-label  ">
              Make:
            </label>
            <div className="col-9">
              <input type="text" id="make" name="make" className="form-control border border-white" 
            
              value={formData.make} onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.querySelector('[name="design_model"]').focus(); // Move to Design Model field
                }
              }}
              />
            </div>
          </div>
  
          {/* Design Model */}
          <div className="row mb-3">
            <label htmlFor="design_model" className="col-3 col-form-label  ">
              Design Model:
            </label>
            <div className="col-9">
              <input type="text" id="design_model" name="design_model" className="form-control border border-white"
              value={formData.design_model} onChange={handleInputChange}

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  binLocationRef.current.focus(); // Move to Bin Location dropdown
                }
              }}

              />
            </div>
          </div>
          <div className="row mb-3">
  <label htmlFor="binLocation" className="col-3 col-form-label">
    Bin Location:
  </label>
  <div className="col-9">
    <Select
  //  value={binLocations.find(option => option.bin_name === formData.bin_location) || { value:  formData.bin_location , label:  formData.bin_location }}
      
  value={ {value:  formData.bin_location , label:  formData.bin_location }}
      
   id="binLocation"
      options={(binLocations || []).map(option => ({
        value: option.bin_name,
        label: option.bin_name,
      }))}
      onChange={(selectedOption) => handleSelectChange('bin_location', selectedOption)}
      styles={customStyles}
      placeholder="Select Bin Location"
      ref={binLocationRef}
    />
  </div>
</div>

<div className="row mb-3">
  <label htmlFor="category" className="col-3 col-form-label">
    Category:
  </label>
  <div className="col-9">
    <Select
      id="category"
      options={(categories || []).map(option => ({
        value: option.category_code,
        label: option.category_name,
      }))}
      onChange={(selectedOption) => handleSelectChange('category_code', selectedOption)}
      styles={customStyles}
      placeholder="Select Category"
      value={
        categories
          .filter((option) => option.category_code === formData.category_code)
          .map((option) => ({
            value: option.category_code,
            label: option.category_name,
          }))[0]
      }
    />
  </div>
</div>

<div className="row mb-3">
  <label htmlFor="itemType" className="col-3 col-form-label">
    Item Type:
  </label>
  <div className="col-9">
    <Select
      id="itemType"
      options={(itemTypes || []).map(option => ({
        value: option.sub_cate_name,
        label: option.sub_cate_name,
      }))}
      
      // options={(itemTypes || []).map(option => ({
      //   value: option.value || option.id,
      //   label: option.name || option.label,
      // }))}
      onChange={(selectedOption) => handleSelectChange('sub_category', selectedOption)}
      styles={customStyles}
      placeholder="Select Item Type"
      value={ {value:  formData.sub_category , label:  formData.sub_category }}
    />
  </div>
</div>

<div className="row mb-3">
  <label htmlFor="productGroup" className="col-3 col-form-label">
    Product Group:
  </label>
  <div className="col-9">
    <Select
      id="productGroup"
      options={(productGroups || []).map(option => ({
        value: option.group_code,
        label: option.group_name,
      }))}
      onChange={(selectedOption) => handleSelectChange('group_code', selectedOption)}
      styles={customStyles}
      placeholder="Select Product Group"
      value={
        productGroups
          .filter((option) => option.group_code === formData.group_code)
          .map((option) => ({
            value: option.group_code,
            label: option.group_name,
          }))[0]
      }
    />
  </div>
</div>

<div className="row mb-3">
  <label htmlFor="uom" className="col-3 col-form-label">
    UOM:
  </label>
  <div className="col-9">
    <Select
      id="uom"
      options={(uoms || []).map(option => ({
        value: option.uom_name,
        label: option.uom_name,
      }))}
      onChange={(selectedOption) => handleSelectChange('uom', selectedOption)}
      styles={customStyles}
      placeholder="Select UOM"
      value={ {value:  formData.uom , label:  formData.uom }}
    />
  </div>
</div>    </div>
  
  
             <div className="col-md-6">
             <div className="row mb-3">
      {/* <div className="col-12 text-end">
        <label htmlFor="imageUpload" className="custom-upload-button">
          {selectedImage ? (
            <img
              src={selectedImage}
          
              alt="Selected"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                cursor: 'pointer',
              }}
            />
          ) : (
            ""
          )}
        </label>
        <input
          type="file"
          id="imageUpload"
          onChange={handleImageChange}
          style={{
            display: 'none', // Hide the default input file element
          }}
        />
      </div> */}
      <div className="col-12 text-center">
  <label htmlFor="imageUpload" className="custom-upload-button">
    {selectedImage ? (
      <img
        src={selectedImage}
        alt="Selected"
        style={{
          maxWidth: '70vw', // Responsive width
          maxHeight: '25vh', // Responsive height
          objectFit: 'contain',
          cursor: 'pointer',
          display: 'block', // Ensure proper centering
          margin: '0 auto', // Center the image horizontally
        }}
      />
    ) : (
   ""
    )}
  </label>
  <input
    type="file"
    id="imageUpload"
    onChange={handleImageChange}
    style={{
      display: 'none', // Hide the default input file element
    }}
  />
</div>

      </div>
  
          {/* First Row: Tax Code and Sale Tax */}
          <div className="row">
            <div className="col-6 form-group-row">
              <label htmlFor="tax_code" className="form-label">
                Tax Code:
              </label>
              <input type="number" id="tax_code" name="tax_code" className="form-control border border-white" min="0" placeholder="0"  
              value={formData.tax_code} onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.querySelector('[name="sale_tax"]').focus(); // Move to Design Model field
                }
              }}
              />
            </div>
            <div className="col-6 form-group-row">
              <label htmlFor="sale_tax" className="form-label">
                Sale Tax:
              </label>
              <input type="number" id="sale_tax" name="sale_tax" className="form-control border border-white" min="0" placeholder="0" 
              value={formData.sale_tax} onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.querySelector('[name="case_qty"]').focus(); // Move to Design Model field
                }
              }}
              />
            </div>
          </div>
  
          {/* Second Row: Pack Qty and Disc (%) */}
          <div className="row">
            <div className="col-6 form-group-row">
              <label htmlFor="case_qty" className="form-label">
                Pack Qty:
              </label>
              <input type="number" id="case_qty" name="case_qty" className="form-control border border-white" placeholder="1" min="0"
              value={formData.case_qty} onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.querySelector('[name="item_disc"]').focus(); // Move to Design Model field
                }
              }}
              />
            </div>
            <div className="col-6 form-group-row">
              <label htmlFor="item_disc" className="form-label">
                Disc (%):
              </label>
              <input type="number" id="item_disc" name="item_disc" className="form-control border border-white" placeholder="0" min="0"
              value={formData.item_disc} onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.querySelector('[name="cost"]').focus(); // Move to Design Model field
                }
              }}
              />
            </div>
          </div>
  
          {/* Third Row: Cost and Retail */}
          <div className="row">
            <div className="col-6 form-group-row form-group-row">
              <label htmlFor="cost" className="form-label">
                Cost:
              </label>
              <input type="number" id="cost" name="cost" className="form-control border border-white" placeholder="0" min="0" 
              value={formData.cost} onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.querySelector('[name="retail"]').focus(); // Move to Design Model field
                }
              }}
              />
            </div>
            <div className="col-6 form-group-row">
              <label htmlFor="retail" className="form-label">
                Retail:
              </label>
              <input type="number" id="retail" name="retail" className="form-control border border-white"  placeholder="0" min="0"
              value={formData.retail} onChange={handleInputChange}
              
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.querySelector('[name="wrate"]').focus(); // Move to Design Model field
                }
              }}
              />
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
              <label htmlFor="wrate" className="form-label">
                W.Rate
              </label>
              <input type="number" id="wrate" name="wrate" className="form-control border border-white" placeholder="0" min="0" />
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
              <label htmlFor="retail_min" className="form-label">
              Min R Level:
              </label>
              <input
                type="number"
                id="retail_min"
                name="retail_min"
                className="form-control border border-white bg-warning text-white"
                placeholder="0"
                min="0"
                value={formData.retail_min} onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    document.querySelector('[name="retail_max"]').focus(); 
                  }
                }}
              />
            </div>
            <div className="col-6 form-group-row">
              <label htmlFor="retail_max" className="form-label">
                Max R Level:
              </label>
              <input
                type="number"
                id="retail_max"
                name="retail_max"
                className="form-control border border-white  text-white bg-warning"
                placeholder="0"
                
             min="0"
              value={formData.retail_max} onChange={handleInputChange}
              />
            </div>
          </div>
  
  
          {/* Final Row: Open Qty */}
          <div className="d-flex justify-content-end align-items-end py-5">
          <div className="py-4 px-4" style={{padding:"0 30px",width:"80%",
            background: '#F5F5F5',}}>
          <div className="row">
          <div style={{ display: 'flex', alignItems: 'center', background: '#F5F5F5', padding: '5px 10px' }}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="eeee, MMMM d, yyyy" // Day, Month Date, Year
          customInput={<CustomInput dateText={formattedDate} 
          
          
          />}
        />
      </div>
      </div>
           <div className="row mt-4">
          
            <div className="form-group-row ">
              <label htmlFor="branches" className="form-label">
                Branch Code:
              </label>
        

              <Select
              //value={ {value:  formData.branch_id , label:  ''}}
      
              id="branches"
              options={(branches || []).map(option => ({
                value: option.branch_code, // The unique code for the branch
                label: option.branch_name, // The name displayed in the dropdown
              }))}
                 onChange={(selectedOption) => handleSelectChange('branch_id', selectedOption)}
                 styles={customStyles}
  placeholder="Select Branch"
   className="dropdown" 
   value={
    branches 
      .filter((option) => option.branch_code === formData.branch_id)
      .map((option) => ({
        value: option.branch_code,
        label: option.branch_name,
      }))[0]
  }
  //             value={formData.branch_id} 
              
              // onChange={handleInputChange}
            
/>

              {/* <Select
                id="branchCode"
                placeholder="Select Branch"
                className="dropdown"
              /> */}
            </div>
          </div>
          <div className="row ">
          <div className="form-group-row">
            <label htmlFor="qty_inhand" className="col-form-label  ">
              Open Qty:
            </label>
         
              <input type="number" id="qty_inhand" name="qty_inhand" className="form-control border border-black" 
              value={formData.qty_inhand} onChange={handleInputChange}
              />
         
            </div>
          </div>
          </div>
          </div>
          </div>
          </div>
        </form>
        </div>
        </div>
        <div className="form-actions bg-white mt-2 fixed-bottom">
        <button className="btn btn-success text-white" onClick={handleSave} >Save </button>
                  
                  <button className="btn btn-secondary" onClick={handleUpdate}>Edit</button>
                      {/* <button className="btn btn-success text-white" onClick={handleSave} ><FaSave  size="29"/> </button>
                  
                      <button className="btn btn-secondary" onClick={handleUpdate}><FaPencilAlt  size="29"/></button> */}
           



                      {/* <button className="btn btn-warning"><FaPlus  size="29" /></button> */}
                  </div>
  
                  </div>
  )
}

export default NewProduct;
