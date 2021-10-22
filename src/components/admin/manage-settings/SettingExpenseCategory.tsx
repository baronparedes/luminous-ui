import {useEffect, useState} from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaPlus, FaTimes} from 'react-icons/fa';
import {useDispatch} from 'react-redux';

import {useUpdateSettingValue} from '../../../Api';
import {SETTING_KEYS} from '../../../constants';
import {useRootState} from '../../../store';
import {settingActions} from '../../../store/reducers/setting.reducer';
import Loading from '../../@ui/Loading';
import {SettingContainer} from './SettingsView';

type FormData = {
  category: string;
};

const SettingExpenseCategory = () => {
  const dispatch = useDispatch();
  const savedCategories = useRootState(state =>
    state.setting.values.find(v => v.key === SETTING_KEYS.EXPENSE_CATEGORY)
  );
  const [categories, setCategories] = useState<string[]>([]);
  const {handleSubmit, formState, control, reset} = useForm<FormData>({
    defaultValues: {
      category: '',
    },
  });
  const {mutate, loading} = useUpdateSettingValue({});

  const onSubmit = (formData: FormData) => {
    setCategories([...categories, formData.category]);
    reset();
  };
  const handleSave = () => {
    const value = JSON.stringify(categories);
    mutate({key: SETTING_KEYS.EXPENSE_CATEGORY, value}).then(() => {
      dispatch(
        settingActions.updateSetting({
          key: SETTING_KEYS.EXPENSE_CATEGORY,
          value,
        })
      );
    });
  };
  const handleRemove = (item: string) => {
    setCategories(categories.filter(c => c !== item));
  };

  useEffect(() => {
    savedCategories && setCategories(JSON.parse(savedCategories.value));
  }, [savedCategories]);

  return (
    <>
      <SettingContainer
        heading="Expense Categories"
        renderRightContent={
          <Button disabled={loading} onClick={() => handleSave()}>
            Save
          </Button>
        }
      >
        <Container>
          <Row>
            <Col>
              {loading && <Loading />}
              {!loading && (
                <>
                  <Form onSubmit={handleSubmit(onSubmit)} role="form">
                    <Form.Group controlId="form-expense-category">
                      <InputGroup className="mb-2">
                        <Controller
                          rules={{
                            validate: value =>
                              !categories
                                .map(c => c.toLowerCase())
                                .includes(value.toLowerCase()) ||
                              'should be unique',
                          }}
                          control={control}
                          name="category"
                          render={({field}) => (
                            <Form.Control
                              {...field}
                              isInvalid={
                                formState.errors.category !== undefined
                              }
                              placeholder="expense category"
                              required
                            />
                          )}
                        />
                        <InputGroup.Append>
                          <Button
                            type="submit"
                            variant="success"
                            title="create new expense category"
                          >
                            <FaPlus />
                          </Button>
                        </InputGroup.Append>
                        <Form.Control.Feedback
                          type="invalid"
                          className="text-right"
                        >
                          {formState.errors.category?.message}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Form>
                  <ListGroup>
                    {categories.map((item, i) => {
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
                </>
              )}
            </Col>
          </Row>
        </Container>
      </SettingContainer>
    </>
  );
};

export default SettingExpenseCategory;
