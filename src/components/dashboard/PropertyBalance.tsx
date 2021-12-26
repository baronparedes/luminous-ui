import {useState} from 'react';
import {Col, Container, Form, Row} from 'react-bootstrap';
import {CSVLink} from 'react-csv';
import {Link} from 'react-router-dom';

import routes from '../../@utils/routes';
import {
  ChargeAttr,
  PropertyBalanceByChargeView,
  PropertyBalanceView,
} from '../../Api';
import ModalContainer from '../@ui/ModalContainer';
import RoundedPanel from '../@ui/RoundedPanel';
import {Table} from '../@ui/Table';
import PropertyBalanceByCharge from './PropertyBalanceByCharge';

type Props = {
  data: PropertyBalanceView[];
  breakdownData: PropertyBalanceByChargeView[];
  charges: ChargeAttr[] | null;
};

const PropertyBalance = ({data, breakdownData, charges}: Props) => {
  const [toggle, setToggle] = useState(false);
  const [threshold, setThreshold] = useState(15000);
  const thresholdData = data.filter(d => Number(d.balance) >= threshold);
  const propertyLabel = thresholdData.length > 1 ? 'properties' : 'property';

  return (
    <>
      <RoundedPanel className="p-3 text-center">
        <Row className="text-left mb-2">
          <Col>
            <div>
              Total of{' '}
              <strong>
                <a
                  href="#"
                  className="text-underline"
                  onClick={e => {
                    e.preventDefault();
                    setToggle(true);
                  }}
                >
                  {`${thresholdData.length} ${propertyLabel}`}
                </a>
              </strong>{' '}
              that have a balance of more than{' '}
              <Form.Control
                style={{width: '10em'}}
                className="d-inline"
                name="threshold"
                placeholder="threshold"
                onChange={e => setThreshold(Number(e.target.value))}
                value={threshold}
                type="number"
                required
                step="any"
                min={0}
              />
              <PropertyBalanceByCharge data={breakdownData} charges={charges} />
            </div>
          </Col>
        </Row>
      </RoundedPanel>
      <ModalContainer
        dialogClassName="mt-5"
        header={<h5>Properties</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
        size="lg"
      >
        <Container className="text-right p-3">
          <CSVLink
            data={thresholdData}
            filename={'property-balance.csv'}
            className="btn btn-primary"
            target="_blank"
          >
            Download
          </CSVLink>
        </Container>
        <Table headers={['code', 'collected', 'charged', 'balance']}>
          <tbody>
            {thresholdData.map(row => {
              return (
                <tr>
                  <td>
                    <Link
                      className="text-underline"
                      to={routes.PROPERTY(row.id)}
                    >
                      {row.code}
                    </Link>
                  </td>
                  <td>{row.collected}</td>
                  <td>{row.charged}</td>
                  <td>{row.balance}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ModalContainer>
    </>
  );
};

export default PropertyBalance;
