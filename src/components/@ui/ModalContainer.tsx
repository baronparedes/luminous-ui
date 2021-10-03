import React from 'react';
import {Modal, ModalProps as RBModalProps} from 'react-bootstrap';

export type ModalProps = RBModalProps & {
  header?: React.ReactNode;
};

type Props = {
  toggle?: boolean;
  onClose?: () => void;
};

const ModalContainer: React.FC<Props & ModalProps> = ({
  header,
  toggle,
  children,
  onClose,
  ...rest
}) => {
  return (
    <Modal {...rest} show={toggle} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default ModalContainer;
