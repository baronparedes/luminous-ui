import {useEffect, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {
  CreateVoucherOrOrder,
  ExpenseAttr,
  useGetPurchaseOrder,
  useUpdatePurchaseOrder,
} from '../../Api';
import {useUrl} from '../../hooks/useUrl';
import {useRootState} from '../../store';
import ExpenseTable from '../@ui/ExpenseTable';
import Loading from '../@ui/Loading';
import ManageVoucherOrOrder from '../@ui/ManageVoucherOrOrder';
import RoundedPanel from '../@ui/RoundedPanel';
import ApprovePurchaseOrder from './actions/ApprovePurchaseOrder';
import NotifyApprovers from './actions/NotifyApprovers';
import PrintPurchaseOrder from './actions/PrintPurchaseOrder';
import RejectPurchaseOrder from './actions/RejectPurchaseOrder';
import PurchaseOrderDetails from './PurchaseOrderDetails';

const PurchaseOrderView = () => {
  const [request, setRequest] = useState<CreateVoucherOrOrder>();
  const {me} = useRootState(state => state.profile);
  const {id} = useUrl();
  const purchaseOrderId = Number(id);
  const {data, loading, refetch} = useGetPurchaseOrder({
    id: purchaseOrderId,
  });
  const {mutate, loading: savingPurchaseOrder} = useUpdatePurchaseOrder({
    id: Number(data?.id),
  });

  const handleOnModifyPurchaseOrder = (data: CreateVoucherOrOrder) => {
    mutate(data).then(() => refetch());
  };

  useEffect(() => {
    if (data) {
      const sanitizedExpenses = data.expenses?.map(e => {
        const result: ExpenseAttr = {
          category: e.category,
          categoryId: e.categoryId,
          description: e.description,
          quantity: e.quantity,
          unitCost: e.unitCost,
          totalCost: e.totalCost,
        };
        return result;
      });
      setRequest({
        chargeId: data.chargeId,
        description: data.description,
        expenses: sanitizedExpenses ?? [],
        requestedBy: data.requestedBy,
        requestedDate: data.requestedDate,
        orderData: {
          fulfillmentDate: data.fulfillmentDate,
          vendorName: data.vendorName,
          otherDetails: data.otherDetails as string,
          purchaseRequestId: data.purchaseRequestId,
        },
      });
    }
  }, [data]);

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
                <ExpenseTable
                  expenses={data.expenses}
                  appendHeaderContent={
                    <PrintPurchaseOrder
                      purchaseOrder={data}
                      variant="secondary"
                      buttonLabel={<FaPrint title="print purchase order" />}
                    />
                  }
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
                  purchaseOrderId={purchaseOrderId}
                  onApprove={() => refetch()}
                />
                <RejectPurchaseOrder
                  className="mb-2 w-100"
                  variant="danger"
                  buttonLabel="reject"
                  purchaseOrderId={purchaseOrderId}
                  onReject={() => refetch()}
                />
                <ManageVoucherOrOrder
                  key={new Date().getUTCMilliseconds()}
                  variant="primary"
                  className="mb-2 w-100"
                  buttonLabel="modify order"
                  chargeId={Number(data.chargeId)}
                  onSave={handleOnModifyPurchaseOrder}
                  title={'Modify Purchase Order'}
                  defaultValues={request}
                  loading={savingPurchaseOrder}
                  hasOrderData
                  purchaseRequestId={data.purchaseRequestId}
                />
                <NotifyApprovers
                  className="mb-2 w-100"
                  buttonLabel="notify approvers"
                  purchaseOrderId={purchaseOrderId}
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
