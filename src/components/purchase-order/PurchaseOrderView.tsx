import {useEffect, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {sum} from '../../@utils/helpers';
import {
  CreateVoucherOrOrder,
  DisbursementAttr,
  ExpenseAttr,
  useGetPurchaseOrder,
  usePostPurchaseOrderDisbursement,
  useUpdatePurchaseOrder,
} from '../../Api';
import {useUrl} from '../../hooks';
import {useRootState} from '../../store';
import AddDisbursement from '../@ui/AddDisbursement';
import DisbursementList from '../@ui/DisbursementList';
import ExpenseTable from '../@ui/ExpenseTable';
import Loading from '../@ui/Loading';
import ManageVoucherOrOrder from '../@ui/ManageVoucherOrOrder';
import RoundedPanel from '../@ui/RoundedPanel';
import ApprovePurchaseOrder from './actions/ApprovePurchaseOrder';
import CancelPurchaseOrder from './actions/CancelPurchaseOrder';
import NotifyApprovers from './actions/NotifyApprovers';
import PrintPurchaseOrder from './actions/PrintPurchaseOrder';
import RejectPurchaseOrder from './actions/RejectPurchaseOrder';
import PurchaseOrderDetails from './PurchaseOrderDetails';

const PurchaseOrderView = () => {
  const [request, setRequest] = useState<CreateVoucherOrOrder>();
  const [remainingCost, setRemainingCost] = useState<number>(0);
  const {me} = useRootState(state => state.profile);
  const {id} = useUrl();
  const purchaseOrderId = Number(id);
  const {data, loading, refetch} = useGetPurchaseOrder({
    id: purchaseOrderId,
  });
  const {mutate, loading: savingPurchaseOrder} = useUpdatePurchaseOrder({
    id: Number(data?.id),
  });
  const {mutate: mutatePurchaseOrderDisbursement, loading: savingDisbursement} =
    usePostPurchaseOrderDisbursement({
      id: Number(data?.id),
    });

  const renderCancel =
    data && data.disbursements && data.disbursements.length === 0;
  const renderAddDisbursement = remainingCost > 0;

  const handleOnModifyPurchaseOrder = (formData: CreateVoucherOrOrder) => {
    mutate(formData).then(() => refetch());
  };

  const handleOnDisburse = (d: DisbursementAttr) => {
    const forCashPayment: DisbursementAttr = {
      details: d.details,
      releasedBy: d.releasedBy,
      amount: d.amount,
      paymentType: 'cash',
      chargeId: Number(data?.chargeId),
    };
    const forCheckPayment: DisbursementAttr = {
      amount: d.amount,
      details: d.details,
      paymentType: d.paymentType,
      chargeId: Number(data?.chargeId),
      releasedBy: d.releasedBy,
      checkIssuingBank: d.checkIssuingBank,
      checkNumber: d.checkNumber,
      checkPostingDate: d.checkPostingDate
        ? new Date(d.checkPostingDate).toISOString()
        : undefined,
    };
    const sanitized =
      d.paymentType === 'cash' ? forCashPayment : forCheckPayment;
    mutatePurchaseOrderDisbursement(sanitized).then(() => refetch());
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
      setRemainingCost(
        data.totalCost - sum(data.disbursements?.map(d => d.amount))
      );
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
                <DisbursementList disbursements={data.disbursements} />
              </>
            )}
          </Col>
          {data &&
            data.status === 'approved' &&
            me?.type === 'admin' &&
            (renderAddDisbursement || renderCancel) && (
              <Col md={3}>
                {renderAddDisbursement && (
                  <AddDisbursement
                    key={new Date().getUTCMilliseconds()}
                    chargeId={data.chargeId}
                    maxValue={remainingCost}
                    onDisburse={handleOnDisburse}
                    className="mb-2 w-100"
                    size={undefined}
                    buttonLabel="add disbursement"
                    disabled={savingDisbursement}
                  />
                )}
                {renderCancel && (
                  <CancelPurchaseOrder
                    className="mb-2 w-100"
                    variant="warning"
                    buttonLabel="cancel"
                    purchaseOrderId={purchaseOrderId}
                    onCancel={() => refetch()}
                  />
                )}
              </Col>
            )}
          {data && data.status === 'pending' && me?.type === 'admin' && (
            <Col md={3}>
              <RoundedPanel className="mb-2">
                <ApprovePurchaseOrder
                  className="mb-2 w-100"
                  variant="success"
                  buttonLabel="approve"
                  purchaseOrder={data}
                  onApprove={() => refetch()}
                />
                <RejectPurchaseOrder
                  className="mb-2 w-100"
                  variant="danger"
                  buttonLabel="reject"
                  purchaseOrder={data}
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
