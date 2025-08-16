import {useState} from 'react';
import {Badge, Col, Container, Row} from 'react-bootstrap';

import {
  RequestStatus,
  useGetAllPurchaseOrdersByChargeAndStatus,
} from '../../Api';
import {useChargeBalance} from '../../hooks';
import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';
import PurchaseOrderList from '../purchase-order/PurchaseOrderList';

const OrderView = () => {
  const {availableCommunityBalance} = useChargeBalance();
  const [selectedStatus, setSelectedStatus] =
    useState<RequestStatus>('pending');
  const {data, loading} = useGetAllPurchaseOrdersByChargeAndStatus({
    chargeId: availableCommunityBalance.chargeId,
    status: selectedStatus,
  });

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
            </Row>
          </RoundedPanel>
          <PurchaseOrderList
            purchaseOrders={data}
            loading={loading}
            onSelectedStatusChange={setSelectedStatus}
            selectedStatus={selectedStatus}
          />
        </>
      </Container>
    </>
  );
};

export default OrderView;
