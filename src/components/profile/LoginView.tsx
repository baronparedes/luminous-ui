import {useState} from 'react';
import {Button, Col, Container} from 'react-bootstrap';
import styled from 'styled-components';

import RoundedPanel from '../@ui/RoundedPanel';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const LoginContainer = styled(RoundedPanel)`
  max-width: 500px;
  margin-top: 3em;
`;

const LoginView = () => {
  const [toggleRegisterForm, setToggleRegisterForm] = useState(false);

  return (
    <Container fluid>
      <LoginContainer className="pt-5 pb-5">
        <h1 className="brand text-center">Luminous</h1>
        {!toggleRegisterForm && <LoginForm />}
        {toggleRegisterForm && <RegisterForm />}
        <Col className="text-center">
          {!toggleRegisterForm && <span>Don't have an account?</span>}
          <Button
            variant="link"
            className="ml-1"
            onClick={() => setToggleRegisterForm(!toggleRegisterForm)}
          >
            {!toggleRegisterForm ? 'Register' : 'Back to Login'}
          </Button>
        </Col>
      </LoginContainer>
    </Container>
  );
};

export default LoginView;
