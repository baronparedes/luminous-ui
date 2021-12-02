import {useEffect, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';
import {useHistory} from 'react-router';

import routes from '../../@utils/routes';
import {
  CreateVoucherOrOrder,
  ExpenseAttr,
  useGetPurchaseRequest,
  usePostPurchaseOrder,
  useUpdatePurchaseRequest,
} from '../../Api';
import {useUrl} from '../../hooks/useUrl';
import {useRootState} from '../../store';
import ExpenseTable from '../@ui/ExpenseTable';
import Loading from '../@ui/Loading';
import ManageVoucherOrOrder from '../@ui/ManageVoucherOrOrder';
import RoundedPanel from '../@ui/RoundedPanel';
import ApprovePurchaseRequest from './actions/ApprovePurchaseRequest';
import NotifyApprovers from './actions/NotifyApprovers';
import PrintPurchaseRequest from './actions/PrintPurchaseRequest';
import RejectPurchaseRequest from './actions/RejectPurchaseRequest';
import PurchaseRequestDetails from './PurchaseRequestDetails';

const PurchaseRequestView = () => {
  const history = useHistory();
  const [request, setRequest] = useState<CreateVoucherOrOrder>();
  const {me} = useRootState(state => state.profile);
  const {id} = useUrl();
  const purchaseRequestId = Number(id);
  const {data, loading, refetch} = useGetPurchaseRequest({
    id: purchaseRequestId,
  });
  const {mutate, loading: savingPurchaseRequest} = useUpdatePurchaseRequest({
    id: Number(data?.id),
  });
  const {mutate: mutatePurchaseOrder, loading: savingPurchaseOrder} =
    usePostPurchaseOrder({});

  const handleOnModifyPurchaseRequest = (data: CreateVoucherOrOrder) => {
    mutate(data).then(() => refetch());
  };

  const handleOnCreatePurchaseOrder = (data: CreateVoucherOrOrder) => {
    mutatePurchaseOrder(data).then(id => {
      history.push(routes.PURCHASE_ORDER(id));
    });
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
      });
    }
  }, [data]);

  const newOrderRequest = !request
    ? undefined
    : {
        ...request,
        requestedDate: new Date().toISOString(),
        requestedBy: Number(me?.id),
      };

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
          {data && data.status === 'approved' && me?.type === 'admin' && (
            <Col md={3}>
              <RoundedPanel className="mb-2">
                <ManageVoucherOrOrder
                  key={new Date().getUTCMilliseconds()}
                  variant="primary"
                  className="mb-2 w-100"
                  buttonLabel="new purchase order"
                  chargeId={Number(data.chargeId)}
                  hasOrderData
                  purchaseRequestId={Number(data.id)}
                  onSave={handleOnCreatePurchaseOrder}
                  title={'Create new Purchase Order'}
                  defaultValues={newOrderRequest}
                  loading={savingPurchaseOrder}
                />
              </RoundedPanel>
            </Col>
          )}
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
                <ManageVoucherOrOrder
                  key={new Date().getUTCMilliseconds()}
                  variant="primary"
                  className="mb-2 w-100"
                  buttonLabel="modify request"
                  chargeId={Number(data.chargeId)}
                  onSave={handleOnModifyPurchaseRequest}
                  title={'Modify Purchase Request'}
                  defaultValues={request}
                  loading={savingPurchaseRequest}
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
