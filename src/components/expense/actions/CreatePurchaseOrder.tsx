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
import {CreatePurchaseRequest, ExpenseAttr} from '../../../Api';
import {useRootState} from '../../../store';
import {Currency} from '../../@ui/Currency';
import ModalContainer from '../../@ui/ModalContainer';
import {validateNotEmpty} from '../../@validation';
import AddExpense from './AddExpense';

type Props = {
  buttonLabel: React.ReactNode;
  onCreatePurchaseOrder?: () => void;
};

const CreatePurchaseOrder = ({
  buttonLabel,
  ...buttonProps
}: Props & ButtonProps) => {
  const {me} = useRootState(state => state.profile);
  const [toggle, setToggle] = useState(false);
  const {handleSubmit, control, formState, getValues} =
    useForm<CreatePurchaseRequest>({
      defaultValues: {
        description: '',
        expenses: [
          {
            category: 'Repair & Maintenance',
            description: 'Test 123',
            quantity: 3,
            unitCost: 100,
            totalCost: 300,
          },
        ],
        requestedBy: Number(me?.id),
      },
    });
  const {append, remove} = useFieldArray({
    control,
    name: 'expenses',
  });

  const totalCost = sum(getValues('expenses').map(e => e.totalCost));

  const handleOnAddExpense = (expense: ExpenseAttr) => {
    append(expense);
  };

  const onSubmit = (formData: CreatePurchaseRequest) => {
    console.log(formData);
  };

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        size="xl"
        header={<h5>Create New Purchase Order</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Container>
          <Form onSubmit={handleSubmit(onSubmit)} role="form">
            <Row className="pb-2">
              <Col md={12} className="text-right">
                <label className="text-muted">Total Cost</label>
                <h5>
                  <strong>
                    <Currency noCurrencyColor currency={totalCost} />
                  </strong>
                </h5>
              </Col>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="form-description">
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
            <Row>
              <Col md={12}>
                <strong>
                  <label>Expenses</label>
                </strong>
                <AddExpense
                  size="sm"
                  title="add expense"
                  className="float-right"
                  onAddExpense={handleOnAddExpense}
                />
              </Col>
              <Col>
                <ListGroup className="mt-3">
                  {getValues('expenses').map((expense, i) => {
                    return (
                      <>
                        <ListGroup.Item key={i}>
                          <Container>
                            <Row>
                              <Col md={12} className="mb-2">
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
                              <Col>
                                <label>{expense.description}</label>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <small className="text-muted">
                                  <label className="d-block">
                                    Qty: {expense.quantity}
                                  </label>
                                  <label className="d-block">
                                    Unit Cost: {expense.unitCost}
                                  </label>
                                </small>
                              </Col>
                              <Col className="text-right">
                                <h4>
                                  <strong>
                                    <Currency
                                      noCurrencyColor
                                      currency={expense.totalCost}
                                    />
                                  </strong>
                                </h4>
                              </Col>
                            </Row>
                          </Container>
                        </ListGroup.Item>
                      </>
                    );
                  })}
                </ListGroup>
              </Col>
            </Row>
          </Form>
        </Container>
      </ModalContainer>
    </>
  );
};

export default CreatePurchaseOrder;
