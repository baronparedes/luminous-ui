import {useEffect, useState} from 'react';
import {Button, ButtonProps, Col, Container, Row} from 'react-bootstrap';

import {roundOff} from '../../../@utils/currencies';
import {
  getCurrentMonthYearRelativeToCutoff,
  toTransactionPeriodFromDate,
} from '../../../@utils/dates';
import {sum} from '../../../@utils/helpers';
import {
  PaymentDetailAttr,
  TransactionAttr,
  usePostCollections,
  useSuggestPaymentBreakdown,
} from '../../../Api';
import {DEFAULTS, SETTING_KEYS} from '../../../constants';
import {useRootState} from '../../../store';
import ErrorInfo from '../../@ui/ErrorInfo';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import RoundedPanel from '../../@ui/RoundedPanel';
import {getFieldErrorsFromRequest, PATTERN_MATCH} from '../../@validation';
import ProcessAmountInput, {
  AmountChargeChangeProps,
} from './ProcessAmountInput';
import ProcessPaymentDetails from './ProcessPaymentDetails';

type Props = {
  propertyId: number;
  amount?: number;
  buttonLabel: string;
  onProcessedPayment?: () => void;
};

type FormData = {amount?: number};

const ProcessPayment = ({
  propertyId,
  amount,
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

  const [suggestedBreakdown, setSuggestedBreakdown] =
    useState<TransactionAttr[]>();
  const [toggle, setToggle] = useState(false);
  const [areChargesValid, setAreChargesValid] = useState(false);
  const [amountToBeProcess, setAmountToBeProcessed] = useState(amount);

  const {data, loading, refetch} = useSuggestPaymentBreakdown({
    propertyId,
    lazy: true,
  });
  const {mutate, loading: loadingCollections, error} = usePostCollections({});

  const orNumberError = getFieldErrorsFromRequest(error, 'or_number');
  const totalCollected = suggestedBreakdown
    ? sum(suggestedBreakdown.map(bd => bd.amount))
    : 0;

  const handleOnCompute = (formData: FormData) => {
    setSuggestedBreakdown(undefined);
    setAmountToBeProcessed(formData.amount);
    refetch({
      queryParams: {
        amount: formData.amount ?? 0,
        year: period.year,
        month: period.month,
      },
    });
  };
  const handleOnValidityChange = (isValid: boolean) => {
    if (!isValid) {
      setSuggestedBreakdown(undefined);
    }
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
        setSuggestedBreakdown(undefined);
        onProcessedPayment && onProcessedPayment();
      });
    }
  };

  useEffect(() => {
    setSuggestedBreakdown(data ?? undefined);
  }, [data]);

  useEffect(() => {
    setAmountToBeProcessed(amount);
  }, [toggle]);

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
        header={<h5>Process Payment</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <ProcessAmountInput
          size="lg"
          buttonLabel="compute"
          onSubmit={handleOnCompute}
          onValidityChange={handleOnValidityChange}
          amount={amount}
        />
        <Container>
          {loading && <Loading />}
          {!loading && suggestedBreakdown && (
            <>
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
                    totalChange={
                      amountToBeProcess
                        ? amountToBeProcess - totalCollected
                        : undefined
                    }
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

export default ProcessPayment;
