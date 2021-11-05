import {useState} from 'react';
import {Button, Col, Container, Form, InputGroup} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaPencilAlt} from 'react-icons/fa';
import styled from 'styled-components';

import {AuthProfile, UpdateProfile, useUpdateProfile} from '../../../Api';
import {PROFILE_TYPE, RECORD_STATUS} from '../../../constants';
import ButtonLoading from '../../@ui/ButtonLoading';
import ErrorInfo from '../../@ui/ErrorInfo';
import ModalContainer from '../../@ui/ModalContainer';

const UpdateFormContainer = styled(Container)`
  min-width: '600px';
  width: '600px';
`;

type FormData = UpdateProfile & {remarks?: string};

const ProfileUpdateButton: React.FC<{
  profile: AuthProfile;
  onUpdate?: (updatedProfile: AuthProfile) => void;
}> = ({profile, onUpdate}) => {
  const initialValue: FormData = {
    name: profile.name,
    email: profile.email,
    mobileNumber: profile.mobileNumber,
    type: profile.type,
    status: profile.status,
    remarks: profile.remarks,
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
        title="update"
        onClick={() => {
          setToggle(true);
          reset(initialValue);
        }}
      >
        <FaPencilAlt />
      </Button>
      <ModalContainer
        size="lg"
        header={<h5>Update Profile of {profile.username}</h5>}
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
                    <Form.Label htmlFor="name" column sm={3}>
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
                    <Form.Label htmlFor="email" column sm={3}>
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
                name="mobileNumber"
                control={control}
                render={({field}) => (
                  <InputGroup className="mb-2">
                    <Form.Label htmlFor="mobileNumber" column sm={3}>
                      mobile
                    </Form.Label>
                    <Form.Control
                      {...field}
                      id="mobileNumber"
                      disabled={loading}
                      placeholder="mobile number"
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
                    <Form.Label htmlFor="type" column sm={3}>
                      type
                    </Form.Label>
                    <Form.Control as="select" {...field} id="type">
                      {PROFILE_TYPE.map((s, i) => {
                        return (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        );
                      })}
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
                    <Form.Label htmlFor="status" column sm={3}>
                      status
                    </Form.Label>
                    <Form.Control as="select" {...field} id="status">
                      {RECORD_STATUS.map((s, i) => {
                        return (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </InputGroup>
                )}
              />
            </Col>
            <Col>
              <Controller
                name="remarks"
                control={control}
                render={({field}) => (
                  <InputGroup className="mb-2">
                    <Form.Label htmlFor="remarks" column sm={3}>
                      remarks
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      {...field}
                      rows={5}
                      disabled={loading}
                      placeholder="remarks"
                      id="remarks"
                    />
                  </InputGroup>
                )}
              />
            </Col>
            {error && (
              <Col>
                <ErrorInfo>unable to save</ErrorInfo>
              </Col>
            )}
            <Col className="text-right mb-2">
              <ButtonLoading
                variant="primary"
                type="submit"
                disabled={loading}
                loading={loading}
              >
                Update
              </ButtonLoading>
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
