import {Badge, Button, Col, Container, Row} from 'react-bootstrap';

import {usePassOnBalance} from '../../hooks/usePassOnBalance';
import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';

const DisbursementView = () => {
  const {data} = usePassOnBalance();

  return (
    <>
      <Container>
        <RoundedPanel className="p-4">
          <Row>
            <Col sm={12} md={9}>
              <Row>
                {data.map(d => {
                  return (
                    <Col key={d.chargeId} className="text-center">
                      <h5>
                        <Badge pill variant="primary">
                          {d.code}
                        </Badge>
                      </h5>
                      {data && (
                        <h4>
                          <Currency currency={d.balance} />
                        </h4>
                      )}
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col className="text-right">
              <Button>New Disbursement</Button>
            </Col>
          </Row>
        </RoundedPanel>
      </Container>
    </>
  );
};

export default DisbursementView;
