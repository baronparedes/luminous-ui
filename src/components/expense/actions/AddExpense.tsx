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
import {FaPlus, FaReceipt} from 'react-icons/fa';

import {ExpenseAttr} from '../../../Api';
import ModalContainer from '../../@ui/ModalContainer';
import {validateNotEmpty} from '../../@validation';

type Props = {
  onAddExpense?: (data: ExpenseAttr) => void;
};

const AddExpense = ({onAddExpense, ...buttonProps}: Props & ButtonProps) => {
  const [toggle, setToggle] = useState(false);
  const defaultValues: ExpenseAttr = {
    category: '',
    description: '',
    quantity: 1,
    unitCost: 0,
    totalCost: 0,
  };
  const {handleSubmit, control, formState, reset} = useForm<ExpenseAttr>({
    defaultValues,
  });
  const onSubmit = (formData: ExpenseAttr) => {
    setToggle(false);
    onAddExpense && onAddExpense(formData);
  };

  return (
    <>
      <Button
        {...buttonProps}
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
        header={<h5>Add Expense</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Container className="p-3">
          <Form onSubmit={handleSubmit(onSubmit)} role="form">
            <Row>
              <InputGroup className="mb-2">
                <InputGroup.Text>
                  <FaReceipt />
                </InputGroup.Text>
                <Controller
                  name="description"
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
              </InputGroup>
            </Row>
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

export default AddExpense;
