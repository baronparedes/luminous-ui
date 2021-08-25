import React from 'react';
import {Container, Nav, Navbar} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';

import routes from '../../@utils/routes';
import NavCurrentProfile from './NavCurrentProfile';

const Navigation: React.FC = () => {
  return (
    <Container>
      <Navbar expand="lg" variant="dark" className="p-0">
        <Navbar.Brand href="#home" className="brand">
          Luminous
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to={routes.DASHBOARD} exact>
              dashboard
            </Nav.Link>
          </Nav>
          <NavCurrentProfile />
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

export default Navigation;
