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
  const {handleSubmit, control, watch, formState} = useForm<PaymentDetailAttr>({
    defaultValues: {
      orNumber: '',
      paymentType: 'cash',
      collectedBy: Number(me?.id),
      checkIssuingBank: '',
      checkNumber: '',
      checkPostingDate: '',
    },
  });
  const isCheckPayment = watch('paymentType') === 'check';
  const onSubmit = (formData: PaymentDetailAttr) => {
    const forCashPayment: PaymentDetailAttr = {
      orNumber: formData.orNumber,
      collectedBy: formData.collectedBy,
      paymentType: 'cash',
    };
    const form = isCheckPayment ? formData : forCashPayment;
    if (confirm('Proceed?')) {
      setToggle(false);
      onCollect && onCollect(form);
    }
  };

  return (
    <>
      <Button
        disabled={disabled}
        className="w-25"
        onClick={() => setToggle(true)}
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
                <InputGroup.Text>
                  <FaMoneyBillWave />
                </InputGroup.Text>
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
                <InputGroup.Text>
                  <FaReceipt />
                </InputGroup.Text>
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
            {watch('paymentType') === 'check' && (
              <>
                <Row>
                  <InputGroup className="mb-2">
                    <InputGroup.Text>
                      <FaMoneyCheck />
                    </InputGroup.Text>
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
                    <InputGroup.Text>
                      <FaCalendar />
                    </InputGroup.Text>
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
                    <InputGroup.Text>
                      <RiBankFill />
                    </InputGroup.Text>
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
