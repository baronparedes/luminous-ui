import {Button, Col, Form} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';
import styled from 'styled-components';

import routes from '../../@utils/routes';
import {useAuth} from '../../Api';
import {useRootState} from '../../store';
import {profileActions} from '../../store/reducers/profile.reducer';
import ErrorInfo from '../@ui/ErrorInfo';
import FieldContainer from '../@ui/FieldContainer';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';

const LoginContainer = styled(RoundedPanel)`
  max-width: 500px;
  margin-top: 3em;
`;

type FormData = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const {token} = useRootState(state => state.profile);
  const {mutate, loading, error} = useAuth({});
  const {handleSubmit, control} = useForm<FormData>();
  const onSubmit = (formData: FormData) => {
    const bearer = `${formData.username}:${formData.password}`;
    const credentials = Buffer.from(bearer).toString('base64');
    mutate(undefined, {headers: {Authorization: `Basic ${credentials}`}})
      .then(data => {
        if (data) {
          dispatch(
            profileActions.signIn({
              me: data.profile,
              token: data.token,
            })
          );
        }
      })
      .catch(() => {});
  };
  if (token) {
    return <Redirect to={routes.DASHBOARD} />;
  }
  return (
    <LoginContainer className="pt-5 pb-5">
      <h1 className="brand text-center">Luminous</h1>
      <Form onSubmit={handleSubmit(onSubmit)} role="form">
        <FieldContainer as={Col} label="username" controlId="username">
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({field}) => (
              <Form.Control
                {...field}
                disabled={loading}
                required
                placeholder="username"
              />
            )}
          />
        </FieldContainer>
        <FieldContainer as={Col} label="password" controlId="password">
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({field}) => (
              <Form.Control
                {...field}
                disabled={loading}
                required
                type="password"
                placeholder="password"
              />
            )}
          />
        </FieldContainer>
        {error && (
          <Col>
            <ErrorInfo>{`unable to login ${error.data as string}`}</ErrorInfo>
          </Col>
        )}
        <Col className="text-right pb-3">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading && (
              <div className="float-left pr-2">
                <Loading size={12} />
              </div>
            )}
            Sign In
          </Button>
        </Col>
      </Form>
    </LoginContainer>
  );
};

export default LoginForm;
