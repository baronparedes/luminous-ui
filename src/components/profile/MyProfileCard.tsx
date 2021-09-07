import {Col, Container} from 'react-bootstrap';
import {FaEnvelope, FaMobile, FaUser} from 'react-icons/fa';

import banner from '../../@assets/img/banner.jpg';
import {AuthProfile} from '../../Api';
import Avatar from '../@ui/Avatar';
import RoundedPanel from '../@ui/RoundedPanel';

type Props = {
  profile: AuthProfile;
};

const MyProfileView = ({profile}: Props) => {
  return (
    <>
      <RoundedPanel>
        <div
          style={{
            minHeight: '100px',
            padding: 0,
            margin: 0,
            backgroundImage: `url(${banner})`,
            backgroundSize: '100% 100%',
          }}
        />
        <div style={{marginTop: '-80px'}}>
          <Avatar name={profile.name} avatarSize="8rem" />
        </div>
        <Container className="text-center mb-3">
          <Col>
            <h4>{profile.name}</h4>
          </Col>
          <Col>
            <small>
              <FaUser className="mr-1" />
              {profile.username}
            </small>
          </Col>
          <Col>
            <small>
              <FaEnvelope className="mr-1" />
              {profile.email}
            </small>
          </Col>
          {profile.mobileNumber && (
            <Col>
              <small>
                <FaMobile className="mr-1" />
                {profile.mobileNumber}
              </small>
            </Col>
          )}
        </Container>
      </RoundedPanel>
    </>
  );
};

export default MyProfileView;
