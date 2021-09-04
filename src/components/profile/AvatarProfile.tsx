import {useState} from 'react';
import {Container} from 'react-bootstrap';
import styled from 'styled-components';

import {getInitials} from '../../@utils/strings';
import {AuthProfile} from '../../Api';
import ModalContainer from '../@ui/ModalContainer';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateBasicDetailsForm from './UpdateBasicDetailsForm';

const Avatar = styled('div')`
  border: 1px solid white;
  border-radius: 50%;
  height: var(--avatar-size);
  text-align: center;
  width: var(--avatar-size);
  cursor: pointer;
`;

const Initials = styled('span')`
  font-size: calc(var(--avatar-size) / 2); /* 50% of parent */
  line-height: 1;
  position: relative;
  top: calc(var(--avatar-size) / 4); /* 25% of parent */
`;

const AvatarProfile: React.FC<{profile: AuthProfile}> = ({profile}) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      {profile && (
        <>
          <Avatar className="bg-primary" onClick={() => setToggle(true)}>
            <Initials className="text-white">
              {getInitials(profile.name)}
            </Initials>
          </Avatar>
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
