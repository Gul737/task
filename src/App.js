// // import logo from './logo.svg';
// // import './App.css';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import 'bootstrap-icons/font/bootstrap-icons.css';

// // import { FaUser, FaLock, FaCalendar } from 'react-icons/fa'; // Icons
// import InvoiceForm from './InvoiceForm';

// import LoginForm from './login';
// import home from './home';
// import MyNavbar from './MyNavBar';

// // export default LoginForm;
// function App() {
//   return (
//   <div>
// <LoginForm/>
// {/* <home/> */}
// {/* <MyNavbar/> */}
// {/* <InvoiceForm/> */}
//   </div>
//   );
// }

// export default App;
// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import LoginForm from './login';
// import MyNavBar from './MyNavBar'; // Adjust this if your file name is different
// import InvoiceForm from './InvoiceForm';

// const App = () => {
//   return (
//     <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<LoginForm />} />
//       <Route path="/home" element={<MyNavBar />} />
//       <Route path="/invoice" element={<InvoiceForm />} />
//     </Routes>
//   </BrowserRouter>
//   );
// };

// export default App;
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
