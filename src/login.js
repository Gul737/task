import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaUser, FaLock, FaCodeBranch } from 'react-icons/fa';
import Cookies from 'js-cookie';

const LoginForm = () => {
    const [loginName, setLoginName] = useState('');
    const [password, setPassword] = useState('');
    const [employeeNames, setEmployeeNames] = useState([]);
    const [branchCode, setBranchCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
let selectedCodeG ;
    useEffect(() => {
    
        const fetchEmployeeNames = async () => {
            const response = await fetch('http://localhost:3001/branch_info');
            const data = await response.json();
            setEmployeeNames(data);
        };
        fetchEmployeeNames();
    }, []);
  

    const handleBranchChange = (e) => {
        // const selectedCode = e.target.value;
        // setBranchCode(selectedCode);
        // Cookies.set('branchCode', selectedCode); // Store branch_code in the cookies
        // console.log(selectedCode);
         const selectedCode = e.target.value;
         selectedCodeG=selectedCode;
        setBranchCode(selectedCode);
        //Cookies.set('branchCode', selectedCode)
        Cookies.set('branchCode', selectedCode, { path: '/' , sameSite: 'None', secure: true  });
        console.log("Hey i am in cookie login"+  Cookies.set('branchCode', selectedCode));
    
        // Send branch code to the server to save in the session
    //     fetch('http://localhost:3001/set-branch', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ branch_code: selectedCode }),
    //         credentials: 'include', // Include cookies in the request
    //     })
        
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.success) {
    //             console.log("Branch code saved in session.");
    //         }
    //     })
    //     .catch(error => console.error("Error setting branch code:", error));
     };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!loginName || !password || !branchCode) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                 body: JSON.stringify({ login_name: loginName, password,branch_id:branchCode }),
                //body: JSON.stringify({ login_name: loginName, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                navigate('/home');
            } else {
                setErrorMessage('Invalid username or password or branch id');
            }
        } catch (error) {
            console.error('Fetch error: ', error);
            setErrorMessage('Failed to login. Please try again later.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center login-container pt-5 pb-5">
            <div className="card shadow pl-4 d-flex flex-column align-items-center pb-5" style={{ width: '80%', maxWidth: '900px' }}>
                <img src="/assets/paper-plane.png" alt="no show" style={{ width: "15%" }} className='mt-4 mb-2' />
                <hr/>

                <div className="d-flex row w-100 pt-5 res">
                    <div className="col-md-5 d-flex justify-content-center align-items-center left">
                        <form className="w-100 p-3" onSubmit={handleLogin}>
                            <div className="form-group position-relative mb-3">
                                <FaUser className="position-absolute form-icon" />
                                <input
                                    type="text"
                                    className="form-control px-5"
                                    placeholder="Username"
                                    value={loginName}
                                    onChange={(e) => setLoginName(e.target.value)}
                                />
                            </div>
                            <div className="form-group position-relative mb-3">
                                <FaLock className="position-absolute form-icon" />
                                <input
                                    type="password"
                                    className="form-control px-5"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group position-relative mb-3">
                                <FaCodeBranch className="position-absolute form-icon" />
                                <select
                                    className="form-control px-5"
                                    value={branchCode}
                                    onChange={handleBranchChange}
                                    style={{ borderRadius: '0 0 4px 0' }}
                                >
                                    <option value="">Select Branch</option>
                                    {employeeNames.map((branch, index) => (
                                        <option key={index} value={branch.branch_code}>{branch.branch_name}</option>
                                    ))}
                                </select>
                                <i
                                    className="bi bi-caret-down-fill position-absolute"
                                    style={{
                                        top: '50%',
                                        right: '10px',
                                        transform: 'translateY(-50%)',
                                    }}
                                ></i>
                            </div>

                            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                            <button type="submit" className="btn mt-4 btn-primary last">LOGIN</button>
                        </form>
                    </div>

                    <div className="col-md-5 d-flex justify-content-end align-items-center right">
                        <video
                            style={{ width: '100%', height: 'auto', objectFit: "cover" }}
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/assets/right.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
