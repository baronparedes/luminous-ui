import React from 'react';
import {ColProps, Form} from 'react-bootstrap';

type Props = {
  label?: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  controlId?: string;
};

const FieldContainer: React.FC<Props & ColProps> = props => {
  return (
    <Form.Group {...props}>
      <Form.Label className="text-muted">
        {props.label}
        {!props.label && <span>&nbsp;</span>}
      </Form.Label>
      {!props.label && <br />}
      {props.children}
    </Form.Group>
  );
};

export default FieldContainer;
