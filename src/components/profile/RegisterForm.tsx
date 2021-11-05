import {Button, Col, Form, InputGroup} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaEnvelope, FaKey, FaMobile, FaTag, FaUserAlt} from 'react-icons/fa';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';

import routes from '../../@utils/routes';
import {RegisterProfile, useRegister} from '../../Api';
import {useRootState} from '../../store';
import {profileActions} from '../../store/reducers/profile.reducer';
import ButtonLoading from '../@ui/ButtonLoading';
import ErrorInfo from '../@ui/ErrorInfo';
import {getFieldErrorsFromRequest} from '../@validation';

type FormData = RegisterProfile & {confirmPassword: string};

const RegisterForm = () => {
  const initialValue: FormData = {
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    username: '',
  };
  const dispatch = useDispatch();
  const {token} = useRootState(state => state.profile);
  const {loading, error, mutate} = useRegister({});
  const {handleSubmit, control, getValues, formState, reset} =
    useForm<FormData>({defaultValues: initialValue});
  const onSubmit = (formData: FormData) => {
    const body: RegisterProfile = {
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      name: formData.name,
      username: formData.username,
      password: formData.password,
    };
    mutate(body)
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
  const onReset = () => {
    reset(initialValue);
  };
  if (!loading && !error && token) {
    return <Redirect to={routes.ROOT} />;
  }
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} role="form">
        <Col>
          <Controller
            name="name"
            control={control}
            render={({field}) => (
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaTag />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  {...field}
                  disabled={loading}
                  required
                  placeholder="fullname"
                />
              </InputGroup>
            )}
          />
        </Col>
        <Col>
          <Controller
            name="email"
            control={control}
            render={({field}) => (
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaEnvelope />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  {...field}
                  disabled={loading}
                  required
                  type="email"
                  placeholder="email"
                />
              </InputGroup>
            )}
          />
        </Col>
        <Col>
          <Controller
            name="mobileNumber"
            control={control}
            render={({field}) => (
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaMobile />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  {...field}
                  disabled={loading}
                  placeholder="mobile number"
                />
              </InputGroup>
            )}
          />
        </Col>
        <Col>
          <Controller
            name="username"
            control={control}
            render={({field}) => (
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaUserAlt />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  {...field}
                  disabled={loading}
                  required
                  placeholder="username"
                  isInvalid={
                    error !== null &&
                    getFieldErrorsFromRequest(error, 'username') !== undefined
                  }
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {error &&
                    getFieldErrorsFromRequest(error, 'username')?.message}
                </Form.Control.Feedback>
              </InputGroup>
            )}
          />
        </Col>
        <Col>
          <Controller
            name="password"
            control={control}
            render={({field}) => (
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaKey />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  {...field}
                  disabled={loading}
                  required
                  minLength={8}
                  type="password"
                  placeholder="password"
                />
              </InputGroup>
            )}
          />
        </Col>
        <Col>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              validate: value =>
                value === getValues('password') || 'password does not match',
            }}
            render={({field}) => (
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaKey />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  {...field}
                  disabled={loading}
                  required
                  minLength={8}
                  type="password"
                  isInvalid={formState.errors.confirmPassword !== undefined}
                  placeholder="confirm password"
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </InputGroup>
            )}
          />
        </Col>
        {error && (
          <Col>
            <ErrorInfo>unable to register</ErrorInfo>
          </Col>
        )}
        <Col className="text-center mb-2">
          <ButtonLoading
            variant="primary"
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-100"
          >
            Register
          </ButtonLoading>
        </Col>
        <Col className="text-center pb-3">
          <Button
            variant="info"
            disabled={loading}
            className="w-100"
            onClick={onReset}
          >
            Clear
          </Button>
        </Col>
      </Form>
    </>
  );
};

export default RegisterForm;
