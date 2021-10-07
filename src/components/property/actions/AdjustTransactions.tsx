import {useState} from 'react';
import {Button, ButtonProps, Container, ListGroup} from 'react-bootstrap';

import {TransactionAttr, usePostTransactions} from '../../../Api';
import {useRootState} from '../../../store';
import ErrorInfo from '../../@ui/ErrorInfo';
import ModalContainer from '../../@ui/ModalContainer';
import WaivableTransaction from './WaivableTranasction';

type Props = {
  buttonLabel: React.ReactNode;
  currentTransactions?: TransactionAttr[];
};

type WaivedTransction = {
  transactionId: number;
  transactions: TransactionAttr[];
};

export function toWaivedTransaction(
  transaction: TransactionAttr,
  comments: string,
  profileId: number
) {
  const cleaned = {
    ...transaction,
    charge: undefined,
    paymentDetailId: transaction.paymentDetailId ?? undefined,
    comments: transaction.comments ?? undefined,
    rateSnapshot: transaction.rateSnapshot
      ? Number(transaction.rateSnapshot)
      : undefined,
  };
  const waived: TransactionAttr = {
    ...cleaned,
    waivedBy: profileId,
  };
  const deduction: TransactionAttr = {
    ...cleaned,
    id: undefined,
    amount: transaction.amount * -1,
    waivedBy: profileId,
    comments: JSON.stringify({
      waivedTransaction: transaction.id,
      reason: comments,
    }),
  };
  const item: WaivedTransction = {
    transactionId: Number(transaction.id),
    transactions: [waived, deduction],
  };
  return item;
}

const AdjustTransactions = ({
  buttonLabel,
  currentTransactions,
  ...buttonProps
}: Props & ButtonProps) => {
  const {me} = useRootState(state => state.profile);
  const [toggle, setToggle] = useState(false);
  const [waivedTransactions, setWaivedTransactions] = useState<
    WaivedTransction[]
  >([]);

  const {mutate, loading, error} = usePostTransactions({});

  const handleOnTransactionWaived = (
    transaction: TransactionAttr,
    comments: string
  ) => {
    setWaivedTransactions(state => {
      const item = toWaivedTransaction(transaction, comments, Number(me?.id));
      const newState = [...state, item];
      return newState;
    });
  };

  const handleOnTransactionWaiveCancelled = (transaction: TransactionAttr) => {
    setWaivedTransactions(state => {
      const newState = state.filter(s => s.transactionId !== transaction.id);
      return newState;
    });
  };

  const handleOnSaveAdjustments = () => {
    if (confirm('Proceed?')) {
      const transactionsToBeSaved: TransactionAttr[] = [];
      for (const i of waivedTransactions) {
        transactionsToBeSaved.push(...i.transactions);
      }
      mutate(transactionsToBeSaved)
        .then(() => {
          setToggle(false);
        })
        .catch(e => console.error(e));
    }
  };

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        size="lg"
        header={<h5>Adjust Transactions</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <ListGroup className="p-3">
          {currentTransactions &&
            currentTransactions
              .filter(t => !t.waivedBy)
              .map((item, i) => {
                return (
                  <ListGroup.Item key={i}>
                    <WaivableTransaction
                      disabled={loading}
                      transaction={item}
                      onTransactionWaived={handleOnTransactionWaived}
                      onTransactionWaiveCancelled={
                        handleOnTransactionWaiveCancelled
                      }
                    />
                  </ListGroup.Item>
                );
              })}
        </ListGroup>
        {error && (
          <ErrorInfo>unable to save adjustments at this moment</ErrorInfo>
        )}
        <Container className="text-right">
          <Button
            disabled={!(waivedTransactions.length > 0) || loading}
            onClick={handleOnSaveAdjustments}
          >
            Save Adjustments
          </Button>
        </Container>
      </ModalContainer>
    </>
  );
};

export default AdjustTransactions;
