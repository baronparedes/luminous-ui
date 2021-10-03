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

type ProcessAmountInputProps = {
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

const ProcessAmountInput = ({
  chargeId,
  amount,
  onSubmit,
  onChange,
  onValidityChange,
  onRemove,
  buttonLabel,
  className,
  size,
}: ProcessAmountInputProps) => {
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
        <InputGroup className="mb-2">
          <InputGroup.Text>
            <FaMoneyBill />
          </InputGroup.Text>
          <Controller
            name="amount"
            control={control}
            rules={{
              pattern: decimalPatternRule,
              validate: validateGreaterThanZero,
            }}
            render={({field}) => (
              <Form.Control
                {...field}
                onChange={e => {
                  field.onChange(e);
                  onChange &&
                    onChange({
                      amount: parseFloat(e.target.value),
                      chargeId,
                    });
                  trigger('amount');
                }}
                type="number"
                size={size}
                required
                step="any"
                placeholder="amount to pay"
                isInvalid={formState.errors.amount !== undefined}
              />
            )}
          />
          {buttonLabel && (
            <Button size="sm" type="submit">
              {buttonLabel}
            </Button>
          )}
          {onRemove && (
            <Button
              title="remove"
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
      </Col>
    </Form>
  );
};

export default ProcessAmountInput;
