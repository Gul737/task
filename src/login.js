import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginForm = () => {
    const [loginName, setLoginName] = useState('');
    const [password, setPassword] = useState('');
    const [employeeNames, setEmployeeNames] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeeNames = async () => {
            const response = await fetch('http://localhost:3001/login_info');
            const data = await response.json();
            setEmployeeNames(data.map(employee => employee.emp_name)); // Map employee names
        };
        fetchEmployeeNames();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Frontend validation for empty fields
        if (!loginName || !password || !selectedEmployee) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login_name: loginName, password, selected_employee: selectedEmployee }),
        });

        const data = await response.json();

        if (data.success) {
            navigate('/home');
        } else {
            setErrorMessage('Invalid username, password');
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="card shadow p-4">
                <h3 className="mb-4">Welcome | Ztech</h3>
                <hr />
                <form className="bg p-3 size mt-3" onSubmit={handleLogin}>
                    <div className="form-group position-relative mb-3">
                        <FaUser className="position-absolute form-icon bg" />
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
                    <div className="d-flex align-items-center" style={{ maxWidth: '350px' }}>
                        <i
                            className="bi bi-windows"
                            style={{
                                color: 'rgb(105, 103, 103)',
                                backgroundColor: '#c5c7c9',
                                padding: '10px',
                                borderRadius: '4px 0 0 4px',
                                height: '76px',
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #a19d9d',
                            }}
                        ></i>
                        <div style={{ width: '100%' }}>
                            <div className="position-relative ">
                                <select
                                    className="form-control"
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                    style={{ borderRadius: '0 0 4px 0' }}
                                >
                                    <option value="">Select Salesman</option>
                                    {employeeNames.map((name, index) => (
                                        <option key={index} value={name}>{name}</option>
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
                            <div className="position-relative">
                                <select className="form-control" style={{ borderRadius: '0 4px 0 0' }}>
                                    <option>Monday</option>
                                    <option>Tuesday</option>
                                    <option>Wednesday</option>
                                    <option>Thursday</option>
                                    <option>Friday</option>
                                    <option>Saturday</option>
                                    <option>Sunday</option>
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
                        </div>
                    </div>
                    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                    <button type="submit" className="btn btn-primary mt-4">
                        LOGIN
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
