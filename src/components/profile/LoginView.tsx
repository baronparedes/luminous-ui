import {useState} from 'react';
import {Button, Col, Container} from 'react-bootstrap';
import styled from 'styled-components';

import RoundedPanel from '../@ui/RoundedPanel';
import ForgotPasswordForm from './ForgotPasswordForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const LoginContainer = styled(RoundedPanel)`
  max-width: 500px;
  margin-top: 3em;
`;

type FormType = 'login' | 'register' | 'forgot-password';

const LoginView = () => {
  const [formType, setFormType] = useState<FormType>('login');

  return (
    <Container fluid>
      <LoginContainer className="pt-5 pb-5">
        <h1 className="brand text-center">Luminous</h1>
        {formType === 'login' && (
          <>
            <LoginForm />
            <Col className="text-center">
              <span>Don't have a profile?</span>
              <Button variant="link" onClick={() => setFormType('register')}>
                Register
              </Button>
            </Col>
            <Col className="text-center">
              <Button
                variant="link"
                onClick={() => setFormType('forgot-password')}
              >
                Forgot password?
              </Button>
            </Col>
          </>
        )}
        {formType === 'register' && (
          <>
            <RegisterForm />
            <Col className="text-center">
              <Button
                variant="link"
                className="ml-1"
                onClick={() => setFormType('login')}
              >
                Back to Login
              </Button>
            </Col>
          </>
        )}
        {formType === 'forgot-password' && (
          <>
            <ForgotPasswordForm onForgotPassword={() => setFormType('login')} />
            <Col className="text-center">
              <Button
                variant="link"
                className="ml-1"
                onClick={() => setFormType('login')}
              >
                Back to Login
              </Button>
            </Col>
          </>
        )}
      </LoginContainer>
    </Container>
  );
};

export default LoginView;
