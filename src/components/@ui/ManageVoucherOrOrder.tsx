import {useState} from 'react';
import {
  Button,
  ButtonProps,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from 'react-bootstrap';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {FaTimes} from 'react-icons/fa';

import {sum} from '../../@utils/helpers';
import {
  CreatePurchaseOrder,
  CreateVoucherOrOrder,
  ExpenseAttr,
} from '../../Api';
import {useRootState} from '../../store';
import {requiredIf, validateNotEmpty} from '../@validation';
import AddExpense from './AddExpense';
import ButtonLoading from './ButtonLoading';
import {Currency} from './Currency';
import ModalContainer from './ModalContainer';

type Props = {
  chargeId: number;
  buttonLabel: React.ReactNode;
  onSave?: (request: CreateVoucherOrOrder) => void;
  title: string;
  loading?: boolean;
  defaultValues?: CreateVoucherOrOrder;
  hasOrderData?: boolean;
  purchaseRequestId?: number;
};

const ManageVoucherOrOrder = ({
  buttonLabel,
  chargeId,
  title,
  loading,
  defaultValues,
  hasOrderData,
  purchaseRequestId,
  onSave,
  ...buttonProps
}: Props & ButtonProps) => {
  const {me} = useRootState(state => state.profile);
  const [toggle, setToggle] = useState(false);
  const defaultOrderData: CreatePurchaseOrder = {
    purchaseRequestId: Number(purchaseRequestId),
    vendorName: '',
    fulfillmentDate: new Date().toISOString(),
    otherDetails: '',
  };
  const {handleSubmit, control, formState, getValues} =
    useForm<CreateVoucherOrOrder>({
      defaultValues: defaultValues
        ? {
            ...defaultValues,
            orderData: hasOrderData
              ? defaultValues.orderData ?? defaultOrderData
              : undefined,
          }
        : {
            chargeId,
            description: '',
            expenses: [],
            requestedBy: Number(me?.id),
            requestedDate: new Date().toISOString(),
            orderData: hasOrderData ? defaultOrderData : undefined,
          },
    });

  const {append, remove} = useFieldArray({
    control,
    name: 'expenses',
  });

  const totalCost = sum(getValues('expenses').map(e => e.totalCost));
  const hasNoExpense = getValues('expenses').length === 0;

  const handleOnAddExpense = (expense: ExpenseAttr) => {
    append(expense);
  };

  const onSubmit = (formData: CreateVoucherOrOrder) => {
    if (!confirm('Proceed?')) return;
    onSave &&
      onSave({
        ...formData,
        chargeId: Number(chargeId),
      });
    setToggle(false);
  };

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        backdrop="static"
        size="lg"
        header={<h5>{title}</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Container className="mb-3">
          <Form onSubmit={handleSubmit(onSubmit)} role="form">
            <Row className="pb-2">
              <Col>
                <h5>
                  <small className="mr-2">
                    <label className="text-muted">Total Cost</label>
                  </small>
                  <strong>
                    <Currency noCurrencyColor currency={totalCost} />
                  </strong>
                </h5>
              </Col>
              <Col className="text-right" md={3} sm={12}>
                <ButtonLoading
                  className="w-100"
                  type="submit"
                  disabled={hasNoExpense || loading || !formState.isDirty}
                  loading={loading}
                >
                  Save
                </ButtonLoading>
              </Col>
            </Row>
            <Row>
              <Form.Group as={Col} md={12} controlId="form-description">
                <Form.Text className="text-muted">
                  Purpose of the request
                </Form.Text>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    validate: validateNotEmpty,
                  }}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      as="textarea"
                      rows={2}
                      required
                      placeholder="description"
                      isInvalid={formState.errors.description !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.description?.message}
                </Form.Control.Feedback>
              </Form.Group>
              {hasOrderData && (
                <>
                  <Form.Group as={Col} md={6} controlId="form-vendor-name">
                    <Form.Text className="text-muted">Vendor name</Form.Text>
                    <Controller
                      name="orderData.vendorName"
                      control={control}
                      rules={{
                        validate: {
                          required: requiredIf(hasOrderData),
                          validateNotEmpty,
                        },
                      }}
                      render={({field}) => (
                        <Form.Control
                          {...field}
                          required={hasOrderData}
                          placeholder="vendor name"
                          isInvalid={
                            formState.errors.orderData?.vendorName !== undefined
                          }
                        />
                      )}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="text-right"
                    >
                      {formState.errors.orderData?.vendorName?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={6} controlId="form-fulfillment-date">
                    <Form.Text className="text-muted">
                      Fulfillment date
                    </Form.Text>
                    <Controller
                      name="orderData.fulfillmentDate"
                      control={control}
                      rules={{
                        validate: {
                          required: requiredIf(hasOrderData),
                        },
                      }}
                      render={({field}) => (
                        <Form.Control
                          {...field}
                          type="date"
                          required={hasOrderData}
                          placeholder="fulfillment date"
                          isInvalid={
                            formState.errors.orderData?.fulfillmentDate !==
                            undefined
                          }
                        />
                      )}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="text-right"
                    >
                      {formState.errors.orderData?.vendorName?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={12} controlId="form-other details">
                    <Form.Text className="text-muted">Other details</Form.Text>
                    <Controller
                      name="orderData.otherDetails"
                      control={control}
                      rules={{
                        validate: {
                          required: requiredIf(hasOrderData),
                        },
                      }}
                      render={({field}) => (
                        <Form.Control
                          {...field}
                          required={hasOrderData}
                          placeholder="other details"
                          isInvalid={
                            formState.errors.orderData?.otherDetails !==
                            undefined
                          }
                        />
                      )}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="text-right"
                    >
                      {formState.errors.orderData?.vendorName?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )}
            </Row>
          </Form>
          <hr />
          <Container className="p-0">
            <Row>
              <Col md={12}>
                <AddExpense
                  disabled={loading}
                  size="sm"
                  title="add expense"
                  className="float-right"
                  onAddExpense={handleOnAddExpense}
                />
                <strong>
                  <label>Expenses</label>
                </strong>
                {hasNoExpense && (
                  <small className="d-block text-muted">
                    minimum of 1 expense should be added
                  </small>
                )}
              </Col>
              <Col>
                <ListGroup className="mt-3">
                  {getValues('expenses').map((expense, i) => {
                    return (
                      <ListGroup.Item key={i} className="m-0 p-0 pt-2">
                        <Container>
                          <Row>
                            <Col md={12}>
                              <Button
                                variant="danger"
                                size="sm"
                                className="float-right"
                                aria-label="remove"
                                title="remove"
                                onClick={() => {
                                  remove(i);
                                }}
                              >
                                <FaTimes />
                              </Button>
                              <strong>{expense.category}</strong>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12} className="mt-1">
                              <p style={{width: '95%'}}>
                                {expense.description}
                              </p>
                            </Col>
                            <Col>
                              <small className="text-muted">
                                <label>qty: {expense.quantity}</label>
                              </small>
                            </Col>
                            <Col>
                              <small className="text-muted">
                                <label>unit cost: {expense.unitCost}</label>
                              </small>
                            </Col>
                            <Col className="text-right">
                              <small className="text-muted">total cost</small>
                              <h5>
                                <strong>
                                  <Currency
                                    noCurrencyColor
                                    currency={expense.totalCost}
                                  />
                                </strong>
                              </h5>
                            </Col>
                          </Row>
                        </Container>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Col>
            </Row>
          </Container>
        </Container>
      </ModalContainer>
    </>
  );
};

export default ManageVoucherOrOrder;
