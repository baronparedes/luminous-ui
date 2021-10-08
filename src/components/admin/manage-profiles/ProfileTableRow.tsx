import classNames from 'classnames';
import {useState} from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import {FaCheck, FaTimes} from 'react-icons/fa';

import {AuthProfile, RecordStatus, useUpdateProfileStatus} from '../../../Api';
import {STATUS_COLORS} from '../../../constants';
import {useRootState} from '../../../store';
import ProfileUpdateButton from './ProfileUpdateButton';

const ProfileTableRow: React.FC<{profile: AuthProfile}> = ({profile}) => {
  const {me} = useRootState(state => state.profile);
  const [profileState, setProfileState] = useState<AuthProfile>({...profile});
  const {mutate} = useUpdateProfileStatus({id: profile.id});
  const toggleStatus = (status: RecordStatus) => {
    mutate(undefined, {
      queryParams: {
        status,
      },
    })
      .then(() => setProfileState({...profileState, status}))
      .catch(() => {});
  };

  const handleOnUpdate = (updatedProfile: AuthProfile) =>
    setProfileState({...updatedProfile});

  if (me?.id === profile.id) {
    return null;
  }

  return (
    <tr>
      <td>{profileState.id}</td>
      <td>{profileState.name}</td>
      <td>{profileState.username}</td>
      <td>{profileState.email}</td>
      <td>{profileState.mobileNumber}</td>
      <td>{profileState.type}</td>
      <td
        className={classNames(
          STATUS_COLORS[profileState.status],
          'font-weight-bold'
        )}
      >
        {profileState.status}
      </td>
      <td>
        <ButtonGroup>
          <ProfileUpdateButton
            profile={profileState}
            onUpdate={handleOnUpdate}
          />
          {profileState.status === 'active' && (
            <Button
              aria-label="mark as inactive"
              title="mark as inactive"
              variant="danger"
              size="sm"
              onClick={() => toggleStatus('inactive')}
            >
              <FaTimes />
            </Button>
          )}
          {profileState.status === 'inactive' && (
            <Button
              aria-label="mark as active"
              title="mark as active"
              variant="success"
              size="sm"
              onClick={() => toggleStatus('active')}
            >
              <FaCheck />
            </Button>
          )}
        </ButtonGroup>
      </td>
    </tr>
  );
};

export default ProfileTableRow;
