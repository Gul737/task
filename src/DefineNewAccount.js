import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function DefineNewAccount() {
  const [activeTab, setActiveTab] = useState("NewAccount");

  const renderContent = () => {
    switch (activeTab) {
      case "NewAccount":
        return (
          <div>
            {/* <h4 className="mb-4">New Account Form</h4> */}
            <form className="w-75 pt-3">
              {/* Row 1 */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-2">
                  <label htmlFor="accountCode" className="form-label txt-dec">
                    Account Code:
                  </label>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    id="accountCode"
                    className="form-control "
                    placeholder=" "
                    
                  />
                </div>
                <div className="col-md-1">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="601"
                    min='0'
                  />
                </div>
                <div className="col-md-2">
                  <select className="form-select color-border">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-md-1">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="6"
                    min='0'
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-2">
                  <label htmlFor="accountTitle" className="form-label  txt-dec">
                    Account Title:
                  </label>
                </div>
                <div className="col-md-9">
                  <input
                    type="text"
                    id="accountTitle"
                    className="form-control"
                    placeholder=" "
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-2">
                  <label htmlFor="description" className="form-label  txt-dec">
                    Description:
                  </label>
                </div>
                <div className="col-md-9">
                  <textarea
                    id="description"
                    className="form-control"
                    rows="3"
                    placeholder=" "
                  ></textarea>
                </div>
              </div>

              {/* Row 4 */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-2">
                  <label htmlFor="branchCode" className="form-label  txt-dec">
                    Branch Code:
                  </label>
                </div>
                <div className="col-md-9">
                  <select id="branchCode" className="form-select color-border">
                    <option value="main">Main Branch</option>
                    <option value="branch1">Branch 1</option>
                    <option value="branch2">Branch 2</option>
                  </select>
                </div>
              </div>

            </form>
            <div className="form-actions last mt-2 fixed-bottom last-form-action-with-total justify-content-center bg-p gap-3">
 
        <button className="btn btn-success  bg-white txt-dec" id="save-btn" >SAVE</button>
        <button className="btn btn-success  bg-white txt-dec" id="save-btn" >UPDATE</button>
                  </div>
                
          </div>
        );
      case "AccountList":
        return <div>

<table style={{ width: '70%' }} className="responsive-table table-acc">
          <thead>
            <tr style={{ padding: '10px' }}>
              <th className="p-set" style={{ width: '10%' }}> </th>
              <th className="p-set " style={{ width: '10%', textAlign: 'left' }}>Account Code</th>
              <th className="p-set" style={{ width: '30%' }} >Account Name</th>
              <th className="p-set" style={{ width: '20%' }}>Description</th>
            </tr>
          </thead>
          <br />
          <tbody>
      
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              
              
              </tr>
        
          </tbody>
        </table>
        
        </div>;
      case "Opening":
        return <div>
  <form className="w-50 pt-3">
             
              <div className="row mb-3 align-items-center">
                <div className="col-md-2">
                  <label htmlFor="accountCode" className="form-label  txt-dec">
                    Code:
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    id="accountCode"
                    className="form-control"
                    placeholder=" "
                  />
                </div>
              </div>

              <div className="row mb-3 align-items-center">
                <div className="col-md-2">
                  <label htmlFor="accountAmount" className="form-label  txt-dec">
                    Amount:
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    id="accountAmount"
                    className="form-control"
                    placeholder=" "
                  />
                </div>
              </div>
              
              <div className="row mb-3 align-items-center">
                <div className="col-md-2">
                  <label htmlFor="accountParticular" className="form-label  txt-dec">
                    Particular:
                  </label>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    id="accountParticular"
                    className="form-control"
                    placeholder=" "
                  />
                </div>
              </div>

              <div className="row mb-3 align-items-center">
                <div className="col-md-2">
                 
                </div>
                <div className="col-md-6">
                <div class="d-flex align-items-center gap-4 mt-3">

<div class="form-check">
  <input class="form-check-input custom-radio " type="radio" name="type" id="CR" value="Cr"   
   />
  <label class="form-check-label" for="CR">Cr</label>
</div>
<div class="form-check">
  <input class="form-check-input custom-radio " type="radio" name="type" id="DR" value="Dr"      
  />
  <label class="form-check-label" for="DR">Dr</label>
</div>


</div>
       
                </div>
              </div>
          </form>


        </div>;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      <h3 className="bg-p py-3 px-3 text-white w-100">Define New Accounts</h3>

      <div className="px-5 py-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "NewAccount" ? "active bg-primary text-white" : ""
              }`}
              onClick={() => setActiveTab("NewAccount")}
            >
              New Account
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "AccountList" ? "active bg-primary text-white" : ""
              }`}
              onClick={() => setActiveTab("AccountList")}
            >
              Account List
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "Opening" ? "active bg-primary text-white" : ""
              }`}
              onClick={() => setActiveTab("Opening")}
            >
              Opening
            </button>
          </li>
        </ul>

        <div className="mt-4 pt-4">{renderContent()}</div>
      </div>
    </div>
  );
}

export default DefineNewAccount;
