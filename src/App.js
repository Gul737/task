import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './login';
import MyNavBar from './MyNavBar'
import InvoiceForm from './InvoiceForm';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<MyNavBar />} /> {/* Redirect to MyNavBar on successful login */}
                <Route path="/invoice" element={<InvoiceForm />} />
            </Routes>
        </Router>
    );
}

export default App;
