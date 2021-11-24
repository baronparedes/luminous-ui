import {useState} from 'react';
import {Button, Col, Container, Form, InputGroup, Row} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {
  FaCalendar,
  FaMoneyBill,
  FaMoneyBillWave,
  FaMoneyCheck,
  FaPlus,
  FaReceipt,
} from 'react-icons/fa';
import {RiBankFill} from 'react-icons/ri';

import {DisbursementAttr} from '../../../Api';
import {useRootState} from '../../../store';
import ModalContainer from '../../@ui/ModalContainer';
import {
  decimalPatternRule,
  requiredIf,
  validateGreaterThanZero,
  validateNotEmpty,
} from '../../@validation';

type Props = {
  disabled?: boolean;
  maxValue?: number;
  onDisburse?: (data: DisbursementAttr) => void;
};

const AddDisbursement = ({disabled, maxValue, onDisburse}: Props) => {
  const {me} = useRootState(state => state.profile);
  const [toggle, setToggle] = useState(false);
  const defaultValues: DisbursementAttr = {
    details: '',
    paymentType: 'cash',
    releasedBy: Number(me?.id),
    checkIssuingBank: '',
    checkNumber: '',
    checkPostingDate: '',
    amount: maxValue ?? 0,
  };
  const {handleSubmit, control, watch, formState, reset} =
    useForm<DisbursementAttr>({
      defaultValues,
    });

  const isCheckPayment = watch('paymentType') === 'check';

  const onSubmit = (formData: DisbursementAttr) => {
    setToggle(false);
    onDisburse && onDisburse(formData);
  };

  return (
    <>
      <Button
        size="sm"
        disabled={disabled}
        title="add disbursement"
        onClick={() => {
          setToggle(true);
          reset(defaultValues);
        }}
      >
        <FaPlus />
      </Button>
      <ModalContainer
        backdrop="static"
        dialogClassName="mt-5"
        header={<h5>Add Disbursements</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Container className="p-3">
          <Form onSubmit={handleSubmit(onSubmit)} role="form">
            <Row>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaMoneyBill />
                  </InputGroup.Text>
                </InputGroup.Prepend>
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
                      type="number"
                      required
                      step="any"
                      placeholder="amount to release"
                      isInvalid={formState.errors.amount !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.amount?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Row>
            <Row>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaMoneyBillWave />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Controller
                  name="paymentType"
                  control={control}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      as="select"
                      placeholder="payment type"
                      required
                    >
                      <option value="cash">cash</option>
                      <option value="check">check</option>
                    </Form.Control>
                  )}
                />
              </InputGroup>
            </Row>
            <Row>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaReceipt />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Controller
                  name="details"
                  control={control}
                  rules={{
                    validate: {
                      validateNotEmpty,
                    },
                  }}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      as="textarea"
                      rows={3}
                      required
                      placeholder="details"
                      isInvalid={formState.errors.details !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.details?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Row>
            {isCheckPayment && (
              <>
                <Row>
                  <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FaMoneyCheck />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Controller
                      rules={{
                        validate: {
                          required: requiredIf(isCheckPayment),
                        },
                      }}
                      name="checkNumber"
                      control={control}
                      render={({field}) => (
                        <Form.Control
                          {...field}
                          required={isCheckPayment}
                          placeholder="check number"
                          isInvalid={formState.errors.checkNumber !== undefined}
                        />
                      )}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="text-right"
                    >
                      {formState.errors.checkNumber?.message}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Row>
                <Row>
                  <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FaCalendar />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Controller
                      rules={{
                        validate: {
                          required: requiredIf(isCheckPayment),
                        },
                      }}
                      name="checkPostingDate"
                      control={control}
                      render={({field}) => (
                        <Form.Control
                          {...field}
                          required={isCheckPayment}
                          type="date"
                          placeholder="check posting date"
                          isInvalid={
                            formState.errors.checkPostingDate !== undefined
                          }
                        />
                      )}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="text-right"
                    >
                      {formState.errors.checkPostingDate?.message}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Row>
                <Row>
                  <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <RiBankFill />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Controller
                      rules={{
                        validate: {
                          required: requiredIf(isCheckPayment),
                        },
                      }}
                      name="checkIssuingBank"
                      control={control}
                      render={({field}) => (
                        <Form.Control
                          {...field}
                          required={isCheckPayment}
                          placeholder="check issuing bank"
                          isInvalid={
                            formState.errors.checkIssuingBank !== undefined
                          }
                        />
                      )}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="text-right"
                    >
                      {formState.errors.checkIssuingBank?.message}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Row>
              </>
            )}
            <Row>
              <Col className="text-right p-0">
                <Button className="w-25" type="submit">
                  disburse
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </ModalContainer>
    </>
  );
};

export default AddDisbursement;
