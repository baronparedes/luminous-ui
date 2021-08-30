import {useState} from 'react';
import {Button, Col, Container, Form, InputGroup} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaPencilAlt} from 'react-icons/fa';
import styled from 'styled-components';

import {AuthProfile, UpdateProfile, useUpdateProfile} from '../../../Api';
import ErrorInfo from '../../@ui/ErrorInfo';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';

const UpdateFormContainer = styled(Container)`
  min-width: '600px';
  width: '600px';
`;

type FormData = UpdateProfile;

const ProfileUpdateButton: React.FC<{
  profile: AuthProfile;
  onUpdate?: (updatedProfile: AuthProfile) => void;
}> = ({profile, onUpdate}) => {
  const initialValue: FormData = {
    name: profile.name,
    email: profile.email,
    type: profile.type,
    status: profile.status,
  };
  const [toggle, setToggle] = useState(false);
  const {loading, error, mutate} = useUpdateProfile({id: profile.id});
  const {handleSubmit, control, reset} = useForm<FormData>({
    defaultValues: initialValue,
  });
  const onSubmit = (formData: UpdateProfile) => {
    mutate(formData)
      .then(data => {
        onUpdate && onUpdate(data);
        setToggle(false);
      })
      .catch(() => {});
  };
  const onReset = () => {
    reset(initialValue);
  };
  return (
    <>
      <Button
        aria-label="update"
        variant="primary"
        size="sm"
        onClick={() => {
          setToggle(true);
          reset(initialValue);
        }}
      >
        <FaPencilAlt />
      </Button>
      <ModalContainer
        header={<h5>Update Profile</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <UpdateFormContainer>
          <Form onSubmit={handleSubmit(onSubmit)} role="form">
            <Col>
              <Controller
                name="name"
                control={control}
                render={({field}) => (
                  <InputGroup className="mb-2">
                    <Form.Label htmlFor="name" column sm={2}>
                      name
                    </Form.Label>
                    <Form.Control
                      {...field}
                      id="name"
                      required
                      placeholder="name"
                      disabled={loading}
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
                    <Form.Label htmlFor="email" column sm={2}>
                      email
                    </Form.Label>
                    <Form.Control
                      {...field}
                      id="email"
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
                name="type"
                control={control}
                render={({field}) => (
                  <InputGroup className="mb-2">
                    <Form.Label htmlFor="type" column sm={2}>
                      type
                    </Form.Label>
                    <Form.Control as="select" {...field} id="type">
                      <option value="user">user</option>
                      <option value="stakeholder">stakeholder</option>
                      <option value="admin">admin</option>
                    </Form.Control>
                  </InputGroup>
                )}
              />
            </Col>
            <Col>
              <Controller
                name="status"
                control={control}
                render={({field}) => (
                  <InputGroup className="mb-2">
                    <Form.Label htmlFor="status" column sm={2}>
                      status
                    </Form.Label>
                    <Form.Control as="select" {...field} id="status">
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </Form.Control>
                  </InputGroup>
                )}
              />
            </Col>
            {error && (
              <Col>
                <ErrorInfo>unable to register</ErrorInfo>
              </Col>
            )}
            <Col className="text-right mb-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading && (
                  <div className="float-left mb-2">
                    <Loading size={12} />
                  </div>
                )}
                Update
              </Button>
              <Button
                variant="info"
                disabled={loading}
                onClick={onReset}
                className="ml-2"
              >
                Reset
              </Button>
            </Col>
          </Form>
        </UpdateFormContainer>
      </ModalContainer>
    </>
  );
};

export default ProfileUpdateButton;
