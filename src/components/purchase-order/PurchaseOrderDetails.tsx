import {Col, Row} from 'react-bootstrap';

import {PurchaseOrderAttr} from '../../Api';
import {LabeledCurrency} from '../@ui/LabeledCurrency';
import RoundedPanel from '../@ui/RoundedPanel';
import PurchaseOrderCard from './PurchaseOrderCard';

type Props = {
  purchaseOrder: PurchaseOrderAttr;
};

const PurchaseOrderDetails = ({purchaseOrder}: Props) => {
  return (
    <>
      <RoundedPanel className="p-4 mb-3">
        <Row>
          <Col md={8}>
            <PurchaseOrderCard purchaseOrder={purchaseOrder} />
          </Col>
          <Col md={4}>
            <LabeledCurrency
              label="total cost"
              pill
              variant="primary"
              className="text-right"
              noCurrencyColor
              currency={purchaseOrder.totalCost}
            />
          </Col>
        </Row>
      </RoundedPanel>
      <RoundedPanel className="p-4 mb-3">
        <Row>
          <Col>
            <label>
              <strong>Vendor name </strong>
              <p>{purchaseOrder.vendorName}</p>
            </label>
          </Col>
          <Col>
            <label>
              <strong>Fulfillment date </strong>
              <p>{purchaseOrder.fulfillmentDate}</p>
            </label>
          </Col>
          <Col>
            <label>
              <strong>Other details </strong>
              <p>{purchaseOrder.otherDetails}</p>
            </label>
          </Col>
        </Row>
      </RoundedPanel>
    </>
  );
};

export default PurchaseOrderDetails;
