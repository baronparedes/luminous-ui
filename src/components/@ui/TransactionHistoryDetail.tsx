import {Col, Container, ListGroup, Row} from 'react-bootstrap';

import {toTransactionPeriodFromDate} from '../../@utils/dates';
import {sum} from '../../@utils/helpers';
import {PaymentDetailAttr, PropertyTransactionHistoryView} from '../../Api';
import {LabeledCurrency} from './LabeledCurrency';
import PaymentDetail from './PaymentDetail';
import TransactionDetail from './TransactionDetail';

type Props = {
  data: PropertyTransactionHistoryView;
};

const TransactionHistoryDetail = ({data}: Props) => {
  const {transactionHistory, paymentHistory} = data;
  const totalCharges = sum(
    data?.transactionHistory
      ?.filter(d => d.transactionType === 'charged')
      ?.map(d => d.amount)
  );
  const totalCollected = sum(
    data?.transactionHistory
      ?.filter(d => d.transactionType === 'collected')
      ?.map(d => d.amount)
  );
  const balance = totalCharges - totalCollected;
  const availableChargedPeriods = data
    ? [...new Set(transactionHistory.map(f => f.transactionPeriod))]
    : [];
  const availableCollectedPeriods = data
    ? [...new Set(paymentHistory.map(f => f.transactionPeriod))]
    : [];
  const availablePeriods = [
    ...new Set([...availableChargedPeriods, ...availableCollectedPeriods]),
  ];

  return (
    <>
      <Container className="text-right mb-3">
        <Row>
          <Col>
            <LabeledCurrency
              className="text-center"
              label="previous balance"
              pill
              variant="danger"
              noCurrencyColor
              currency={data.previousBalance}
            />
          </Col>
          <Col>
            <LabeledCurrency
              className="text-center"
              label="running balance"
              pill
              variant="info"
              noCurrencyColor
              currency={balance}
            />
          </Col>
        </Row>
      </Container>
      <ListGroup>
        {availablePeriods.length === 0 && (
          <ListGroup.Item className="text-center text-muted">
            No items to display
          </ListGroup.Item>
        )}
        {availablePeriods.sort().map((p, i) => {
          const {month} = toTransactionPeriodFromDate(new Date(p));
          const charged = transactionHistory.filter(
            d => d.transactionPeriod === p && d.transactionType === 'charged'
          );
          const collected = paymentHistory
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
                  <Col md={2}>
                    <div>
                      <h5>{month}</h5>
                    </div>
                  </Col>
                  <Col>
                    <ListGroup>
                      {charged.map((item, j) => {
                        return (
                          <ListGroup.Item key={j} className="p-2">
                            <small>
                              <TransactionDetail transaction={item} />
                            </small>
                          </ListGroup.Item>
                        );
                      })}
                      {collected.map((item, j) => {
                        return (
                          <ListGroup.Item key={j} className="p-2">
                            <small>
                              <PaymentDetail
                                paymentDetail={item.paymentDetail}
                                totalCollected={item.totalCollected}
                              />
                            </small>
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
  );
};

export default TransactionHistoryDetail;
