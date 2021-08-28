import React from 'react';
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {FaHome, FaUsers} from 'react-icons/fa';
import {LinkContainer} from 'react-router-bootstrap';
import {NavLink} from 'react-router-dom';

import routes from '../../@utils/routes';
import {useRootState} from '../../store';
import NavCurrentProfile from './NavCurrentProfile';

const Navigation: React.FC = () => {
  const {me} = useRootState(state => state.profile);
  return (
    <Container>
      <Navbar expand="lg" variant="dark" className="p-0">
        <Navbar.Brand className="brand">Luminous</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="m-1" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} to={routes.ROOT} exact>
              <FaHome style={{fontSize: '1.75em'}} />
            </Nav.Link>
            <Nav.Link as={NavLink} to={routes.DASHBOARD} exact>
              dashboard
            </Nav.Link>
            {me?.type === 'admin' && (
              <LinkContainer
                to={routes.ADMIN}
                exact
                onClick={e => e.preventDefault()}
              >
                <NavDropdown title="admin" id="admin-nav-dropdown">
                  <NavDropdown.Item
                    as={NavLink}
                    to={routes.ADMIN_PROFILES}
                    exact
                  >
                    <FaUsers className="mr-1" />
                    profiles
                  </NavDropdown.Item>
                </NavDropdown>
              </LinkContainer>
            )}
          </Nav>
          <NavCurrentProfile />
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

export default Navigation;
