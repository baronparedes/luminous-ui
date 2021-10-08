import {useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import {Controller, useForm} from 'react-hook-form';

import {TransactionAttr} from '../../../Api';
import {Currency} from '../../@ui/Currency';
import ModalContainer from '../../@ui/ModalContainer';

type Props = {
  onTransactionWaived?: (
    transaction: TransactionAttr,
    comments: string
  ) => void;
  onTransactionWaiveCancelled?: (transaction: TransactionAttr) => void;
  transaction: TransactionAttr;
  disabled?: boolean;
};

type FormData = {
  comments: string;
};

type StrikethroughProps = {toggled?: boolean};
const Strikethrough: React.FC<StrikethroughProps> = ({toggled, children}) => {
  if (toggled) {
    return <del>{children}</del>;
  }
  return <>{children}</>;
};

const WaivableTransaction = ({
  transaction,
  disabled,
  onTransactionWaived,
  onTransactionWaiveCancelled,
}: Props) => {
  const [waived, setWaived] = useState(false);
  const [toggle, setToggle] = useState(false);

  const defaultValues: FormData = {
    comments: '',
  };
  const {handleSubmit, control} = useForm<FormData>({
    defaultValues,
  });

  const handleOnTransactionWaived = (formData: FormData) => {
    onTransactionWaived && onTransactionWaived(transaction, formData.comments);
    setWaived(true);
    setToggle(false);
  };

  return (
    <>
      <Row data-testid={`waivable-tranasction-${transaction.id}`}>
        <Col md={3}>
          <Strikethrough toggled={waived}>
            <strong>{transaction.charge?.code}</strong>
          </Strikethrough>
        </Col>
        <Col className="text-right">
          <div className="d-inline pr-3">
            <Strikethrough toggled={waived}>
              <h4 className="d-inline">
                <Currency currency={transaction.amount} noCurrencyColor />
              </h4>
            </Strikethrough>
          </div>
          {!waived && (
            <>
              <Button
                size="sm"
                onClick={() => setToggle(true)}
                disabled={disabled}
              >
                waive
              </Button>
              <ModalContainer
                backdrop="static"
                dialogClassName="mt-5"
                header={<h5>Please enter comments for waiving this charge</h5>}
                toggle={toggle}
                onClose={() => setToggle(false)}
              >
                <Form
                  onSubmit={handleSubmit(handleOnTransactionWaived)}
                  role="form"
                >
                  <Form.Group className="mb-3" controlId="form-comments">
                    <Controller
                      name="comments"
                      control={control}
                      render={({field}) => (
                        <Form.Control
                          {...field}
                          as="textarea"
                          rows={5}
                          required
                          placeholder="comments"
                        />
                      )}
                    />
                  </Form.Group>
                  <div className="text-right">
                    <Button variant="danger" type="submit">
                      waive
                    </Button>
                  </div>
                </Form>
              </ModalContainer>
            </>
          )}
          {waived && (
            <Button
              disabled={disabled}
              variant="warning"
              size="sm"
              onClick={() => {
                onTransactionWaiveCancelled &&
                  onTransactionWaiveCancelled(transaction);
                setWaived(false);
              }}
            >
              undo
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
};

export default WaivableTransaction;
