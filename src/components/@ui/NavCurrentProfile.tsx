import {Button, Navbar} from 'react-bootstrap';

const NavCurrentProfile = () => {
  return (
    <>
      <Navbar.Text>
        Welcome!
        <span className="pl-2 pr-2 text-bold text-white">Baron</span>
        <Button variant="secondary">Sign Out</Button>
      </Navbar.Text>
    </>
  );
};

export default NavCurrentProfile;
