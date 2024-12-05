import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './login';
import Alllist from './list'
import MyNavBar from './MyNavBar'
import InvoiceForm from './InvoiceForm';
import AddCustomer from './Customer';
import NewP from './NewProduct';
import Receive from './Receive_voucher'
import EmployeeRights from './Select_Employee';
import NewAccount from './CreateNewAccount';
import DefineAccount from './DefineNewAccount';
import TransferSlip from './StockTransferSlip';

function App() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<TransferSlip/>} />
            <Route path="/transfer" element={<TransferSlip/>} />
            <Route path="/account" element={<NewAccount/>} />
            <Route path="/account_detail" element={<DefineAccount/>} />
            <Route path="/user_rights" element={<EmployeeRights/>} />
                {/* <Route path="/" element={<LoginForm />} /> */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<MyNavBar />} /> 
                <Route path="/invoice" element={<InvoiceForm />} />
                <Route path="/customer" element={<AddCustomer />} /> 
                <Route path="/product" element={<NewP />} /> 
                <Route path="/list" element={<Alllist/>}/>
                <Route path="/receive_voucher" element={<Receive/>}/>


            </Routes>
        </Router>
    );
}

export default App;
