import React from 'react';
import {Alert} from 'react-bootstrap';

const ErrorInfo: React.FC = props => {
  return (
    <Alert variant="danger" role="error">
      {props.children}
    </Alert>
  );
};

export default ErrorInfo;
