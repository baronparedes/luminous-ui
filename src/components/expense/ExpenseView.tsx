import {Badge, Col, Container, Row} from 'react-bootstrap';

import {useCommunityBalance} from '../../hooks/useCommunityBalance';
import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';
import CreatePurchaseOrder from './actions/CreatePurchaseOrder';
import PurchaseOrderList from './PurchaseOrderList';

const ExpenseView = () => {
  const {data} = useCommunityBalance();

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
              <CreatePurchaseOrder
                variant="primary"
                className="w-100"
                buttonLabel="create new request"
                onCreatePurchaseOrder={() => window.location.reload()}
              />
            </Col>
          </Row>
        </RoundedPanel>
        <PurchaseOrderList />
      </Container>
    </>
  );
};

export default ExpenseView;
