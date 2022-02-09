import {Col, Container, Row} from 'react-bootstrap';

import {toTransactionPeriodFromDate} from '../../@utils/dates';
import {sum} from '../../@utils/helpers';
import {PropertyTransactionHistoryView} from '../../Api';
import {Currency} from './Currency';
import {LabeledCurrency} from './LabeledCurrency';
import {Table} from './Table';

type Props = {
  data: PropertyTransactionHistoryView;
};

const TransactionHistoryDetail = ({data}: Props) => {
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
      <Table headers={['charge code', 'month', 'type', 'amount']} size="sm">
        <tbody>
          {data &&
            data.transactionHistory.map((t, i) => {
              const period = toTransactionPeriodFromDate(t.transactionPeriod);
              return (
                <tr key={i}>
                  <td>{t.charge?.code}</td>
                  <td>{`${period.month}`}</td>
                  <td>{t.transactionType}</td>
                  {t.transactionType === 'charged' && (
                    <td>
                      <strong>
                        <Currency noCurrencyColor currency={t.amount} />
                      </strong>
                    </td>
                  )}
                  {t.transactionType === 'collected' && (
                    <td>
                      <strong>
                        <Currency
                          noCurrencyColor
                          className="text-success"
                          currency={t.amount * -1}
                        />
                      </strong>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
};

export default TransactionHistoryDetail;
