import {Col, Container, ListGroup, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {WaterReading} from '../../@types';
import {getCurrentMonthYear} from '../../@utils/dates';
import {calculateAccount, sum} from '../../@utils/helpers';
import {PropertyAccount} from '../../Api';
import {Currency} from '../@ui/Currency';
import {LabeledCurrency} from '../@ui/LabeledCurrency';
import PaymentDetail from '../@ui/PaymentDetail';
import RoundedPanel from '../@ui/RoundedPanel';
import {Table} from '../@ui/Table';
import PrintStatementOfAccount from './actions/PrintStatementOfAccount';
import {useChargeIds} from '../../hooks/useChargeIds';

type Props = {
  propertyAccount: PropertyAccount;
};

const PropertyStatementOfAccount = ({propertyAccount}: Props) => {
  const {year, month} = getCurrentMonthYear();
  const {transactions} = propertyAccount;
  const {currentBalance, previousBalance, collectionBalance} =
    calculateAccount(propertyAccount);
  const {waterChargeId} = useChargeIds();
  return (
    <>
      <RoundedPanel className="p-0 m-auto">
        <Table
          renderHeaderContent={
            <>
              <Row>
                <Col>
                  <div className="center-content">
                    <h5 className="m-auto">SOA - {`${month} ${year}`}</h5>
                  </div>
                </Col>
                <Col className="text-right">
                  <PrintStatementOfAccount
                    variant="secondary"
                    buttonLabel={<FaPrint title="print current statement" />}
                    propertyAccount={propertyAccount}
                    year={year}
                    month={month}
                  />
                </Col>
              </Row>
            </>
          }
          headers={['charge code', 'rate', 'unit', 'amount']}
        >
          <tbody>
            {transactions &&
              transactions
                .filter(t => t.transactionType === 'charged')
                .map((t, i) => {
                  const parseUnit = (chargeId: number | undefined) => {
                    if (chargeId === waterChargeId) {
                      try {
                        return (JSON.parse(t.comments ?? '') as WaterReading)
                          .usage;
                      } catch (e) {
                        return '';
                      }
                    }
                    return propertyAccount.property?.floorArea;
                  };
                  const unit = parseUnit(t.charge?.id);
                  return (
                    <tr key={i}>
                      <td>{t.charge?.code}</td>
                      <td>{t.rateSnapshot}</td>
                      <td>{unit}</td>
                      <td>
                        <strong>
                          <Currency noCurrencyColor currency={t.amount} />
                        </strong>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </Table>
      </RoundedPanel>
      <RoundedPanel className="mt-3 text-center">
        <Row style={{fontSize: '1.2em'}}>
          <Col>
            <LabeledCurrency
              label="less payments"
              currency={collectionBalance}
              pill
              noCurrencyColor
              variant="success"
            />
          </Col>
          <Col>
            <LabeledCurrency
              label="previous balance"
              currency={previousBalance}
              pill
              noCurrencyColor
              variant="info"
            />
          </Col>
          <Col>
            <LabeledCurrency
              label="current charges"
              currency={currentBalance}
              pill
              noCurrencyColor
              variant="danger"
            />
          </Col>
        </Row>
      </RoundedPanel>
      {propertyAccount.paymentDetails &&
        propertyAccount.paymentDetails.length > 0 && (
          <RoundedPanel className="mt-3 p-2">
            <ListGroup>
              {propertyAccount.paymentDetails.map((item, i) => {
                const transactions = propertyAccount.transactions?.filter(
                  t => t.paymentDetailId === item.id
                );
                const totalCollected = transactions
                  ? sum(transactions.map(t => t.amount))
                  : 0;
                return (
                  <ListGroup.Item key={i} className="p-2">
                    <Container>
                      <Row>
                        <Col>
                          <PaymentDetail
                            paymentDetail={item}
                            totalCollected={totalCollected}
                          />
                        </Col>
                      </Row>
                    </Container>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </RoundedPanel>
        )}
    </>
  );
};

export default PropertyStatementOfAccount;
