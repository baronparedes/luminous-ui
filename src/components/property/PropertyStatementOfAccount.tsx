import {Col, Row} from 'react-bootstrap';

import {getCurrentMonthYear} from '../../@utils/dates';
import {calculateAccount} from '../../@utils/helpers';
import {PropertyAccount} from '../../Api';
import {Currency} from '../@ui/Currency';
import {LabeledCurrency} from '../@ui/LabeledCurrency';
import RoundedPanel from '../@ui/RoundedPanel';
import {Table} from '../@ui/Table';

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
          renderHeaderContent={<h5>SOA - {`${month} ${year}`}</h5>}
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
    </>
  );
};

export default PropertyStatementOfAccount;
