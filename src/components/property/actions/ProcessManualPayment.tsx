import {useEffect, useState} from 'react';
import {Button, ButtonProps, Col, Container, Form, Row} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaPlus} from 'react-icons/fa';

import {roundOff} from '../../../@utils/currencies';
import {
  getCurrentMonthYearRelativeToCutoff,
  toTransactionPeriod,
  toTransactionPeriodFromDate,
} from '../../../@utils/dates';
import {sum} from '../../../@utils/helpers';
import {
  ChargeAttr,
  PaymentDetailAttr,
  Period,
  TransactionAttr,
  usePostCollections,
} from '../../../Api';
import {DEFAULTS, SETTING_KEYS} from '../../../constants';
import {useRootState} from '../../../store';
import ErrorInfo from '../../@ui/ErrorInfo';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import RoundedPanel from '../../@ui/RoundedPanel';
import {
  decimalPatternRule,
  getFieldErrorsFromRequest,
  PATTERN_MATCH,
  validateGreaterThanZero,
  validateNotEqualToZero,
} from '../../@validation';
import ProcessAmountInput, {
  AmountChargeChangeProps,
} from './ProcessAmountInput';
import ProcessPaymentDetails from './ProcessPaymentDetails';

type Props = {
  propertyId: number;
  buttonLabel: string;
  charges?: ChargeAttr[] | null;
  onProcessedPayment?: () => void;
};

type FormData = {
  chargeId: number;
  amount: number;
};

export function toTransaction(
  formData: FormData,
  propertyId: number,
  period: Period
) {
  const transactionPeriod = toTransactionPeriod(
    period.year,
    period.month
  ).toISOString();
  const transaction: TransactionAttr = {
    amount: Number(formData.amount),
    chargeId: Number(formData.chargeId),
    propertyId: propertyId,
    transactionType: 'collected',
    transactionPeriod,
  };
  return transaction;
}

const ProcessManualPayment = ({
  propertyId,
  charges,
  buttonLabel,
  onProcessedPayment,
  ...buttonProps
}: Props & ButtonProps) => {
  const setting = useRootState(state =>
    state.setting.values.find(v => v.key === SETTING_KEYS.BILLING_CUTOFF_DAY)
  );
  const billingCutoffDay = setting
    ? Number(setting.value)
    : DEFAULTS.BILLING_CUTOFF_DAY;
  const period = getCurrentMonthYearRelativeToCutoff(billingCutoffDay);

  const [suggestedBreakdown, setSuggestedBreakdown] = useState<
    TransactionAttr[]
  >([]);
  const [toggle, setToggle] = useState(false);
  const [formToggle, setFormToggle] = useState(false);
  const [areChargesValid, setAreChargesValid] = useState(false);

  const {mutate, loading: loadingCollections, error} = usePostCollections({});

  const {handleSubmit, control, formState, reset} = useForm<FormData>({
    defaultValues: {
      chargeId: 0,
      amount: 0,
    },
  });

  const orNumberError = getFieldErrorsFromRequest(error, 'or_number');
  const totalCollected = suggestedBreakdown
    ? sum(suggestedBreakdown.map(bd => bd.amount))
    : 0;

  const loading = false;

  const getChargeOptions = () => {
    const existingCharges = suggestedBreakdown.map(t => t.chargeId);
    const list = charges
      ?.filter(c => !existingCharges.includes(Number(c.id)))
      .map(c => {
        return {
          value: Number(c.id),
          description: c.code,
        };
      });
    return list ?? [];
  };

  const handleOnChargeAdd = (formData: FormData) => {
    const transaction = {
      ...toTransaction(formData, propertyId, period),
      charge: charges?.find(c => c.id === Number(formData.chargeId)),
    };
    setSuggestedBreakdown(state => [...state, transaction]);
    setFormToggle(false);
    reset();
  };

  const handleOnAmountChange = (value: AmountChargeChangeProps) => {
    setSuggestedBreakdown(state => {
      if (state) {
        const newState = state.map(s => {
          if (s.chargeId === value.chargeId) {
            return {...s, amount: value.amount ?? 0} as TransactionAttr;
          }
          return s;
        });
        return newState;
      }
      return state;
    });
  };

  const handleOnRemove = (chargeId?: number) => {
    setSuggestedBreakdown(state => {
      if (state) {
        const newState = state.filter(s => s.chargeId !== chargeId);
        return newState;
      }
      return state;
    });
  };

  const handleOnCollect = (paymentDetail: PaymentDetailAttr) => {
    if (suggestedBreakdown) {
      const transactionsCleaned = suggestedBreakdown.map(bd => {
        return {...bd, charge: undefined};
      });
      mutate({
        paymentDetail,
        transactions: transactionsCleaned,
      }).then(() => {
        setToggle(false);
        setSuggestedBreakdown([]);
        onProcessedPayment && onProcessedPayment();
      });
    }
  };

  useEffect(() => {
    let result = true;
    if (suggestedBreakdown && suggestedBreakdown.length > 0) {
      for (const item of suggestedBreakdown) {
        const regex = new RegExp(PATTERN_MATCH.TWO_DECIMAL_PLACE_NUMBER);
        if (
          isNaN(item.amount) ||
          item.amount <= 0 ||
          !regex.test(item.amount.toString())
        ) {
          result = false;
          break;
        }
      }
    } else {
      result = false;
    }
    setAreChargesValid(result);
  }, [suggestedBreakdown]);

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        size="lg"
        header={<h5>Manual Payments</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Container>
          <div className="text-right">
            <Button
              variant="success"
              title="new transaction"
              onClick={() => setFormToggle(true)}
            >
              <FaPlus />
            </Button>
          </div>
          <ModalContainer
            backdrop="static"
            dialogClassName="mt-5"
            header={<h5>Add Payments</h5>}
            toggle={formToggle}
            onClose={() => setFormToggle(false)}
          >
            <Form onSubmit={handleSubmit(handleOnChargeAdd)} role="form">
              <Form.Group className="mb-3" controlId="form-charge-id">
                <Controller
                  name="chargeId"
                  control={control}
                  rules={{
                    required: 'should be required',
                    validate: validateGreaterThanZero,
                  }}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      as="select"
                      placeholder="Please select a charge code"
                      isInvalid={formState.errors.chargeId !== undefined}
                    >
                      <option value="Please select a charge code">
                        Please select a charge code
                      </option>
                      {getChargeOptions().map(c => {
                        return (
                          <option value={c.value} key={c.value}>
                            {c.description}
                          </option>
                        );
                      })}
                    </Form.Control>
                  )}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="form-amount">
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    pattern: decimalPatternRule,
                    validate: validateNotEqualToZero,
                  }}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      type="number"
                      step="any"
                      required
                      placeholder="enter amount"
                      isInvalid={formState.errors.amount !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.amount?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="text-right">
                <Button type="submit">add</Button>
              </div>
            </Form>
          </ModalContainer>
        </Container>
        <Container>
          {loading && <Loading />}
          {!loading && suggestedBreakdown && (
            <>
              {suggestedBreakdown.length === 0 && (
                <RoundedPanel className="text-center text-muted border mt-3">
                  No items to display
                </RoundedPanel>
              )}
              {suggestedBreakdown.map(item => {
                const period = toTransactionPeriodFromDate(
                  new Date(item.transactionPeriod)
                );
                return (
                  <RoundedPanel
                    key={item.chargeId}
                    className="mt-2 p-2 pb-0 border"
                  >
                    <Row>
                      <Col md={3}>
                        <span>
                          {`${item.charge?.code}`}
                          <div className="text-muted">
                            <small>{`${period.year} ${period.month}`}</small>
                          </div>
                        </span>
                      </Col>
                      <Col>
                        <ProcessAmountInput
                          chargeId={item.chargeId}
                          onChange={handleOnAmountChange}
                          onRemove={handleOnRemove}
                          amount={parseFloat(roundOff(item.amount).toFixed(2))}
                        />
                      </Col>
                    </Row>
                  </RoundedPanel>
                );
              })}
              <div className="pt-3">
                <div>
                  {!loading && error && (
                    <>
                      {!orNumberError && (
                        <ErrorInfo>
                          unable to collect payment at this moment
                        </ErrorInfo>
                      )}
                      {orNumberError && (
                        <ErrorInfo>OR# should be unique</ErrorInfo>
                      )}
                    </>
                  )}
                </div>
                <div className="pt-2 pb-2 text-right">
                  <ProcessPaymentDetails
                    totalCollected={totalCollected}
                    disabled={!areChargesValid || loadingCollections}
                    onCollect={handleOnCollect}
                  />
                </div>
              </div>
            </>
          )}
        </Container>
      </ModalContainer>
    </>
  );
};

export default ProcessManualPayment;
