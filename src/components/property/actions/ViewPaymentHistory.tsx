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
import {FaPrint} from 'react-icons/fa';

import {
  getCurrentMonthYear,
  getPastYears,
  toTransactionPeriodFromDate,
} from '../../../@utils/dates';
import {
  PaymentDetailAttr,
  PropertyAttr,
  useGetPaymentHistory,
  useRefundPayment,
} from '../../../Api';
import {useRootState} from '../../../store';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import PaymentDetail from '../../@ui/PaymentDetail';
import SelectYear from '../../@ui/SelectYear';
import PrintPaymentHistory from './PrintPaymentHistory';
import config from '../../../config';

type Props = {
  property: PropertyAttr;
  buttonLabel: string;
  onClose?: () => void;
};

type RefundButtonProps = {
  totalCollected: number;
  paymentDetail: PaymentDetailAttr;
  propertyId?: number;
  refundedBy: number;
  onRefundComplete?: () => void;
};

export const RefundPaymentButton = ({
  totalCollected,
  paymentDetail,
  propertyId,
  refundedBy,
  onRefundComplete,
}: RefundButtonProps) => {
  const [toggle, setToggle] = useState(false);
  const [comments, setComments] = useState('');

  const {mutate} = useRefundPayment({queryParams: {propertyId}});

  const handleOnRefund = () => {
    if (confirm('Continue?')) {
      mutate({
        comments,
        paymentDetailId: Number(paymentDetail.id),
        refundedBy,
      }).then(() => onRefundComplete && onRefundComplete());
    }
  };

  return (
    <>
      <Button size="sm" variant="warning" onClick={() => setToggle(true)}>
        Refund
      </Button>
      <ModalContainer
        backdrop="static"
        dialogClassName="mt-5"
        header={
          <h5>
            Refund the amount of {totalCollected} with OR #{' '}
            {paymentDetail.orNumber}?
          </h5>
        }
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Form.Group className="mb-3" controlId="form-comments">
          <Form.Control
            as="textarea"
            rows={5}
            required
            placeholder="comments"
            value={comments}
            onChange={e => setComments(e.target.value)}
          />
        </Form.Group>
        <div className="text-right">
          <Button
            size="sm"
            variant="warning"
            onClick={() => handleOnRefund()}
            disabled={!comments}
          >
            Refund
          </Button>
        </div>
      </ModalContainer>
    </>
  );
};

const ViewPaymentHistory = ({
  property,
  buttonLabel,
  onClose,
  ...buttonProps
}: Props & Omit<ButtonProps, 'property'>) => {
  const {me} = useRootState(state => state.profile);

  const propertyId = Number(property?.id);
  const {year} = getCurrentMonthYear();
  const years = getPastYears(config.HISTORY_YEARS).sort().reverse();

  const [selectedYear, setSelectedYear] = useState<number>(year);
  const [toggle, setToggle] = useState(false);

  const {data, loading, refetch} = useGetPaymentHistory({
    propertyId,
    year: selectedYear,
  });

  const availablePeriods = data
    ? [...new Set(data.map(f => f.transactionPeriod))]
    : [];

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        size="lg"
        header={<h5>View Payment History</h5>}
        toggle={toggle}
        onClose={() => {
          setToggle(false);
          onClose && onClose();
        }}
      >
        <div className="m-2 pb-3">
          <Container className="m-0 p-0 pb-3">
            <Row>
              <Col>
                <SelectYear
                  availableYears={years}
                  value={selectedYear}
                  onSelectYear={setSelectedYear}
                  size="lg"
                />
              </Col>
              {availablePeriods.length > 0 && data && (
                <Col md={2} sm={4}>
                  <div className="text-right mb-3">
                    <PrintPaymentHistory
                      availablePeriods={availablePeriods}
                      year={year}
                      property={property}
                      paymentHistory={data}
                      buttonLabel={<FaPrint />}
                      className="w-100"
                    />
                  </div>
                </Col>
              )}
            </Row>
          </Container>
          {loading && <Loading />}
          {!loading && data && (
            <>
              <ListGroup>
                {availablePeriods.length === 0 && (
                  <ListGroup.Item className="text-center text-muted">
                    No items to display
                  </ListGroup.Item>
                )}
                {availablePeriods.sort().map((p, i) => {
                  const {month} = toTransactionPeriodFromDate(new Date(p));
                  const items = data
                    .filter(d => d.transactionPeriod === p)
                    .map(d => {
                      const totalCollected = d.amount;
                      const paymentDetail: PaymentDetailAttr = {
                        ...d,
                        orNumber: d.orNumber,
                        collectedBy: 0,
                      };
                      return {
                        paymentDetail,
                        totalCollected,
                      };
                    });
                  return (
                    <ListGroup.Item key={i}>
                      <Container className="p-0 m-0">
                        <Row>
                          <Col md={2} sm={12}>
                            <div>
                              <h5>{month}</h5>
                            </div>
                          </Col>
                          <Col>
                            <ListGroup>
                              {items.map((item, j) => {
                                return (
                                  <ListGroup.Item key={j}>
                                    <Row>
                                      <Col>
                                        <PaymentDetail
                                          paymentDetail={item.paymentDetail}
                                          totalCollected={item.totalCollected}
                                        />
                                      </Col>
                                      {me?.type === 'admin' && (
                                        <Col md={2}>
                                          <RefundPaymentButton
                                            paymentDetail={item.paymentDetail}
                                            totalCollected={item.totalCollected}
                                            propertyId={propertyId}
                                            refundedBy={Number(me?.id)}
                                            onRefundComplete={() => refetch()}
                                          />
                                        </Col>
                                      )}
                                    </Row>
                                  </ListGroup.Item>
                                );
                              })}
                            </ListGroup>
                          </Col>
                        </Row>
                      </Container>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </>
          )}
        </div>
      </ModalContainer>
    </>
  );
};

export default ViewPaymentHistory;
