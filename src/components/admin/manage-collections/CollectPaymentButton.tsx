import {useEffect, useState} from 'react';
import {Button, Col, Container, Form, InputGroup, Row} from 'react-bootstrap';
import ModalContainer from '../../@ui/ModalContainer';
import {Controller, useForm} from 'react-hook-form';

import {
  CategoryAttr,
  PaymentDetailAttr,
  Period,
  TransactionAttr,
} from '../../../Api';
import {toTransactionPeriod} from '../../../@utils/dates';
import {
  FaMoneyBillWave,
  FaReceipt,
  FaMoneyCheck,
  FaCalendar,
  FaArchive,
  FaMoneyBill,
} from 'react-icons/fa';
import {RiBankFill} from 'react-icons/ri';
import {
  validateNotEmpty,
  requiredIf,
  decimalPatternRule,
  validateGreaterThanZero,
} from '../../@validation';
import {BiDetail} from 'react-icons/bi';
import {useRootState} from '../../../store';
import {parseSubCategories} from '../../../@utils/helpers';

type Props = {
  onCollect?: (data: TransactionAttr & PaymentDetailAttr) => void;
  chargeId: number;
  period: Period;
  loading?: boolean;
};

const CollectPaymentButton: React.FC<Props> = ({
  onCollect,
  chargeId,
  period,
  loading,
}) => {
  const [toggle, setToggle] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryAttr>();

  const savedCategories = useRootState(state => state.setting.categories);
  const subCategories = parseSubCategories(selectedCategory?.subCategories);

  const {handleSubmit, control, watch, formState, setValue} = useForm<
    TransactionAttr & PaymentDetailAttr
  >({
    defaultValues: {
      paymentType: 'cash',
      chargeId,
      transactionPeriod: toTransactionPeriod(
        period.year,
        period.month
      ).toISOString(),
    },
  });

  const isCheckPayment = watch('paymentType') === 'check';
  const isBankTransferPayment = watch('paymentType') === 'bank-transfer';
  const isGcashPayment = watch('paymentType') === 'gcash';

  const onSubmit = (formData: TransactionAttr & PaymentDetailAttr) => {
    setToggle(false);
    onCollect && onCollect(formData);
  };

  useEffect(() => {
    const newSelectedCategory = savedCategories.find(
      c => c.id === Number(watch('categoryId'))
    );
    setSelectedCategory(newSelectedCategory);
  }, [watch('categoryId')]);

  return (
    <>
      <Button
        variant="success"
        className="ml-2"
        onClick={() => setToggle(true)}
      >
        Collect Payment
      </Button>
      <ModalContainer
        backdrop="static"
        dialogClassName="mt-5"
        header={<h5>Collect Payment</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Container className="p-3">
          <Form onSubmit={handleSubmit(onSubmit)} role="form">
            <Row>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <FaMoneyBill />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Controller
                  name="amount"
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
                      placeholder="amount"
                      isInvalid={formState.errors.amount !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.amount?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Row>
            <Row>
              <InputGroup className="mb-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <BiDetail />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Controller
                  name="details"
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
                      isInvalid={formState.errors.details !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.details?.message}
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
            <hr />
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
                      placeholder="or number"
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
            {/* <Row>
              <PropertySelect
                placeholder="select a property (optional)"
                onSelectProperty={p =>
                  setValue('propertyId', p?.id ?? undefined)
                }
              />
            </Row> */}
            <Row>
              <Col className="text-right p-0">
                <Button className="w-25" type="submit" disabled={loading}>
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

export default CollectPaymentButton;
