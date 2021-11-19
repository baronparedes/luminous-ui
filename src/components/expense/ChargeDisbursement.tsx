import {Badge, Col, Row} from 'react-bootstrap';

import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';

type Props = {
  chargeId: number;
  code: string;
  balance: number;
};

const ChargeDisbursement = ({code, balance}: Props) => {
  return (
    <>
      <RoundedPanel className="p-3 mb-3">
        <Row>
          <Col className="text-right">
            <h3>
              <Badge pill variant="primary">
                {code}
              </Badge>
            </h3>
            <h2>
              <Currency currency={balance} />
            </h2>
          </Col>
        </Row>
      </RoundedPanel>
    </>
  );
};

export default ChargeDisbursement;
