import {Col, Container, Row} from 'react-bootstrap';
import {FaPrint} from 'react-icons/fa';

import {useGetVoucher} from '../../Api';
import {useUrl} from '../../hooks/useUrl';
import {useRootState} from '../../store';
import Loading from '../@ui/Loading';
import RoundedPanel from '../@ui/RoundedPanel';
import ApproveVoucher from './actions/ApproveVoucher';
import NotifyApprovers from './actions/NotifyApprovers';
import PrintVoucher from './actions/PrintVoucher';
import RejectVoucher from './actions/RejectVoucher';
import VoucherDetails from './VoucherDetails';
import VoucherDisbursements from './VoucherDisbursements';
import VoucherExpenses from './VoucherExpenses';

const VoucherView = () => {
  const {me} = useRootState(state => state.profile);
  const {id} = useUrl();
  const voucherId = Number(id);
  const {data, loading, refetch} = useGetVoucher({
    id: voucherId,
  });

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
                <VoucherExpenses
                  expenses={data.expenses}
                  appendHeaderContent={
                    <PrintVoucher
                      voucher={data}
                      variant="secondary"
                      buttonLabel={<FaPrint title="print voucher" />}
                    />
                  }
                />
                <VoucherDisbursements disbursements={data.disbursements} />
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
                  voucherId={Number(data.id)}
                  totalCost={data.totalCost}
                  onApproveVoucher={() => refetch()}
                />
                <RejectVoucher
                  className="mb-2 w-100"
                  variant="danger"
                  buttonLabel="reject"
                  voucherId={Number(data.id)}
                  onRejectVoucher={() => refetch()}
                />
                <NotifyApprovers
                  className="mb-2 w-100"
                  buttonLabel="notify approvers"
                  voucherId={Number(data.id)}
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
