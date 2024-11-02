import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaUser, FaLock,FaCodeBranch} from 'react-icons/fa';
import Cookies from 'js-cookie';

const LoginForm = () => {
    const [loginName, setLoginName] = useState('');
    const [password, setPassword] = useState('');
    const [employeeNames, setEmployeeNames] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeeNames = async () => {
            const response = await fetch('http://localhost:3001/branch_info');
            const data = await response.json();
            //setEmployeeNames(data.map(branch_info => branch_info.branch_name)); // Map employee names
            setEmployeeNames(data); 
        };
        fetchEmployeeNames();
    }, []);
    const handleEmployeeChange = (e) => {
        const selectedCode = e.target.value; // branch_code is the value
        setSelectedEmployee(selectedCode);
        Cookies.set('selectedEmployee', selectedCode); // Store branch_code in the cookie
        // Step 2: Fetch the cookie value from the server
        fetch('http://localhost:3001/var', {
            method: 'GET', // or 'POST'
            credentials: 'include' // Send cookies with the request
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the data received from the server
        })
        .catch(error => console.error('Error:', error));
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Frontend validation for empty fields
        if (!loginName || !password || !selectedEmployee) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        try {
            //const selectedEmployee = Cookies.get('selectedEmployee');
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ login_name: loginName, password, selected_employee: selectedEmployee }),
            body: JSON.stringify({ login_name: loginName, password}),
        });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
        const data = await response.json();
        console.log(data);

    if (data.success) {
    //    document.cookie = `selectedEmployee=${selectedEmployee}; path=/; max-age=86400`; // Expires in 1 day
    //const selectedCode = e.target.value;  // branch_code is the value
    //const selectedCode='001';
    // setSelectedEmployee(selectedCode);
    // Cookies.set('selectedEmployee', selectedCode);
    //const cookieValue = Cookies.get('selectedEmployee');
      //  if (cookieValue) {
        //    setSelectedEmployee(cookieValue);
        //}
    //  Cookies.set('selectedEmployee', selectedEmployee);
        // Pass the selected employee to the /home route
         //navigate('/home', { state: { selectedEmployee } });
         navigate('/home');
        //navigate('/invoice',{ state:{selectedEmployee}});
    } else {
        setErrorMessage('Invalid username or password');
    }
} catch (error) {
    console.error('Fetch error: ', error);
    setErrorMessage('Failed to login. Please try again later.');
}
    };
    return (
        <div className="d-flex justify-content-center align-items-center login-container pt-5 pb-5" >
            <div className="card shadow pl-4 d-flex flex-column align-items-center pb-5" style={{ width: '80%', maxWidth: '900px' }}>
                {/* Top Image */}
                <img src="/assets/paper-plane.png" alt="no show" style={{ width: "15%" }} className='mt-4 mb-2' />
                <hr/>

                {/* Form and Video Side-by-Side */}
                <div className="d-flex row  w-100 pt-5 res">
                    {/* Left Side - Form */}
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
                                    value={selectedEmployee}
                                    // onChange={(e) => setSelectedEmployee(e.target.value)}
                                    onChange={handleEmployeeChange}
                                    style={{ borderRadius: '0 0 4px 0' }}
                                >
                                    {/* <option value="">Select Branch Name</option>
                                    {employeeNames.map((code, index) => (
                                        <option key={index} value={code}>{code}</option>
                                    ))} */}
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

                    {/* Right Side - Video */}
                    <div className="col-md-5 d-flex justify-content-end align-items-center right">
                        {/* <video width="70%" height="70%" controls>
                            <source src="/assets/part.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video> */}
                 <video
        style={{ width: '100%', height: 'auto',objectFit:"cover"}}
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
    
//         <div className="login-container d-flex justify-content-center align-items-center">
//             <div className="card shadow p-4 d-flex justify-content-center align-items-center">
//           <img src="/assets/paper-plane.png" alt="no show" style={{width:"20%"}}/>

//                 <hr/>
//                 <form className="bg p-3 size mt-3" onSubmit={handleLogin}>
//                     <div className="form-group position-relative mb-3">
//                         <FaUser className="position-absolute form-icon " />
//                         <input
//                             type="text"
//                             className="form-control px-5"
//                             placeholder="Username"
//                             value={loginName}
//                             onChange={(e) => setLoginName(e.target.value)}
//                         />
//                     </div>
//                     <div className="form-group position-relative mb-3">
//                         <FaLock className="position-absolute form-icon" />
//                         <input
//                             type="password"
//                             className="form-control px-5"
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                     </div>
                  
//      {/* <div className="form-group position-relative mb-3">
//     <FaCodeBranch className="position-absolute form-icon" />
//     <div style={{ width: '100%' }}>
//         <div className="position-relative">
//         <select
//     className="form-control"
//     value={selectedEmployee}
//     onChange={(e) => setSelectedEmployee(e.target.value)}
//     style={{ borderRadius: '0 0 4px 0' }}
// >
//     <option value="">Select Branch Name</option>
//     {employeeNames.map((code, index) => ( 
//         <option key={index} value={code}>{code}</option>
//     ))}
// </select>
//             <i
//                 className="bi bi-caret-down-fill position-absolute"
//                 style={{
//                     top: '50%',
//                     right: '10px',
//                     transform: 'translateY(-50%)',
//                 }}
//             ></i>
//         </div>
//     </div>
// </div> */}
// <div className="form-group position-realtive mb-3">

//             {/* <div style={{ width: '100%' }}> */}
           
//                 <div className="position-relative">
//                 <FaCodeBranch className="position-absolute form-icon" /> 
//                     <select
//                         className="form-control px-5"
//                         value={selectedEmployee}
//                         onChange={(e) => setSelectedEmployee(e.target.value)}
//                         style={{ borderRadius: '0 0 4px 0' }}
//                     >
//                         <option value="">Select Branch Name</option>
//                         {employeeNames.map((code, index) => ( 
//                             <option key={index} value={code}>{code}</option>
//                         ))}
//                     </select>
//                     <i
//                         className="bi bi-caret-down-fill position-absolute"
//                         style={{
//                             top: '50%',
//                             right: '10px',
//                             transform: 'translateY(-50%)',
//                         }}
//                     ></i>
//                 </div>
//             {/* </div> */}
//         </div>

//                     {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
//                     <button type="submit" className="btn mt-4 last btn-primary">
//                         LOGIN
//                     </button>
//                 </form>
//                 <div className="col-md-5 d-flex justify-content-center align-items-center">
//                 <video width="100%" height="auto" controls>
//                     <source src="/assets/part.mp4" type="video/mp4" />
//                     Your browser does not support the video tag.
//                 </video>
//             </div>
//             </div>
//         </div>
        
    );
};

export default LoginForm;
