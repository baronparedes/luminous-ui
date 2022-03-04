import {TransactionAttr} from '../../Api';
import {Currency} from './Currency';

type Props = {
  transaction: TransactionAttr;
};

const TransactionDetail = ({transaction}: Props) => {
  return (
    <>
      <div className="d-inline pr-2">
        <span className="text-muted pr-2">Charged</span>
        <strong>{transaction.charge?.code}</strong>
      </div>
      <div className="d-inline pr-2">
        <span className="text-muted pr-2">with an amount of</span>
        <strong>
          <Currency currency={transaction.amount} noCurrencyColor />
        </strong>
      </div>
    </>
  );
};

export default TransactionDetail;
