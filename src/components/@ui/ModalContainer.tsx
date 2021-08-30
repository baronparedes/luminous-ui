import React from 'react';
import {Modal} from 'react-bootstrap';

export type ModalProps = {
  header?: React.ReactNode;
  modalsize?: 'sm' | 'lg' | 'xl';
};

type Props = {
  toggle?: boolean;
  onClose?: () => void;
};

const ModalContainer: React.FC<Props & ModalProps> = props => {
  return (
    <Modal show={props.toggle} onHide={props.onClose} size={props.modalsize}>
      <Modal.Header closeButton>
        <Modal.Title>{props.header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
};

export default ModalContainer;
