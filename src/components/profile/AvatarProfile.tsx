import {useState} from 'react';
import {Container} from 'react-bootstrap';

import {AuthProfile} from '../../Api';
import Avatar from '../@ui/Avatar';
import ModalContainer from '../@ui/ModalContainer';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateBasicDetailsForm from './UpdateBasicDetailsForm';

const AvatarProfile: React.FC<{profile: AuthProfile}> = ({profile}) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      {profile && (
        <>
          <Avatar onClick={() => setToggle(true)} name={profile.name} />
          <ModalContainer
            header={<h5>Update your profile</h5>}
            toggle={toggle}
            onClose={() => setToggle(false)}
          >
            <Container className="border p-2">
              <UpdateBasicDetailsForm
                profile={profile}
                onUpdate={() => setToggle(false)}
              />
            </Container>
            <Container className="border mt-3 p-2">
              <ChangePasswordForm
                id={profile.id}
                onUpdate={() => setToggle(false)}
              />
            </Container>
          </ModalContainer>
        </>
      )}
    </>
  );
};

export default AvatarProfile;
