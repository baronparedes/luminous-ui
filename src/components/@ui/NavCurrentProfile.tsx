import {Button, Navbar} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';

import routes from '../../@utils/routes';
import {useRootState} from '../../store';
import {profileActions} from '../../store/reducers/profile.reducer';
import AvatarProfile from '../profile/AvatarProfile';

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
        <>
          <Navbar.Text className="mr-2">
            <AvatarProfile profile={profile.me} />
          </Navbar.Text>
          <Navbar.Text>
            <Button variant="secondary" onClick={handleOnClick} size="sm">
              Sign Out
            </Button>
          </Navbar.Text>
        </>
      )}
    </>
  );
};

export default NavCurrentProfile;
