import {useState} from 'react';
import {Badge, Col, Row} from 'react-bootstrap';

import {
  CreateVoucherOrOrder,
  RequestStatus,
  useGetAllVouchersByChargeAndStatus,
  usePostVoucher,
} from '../../Api';
import {Currency} from '../@ui/Currency';
import ManageVoucherOrOrder from '../@ui/ManageVoucherOrOrder';
import RoundedPanel from '../@ui/RoundedPanel';
import VoucherList from '../voucher/VoucherList';

type Props = {
  chargeId: number;
  code: string;
  balance: number;
};

const ChargeDisbursement = ({chargeId, code, balance}: Props) => {
  const [selectedStatus, setSelectedStatus] =
    useState<RequestStatus>('pending');
  const {data, loading, refetch} = useGetAllVouchersByChargeAndStatus({
    chargeId,
    status: selectedStatus,
  });
  const {mutate, loading: creatingVoucher} = usePostVoucher({});

  const handleCreateVoucher = (data: CreateVoucherOrOrder) => {
    mutate(data).then(() => {
      refetch();
    });
  };

  return (
    <>
      <RoundedPanel className="p-4">
        <Row>
          <Col sm={12} md={9}>
            <div>
              <h4>
                <Badge pill variant="primary">
                  {code}
                </Badge>
              </h4>
              <h3>
                <Currency currency={balance} />
              </h3>
            </div>
          </Col>
          <Col className="text-right">
            <ManageVoucherOrOrder
              variant="primary"
              className="w-100"
              buttonLabel="create new voucher"
              chargeId={chargeId}
              title={`Create New Voucher for ${code}`}
              disabled={creatingVoucher}
              loading={creatingVoucher}
              onSave={handleCreateVoucher}
            />
          </Col>
        </Row>
      </RoundedPanel>
      <VoucherList
        vouchers={data}
        loading={loading}
        onSelectedStatusChange={setSelectedStatus}
        selectedStatus={selectedStatus}
      />
    </>
  );
};

export default ChargeDisbursement;
