import {useState} from 'react';
import {Badge, Col, Container, Row} from 'react-bootstrap';

import {
  CreateVoucherOrOrder,
  RequestStatus,
  useGetAllPurchaseRequestsByChargeAndStatus,
  usePostPurchaseRequest,
} from '../../Api';
import {useChargeBalance} from '../../hooks/useChargeBalance';
import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';
import ManagePurchaseRequest from '../purchase-request/actions/ManagePurchaseRequest';
import PurchaseRequestList from '../purchase-request/PurchaseRequestList';

const RequestView = () => {
  const {availableCommunityBalance} = useChargeBalance();
  const [selectedStatus, setSelectedStatus] =
    useState<RequestStatus>('pending');
  const {data, loading, refetch} = useGetAllPurchaseRequestsByChargeAndStatus({
    chargeId: availableCommunityBalance.chargeId,
    status: selectedStatus,
  });
  const {mutate, loading: creatingPurchaseRequest} = usePostPurchaseRequest({});

  const handleOnCreatePurchaseRequest = (data: CreateVoucherOrOrder) => {
    mutate(data).then(() => {
      refetch();
    });
  };
  return (
    <>
      <Container>
        <>
          <RoundedPanel className="p-4">
            <Row>
              <Col sm={12} md={9}>
                <div>
                  <h4>
                    <Badge pill variant="primary">
                      {availableCommunityBalance.code}
                    </Badge>
                  </h4>
                  <h3>
                    <Currency currency={availableCommunityBalance.balance} />
                  </h3>
                </div>
              </Col>
              <Col className="text-right">
                <ManagePurchaseRequest
                  variant="primary"
                  className="w-100"
                  buttonLabel="create new request"
                  chargeId={availableCommunityBalance.chargeId}
                  onSave={handleOnCreatePurchaseRequest}
                  title={'Create New Purchase Request'}
                  loading={creatingPurchaseRequest}
                />
              </Col>
            </Row>
          </RoundedPanel>
          <PurchaseRequestList
            purchaseRequests={data}
            loading={loading}
            onSelectedStatusChange={setSelectedStatus}
            selectedStatus={selectedStatus}
          />
        </>
      </Container>
    </>
  );
};

export default RequestView;
