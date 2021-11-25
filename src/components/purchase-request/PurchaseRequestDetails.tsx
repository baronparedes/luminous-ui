import {Col, Row} from 'react-bootstrap';

import {PurchaseRequestAttr} from '../../Api';
import {LabeledCurrency} from '../@ui/LabeledCurrency';
import RoundedPanel from '../@ui/RoundedPanel';
import PurchaseRequestCard from './PurchaseRequestCard';

type Props = {
  purchaseRequest: PurchaseRequestAttr;
};

const PurchaseRequestDetails = ({purchaseRequest}: Props) => {
  return (
    <RoundedPanel className="p-4 mb-3">
      <Row>
        <Col md={8}>
          <PurchaseRequestCard purchaseRequest={purchaseRequest} />
        </Col>
        <Col md={4}>
          <LabeledCurrency
            label="total cost"
            pill
            variant="primary"
            className="text-right"
            noCurrencyColor
            currency={purchaseRequest.totalCost}
          />
        </Col>
      </Row>
    </RoundedPanel>
  );
};

export default PurchaseRequestDetails;
