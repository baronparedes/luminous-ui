import React from 'react';
import {Modal, ModalProps as RBModalProps} from 'react-bootstrap';

export type ModalProps = Pick<
  RBModalProps,
  'dialogClassName' | 'centered' | 'size'
> & {
  header?: React.ReactNode;
};

type Props = {
  toggle?: boolean;
  onClose?: () => void;
};

const ModalContainer: React.FC<Props & ModalProps> = props => {
  return (
    <Modal
      show={props.toggle}
      onHide={props.onClose}
      size={props.size}
      centered={props.centered}
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
};

export default ModalContainer;
