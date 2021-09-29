import {useState} from 'react';
import {Button, ButtonProps} from 'react-bootstrap';

import ConfirmModal from './ConfirmModal';

type Props = {
  onConfirm: () => void;
};

const ConfirmButton: React.FC<Props & ButtonProps> = ({
  children,
  onConfirm,
  ...buttonProps
}) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {children}
        <ConfirmModal
          header={<h5>Confirm</h5>}
          toggle={toggle}
          onClose={() => setToggle(false)}
          onConfirm={onConfirm}
        >
          Do you want to continue?
        </ConfirmModal>
      </Button>
    </>
  );
};

export default ConfirmButton;
