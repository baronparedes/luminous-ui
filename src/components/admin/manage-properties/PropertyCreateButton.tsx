import {useState} from 'react';
import {Button} from 'react-bootstrap';

import {PropertyAttr, useCreateProperty} from '../../../Api';
import ModalContainer from '../../@ui/ModalContainer';
import PropertyForm from './PropertyForm';

type Props = {
  onCreate?: () => void;
};

const PropertyCreateButton: React.FC<Props> = props => {
  const [toggle, setToggle] = useState(false);
  const {mutate, loading, error} = useCreateProperty({});
  const handleSubmit = (data: PropertyAttr) => {
    mutate(data)
      .then(() => {
        setToggle(false);
        props.onCreate && props.onCreate();
      })
      .catch(() => {});
  };
  return (
    <>
      <Button
        variant="success"
        className="ml-2"
        onClick={() => {
          setToggle(true);
        }}
      >
        create
      </Button>
      <ModalContainer
        header={<h5>New Property</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <PropertyForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error !== null}
        />
      </ModalContainer>
    </>
  );
};

export default PropertyCreateButton;
