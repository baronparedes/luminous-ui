import {useState} from 'react';
import {Button, Col, Container, Form, InputGroup, Row} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {
  FaCalendar,
  FaMoneyBillWave,
  FaMoneyCheck,
  FaReceipt,
} from 'react-icons/fa';
import {RiBankFill} from 'react-icons/ri';

import {PaymentDetailAttr} from '../../../Api';
import {useRootState} from '../../../store';
import {Currency} from '../../@ui/Currency';
import ModalContainer from '../../@ui/ModalContainer';
import {requiredIf, validateNotEmpty} from '../../@validation';

type Props = {
  onCollect?: (data: PaymentDetailAttr) => void;
  disabled?: boolean;
  totalCollected: number;
  totalChange?: number;
};

const ProcessPaymentDetails = ({
  onCollect,
  disabled,
  totalCollected,
  totalChange,
}: Props) => {
  const {me} = useRootState(state => state.profile);
  const [toggle, setToggle] = useState(false);
  const defaultValues: PaymentDetailAttr = {
    orNumber: '',
    paymentType: 'cash',
    collectedBy: Number(me?.id),
    checkIssuingBank: '',
    checkNumber: '',
    checkPostingDate: '',
    transferBank: '',
    transferDate: '',
    transferFrom: '',
    referenceNumber: '',
  };
  const {handleSubmit, control, watch, formState} = useForm<PaymentDetailAttr>({
    defaultValues,
  });
  const isCashPayment = watch('paymentType') === 'cash';
  const isCheckPayment = watch('paymentType') === 'check';
  const isBankTransferPayment = watch('paymentType') === 'bank-transfer';
  const isGcashPayment = watch('paymentType') === 'gcash';
  const onSubmit = (formData: PaymentDetailAttr) => {
    if (confirm('Proceed?')) {
      setToggle(false);

      if (isCashPayment)
        onCollect &&
          onCollect({
            orNumber: formData.orNumber,
            collectedBy: formData.collectedBy,
            paymentType: 'cash',
          });

      if (isCheckPayment)
        onCollect &&
          onCollect({
            orNumber: formData.orNumber,
            collectedBy: formData.collectedBy,
            paymentType: 'check',
            checkIssuingBank: formData.checkIssuingBank,
            checkNumber: formData.checkNumber,
            checkPostingDate: formData.checkPostingDate,
          });

      if (isBankTransferPayment)
        onCollect &&
          onCollect({
            orNumber: formData.orNumber,
            collectedBy: formData.collectedBy,
            paymentType: 'bank-transfer',
            referenceNumber: formData.referenceNumber,
            transferBank: formData.transferBank,
            transferDate: formData.transferDate,
          });

      if (isGcashPayment)
        onCollect &&
          onCollect({
            orNumber: formData.orNumber,
            collectedBy: formData.collectedBy,
            paymentType: 'gcash',
            referenceNumber: formData.referenceNumber,
            transferFrom: formData.transferFrom,
            transferDate: formData.transferDate,
          });
    }
  };

  return (
    <>
      <Button
        disabled={disabled}
        className="w-25"
        onClick={() => {
          setToggle(true);
        }}
      >
        enter payment details
      </Button>
      <ModalContainer
        backdrop="static"
        dialogClassName="mt-5"
        header={<h5>Enter Payment Details</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Container className="p-3">
          <Form onSubmit={handleSubmit(onSubmit)} role="form">
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
                  name="orNumber"
                  control={control}
                  rules={{
                    validate: {
                      validateNotEmpty,
                    },
                  }}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      required
                      placeholder="official receipt"
                      isInvalid={formState.errors.orNumber !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.orNumber?.message}
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
                        name="transferFrom"
                        control={control}
                        render={({field}) => (
                          <Form.Control
                            {...field}
                            required={isGcashPayment}
                            placeholder="from gcash number"
                            isInvalid={
                              formState.errors.transferFrom !== undefined
                            }
                          />
                        )}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="text-right"
                      >
                        {formState.errors.transferFrom?.message}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Row>
                )}
              </>
            )}
            <hr />
            <Row>
              <Col className="pb-2 text-left">
                <div>
                  <span className="pr-2">total</span>
                  <strong style={{fontSize: '1.2em'}}>
                    <Currency currency={totalCollected} />
                  </strong>
                </div>
                {totalChange !== undefined && totalChange > 0 && (
                  <div>
                    <span className="pr-2">change</span>
                    <strong style={{fontSize: '1.2em'}}>
                      <Currency currency={totalChange} noCurrencyColor />
                    </strong>
                  </div>
                )}
              </Col>
              <Col className="text-right" xs={12} sm={6}>
                <Button className="w-100" type="submit">
                  collect
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </ModalContainer>
    </>
  );
};

export default ProcessPaymentDetails;
