import {Badge, Button, Col, Container, Row} from 'react-bootstrap';

import {useAvailableBalance} from '../../hooks/useAvailableBalance';
import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';
import PurchaseOrderList from './PurchaseOrderList';

const ExpenseView = () => {
  const {data} = useAvailableBalance();

  return (
    <>
      <Container>
        <RoundedPanel className="p-4">
          <Row>
            <Col sm={12} md={9}>
              <div>
                <h4>
                  <Badge pill variant="primary">
                    available funds
                  </Badge>
                </h4>
                {data && (
                  <h3>
                    <Currency currency={data} />
                  </h3>
                )}
              </div>
            </Col>
            <Col className="text-right">
              <Button variant="primary" className="w-100">
                create new Request
              </Button>
            </Col>
          </Row>
        </RoundedPanel>
        <PurchaseOrderList status="pending" />
      </Container>
    </>
  );
};

export default ExpenseView;
