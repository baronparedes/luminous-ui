import {useState} from 'react';
import {
  Button,
  ButtonProps,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from 'react-bootstrap';
import {FaTimes} from 'react-icons/fa';
import {v4 as uuidv4} from 'uuid';

import {sum} from '../../../@utils/helpers';
import {
  ApiError,
  ApproveVoucherOrOrder,
  DisbursementAttr,
  useApproveVoucher,
} from '../../../Api';
import AddDisbursement from '../../@ui/AddDisbursement';
import {Currency} from '../../@ui/Currency';
import DisbursementDetail from '../../@ui/DisbursementDetail';
import ErrorInfo from '../../@ui/ErrorInfo';
import ModalContainer from '../../@ui/ModalContainer';
import InputApprovalCodes from './InputApprovalCodes';

type Props = {
  voucherId: number;
  totalCost: number;
  buttonLabel: React.ReactNode;
  onApproveVoucher?: () => void;
};

type NewDisbursement = DisbursementAttr & {
  guid: string;
};

const ApproveVoucher = ({
  buttonLabel,
  voucherId,
  totalCost,
  onApproveVoucher,
  ...buttonProps
}: Props & ButtonProps) => {
  const [disbursements, setDisbursements] = useState<NewDisbursement[]>([]);
  const [toggle, setToggle] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);
  const {mutate, loading, error} = useApproveVoucher({});

  const remainingCost = totalCost - sum(disbursements.map(d => d.amount));
  const canApprove = codes.length >= 3 && remainingCost === 0;

  const handleOnApprove = () => {
    const data: ApproveVoucherOrOrder = {
      codes,
      voucherId,
      disbursements: disbursements.map(d => {
        const forCashPayment: DisbursementAttr = {
          details: d.details,
          releasedBy: d.releasedBy,
          amount: d.amount,
          paymentType: 'cash',
        };
        const forCheckPayment: DisbursementAttr = {
          amount: d.amount,
          details: d.details,
          paymentType: d.paymentType,
          releasedBy: d.releasedBy,
          checkIssuingBank: d.checkIssuingBank,
          checkNumber: d.checkNumber,
          checkPostingDate: d.checkPostingDate
            ? new Date(d.checkPostingDate).toISOString()
            : undefined,
        };
        const sanitized =
          d.paymentType === 'cash' ? forCashPayment : forCheckPayment;
        return sanitized;
      }),
    };

    if (confirm('Proceed?')) {
      mutate(data).then(() => {
        setToggle(false);
        onApproveVoucher && onApproveVoucher();
      });
    }
  };

  const handleOnDisburse = (data: DisbursementAttr) => {
    setDisbursements([...disbursements, {...data, guid: uuidv4()}]);
  };

  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        size="lg"
        header={<h5>Approve V-{voucherId}</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        <Container>
          <Row className="pb-2">
            <Col md={12}>
              <label>Approval Codes</label>
            </Col>
            <Col>
              <InputApprovalCodes
                codes={codes}
                onInputCode={code => setCodes([...codes, code])}
              />
              <ListGroup>
                {codes.map((code, i) => {
                  return (
                    <ListGroupItem key={i}>
                      <strong>{code}</strong>
                      <Button
                        title="remove code"
                        variant="danger"
                        className="float-right"
                        size="sm"
                        onClick={() => setCodes(codes.filter(c => c !== code))}
                      >
                        <FaTimes />
                      </Button>
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <label>Remaining Cost to Disburse</label>
              <strong className="ml-1">
                <Currency noCurrencyColor currency={remainingCost} />
              </strong>
            </Col>
            <Col sm={3} xs={3} className="text-right">
              {remainingCost > 0 && (
                <AddDisbursement
                  maxValue={remainingCost}
                  onDisburse={handleOnDisburse}
                />
              )}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <ListGroup>
                {disbursements.map((item, i) => {
                  return (
                    <ListGroup.Item key={i} className="p-2">
                      <Container>
                        <Row>
                          <Col>
                            <DisbursementDetail disbursement={item} />
                          </Col>
                          <Col md={1}>
                            <Button
                              title="remove disbursement"
                              variant="danger"
                              className="float-right"
                              size="sm"
                              onClick={() =>
                                setDisbursements(
                                  disbursements.filter(
                                    d => d.guid !== item.guid
                                  )
                                )
                              }
                            >
                              <FaTimes />
                            </Button>
                          </Col>
                        </Row>
                      </Container>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Col>
          </Row>
          {error && error.data && (
            <Row className="mt-3">
              <Col>
                <ErrorInfo>{(error.data as ApiError).message}</ErrorInfo>
              </Col>
            </Row>
          )}
          <Row className="mt-3">
            <Col>
              <div className="text-right">
                <Button
                  variant="success"
                  disabled={loading || !canApprove}
                  onClick={handleOnApprove}
                >
                  approve
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </ModalContainer>
    </>
  );
};

export default ApproveVoucher;
