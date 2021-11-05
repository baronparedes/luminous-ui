import {Col, Form, InputGroup} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaEnvelope, FaUserAlt} from 'react-icons/fa';

import ButtonLoading from '../@ui/ButtonLoading';
import ErrorInfo from '../@ui/ErrorInfo';

type FormData = {
  username: string;
  email: string;
};

type Props = {
  onForgotPassword?: () => void;
};

const ForgotPasswordForm = ({onForgotPassword}: Props) => {
  const {handleSubmit, control, reset} = useForm<FormData>({
    defaultValues: {
      email: '',
      username: '',
    },
  });
  const onSubmit = (formData: FormData) => {
    console.log(formData);
    onForgotPassword && onForgotPassword();
    reset();
  };
  const loading = false;
  const error = false;
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} role="form">
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
        {error && (
          <Col>
            <ErrorInfo>unable to reset password</ErrorInfo>
          </Col>
        )}
        <Col className="text-center pb-3">
          <ButtonLoading
            variant="primary"
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-100"
          >
            reset password
          </ButtonLoading>
        </Col>
      </Form>
    </>
  );
};

export default ForgotPasswordForm;
