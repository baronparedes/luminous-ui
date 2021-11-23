import {useEffect, useState} from 'react';
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

import {CategoryAttr, ExpenseAttr} from '../../../Api';
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

function parseSubCategories(value?: string): string[] {
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryAttr>();
  const savedCategories = useRootState(state => state.setting.categories);
  const [toggle, setToggle] = useState(false);
  const {handleSubmit, control, formState, reset, watch, setValue} =
    useForm<ExpenseAttr>();
  const onSubmit = (formData: ExpenseAttr) => {
    const sanitized: ExpenseAttr = {
      ...formData,
      categoryId: Number(formData.categoryId),
      category:
        formData.category.trim() === ''
          ? selectedCategory?.description ?? ''
          : formData.category,
      quantity: Number(formData.quantity),
      unitCost: Number(formData.unitCost),
      totalCost: Number(formData.quantity) * Number(formData.unitCost),
    };
    setToggle(false);
    onAddExpense && onAddExpense(sanitized);
  };

  const totalCost = watch('quantity') * watch('unitCost');
  const subCategories = parseSubCategories(selectedCategory?.subCategories);

  useEffect(() => {
    const newSelectedCategory = savedCategories.find(
      c => c.id === Number(watch('categoryId'))
    );
    setSelectedCategory(newSelectedCategory);
  }, [watch('categoryId')]);

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
                  name="categoryId"
                  control={control}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      as="select"
                      placeholder="category"
                      required
                      onChange={e => {
                        field.onChange(e);
                        setValue('category', '');
                      }}
                    >
                      <option value={undefined}>Choose a category</option>
                      {[...savedCategories]
                        .sort((a, b) =>
                          a.description.localeCompare(b.description)
                        )
                        .map((category, i) => {
                          return (
                            <option key={i} value={Number(category.id)}>
                              {category.description}
                            </option>
                          );
                        })}
                    </Form.Control>
                  )}
                />
              </InputGroup>
            </Row>
            {subCategories.length > 0 && (
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
                        placeholder="sub category"
                        required
                      >
                        <option value="">Choose a sub category</option>
                        {subCategories.map((subCategory, i) => {
                          return (
                            <option key={i} value={subCategory}>
                              {subCategory}
                            </option>
                          );
                        })}
                      </Form.Control>
                    )}
                  />
                </InputGroup>
              </Row>
            )}
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
