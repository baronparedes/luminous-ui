import {useState} from 'react';
import {
  Button,
  ButtonProps,
  Col,
  Container,
  ListGroup,
  Row,
} from 'react-bootstrap';

import {
  getCurrentMonthYear,
  getPastYears,
  toTransactionPeriodFromDate,
} from '../../../@utils/dates';
import {PaymentDetailAttr, useGetPaymentHistory} from '../../../Api';
import Loading from '../../@ui/Loading';
import ModalContainer from '../../@ui/ModalContainer';
import PaymentDetail from '../../@ui/PaymentDetail';
import SelectYear from '../../@ui/SelectYear';

type Props = {
  propertyId: number;
  buttonLabel: string;
};

const ViewPaymentHistory = ({
  propertyId,
  buttonLabel,
  ...buttonProps
}: Props & ButtonProps) => {
  const {year} = getCurrentMonthYear();
  const years = getPastYears(3).sort().reverse();

  const [selectedYear, setSelectedYear] = useState<number>(year);
  const [toggle, setToggle] = useState(false);

  const {data, loading} = useGetPaymentHistory({
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
        onClose={() => setToggle(false)}
      >
        <div className="m-2 pb-3">
          <Container className="m-0 p-0 pb-3">
            <SelectYear
              availableYears={years}
              value={selectedYear}
              onSelectYear={setSelectedYear}
              size="lg"
            />
          </Container>
          {loading && <Loading />}
          {!loading && data && (
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
                                  <PaymentDetail
                                    paymentDetail={item.paymentDetail}
                                    totalCollected={item.totalCollected}
                                  />
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
          )}
        </div>
      </ModalContainer>
    </>
  );
};

export default ViewPaymentHistory;
