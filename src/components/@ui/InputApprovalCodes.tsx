import {Button, Form, InputGroup} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaPlus} from 'react-icons/fa';

import {
  validateNoLeadingSpaces,
  validateNotEmpty,
  validateNoTrailingSpaces,
  validateUnique,
} from '../@validation';

type Props = {
  codes: string[];
  onInputCode: (code: string) => void;
};

type FormData = {
  code: string;
};

const InputApprovalCodes = ({codes, onInputCode}: Props) => {
  const {handleSubmit, control, formState, reset} = useForm<FormData>({
    defaultValues: {
      code: '',
    },
  });
  const onSubmit = (formData: FormData) => {
    onInputCode(formData.code);
    reset();
  };
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} role="form">
        <Form.Group className="mb-3" controlId="form-code">
          <Form.Text className="text-muted">
            Minimum of 3 approval codes
          </Form.Text>
          <InputGroup>
            <Controller
              name="code"
              control={control}
              rules={{
                validate: {
                  validateNotEmpty,
                  validateNoLeadingSpaces,
                  validateNoTrailingSpaces,
                  validateUnique: validateUnique(codes),
                },
              }}
              render={({field}) => (
                <Form.Control
                  {...field}
                  minLength={6}
                  maxLength={6}
                  required
                  placeholder="code"
                  isInvalid={formState.errors.code !== undefined}
                />
              )}
            />
            <InputGroup.Append>
              <Button type="submit" title="add code">
                <FaPlus />
              </Button>
            </InputGroup.Append>
            <Form.Control.Feedback type="invalid" className="text-right">
              {formState.errors.code?.message}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <div className="text-right"></div>
      </Form>
    </>
  );
};

export default InputApprovalCodes;
