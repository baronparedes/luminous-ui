import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {
  FaCogs,
  FaFileUpload,
  FaHome,
  FaPrint,
  FaStream,
  FaUsers,
} from 'react-icons/fa';
import {RiCommunityLine} from 'react-icons/ri';
import {LinkContainer} from 'react-router-bootstrap';
import {NavLink} from 'react-router-dom';

import routes from '../../@utils/routes';
import {ProfileType} from '../../Api';
import {useRootState} from '../../store';
import NavCurrentProfile from './NavCurrentProfile';

type NavItem = {
  to: string;
  exact?: boolean;
  title?: React.ReactNode;
  isDivider?: boolean;
};

type NavSection = NavItem & {
  id: string;
  navItems?: NavItem[];
};

function buildNavigationSections(profileType: ProfileType) {
  const sections: NavSection[] = [];
  const divider: NavItem = {
    isDivider: true,
    to: 'divider',
  };

  if (['admin', 'stakeholder'].includes(profileType)) {
    sections.push({
      id: 'dashboard-nav-section',
      title: 'dashboard',
      to: routes.DASHBOARD,
      exact: true,
    });
  }

  if (['admin'].includes(profileType)) {
    sections.push({
      id: 'admin-nav-section',
      title: 'admin',
      to: routes.ADMIN,
      navItems: [
        {
          to: routes.ADMIN_PROFILES,
          exact: true,
          title: (
            <>
              <FaUsers className="mr-1" />
              profiles
            </>
          ),
        },
        {
          to: routes.ADMIN_PROPERTIES,
          exact: true,
          title: (
            <>
              <RiCommunityLine className="mr-1" />
              properties
            </>
          ),
        },
        divider,
        {
          to: routes.ADMIN_BATCH_TRANSACTIONS,
          exact: true,
          title: (
            <>
              <FaStream className="mr-1" />
              batch transactions
            </>
          ),
        },
        {
          to: routes.ADMIN_BATCH_PRINT_SOA,
          exact: true,
          title: (
            <>
              <FaPrint className="mr-1" />
              batch print soa
            </>
          ),
        },
        divider,
        {
          to: routes.ADMIN_UPLOAD_WATER_READING,
          exact: true,
          title: (
            <>
              <FaFileUpload className="mr-1" />
              upload water reading
            </>
          ),
        },
        divider,
        {
          to: routes.ADMIN_SETTINGS,
          exact: true,
          title: (
            <>
              <FaCogs className="mr-1" />
              settings
            </>
          ),
        },
      ],
    });
  }

  return sections;
}

const NavigationSection = (props: NavSection) => {
  if (props.navItems && props.navItems.length > 0) {
    return (
      <LinkContainer to={props.to} onClick={e => e.preventDefault()}>
        <NavDropdown title={props.title} id={props.id}>
          {props.navItems.map((nav, i) => {
            if (nav.isDivider) {
              return <NavDropdown.Divider key={i} />;
            }
            return (
              <NavDropdown.Item
                as={NavLink}
                to={nav.to}
                exact={nav.exact}
                key={i}
              >
                {nav.title}
              </NavDropdown.Item>
            );
          })}
        </NavDropdown>
      </LinkContainer>
    );
  }
  return (
    <Nav.Link as={NavLink} to={props.to} exact={props.exact} id={props.id}>
      {props.title}
    </Nav.Link>
  );
};

const Navigation: React.FC = () => {
  const {me} = useRootState(state => state.profile);
  const profileType = me?.type || 'unit owner';
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
            {buildNavigationSections(profileType).map((nav, i) => {
              return <NavigationSection {...nav} key={i} />;
            })}
          </Nav>
          <NavCurrentProfile />
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

export default Navigation;
