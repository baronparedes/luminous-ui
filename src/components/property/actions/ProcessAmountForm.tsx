import {useEffect} from 'react';
import {Button, Col, Form, InputGroup} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaMoneyBill, FaTimes} from 'react-icons/fa';

import {decimalPatternRule, validateGreaterThanZero} from '../../@validation';

type FormData = {amount?: number};

export type AmountChargeChangeProps = {
  chargeId?: number;
  amount: number | undefined;
};

type ProcessAmountFormProps = {
  chargeId?: number;
  amount?: number;
  onSubmit?: (formData: FormData) => void;
  onChange?: (value: AmountChargeChangeProps) => void;
  onValidityChange?: (isValid: boolean) => void;
  onRemove?: (chargeId?: number) => void;
  buttonLabel?: string;
  className?: string;
  size?: 'sm' | 'lg';
};

const ProcessAmountForm = ({
  chargeId,
  amount,
  onSubmit,
  onChange,
  onValidityChange,
  onRemove,
  buttonLabel,
  className,
  size,
}: ProcessAmountFormProps) => {
  const defaultValues: FormData = {
    amount,
  };
  const {handleSubmit, control, formState, trigger} = useForm<FormData>({
    defaultValues,
  });
  const onFormSubmit = (formData: FormData) => onSubmit && onSubmit(formData);

  useEffect(() => {
    onValidityChange && onValidityChange(formState.isValid);
  }, [formState.isValid]);

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)} role="form">
      <Col className={className}>
        <Controller
          name="amount"
          control={control}
          rules={{
            pattern: decimalPatternRule,
            validate: validateGreaterThanZero,
          }}
          render={({field}) => (
            <InputGroup className="mb-2">
              <InputGroup.Text>
                <FaMoneyBill />
              </InputGroup.Text>
              <Form.Control
                {...field}
                onChange={e => {
                  onChange &&
                    onChange({
                      amount: parseFloat(e.target.value),
                      chargeId,
                    });
                  field.onChange(e);
                  trigger('amount');
                }}
                size={size}
                id="amount"
                required
                type="number"
                placeholder="amount to pay"
                isInvalid={formState.errors.amount !== undefined}
              />
              {buttonLabel && (
                <Button size="sm" type="submit">
                  {buttonLabel}
                </Button>
              )}
              {onRemove && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onRemove(chargeId)}
                >
                  <FaTimes />
                </Button>
              )}
              <Form.Control.Feedback type="invalid" className="text-right">
                {formState.errors.amount?.message}
              </Form.Control.Feedback>
            </InputGroup>
          )}
        />
      </Col>
    </Form>
  );
};

export default ProcessAmountForm;
