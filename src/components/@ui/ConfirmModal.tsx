import React from 'react';
import {Button} from 'react-bootstrap';

import ModalContainer from './ModalContainer';

type ModalContainerProps = React.ComponentProps<typeof ModalContainer>;

type Props = {
  onConfirm: () => void;
  onClose?: () => void;
};

const ModalConfirmActions = ({onConfirm, onClose}: Props) => {
  return (
    <div className="text-right">
      <Button variant="primary" onClick={onConfirm} className="mr-2">
        Continue
      </Button>
      <Button variant="warning" onClick={onClose}>
        Cancel
      </Button>
    </div>
  );
};

const ConfirmModal: React.FC<Props & ModalContainerProps> = ({
  onConfirm,
  children,
  onClose,
  ...modalProps
}) => {
  return (
    <ModalContainer onClose={onClose} {...modalProps}>
      {children}
      <ModalConfirmActions onConfirm={onConfirm} onClose={onClose} />
    </ModalContainer>
  );
};

export default ConfirmModal;
