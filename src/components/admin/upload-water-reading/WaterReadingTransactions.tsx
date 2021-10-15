import {formatDate} from '../../../@utils/dates';
import {compareTransaction} from '../../../@utils/helpers';
import {TransactionAttr} from '../../../Api';
import {Currency} from '../../@ui/Currency';
import RoundedPanel from '../../@ui/RoundedPanel';
import {Table} from '../../@ui/Table';

type Props = {
  transactions: TransactionAttr[];
  renderHeaderContent?: React.ReactNode;
};

const WaterReadingTransactions = ({
  transactions,
  renderHeaderContent,
}: Props) => {
  return (
    <>
      <RoundedPanel className="mt-3">
        <Table
          renderHeaderContent={renderHeaderContent}
          headers={['unit', 'amount', 'period', 'previous', 'current', 'usage']}
        >
          <tbody>
            {transactions
              .filter(t => t.transactionType === 'charged')
              .filter(t => t.amount > 0)
              .sort(compareTransaction)
              .map((t, i) => {
                const reading = JSON.parse(t.comments ?? '');
                return (
                  <tr key={i}>
                    <td>{t.property?.code}</td>
                    <td>
                      <strong>
                        <Currency noCurrencyColor currency={t.amount} />
                      </strong>
                    </td>
                    <td>{formatDate(t.transactionPeriod)}</td>
                    <td>{reading.previousReading}</td>
                    <td>{reading.presentReading}</td>
                    <td>{reading.usage}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </RoundedPanel>
    </>
  );
};

export default WaterReadingTransactions;
