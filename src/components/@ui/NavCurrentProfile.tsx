import {Button, Navbar} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';

import routes from '../../@utils/routes';
import {useRootState} from '../../store';
import {profileActions} from '../../store/reducers/profile.reducer';

const NavCurrentProfile = () => {
  const profile = useRootState(state => state.profile);
  const dispatch = useDispatch();
  const handleOnClick = () => {
    dispatch(profileActions.signOut());
  };
  if (profile && !profile.token) {
    return <Redirect to={routes.LOGIN} />;
  }
  return (
    <>
      {profile && profile.me && (
        <Navbar.Text>
          Welcome!
          <span className="pl-2 pr-2 font-weight-bold text-white">
            {profile.me.username}
          </span>
          <Button variant="secondary" onClick={handleOnClick} size="sm">
            Sign Out
          </Button>
        </Navbar.Text>
      )}
    </>
  );
};

export default NavCurrentProfile;
