import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './login';
import MyNavBar from './MyNavBar'
import InvoiceForm from './InvoiceForm';
import AddCustomer from './Customer';
import Product from './product';

function App() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<LoginForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<MyNavBar />} /> {/* Redirect to MyNavBar on successful login */}
                <Route path="/invoice" element={<InvoiceForm />} />
                <Route path="/customer" element={<AddCustomer />} />
<Route path="/product" element={<Product />} />

            </Routes>
        </Router>
    );
}

export default App;
