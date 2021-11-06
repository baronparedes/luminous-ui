import {Col, Container, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {useGetPurchaseOrder} from '../../Api';
import {useUrl} from '../../hooks/useUrl';
import {useRootState} from '../../store';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import ApprovePurchaseOrder from './actions/ApprovePurchaseOrder';
import NotifyApprovers from './actions/NotifyApprovers';
import PrintPurchaseOrder from './actions/PrintPurchaseOrder';
import RejectPurchaseOrder from './actions/RejectPurchaseOrder';
import PurchaseOrderDetails from './PurchaseOrderDetails';
import PurchaseOrderDisbursements from './PurchaseOrderDisbursements';
import PurchaseOrderExpenses from './PurchaseOrderExpenses';

const PurchaseOrderView = () => {
  const {me} = useRootState(state => state.profile);
  const {id} = useUrl();
  const purchaseOrderId = Number(id);
  const {data, loading, refetch} = useGetPurchaseOrder({
    id: purchaseOrderId,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Container>
        <Row>
          <Col>{data && <PurchaseOrderDetails purchaseOrder={data} />}</Col>
        </Row>
        <Row>
          <Col>
            {data && (
              <>
                <PurchaseOrderExpenses
                  expenses={data.expenses}
                  appendHeaderContent={
                    <PrintPurchaseOrder
                      purchaseOrder={data}
                      variant="secondary"
                      buttonLabel={<FaPrint title="print purchase order" />}
                    />
                  }
                />
                <PurchaseOrderDisbursements
                  disbursements={data.disbursements}
                />
              </>
            )}
          </Col>
          {data && data.status === 'pending' && me?.type === 'admin' && (
            <Col md={3}>
              <RoundedPanel className="mb-2">
                <ApprovePurchaseOrder
                  className="mb-2 w-100"
                  variant="success"
                  buttonLabel="approve"
                  purchaseOrderId={Number(data.id)}
                  totalCost={data.totalCost}
                  onApprovePurchaseOrder={() => refetch()}
                />
                <RejectPurchaseOrder
                  className="mb-2 w-100"
                  variant="danger"
                  buttonLabel="reject"
                  purchaseOrderId={Number(data.id)}
                  onRejectPurchaseOrder={() => refetch()}
                />
                <NotifyApprovers
                  className="mb-2 w-100"
                  buttonLabel="notify approvers"
                  purchaseOrderId={Number(data.id)}
                />
              </RoundedPanel>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default PurchaseOrderView;
