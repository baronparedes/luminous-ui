import {TransactionAttr} from '../../Api';

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
        <strong>{transaction.amount}</strong>
      </div>
    </>
  );
};

export default TransactionDetail;
