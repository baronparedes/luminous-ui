import {Col, Row} from 'react-bootstrap';

import {VoucherAttr} from '../../Api';
import {LabeledCurrency} from '../@ui/LabeledCurrency';
import RoundedPanel from '../@ui/RoundedPanel';
import VoucherCard from './VoucherCard';

type Props = {
  voucher: VoucherAttr;
};

const VoucherDetails = ({voucher}: Props) => {
  return (
    <RoundedPanel className="p-4 mb-3">
      <Row>
        <Col md={8}>
          <VoucherCard voucher={voucher} />
        </Col>
        <Col md={4}>
          <LabeledCurrency
            label="total cost"
            pill
            variant="primary"
            className="text-right"
            noCurrencyColor
            currency={voucher.totalCost}
          />
        </Col>
      </Row>
    </RoundedPanel>
  );
};

export default VoucherDetails;
