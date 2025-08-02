import {useEffect, useState} from 'react';
import {Col, Container, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {
  CreateVoucherOrOrder,
  ExpenseAttr,
  useGetVoucher,
  useUpdateVoucher,
} from '../../Api';
import {useUrl} from '../../hooks';
import {useRootState} from '../../store';
import DisbursementList from '../@ui/DisbursementList';
import ExpenseTable from '../@ui/ExpenseTable';
import Loading from '../@ui/Loading';
import ManageVoucherOrOrder from '../@ui/ManageVoucherOrOrder';
import RoundedPanel from '../@ui/RoundedPanel';
import ApproveVoucher from './actions/ApproveVoucher';
import NotifyApprovers from './actions/NotifyApprovers';
import PrintVoucher from './actions/PrintVoucher';
import RejectVoucher from './actions/RejectVoucher';
import VoucherDetails from './VoucherDetails';

const VoucherView = () => {
  const [request, setRequest] = useState<CreateVoucherOrOrder>();
  const {me} = useRootState(state => state.profile);
  const {id} = useUrl();
  const voucherId = Number(id);
  const {data, loading, refetch} = useGetVoucher({
    id: voucherId,
  });
  const {mutate, loading: savingVoucher} = useUpdateVoucher({
    id: Number(data?.id),
  });

  const handleOnModifyVoucher = (data: CreateVoucherOrOrder) => {
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
          <Col>{data && <VoucherDetails voucher={data} />}</Col>
        </Row>
        <Row>
          <Col>
            {data && (
              <>
                <ExpenseTable
                  expenses={data.expenses}
                  appendHeaderContent={
                    <PrintVoucher
                      voucher={data}
                      variant="secondary"
                      buttonLabel={<FaPrint title="print voucher" />}
                    />
                  }
                />
                <DisbursementList disbursements={data.disbursements} />
              </>
            )}
          </Col>
          {data && data.status === 'pending' && me?.type === 'admin' && (
            <Col md={3}>
              <RoundedPanel className="mb-2">
                <ApproveVoucher
                  className="mb-2 w-100"
                  variant="success"
                  buttonLabel="approve"
                  chargeId={Number(data.chargeId)}
                  voucher={data}
                  totalCost={data.totalCost}
                  onApproveVoucher={() => refetch()}
                />
                <RejectVoucher
                  className="mb-2 w-100"
                  variant="danger"
                  buttonLabel="reject"
                  voucher={data}
                  onRejectVoucher={() => refetch()}
                />
                <NotifyApprovers
                  className="mb-2 w-100"
                  buttonLabel="notify approvers"
                  voucherId={Number(data.id)}
                />
                <ManageVoucherOrOrder
                  key={new Date().getUTCMilliseconds()}
                  variant="primary"
                  className="mb-2 w-100"
                  buttonLabel="modify voucher"
                  chargeId={Number(data.chargeId)}
                  onSave={handleOnModifyVoucher}
                  title={'Modify Voucher'}
                  defaultValues={request}
                  loading={savingVoucher}
                />
              </RoundedPanel>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default VoucherView;
