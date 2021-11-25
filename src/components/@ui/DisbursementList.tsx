import {Col, Container, ListGroup, Row} from 'react-bootstrap';

import {DisbursementAttr} from '../../Api';
import DisbursementDetail from './DisbursementDetail';
import RoundedPanel from './RoundedPanel';

type Props = {
  disbursements?: DisbursementAttr[];
};

const DisbursementList = ({disbursements}: Props) => {
  return (
    <>
      {disbursements && disbursements.length > 0 && (
        <RoundedPanel className="mt-3 p-2">
          <ListGroup>
            {disbursements.map((item, i) => {
              return (
                <ListGroup.Item key={i} className="p-2">
                  <Container>
                    <Row>
                      <Col>
                        <DisbursementDetail disbursement={item} />
                      </Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </RoundedPanel>
      )}
    </>
  );
};

export default DisbursementList;
