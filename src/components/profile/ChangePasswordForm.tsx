import {Button, Col, Form, InputGroup} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaKey} from 'react-icons/fa';

import {useChangePassword} from '../../Api';
import ErrorInfo from '../@ui/ErrorInfo';
import Loading from '../@ui/Loading';

type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePasswordForm: React.FC<{id: number; onUpdate?: () => void}> = ({
  id,
  onUpdate,
}) => {
  const initialValue: ChangePasswordFormData = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };
  const {mutate, error, loading} = useChangePassword({id});
  const {handleSubmit, control, getValues, formState} =
    useForm<ChangePasswordFormData>({
      defaultValues: initialValue,
    });
  const onSubmit = (formData: ChangePasswordFormData) => {
    mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    })
      .then(() => onUpdate && onUpdate())
      .catch(() => {});
  };
  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      role="form"
      aria-label="change password form"
    >
      <Col>
        <Controller
          name="currentPassword"
          control={control}
          render={({field}) => (
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <FaKey />
              </InputGroup.Text>
              <Form.Control
                {...field}
                disabled={loading}
                required
                minLength={8}
                type="password"
                placeholder="current password"
              />
            </InputGroup>
          )}
        />
      </Col>
      <Col>
        <Controller
          name="newPassword"
          control={control}
          render={({field}) => (
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <FaKey />
              </InputGroup.Text>
              <Form.Control
                {...field}
                disabled={loading}
                required
                minLength={8}
                type="password"
                placeholder="new password"
              />
            </InputGroup>
          )}
        />
      </Col>
      <Col>
        <Controller
          name="confirmNewPassword"
          control={control}
          rules={{
            validate: value =>
              value === getValues('newPassword') || 'password does not match',
          }}
          render={({field}) => (
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <FaKey />
              </InputGroup.Text>
              <Form.Control
                {...field}
                disabled={loading}
                required
                minLength={8}
                type="password"
                isInvalid={formState.errors.confirmNewPassword !== undefined}
                placeholder="confirm new password"
              />
              <Form.Control.Feedback type="invalid" className="text-right">
                {formState.errors.confirmNewPassword?.message}
              </Form.Control.Feedback>
            </InputGroup>
          )}
        />
      </Col>
      {error && (
        <Col>
          <ErrorInfo>unable to change password at this moment</ErrorInfo>
        </Col>
      )}
      <Col className="text-center mb-2">
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-100"
        >
          {loading && (
            <div className="float-left mb-2">
              <Loading size={12} />
            </div>
          )}
          Change Password
        </Button>
      </Col>
    </Form>
  );
};

export default ChangePasswordForm;
