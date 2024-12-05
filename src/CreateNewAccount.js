import React from "react";
import { useNavigate } from "react-router-dom";

function CreateNewAccount() {
  const navigate = useNavigate();

  const handleRadioChange = (event) => {
    if (event.target.id === "expense1") {
      navigate("/account_detail");
    }
  };

  return (
    <div className="container-fluid ">
      <h3 style={{ textAlign: "start" }} className="bg-p py-3 px-3 text-white w-100">
        Create New Accounts
      </h3>

      {/* Responsive Row */}
      <div className="row gy-4 p-5">
        {/* Left Column */}
        <div className="col-12 col-md-6">
          {/* Expense Accounts */}
          <div className="custom-box">
            <h6 className="custom-box-title">Expense Accounts</h6>
            <div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input custom-radio"
                  name="expenseAccounts"
                  id="expense1"
                  onChange={handleRadioChange} // Add onChange handler
                />
                <label className="form-check-label" htmlFor="expense1">
                  Expense Accounts
                </label>
              </div>
            </div>
          </div>

          {/* Fixed Assets */}
          <div className="custom-box mt-4">
            <h6 className="custom-box-title">Fixed Assets</h6>
            <div>
              {[
                "Buildings",
                "Computer Equipment",
                "Computer Software",
                "Furniture and Fixtures",
                "Land",
                "Machinery",
                "Vehicles",
              ].map((item, index) => (
                <div className="form-check" key={index}>
                  <input
                    type="radio"
                    className="form-check-input custom-radio"
                    name="fixedAssets"
                    id={`fixedAsset-${index}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`fixedAsset-${index}`}
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-12 col-md-6">
          {/* Equity */}
          <div className="custom-box">
            <h6 className="custom-box-title">Equity</h6>
            <div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input custom-radio"
                  name="equity"
                  id="capital"
                />
                <label className="form-check-label" htmlFor="capital">
                  Capital Accounts
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input custom-radio"
                  name="equity"
                  id="drawing"
                />
                <label className="form-check-label" htmlFor="drawing">
                  Drawing Accounts
                </label>
              </div>
            </div>
          </div>

          {/* Current Assets */}
          <div className="custom-box mt-4">
            <h6 className="custom-box-title">Current Assets</h6>
            <div>
              {["Cash Accounts", "Bank Accounts", "Loan Accounts"].map(
                (item, index) => (
                  <div className="form-check" key={index}>
                    <input
                      type="radio"
                      className="form-check-input custom-radio"
                      name="currentAssets"
                      id={`currentAsset-${index}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`currentAsset-${index}`}
                    >
                      {item}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Liabilities */}
          <div className="custom-box mt-4">
            <h6 className="custom-box-title">Liabilities</h6>
            <div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input custom-radio"
                  name="liabilities"
                  id="liability"
                />
                <label className="form-check-label" htmlFor="liability">
                  Employee Salaries
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNewAccount;
