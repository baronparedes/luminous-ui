import {Button, Col, Container, Form, InputGroup} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';

import {PropertyAttr} from '../../../Api';
import {RECORD_STATUS} from '../../../constants';
import ErrorInfo from '../../@ui/ErrorInfo';
import Loading from '../../@ui/Loading';

type Props = {
  loading?: boolean;
  error?: boolean;
  value?: PropertyAttr;
  onSubmit: (data: PropertyAttr) => void;
};

const PropertyForm = ({value, onSubmit, loading, error}: Props) => {
  const initialValue: PropertyAttr = {
    code: '',
    address: '',
    floorArea: 0,
    status: 'active',
  };
  const {handleSubmit, control, reset, formState} = useForm<PropertyAttr>({
    defaultValues: value || initialValue,
  });
  const onReset = () => {
    reset(value || initialValue);
  };
  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)} role="form">
          <Col>
            <Controller
              name="code"
              control={control}
              render={({field}) => (
                <InputGroup className="mb-2">
                  <Form.Label htmlFor="code" column sm={3}>
                    code
                  </Form.Label>
                  <Form.Control
                    {...field}
                    id="code"
                    required
                    placeholder="code"
                    disabled={loading || value !== undefined}
                  />
                </InputGroup>
              )}
            />
          </Col>
          <Col>
            <Controller
              name="address"
              control={control}
              render={({field}) => (
                <InputGroup className="mb-2">
                  <Form.Label htmlFor="address" column sm={3}>
                    address
                  </Form.Label>
                  <Form.Control
                    {...field}
                    id="address"
                    disabled={loading}
                    required
                    as="textarea"
                    placeholder="address"
                  />
                </InputGroup>
              )}
            />
          </Col>
          <Col>
            <Controller
              name="floorArea"
              control={control}
              rules={{
                pattern: {
                  value: /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/,
                  message: 'should be a number with up to 2 decimal places',
                },
                validate: value => value > 0 || 'should be greater than 0',
              }}
              render={({field}) => (
                <InputGroup className="mb-2">
                  <Form.Label htmlFor="floorArea" column sm={3}>
                    floor area
                  </Form.Label>
                  <Form.Control
                    {...field}
                    id="floorArea"
                    disabled={loading}
                    required
                    type="number"
                    placeholder="floor area"
                    isInvalid={formState.errors.floorArea !== undefined}
                  />
                  <Form.Control.Feedback type="invalid" className="text-right">
                    {formState.errors.floorArea?.message}
                  </Form.Control.Feedback>
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
          {error && (
            <Col>
              <ErrorInfo>unable to save</ErrorInfo>
            </Col>
          )}
          <Col className="text-right mb-2">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading && (
                <div className="float-left mb-2">
                  <Loading size={12} />
                </div>
              )}
              {value ? 'Update' : 'Create'}
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
      </Container>
    </>
  );
};

export default PropertyForm;
