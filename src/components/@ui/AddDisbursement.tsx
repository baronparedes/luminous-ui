import {useState} from 'react';
import {
  Button,
  ButtonProps,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';
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

import {DisbursementAttr} from '../../Api';
import {useRootState} from '../../store';
import {
  decimalPatternRule,
  requiredIf,
  validateGreaterThanZero,
  validateNotEmpty,
} from '../@validation';
import ModalContainer from './ModalContainer';

type Props = {
  disabled?: boolean;
  maxValue?: number;
  onDisburse?: (data: DisbursementAttr) => void;
  chargeId: number;
  buttonLabel?: string;
};

const AddDisbursement = ({
  chargeId,
  disabled,
  maxValue,
  buttonLabel,
  onDisburse,
  ...buttonProps
}: Props & ButtonProps) => {
  const {me} = useRootState(state => state.profile);
  const [toggle, setToggle] = useState(false);
  const {handleSubmit, control, watch, formState} = useForm<DisbursementAttr>({
    defaultValues: {
      details: '',
      paymentType: 'cash',
      releasedBy: Number(me?.id),
      checkIssuingBank: '',
      checkNumber: '',
      checkPostingDate: '',
      transferBank: '',
      transferDate: '',
      transferTo: '',
      referenceNumber: '',
      amount: maxValue ?? 0,
      chargeId,
    },
  });
  const isCheckPayment = watch('paymentType') === 'check';
  const isBankTransferPayment = watch('paymentType') === 'bank-transfer';
  const isGcashPayment = watch('paymentType') === 'gcash';
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
        }}
        {...buttonProps}
      >
        {buttonLabel ? buttonLabel : <FaPlus />}
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
                      max={maxValue}
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
                      <option value="bank-transfer">bank transfer</option>
                      <option value="gcash">gcash</option>
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
            {(isGcashPayment || isBankTransferPayment) && (
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
                          required: requiredIf(
                            isGcashPayment || isBankTransferPayment
                          ),
                        },
                      }}
                      name="referenceNumber"
                      control={control}
                      render={({field}) => (
                        <Form.Control
                          {...field}
                          required={isGcashPayment || isBankTransferPayment}
                          placeholder="reference number"
                          isInvalid={
                            formState.errors.referenceNumber !== undefined
                          }
                        />
                      )}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="text-right"
                    >
                      {formState.errors.referenceNumber?.message}
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
                          required: requiredIf(
                            isGcashPayment || isBankTransferPayment
                          ),
                        },
                      }}
                      name="transferDate"
                      control={control}
                      render={({field}) => (
                        <Form.Control
                          {...field}
                          required={isGcashPayment || isBankTransferPayment}
                          type="date"
                          placeholder="transfer date"
                          isInvalid={
                            formState.errors.transferDate !== undefined
                          }
                        />
                      )}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="text-right"
                    >
                      {formState.errors.transferDate?.message}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Row>
                {isBankTransferPayment && (
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
                            required: requiredIf(isBankTransferPayment),
                          },
                        }}
                        name="transferBank"
                        control={control}
                        render={({field}) => (
                          <Form.Control
                            {...field}
                            required={isBankTransferPayment}
                            placeholder="transfer bank"
                            isInvalid={
                              formState.errors.transferBank !== undefined
                            }
                          />
                        )}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-right"
                      >
                        {formState.errors.transferBank?.message}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Row>
                )}
                {isGcashPayment && (
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
                            required: requiredIf(isGcashPayment),
                          },
                        }}
                        name="transferTo"
                        control={control}
                        render={({field}) => (
                          <Form.Control
                            {...field}
                            required={isGcashPayment}
                            placeholder="to gcash number"
                            isInvalid={
                              formState.errors.transferTo !== undefined
                            }
                          />
                        )}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-right"
                      >
                        {formState.errors.transferTo?.message}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Row>
                )}
              </>
            )}
            <hr />
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
