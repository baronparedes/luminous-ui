import {useState} from 'react';
import {Button, Col, Container, Form, ListGroup, Row} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';
import {FaPlus, FaTimes} from 'react-icons/fa';

import {getCurrentMonthYear, toTransactionPeriod} from '../../../@utils/dates';
import {ChargeAttr, TransactionAttr} from '../../../Api';
import {Currency} from '../../@ui/Currency';
import ModalContainer from '../../@ui/ModalContainer';
import {
  decimalPatternRule,
  validateGreaterThanZero,
  validateNotEqualToZero,
} from '../../@validation';

type Props = {
  propertyId: number;
  charges?: ChargeAttr[] | null;
  adjustedTransactions: TransactionAttr[];
  disabled?: boolean;
  onTransactionAdjusted?: (transaction: TransactionAttr) => void;
  onTransactionAdjustedRemoved?: (transaction: TransactionAttr) => void;
};

type FormData = {
  comments: string;
  chargeId: number;
  amount: number;
};

export function toTransaction(formData: FormData, propertyId: number) {
  const period = getCurrentMonthYear();
  const transactionPeriod = toTransactionPeriod(
    period.year,
    period.month
  ).toISOString();
  const transaction: TransactionAttr = {
    amount: Number(formData.amount),
    chargeId: Number(formData.chargeId),
    comments: formData.comments,
    propertyId: propertyId,
    transactionType: 'charged',
    transactionPeriod,
  };
  return transaction;
}

const AdjustedTransactions = ({
  adjustedTransactions,
  charges,
  propertyId,
  disabled,
  onTransactionAdjusted,
  onTransactionAdjustedRemoved,
}: Props) => {
  const [toggle, setToggle] = useState(false);
  const defaultValues: FormData = {
    comments: '',
    chargeId: 0,
    amount: 0,
  };
  const {handleSubmit, control, formState, reset} = useForm<FormData>({
    defaultValues,
  });

  const handleOnChargeAdd = (formData: FormData) => {
    const transaction = toTransaction(formData, propertyId);
    onTransactionAdjusted && onTransactionAdjusted(transaction);
    setToggle(false);
    reset();
  };

  const hasAdjustedTransactions = adjustedTransactions.length > 0;
  const getChargeOptions = () => {
    const existingCharges = adjustedTransactions.map(t => t.chargeId);
    const list = charges
      ?.filter(c => !existingCharges.includes(Number(c.id)))
      .map(c => {
        return {
          value: Number(c.id),
          description: c.code,
        };
      });
    return list ?? [];
  };

  return (
    <Container>
      <Row className="pb-2">
        <Col>
          <label>Manual Adjustments</label>
        </Col>
        <Col className="text-right">
          <Button
            size="sm"
            disabled={disabled}
            title="add transaction"
            onClick={() => setToggle(true)}
          >
            <FaPlus />
          </Button>
          <ModalContainer
            backdrop="static"
            dialogClassName="mt-5"
            header={<h5>Add Charges</h5>}
            toggle={toggle}
            onClose={() => setToggle(false)}
          >
            <Form onSubmit={handleSubmit(handleOnChargeAdd)} role="form">
              <Form.Group className="mb-3" controlId="form-charge-id">
                <Controller
                  name="chargeId"
                  control={control}
                  rules={{
                    required: 'should be required',
                    validate: validateGreaterThanZero,
                  }}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      as="select"
                      placeholder="charge id"
                      isInvalid={formState.errors.chargeId !== undefined}
                    >
                      <option value="Please select a charge code">
                        Please select a charge code
                      </option>
                      {getChargeOptions().map(c => {
                        return (
                          <option value={c.value} key={c.value}>
                            {c.description}
                          </option>
                        );
                      })}
                    </Form.Control>
                  )}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="form-amount">
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    pattern: decimalPatternRule,
                    validate: validateNotEqualToZero,
                  }}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      type="number"
                      step="any"
                      required
                      placeholder="amount"
                      isInvalid={formState.errors.amount !== undefined}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid" className="text-right">
                  {formState.errors.amount?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="form-comments">
                <Controller
                  name="comments"
                  control={control}
                  render={({field}) => (
                    <Form.Control
                      {...field}
                      as="textarea"
                      rows={3}
                      required
                      placeholder="comments"
                    />
                  )}
                />
              </Form.Group>
              <div className="text-right">
                <Button type="submit">add</Button>
              </div>
            </Form>
          </ModalContainer>
        </Col>
      </Row>
      <ListGroup>
        {hasAdjustedTransactions &&
          adjustedTransactions.map(transaction => {
            const selectedCharge = charges?.find(
              c => c.id === transaction.chargeId
            );
            return (
              <ListGroup.Item key={Number(transaction.chargeId)}>
                <Row
                  data-testid={`adjusted-transaction-${transaction.chargeId}`}
                >
                  <Col md={3}>
                    <strong>{selectedCharge?.code}</strong>
                  </Col>
                  <Col className="text-right">
                    <div className="d-inline pr-3">
                      <h4 className="d-inline">
                        <Currency
                          currency={transaction.amount}
                          noCurrencyColor
                        />
                      </h4>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={disabled}
                      title="remove"
                      aria-label="remove"
                      onClick={() => {
                        onTransactionAdjustedRemoved &&
                          onTransactionAdjustedRemoved(transaction);
                      }}
                    >
                      <FaTimes />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        {!hasAdjustedTransactions && (
          <ListGroup.Item>
            You can add adjustments by clicking the add button
          </ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  );
};

export default AdjustedTransactions;
