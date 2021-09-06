import {useState} from 'react';
import {Button} from 'react-bootstrap';
import {FaPencilAlt} from 'react-icons/fa';

import {PropertyAttr, useUpdateProperty} from '../../../Api';
import ModalContainer from '../../@ui/ModalContainer';
import PropertyForm from './PropertyForm';

const ProfileUpdateButton: React.FC<{
  value: PropertyAttr;
  onUpdate?: (property: PropertyAttr) => void;
}> = ({value, onUpdate}) => {
  const [toggle, setToggle] = useState(false);
  const {mutate, loading, error} = useUpdateProperty({id: Number(value.id)});
  const handleSubmit = (formData: PropertyAttr) => {
    mutate(formData)
      .then(data => {
        setToggle(false);
        onUpdate && onUpdate(data);
      })
      .catch(() => {});
  };
  return (
    <>
      <Button
        aria-label="update"
        variant="primary"
        size="sm"
        title="update"
        onClick={() => {
          setToggle(true);
        }}
      >
        <FaPencilAlt />
      </Button>
      <ModalContainer
        header={<h5>Update Property</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <PropertyForm
          value={value}
          onSubmit={handleSubmit}
          loading={loading}
          error={error !== null}
        />
      </ModalContainer>
    </>
  );
};

export default ProfileUpdateButton;
