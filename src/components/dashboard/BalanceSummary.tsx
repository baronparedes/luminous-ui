import {Badge, Col, Row} from 'react-bootstrap';

import {ChargeBalance, useChargeBalance} from '../../hooks/useChargeBalance';
import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';

const ChargeBalanceSummary = ({code, balance}: ChargeBalance) => {
  return (
    <div>
      <small>
        <h5>
          <Badge pill variant="primary">
            {code}
          </Badge>
        </h5>
        <h4>
          <Currency currency={balance} />
        </h4>
      </small>
    </div>
  );
};

const BalanceSummary = () => {
  const {availableBalances, availableCommunityBalance} = useChargeBalance();

  return (
    <>
      <RoundedPanel className="p-4 text-center">
        <Row>
          <Col key={availableCommunityBalance.chargeId}>
            <ChargeBalanceSummary {...availableCommunityBalance} />
          </Col>
          {availableBalances &&
            availableBalances.map(chargeBalance => {
              return (
                <Col key={chargeBalance.chargeId}>
                  <ChargeBalanceSummary {...chargeBalance} />
                </Col>
              );
            })}
        </Row>
      </RoundedPanel>
    </>
  );
};

export default BalanceSummary;
