import React, { useEffect } from 'react';
import './App.css';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const MyNavbar = () => {
  useEffect(()=>{
    fetch('http://localhost:3001/set', {
      credentials: 'include' // Ensures cookies are included in the request
  })
      .then(response => response.text())
      .then(data => console.log(data)) // Display response in frontend console
      .catch(error => console.error('Error:', error));
  })
  return (
    <Navbar expand="md" variant="dark" className="px-3 last">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            {/* Definition Dropdown */}
            <NavDropdown title="Definition" id="nav-definition" className="text-white px-4">
              <NavDropdown.Item href="#dummy">Dummy Value</NavDropdown.Item>
            </NavDropdown>

            {/* Sale Dropdown */}
            <NavDropdown title="Sale" id="nav-sale" className="text-white px-4">
              <NavDropdown.Item as={Link} to="/invoice">Sale Invoice</NavDropdown.Item>
              <NavDropdown.Item href="#sale-return">Sale Return</NavDropdown.Item>
              <NavDropdown.Item href="#sale-summary">Sale Summary</NavDropdown.Item>
            </NavDropdown>

            {/* Setup Dropdown */}
            <NavDropdown title="Setup" id="nav-setup" className="text-white px-4">
              <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
