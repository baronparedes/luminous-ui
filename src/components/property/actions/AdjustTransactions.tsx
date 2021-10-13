import {useState} from 'react';
import {
  Button,
  ButtonProps,
  Col,
  Container,
  ListGroup,
  Row,
} from 'react-bootstrap';

import {sanitizeTransaction} from '../../../@utils/helpers';
import {
  TransactionAttr,
  useGetAllCharges,
  usePostTransactions,
} from '../../../Api';
import {useRootState} from '../../../store';
import ErrorInfo from '../../@ui/ErrorInfo';
import ModalContainer from '../../@ui/ModalContainer';
import AdjustedTransactions from './AdjustedTransactions';
import WaivableTransaction from './WaivableTransaction';

type Props = {
  propertyId: number;
  buttonLabel: React.ReactNode;
  currentTransactions?: TransactionAttr[];
  onSaveAdjustments?: () => void;
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
  const cleaned = sanitizeTransaction(transaction);
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
  propertyId,
  onSaveAdjustments,
  ...buttonProps
}: Props & ButtonProps) => {
  const {me} = useRootState(state => state.profile);
  const [toggle, setToggle] = useState(false);
  const [waivedTransactions, setWaivedTransactions] = useState<
    WaivedTransction[]
  >([]);
  const [adjustedTransactions, setAdjustedTransactions] = useState<
    TransactionAttr[]
  >([]);

  const {mutate, loading, error} = usePostTransactions({});
  const {data: charges, loading: loadingCharges} = useGetAllCharges({});

  const hasAdjustments =
    waivedTransactions.length > 0 || adjustedTransactions.length > 0;
  const disableActions = loading || loadingCharges;

  const waivableTransactions =
    currentTransactions?.filter(t => !t.waivedBy) ?? [];
  const hasWaivableTransactions = waivableTransactions.length > 0;

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

  const handleOnTransactionAdjusted = (transaction: TransactionAttr) => {
    setAdjustedTransactions(state => {
      const newState = [...state, transaction];
      return newState;
    });
  };

  const handleOnTransactionAdjustedRemoved = (transaction: TransactionAttr) => {
    setAdjustedTransactions(state => {
      const newState = state.filter(s => s.chargeId !== transaction.chargeId);
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
      for (const i of adjustedTransactions) {
        transactionsToBeSaved.push(sanitizeTransaction(i));
      }
      mutate(transactionsToBeSaved).then(() => {
        onSaveAdjustments && onSaveAdjustments();
        setToggle(false);
      });
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
        <AdjustedTransactions
          disabled={disableActions}
          propertyId={propertyId}
          onTransactionAdjusted={handleOnTransactionAdjusted}
          onTransactionAdjustedRemoved={handleOnTransactionAdjustedRemoved}
          adjustedTransactions={adjustedTransactions}
          charges={charges}
        />
        <br />
        <Container>
          <Row className="pb-2">
            <Col>
              <label>Transactions for waiving</label>
            </Col>
          </Row>
          <ListGroup>
            {hasWaivableTransactions &&
              waivableTransactions.map((item, i) => {
                return (
                  <ListGroup.Item key={i}>
                    <WaivableTransaction
                      disabled={disableActions}
                      transaction={item}
                      onTransactionWaived={handleOnTransactionWaived}
                      onTransactionWaiveCancelled={
                        handleOnTransactionWaiveCancelled
                      }
                    />
                  </ListGroup.Item>
                );
              })}
            {!hasWaivableTransactions && (
              <ListGroup.Item>No waivable transactions found</ListGroup.Item>
            )}
          </ListGroup>
        </Container>
        <hr />
        {error && (
          <ErrorInfo>unable to save adjustments at this moment</ErrorInfo>
        )}
        <Container className="text-right">
          <Button
            disabled={!hasAdjustments || disableActions}
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
