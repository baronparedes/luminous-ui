import styled from 'styled-components';

import {toTransactionPeriodFromDate} from '../../@utils/dates';
import {sum} from '../../@utils/helpers';
import {PropertyAttr, TransactionAttr} from '../../Api';
import {Currency} from '../@ui/Currency';
import {LabeledCurrency} from '../@ui/LabeledCurrency';
import {Table} from '../@ui/Table';
import {PageHeader, PageSection} from './PaperPdf';

const Label = styled('div')`
  font-size: 1.5em;
`;

type Props = {
  property: PropertyAttr;
  transactionHistory: TransactionAttr[];
  year: number;
};

const TransactionHistory = ({property, transactionHistory, year}: Props) => {
  const totalCharges = sum(
    transactionHistory
      .filter(d => d.transactionType === 'charged')
      ?.map(d => d.amount)
  );
  const totalCollected = sum(
    transactionHistory
      .filter(d => d.transactionType === 'collected')
      ?.map(d => d.amount)
  );
  const balance = totalCharges - totalCollected;
  return (
    <PageSection>
      <PageHeader title="TRANSACTION HISTORY" />
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
          <strong>Transaction History for: </strong>
          {`${year}`}
        </Label>
        <hr />
      </PageSection>
      <PageSection>
        <LabeledCurrency
          label="running balance"
          pill
          variant="info"
          noCurrencyColor
          currency={balance}
          className="text-right"
        />
        <Table headers={['charge code', 'month', 'type', 'amount']} size="sm">
          <tbody>
            {transactionHistory.map((t, i) => {
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
      </PageSection>
    </PageSection>
  );
};

export default TransactionHistory;
