import {Col, Row} from 'react-bootstrap';

import {PropertyAccount} from '../../Api';
import {LabeledCurrency} from '../@ui/LabeledCurrency';
import RoundedPanel from '../@ui/RoundedPanel';
import PropertyCard from './PropertyCard';

type Props = {
  propertyAccount: PropertyAccount;
};

const PropertyDetails = ({propertyAccount}: Props) => {
  return (
    <RoundedPanel className="p-4 mb-3">
      <Row>
        {propertyAccount.property && (
          <Col md={8}>
            <PropertyCard property={propertyAccount.property} />
          </Col>
        )}
        <Col md={4}>
          <LabeledCurrency
            label="balance"
            pill
            variant="danger"
            className="text-right"
            noCurrencyColor
            currency={propertyAccount.balance}
          />
        </Col>
      </Row>
    </RoundedPanel>
  );
};

export default PropertyDetails;
