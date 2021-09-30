import {useEffect, useState} from 'react';
import {Button, ButtonProps, Col, Container, Row} from 'react-bootstrap';

import {roundOff} from '../../../@utils/currencies';
import {
  getCurrentMonthYearRelativeToCutoff,
  toTransactionPeriodFromDate,
} from '../../../@utils/dates';
import {sum} from '../../../@utils/helpers';
import {
  TransactionAttr,
  usePostCollections,
  useSuggestPaymentBreakdown,
} from '../../../Api';
import {DEFAULTS, SETTING_KEYS} from '../../../constants';
import {useRootState} from '../../../store';
import {Currency} from '../../@ui/Currency';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import RoundedPanel from '../../@ui/RoundedPanel';
import {PATTERN_MATCH} from '../../@validation';
import ProcessAmountForm, {AmountChargeChangeProps} from './ProcessAmountForm';

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
  const {data, loading, refetch} = useSuggestPaymentBreakdown({
    propertyId,
    lazy: true,
  });
  const {mutate, loading: loadingCollections} = usePostCollections({});
  const handleOnCompute = (formData: FormData) => {
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
  const handleOnCollect = () => {
    if (suggestedBreakdown) {
      mutate(
        suggestedBreakdown.map(bd => {
          return {...bd, charge: undefined};
        })
      ).then(() => {
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
    let result = true;
    if (suggestedBreakdown && suggestedBreakdown.length > 1) {
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
        <ProcessAmountForm
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
                        <label>
                          {`${item.charge?.code}`}
                          <div className="text-muted">
                            <small>{`${period.year} ${period.month}`}</small>
                          </div>
                        </label>
                      </Col>
                      <Col>
                        <ProcessAmountForm
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
              <div className="pt-3 text-right ">
                <strong className="pr-3" style={{fontSize: '2em'}}>
                  <Currency
                    currency={sum(suggestedBreakdown.map(bd => bd.amount))}
                  />
                </strong>
                <Button
                  disabled={!areChargesValid || loadingCollections}
                  className="w-25"
                  onClick={handleOnCollect}
                >
                  collect
                </Button>
              </div>
            </>
          )}
        </Container>
      </ModalContainer>
    </>
  );
};

export default ProcessPayment;
