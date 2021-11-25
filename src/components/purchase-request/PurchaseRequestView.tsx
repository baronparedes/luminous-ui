import {Col, Container, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {useGetPurchaseRequest} from '../../Api';
import {useUrl} from '../../hooks/useUrl';
import {useRootState} from '../../store';
import ExpenseTable from '../@ui/ExpenseTable';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import ApprovePurchaseRequest from './actions/ApprovePurchaseRequest';
import NotifyApprovers from './actions/NotifyApprovers';
import PrintPurchaseRequest from './actions/PrintPurchaseRequest';
import RejectPurchaseRequest from './actions/RejectPurchaseRequest';
import PurchaseRequestDetails from './PurchaseRequestDetails';

const PurchaseRequestView = () => {
  const {me} = useRootState(state => state.profile);
  const {id} = useUrl();
  const purchaseRequestId = Number(id);
  const {data, loading, refetch} = useGetPurchaseRequest({
    id: purchaseRequestId,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Container>
        <Row>
          <Col>{data && <PurchaseRequestDetails purchaseRequest={data} />}</Col>
        </Row>
        <Row>
          <Col>
            {data && (
              <>
                <ExpenseTable
                  expenses={data.expenses}
                  appendHeaderContent={
                    <PrintPurchaseRequest
                      purchaseRequest={data}
                      variant="secondary"
                      buttonLabel={<FaPrint title="print purchase request" />}
                    />
                  }
                />
              </>
            )}
          </Col>
          {data && data.status === 'pending' && me?.type === 'admin' && (
            <Col md={3}>
              <RoundedPanel className="mb-2">
                <ApprovePurchaseRequest
                  className="mb-2 w-100"
                  variant="success"
                  buttonLabel="approve"
                  purchaseRequestId={purchaseRequestId}
                  onApprove={() => refetch()}
                />
                <RejectPurchaseRequest
                  className="mb-2 w-100"
                  variant="danger"
                  buttonLabel="reject"
                  purchaseRequestId={purchaseRequestId}
                  onReject={() => refetch()}
                />
                <NotifyApprovers
                  className="mb-2 w-100"
                  buttonLabel="notify approvers"
                  purchaseRequestId={purchaseRequestId}
                />
              </RoundedPanel>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default PurchaseRequestView;
