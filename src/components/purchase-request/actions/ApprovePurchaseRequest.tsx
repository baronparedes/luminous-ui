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

import {
  ApiError,
  ApproveVoucherOrOrder,
  PurchaseRequestAttr,
  useApprovePurchaseRequest,
} from '../../../Api';
import ErrorInfo from '../../@ui/ErrorInfo';
import InputApprovalCodes from '../../@ui/InputApprovalCodes';
import ModalContainer from '../../@ui/ModalContainer';

type Props = {
  purchaseRequest: PurchaseRequestAttr;
  buttonLabel: React.ReactNode;
  onApprove?: () => void;
};

const ApprovePurchaseRequest = ({
  buttonLabel,
  purchaseRequest,
  onApprove,
  ...buttonProps
}: Props & ButtonProps) => {
  const [toggle, setToggle] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);
  const {mutate, loading, error} = useApprovePurchaseRequest({});
  const canApprove = codes.length >= 3;
  const purchaseRequestId = Number(purchaseRequest.id);

  const handleOnApprove = () => {
    const data: ApproveVoucherOrOrder = {
      codes,
      purchaseRequestId,
    };

    if (confirm('Proceed?')) {
      mutate(data).then(() => {
        setToggle(false);
        onApprove && onApprove();
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
        header={<h5>Approve PR-{purchaseRequest.series}</h5>}
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

export default ApprovePurchaseRequest;
