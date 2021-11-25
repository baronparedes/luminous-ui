import {Col, Container, ListGroup, Row} from 'react-bootstrap';
import styled from 'styled-components';

import {toTransactionPeriodFromDate} from '../../@utils/dates';
import {PaymentDetailAttr, PaymentHistoryView, PropertyAttr} from '../../Api';
import PaymentDetail from '../@ui/PaymentDetail';
import {PageHeader, PageSection} from './PaperPdf';

const Label = styled('div')`
  font-size: 1.5em;
`;

type Props = {
  property: PropertyAttr;
  paymentHistory: PaymentHistoryView[];
  availablePeriods: string[];
  year: number;
};

const PaymentHistory = ({
  property,
  paymentHistory,
  availablePeriods,
  year,
}: Props) => {
  return (
    <PageSection>
      <PageHeader title="PAYMENT HISTORY" />
      <PageSection className="pt-3">
        <Label>
          <strong>Unit Number: </strong>
          {property?.code}
        </Label>
        <small>
          <Label>
            <strong>Address: </strong>
            {property?.address}
          </Label>
        </small>
        <small>
          <Label>
            <strong>Floor area: </strong>
            {property?.floorArea}
          </Label>
        </small>
        <hr />
      </PageSection>
      <PageSection className="pt-3">
        <Label>
          <strong>Payment History for: </strong>
          {`${year}`}
        </Label>
        <hr />
      </PageSection>
      <PageSection>
        <ListGroup>
          {availablePeriods.sort().map((p, i) => {
            const {month} = toTransactionPeriodFromDate(new Date(p));
            const items = paymentHistory
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
                <Container>
                  <div>
                    <h5>{month}</h5>
                  </div>
                  {items.map((item, j) => {
                    return (
                      <Row key={j}>
                        <Col>
                          <div className="p-2">
                            <PaymentDetail
                              paymentDetail={item.paymentDetail}
                              totalCollected={item.totalCollected}
                              noCurrencyColor
                            />
                          </div>
                        </Col>
                      </Row>
                    );
                  })}
                </Container>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </PageSection>
    </PageSection>
  );
};

export default PaymentHistory;
