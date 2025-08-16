import {ButtonGroup} from 'react-bootstrap';
import {useState} from 'react';
import PaymentDetail from '../../@ui/PaymentDetail';
import {TransactionAttr} from '../../../Api';
import {RefundPaymentButton} from '../../property/actions/ViewPaymentHistory';
import {useRootState} from '../../../store';

type Props = {
  transaction: TransactionAttr;
  refetch: () => void;
};

const CollectionTableRow: React.FC<Props> = ({transaction, refetch}) => {
  const {me} = useRootState(state => state.profile);

  const [transactionState] = useState<TransactionAttr>({
    ...transaction,
  });

  return (
    <tr>
      <td>{transactionState.details}</td>
      <td>
        <PaymentDetail
          paymentDetail={transactionState.paymentDetail!}
          totalCollected={transactionState.amount}
        />
      </td>
      <td>{transactionState.category}</td>
      <td>
        <ButtonGroup>
          <RefundPaymentButton
            paymentDetail={transactionState.paymentDetail!}
            totalCollected={transactionState.amount}
            propertyId={transactionState.property?.id}
            refundedBy={Number(me?.id)}
            onRefundComplete={() => refetch()}
          />
        </ButtonGroup>
      </td>
    </tr>
  );
};

export default CollectionTableRow;
