import {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import {MdGroupAdd} from 'react-icons/md';

import {
  useGetPropertyAssignments,
  useUpdatePropertyAssignments,
} from '../../../Api';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import ProfileSelect, {ProfileSelectItem} from '../../profile/ProfileSelect';
import PropertyAssignmentCard, {
  AssignedProfile,
} from '../../property/PropertyAssignmentCard';

type Props = {
  propertyId: number;
  code: string;
};

const PropertyAssignmentButton: React.FC<Props> = ({propertyId, code}) => {
  const [toggle, setToggle] = useState(false);
  const [assignedProfiles, setAssignedProfiles] = useState<AssignedProfile[]>(
    []
  );
  const {data, loading, refetch} = useGetPropertyAssignments({
    propertyId,
    lazy: true,
  });
  const {mutate} = useUpdatePropertyAssignments({id: propertyId});
  const handleOnUpdate = () => {
    const profileIds = assignedProfiles.map(p => p.profileId);
    mutate(profileIds)
      .then(() => setToggle(false))
      .catch(() => {});
  };
  const handleOnRemove = (profileId: number) => {
    setAssignedProfiles(
      assignedProfiles.filter(p => p.profileId !== profileId)
    );
  };
  const handleOnSelectProfiles = (items: ProfileSelectItem[]) => {
    const newAssignedProfiles = assignedProfiles.concat(
      items
        .filter(
          item => !assignedProfiles.map(ap => ap.profileId).includes(item.id)
        )
        .map(item => {
          const result: AssignedProfile = {
            profileId: item.id,
            name: item.name,
            email: item.email,
            username: item.username,
            mobileNumber: item.mobileNumber,
          };
          return result;
        })
    );
    setAssignedProfiles(newAssignedProfiles);
  };

  useEffect(() => {
    if (data) {
      const result = data.map(pa => {
        const assignedProfile: AssignedProfile = {
          profileId: pa.profileId,
          name: pa.profile?.name || '',
          email: pa.profile?.email || '',
          username: pa.profile?.username || '',
          mobileNumber: pa.profile?.mobileNumber,
        };
        return assignedProfile;
      });
      setAssignedProfiles(result);
    }
  }, [data]);

  return (
    <>
      <Button
        variant="info"
        aria-label="add assignment"
        title="add assignment"
        size="sm"
        onClick={() => {
          refetch().then(() => setToggle(true));
        }}
      >
        <MdGroupAdd />
      </Button>
      <ModalContainer
        header={<h5>Manage assignment for {code}</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        {loading && <Loading />}
        <h5>Profiles assigned to this property</h5>
        <ProfileSelect onSelectProfiles={handleOnSelectProfiles} />
        {assignedProfiles.length > 0 &&
          assignedProfiles.map((profile, i) => {
            return (
              <PropertyAssignmentCard
                {...profile}
                key={i}
                onRemove={handleOnRemove}
              />
            );
          })}
        {assignedProfiles.length === 0 && (
          <div className="text-muted text-center p-2">No Assigned Profiles</div>
        )}
        <div className="text-right">
          <Button variant="primary" onClick={handleOnUpdate}>
            update
          </Button>
        </div>
      </ModalContainer>
    </>
  );
};

export default PropertyAssignmentButton;
