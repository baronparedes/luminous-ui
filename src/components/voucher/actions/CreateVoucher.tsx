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

import {sum} from '../../../@utils/helpers';
import {
  ApiError,
  CreateVoucher as CreateVoucherAttr,
  ExpenseAttr,
  usePostVoucher,
} from '../../../Api';
import {useRootState} from '../../../store';
import ButtonLoading from '../../@ui/ButtonLoading';
import {Currency} from '../../@ui/Currency';
import ErrorInfo from '../../@ui/ErrorInfo';
import ModalContainer from '../../@ui/ModalContainer';
import {validateNotEmpty} from '../../@validation';
import AddExpense from './AddExpense';

type Props = {
  chargeId: number;
  chargeCode: string;
  buttonLabel: React.ReactNode;
  onCreateVoucher?: (id: number) => void;
};

const CreateVoucher = ({
  buttonLabel,
  onCreateVoucher,
  chargeId,
  chargeCode,
  ...buttonProps
}: Props & ButtonProps) => {
  const {me} = useRootState(state => state.profile);
  const [toggle, setToggle] = useState(false);
  const {handleSubmit, control, formState, getValues} =
    useForm<CreateVoucherAttr>({
      defaultValues: {
        chargeId,
        description: '',
        expenses: [],
        requestedBy: Number(me?.id),
        requestedDate: new Date().toISOString(),
      },
    });
  const {append, remove} = useFieldArray({
    control,
    name: 'expenses',
  });

  const {mutate, loading, error} = usePostVoucher({});

  const totalCost = sum(getValues('expenses').map(e => e.totalCost));
  const hasNoExpense = getValues('expenses').length === 0;

  const handleOnAddExpense = (expense: ExpenseAttr) => {
    append(expense);
  };

  const onSubmit = (formData: CreateVoucherAttr) => {
    if (!confirm('Proceed?')) return;
    mutate(formData).then(id => {
      setToggle(false);
      onCreateVoucher && onCreateVoucher(id);
    });
  };

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        backdrop="static"
        size="lg"
        header={<h5>Create New Voucher for {chargeCode}</h5>}
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
                  disabled={hasNoExpense || loading}
                  loading={loading}
                >
                  Save
                </ButtonLoading>
              </Col>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="form-description">
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
                      rows={3}
                      required
                      placeholder="description"
                      isInvalid={formState.errors.description !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.description?.message}
                </Form.Control.Feedback>
                <hr />
              </Form.Group>
            </Row>
          </Form>
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
            {error && error.data && (
              <Row className="mt-3">
                <Col>
                  <ErrorInfo>{(error.data as ApiError).message}</ErrorInfo>
                </Col>
              </Row>
            )}
          </Container>
        </Container>
      </ModalContainer>
    </>
  );
};

export default CreateVoucher;
