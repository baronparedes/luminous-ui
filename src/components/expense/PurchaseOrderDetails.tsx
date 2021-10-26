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
  );
};

export default PurchaseOrderDetails;
