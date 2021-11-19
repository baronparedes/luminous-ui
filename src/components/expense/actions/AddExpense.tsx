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
import {BiDetail} from 'react-icons/bi';
import {FaArchive, FaPlus, FaTag} from 'react-icons/fa';

import {ExpenseAttr} from '../../../Api';
import {SETTING_KEYS} from '../../../constants';
import {useRootState} from '../../../store';
import {Currency} from '../../@ui/Currency';
import ModalContainer from '../../@ui/ModalContainer';
import {
  decimalPatternRule,
  validateGreaterThanZero,
  validateNotEmpty,
} from '../../@validation';

type Props = {
  onAddExpense?: (data: ExpenseAttr) => void;
};

function parseSavedCategories(value?: string): string[] {
  try {
    if (value) {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed as string[];
      }
    }
    return [];
  } catch {
    return [];
  }
}

const AddExpense = ({onAddExpense, ...buttonProps}: Props & ButtonProps) => {
  const savedCategories = useRootState(state =>
    state.setting.values.find(v => v.key === SETTING_KEYS.EXPENSE_CATEGORY)
  );
  const [toggle, setToggle] = useState(false);
  const {handleSubmit, control, formState, reset, watch} =
    useForm<ExpenseAttr>();
  const onSubmit = (formData: ExpenseAttr) => {
    const sanitized: ExpenseAttr = {
      ...formData,
      quantity: Number(formData.quantity),
      unitCost: Number(formData.unitCost),
      totalCost: Number(formData.quantity) * Number(formData.unitCost),
    };
    setToggle(false);
    onAddExpense && onAddExpense(sanitized);
  };

  const totalCost = watch('quantity') * watch('unitCost');

  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => {
          setToggle(true);
          reset();
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
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <BiDetail />
                  </InputGroup.Text>
                </InputGroup.Prepend>
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
              <InputGroup className="mb-2">
                <InputGroup.Text>
                  <FaArchive />
                </InputGroup.Text>
                <Controller
                  name="category"
                  control={control}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      as="select"
                      placeholder="category"
                      required
                    >
                      <option value="">Choose a category</option>
                      {parseSavedCategories(savedCategories?.value)
                        .sort()
                        .map((category, i) => {
                          return (
                            <option key={i} value={category}>
                              {category}
                            </option>
                          );
                        })}
                    </Form.Control>
                  )}
                />
              </InputGroup>
            </Row>
            <Row>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <small>qty</small>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Controller
                  name="quantity"
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
                      placeholder="quantity"
                      isInvalid={formState.errors.quantity !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.quantity?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Row>
            <Row>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaTag />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Controller
                  name="unitCost"
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
                      placeholder="unit cost"
                      isInvalid={formState.errors.unitCost !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.unitCost?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Row>
            <Row className="mt-3">
              <Col>
                <label className="text-muted">Total Expense</label>
                <h5>
                  <strong>
                    <Currency noCurrencyColor currency={totalCost ?? 0} />
                  </strong>
                </h5>
              </Col>
              <Col className="text-right p-0" md={6}>
                <Button className="w-50" type="submit">
                  add expense
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
