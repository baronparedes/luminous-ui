import {useEffect, useState} from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Tab,
  TabContainer,
  Tabs,
} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaPlus, FaTimes} from 'react-icons/fa';

import {
  CategoryAttr,
  useGetAllCategories,
  useUpdateCategories,
} from '../../../Api';
import {DEFAULTS} from '../../../constants';
import ButtonLoading from '../../@ui/ButtonLoading';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import {
  validateNoLeadingSpaces,
  validateNotEmpty,
  validateNoTrailingSpaces,
  validateUnique,
} from '../../@validation';
import {SettingContainer} from './SettingsView';

type FormData = {
  description: string;
  newSubCategory: string;
};

type ManageCategoryProps = {
  category: CategoryAttr;
  onCategoryChange?: (category: CategoryAttr) => void;
  onValidityChange?: (categoryId: number, isValid: boolean) => void;
};

type NewExpenseCategoryProps = {
  categories: CategoryAttr[];
  onNewExpenseCategory?: () => void;
};

const ManageCategory = ({
  category,
  onCategoryChange,
  onValidityChange,
}: ManageCategoryProps) => {
  const [subCategories, setSubCategories] = useState<string[]>([]);

  const {handleSubmit, formState, control, trigger, reset, watch} =
    useForm<FormData>({
      defaultValues: {
        description: category.description,
        newSubCategory: '',
      },
    });

  const updateItems = (newState: string[]) => {
    setSubCategories(newState);
    onCategoryChange &&
      onCategoryChange({
        ...category,
        subCategories: JSON.stringify(newState),
      });
  };

  const handleRemove = (item: string) => {
    const newState = subCategories.filter(c => c !== item);
    updateItems(newState);
  };

  const onSubmit = (formData: FormData) => {
    const newState = [...subCategories, formData.newSubCategory];
    updateItems(newState);
    reset();
  };

  useEffect(() => {
    onValidityChange &&
      onValidityChange(Number(category.id), watch('description') !== '');
  }, [watch('description')]);

  useEffect(() => {
    setSubCategories(JSON.parse(category.subCategories));
  }, [category]);

  return (
    <>
      <Row>
        <Form onSubmit={handleSubmit(onSubmit)} role="form" className="w-100">
          <Col md={12}>
            <InputGroup className="mb-2">
              <Controller
                rules={{
                  validate: {
                    validateNotEmpty,
                  },
                }}
                control={control}
                name="description"
                render={({field}) => (
                  <Form.Control
                    {...field}
                    isInvalid={formState.errors.description !== undefined}
                    placeholder="description"
                    required
                    size="lg"
                    onChange={e => {
                      field.onChange(e);
                      onCategoryChange &&
                        onCategoryChange({
                          ...category,
                          description: e.target.value,
                        });
                      trigger('description');
                    }}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid" className="text-right">
                {formState.errors.description?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
          <Col md={12}>
            <InputGroup className="mb-2">
              <Controller
                rules={{
                  validate: {
                    validateNotEmpty,
                    validateNoLeadingSpaces,
                    validateNoTrailingSpaces,
                    validateUnique: validateUnique(subCategories),
                  },
                }}
                control={control}
                name="newSubCategory"
                render={({field}) => (
                  <Form.Control
                    {...field}
                    isInvalid={formState.errors.newSubCategory !== undefined}
                    placeholder="enter sub category"
                    required
                  />
                )}
              />
              <InputGroup.Append>
                <Button
                  type="submit"
                  variant="success"
                  title="create new sub category"
                >
                  <FaPlus />
                </Button>
              </InputGroup.Append>
              <Form.Control.Feedback type="invalid" className="text-right">
                {formState.errors.newSubCategory?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
        </Form>
      </Row>
      <Row>
        <Col>
          <hr />
          <ListGroup>
            {subCategories.map((item, i) => {
              return (
                <ListGroup.Item key={i} className="p-2">
                  <Container>
                    <Row>
                      <Col>
                        <strong>{item}</strong>
                        <Button
                          variant="danger"
                          size="sm"
                          className="float-right"
                          aria-label="remove"
                          title="remove"
                          onClick={() => {
                            handleRemove(item);
                          }}
                        >
                          <FaTimes />
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

const NewExpenseCategory = ({
  categories,
  onNewExpenseCategory,
}: NewExpenseCategoryProps) => {
  const [toggle, setToggle] = useState(false);
  const {mutate, loading: savingCategories} = useUpdateCategories({});
  const {handleSubmit, formState, control, reset} = useForm<{
    description: string;
  }>({
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = (formData: {description: string}) => {
    const newCategory: CategoryAttr = {
      communityId: DEFAULTS.COMMUNITY_ID,
      description: formData.description,
      subCategories: '[]',
    };
    mutate([...categories, newCategory]).then(() => {
      reset();
      setToggle(false);
      onNewExpenseCategory && onNewExpenseCategory();
    });
  };

  return (
    <>
      <Button
        variant="success"
        className="mr-2"
        onClick={() => setToggle(true)}
      >
        New Category
      </Button>
      <ModalContainer
        header={<h5>New Expense Category</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Form onSubmit={handleSubmit(onSubmit)} role="form" className="w-100">
          <InputGroup className="mb-2">
            <Controller
              rules={{
                validate: {
                  validateNotEmpty,
                },
              }}
              control={control}
              name="description"
              render={({field}) => (
                <Form.Control
                  {...field}
                  isInvalid={formState.errors.description !== undefined}
                  placeholder="enter a new category"
                  required
                />
              )}
            />
            <Form.Control.Feedback type="invalid" className="text-right">
              {formState.errors.description?.message}
            </Form.Control.Feedback>
          </InputGroup>
          <div className="text-right">
            <ButtonLoading
              type="submit"
              loading={savingCategories}
              disabled={savingCategories}
            >
              Save
            </ButtonLoading>
          </div>
        </Form>
      </ModalContainer>
    </>
  );
};

const SettingExpenseCategory = () => {
  const [categoryErrors, setCategoryErrors] = useState<number[]>([]);
  const [categories, setCategories] = useState<CategoryAttr[] | null>(null);
  const {data, loading, refetch} = useGetAllCategories({});
  const {mutate, loading: savingCategories} = useUpdateCategories({});

  const handleSave = () => {
    if (categories) {
      mutate(categories).then(() => refetch());
    }
  };

  const handleOnValidityChange = (categoryId: number, isValid: boolean) => {
    setCategoryErrors(state => {
      if (isValid) {
        return state.filter(c => c !== categoryId);
      } else {
        return [...state, categoryId];
      }
    });
  };

  const handleOnCategoryChange = (category: CategoryAttr) => {
    setCategories(state => {
      const newState = state?.map(s => {
        if (s.id === category.id) {
          return {
            ...category,
          };
        }
        return s;
      });
      return newState ?? null;
    });
  };

  useEffect(() => {
    setCategories(data);
  }, [data]);

  return (
    <>
      <SettingContainer
        heading="Expense Categories"
        renderRightContent={
          <>
            <NewExpenseCategory
              categories={categories ?? []}
              onNewExpenseCategory={refetch}
            />
            <ButtonLoading
              disabled={
                loading || savingCategories || categoryErrors.length > 0
              }
              loading={loading || savingCategories}
              onClick={handleSave}
            >
              Save
            </ButtonLoading>
          </>
        }
      >
        <Container>
          {loading && <Loading />}
          {!loading && categories && (
            <TabContainer>
              <Tabs className="mb-3">
                {categories.map(d => {
                  return (
                    <Tab
                      key={Number(d.id)}
                      eventKey={Number(d.id)}
                      title={d.description}
                    >
                      <ManageCategory
                        category={d}
                        onCategoryChange={handleOnCategoryChange}
                        onValidityChange={handleOnValidityChange}
                      />
                    </Tab>
                  );
                })}
              </Tabs>
            </TabContainer>
          )}
        </Container>
      </SettingContainer>
    </>
  );
};

export default SettingExpenseCategory;
