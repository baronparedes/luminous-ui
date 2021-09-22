import {Button, Col, Form, InputGroup} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaEnvelope, FaMobile, FaStickyNote, FaTag} from 'react-icons/fa';
import {useDispatch} from 'react-redux';

import {AuthProfile, UpdateProfile, useUpdateProfile} from '../../Api';
import {profileActions} from '../../store/reducers/profile.reducer';
import ErrorInfo from '../@ui/ErrorInfo';
import Loading from '../@ui/Loading';

type BasicDetailsFormData = {
  name: string;
  email: string;
  mobileNumber?: string;
  remarks?: string;
};

const UpdateBasicDetailsForm: React.FC<{
  profile: AuthProfile;
  onUpdate?: () => void;
}> = ({profile, onUpdate}) => {
  const initialValue: BasicDetailsFormData = {
    name: profile.name,
    email: profile.email,
    mobileNumber: profile.mobileNumber || '',
    remarks: profile.remarks || '',
  };
  const dispatch = useDispatch();
  const {loading, error, mutate} = useUpdateProfile({id: profile.id});
  const {handleSubmit, control} = useForm<BasicDetailsFormData>({
    defaultValues: initialValue,
  });
  const onSubmit = (formData: BasicDetailsFormData) => {
    const body: UpdateProfile = {
      type: profile.type,
      status: profile.status,
      name: formData.name,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      remarks: formData.remarks,
    };
    mutate(body)
      .then(data => {
        dispatch(
          profileActions.updateCurrentProfile({
            email: data.email,
            name: data.name,
            mobileNumber: data.mobileNumber,
            remarks: data.remarks,
          })
        );
        onUpdate && onUpdate();
      })
      .catch(() => {});
  };
  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      role="form"
      aria-label="update basic details form"
    >
      <Col>
        <Controller
          name="name"
          control={control}
          render={({field}) => (
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <FaTag />
              </InputGroup.Text>
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
              <InputGroup.Text>
                <FaEnvelope />
              </InputGroup.Text>
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
              <InputGroup.Text>
                <FaMobile />
              </InputGroup.Text>
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
          name="remarks"
          control={control}
          render={({field}) => (
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <FaStickyNote />
              </InputGroup.Text>
              <Form.Control
                as="textarea"
                rows={3}
                {...field}
                disabled={loading}
                placeholder="remarks"
              />
            </InputGroup>
          )}
        />
      </Col>
      {error && (
        <Col>
          <ErrorInfo>unable to update basic details</ErrorInfo>
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
          Update
        </Button>
      </Col>
    </Form>
  );
};

export default UpdateBasicDetailsForm;
