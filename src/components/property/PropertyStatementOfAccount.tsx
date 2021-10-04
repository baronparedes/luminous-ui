import {Col, Container, ListGroup, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {getCurrentMonthYear} from '../../@utils/dates';
import {calculateAccount, sum} from '../../@utils/helpers';
import {PropertyAccount} from '../../Api';
import {Currency} from '../@ui/Currency';
import {LabeledCurrency} from '../@ui/LabeledCurrency';
import RoundedPanel from '../@ui/RoundedPanel';
import {Table} from '../@ui/Table';
import PrintStatementOfAccount from './actions/PrintStatementOfAccount';

type Props = {
  propertyAccount: PropertyAccount;
};

const PropertyStatementOfAccount = ({propertyAccount}: Props) => {
  const {year, month} = getCurrentMonthYear();
  const {property, transactions} = propertyAccount;
  const {currentBalance, previousBalance, collectionBalance} =
    calculateAccount(propertyAccount);
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
          headers={['area', 'charge code', 'rate', 'amount']}
        >
          <tbody>
            {transactions &&
              transactions
                .filter(t => t.transactionType === 'charged')
                .map((t, i) => {
                  return (
                    <tr key={i}>
                      <td>{property?.floorArea}</td>
                      <td>{t.charge?.code}</td>
                      <td>{t.charge?.rate}</td>
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
          <Col>
            <LabeledCurrency
              label="less payments"
              currency={collectionBalance}
              pill
              noCurrencyColor
              variant="success"
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
                        <Col className="text-right">
                          <div className="d-inline pr-2">
                            <span className="text-muted pr-2">OR#</span>
                            {item.orNumber}
                          </div>
                          <div className="d-inline pr-2">
                            <span className="text-muted pr-2">received</span>
                            {item.paymentType}
                          </div>
                          <div className="d-inline pr-2">
                            <span className="text-muted pr-2">
                              with an amount of
                            </span>
                            <Currency currency={totalCollected} />
                          </div>
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
