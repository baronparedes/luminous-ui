import {Col, Row} from 'react-bootstrap';

import {Currency} from '../@ui/Currency';
import {LabeledCurrency} from '../@ui/LabeledCurrency';
import RoundedPanel from '../@ui/RoundedPanel';
import {Table} from '../@ui/Table';

const PropertyStatementOfAccount = () => {
  return (
    <>
      <RoundedPanel className="mb-3 text-center">
        <Row style={{fontSize: '1.2em'}}>
          <Col>
            <LabeledCurrency
              label="balance forwarded"
              currency={1280.5}
              pill
              noCurrencyColor
              variant="info"
            />
          </Col>
          <Col>
            <LabeledCurrency
              label="current balance"
              currency={1280.5}
              pill
              noCurrencyColor
              variant="danger"
            />
          </Col>
        </Row>
      </RoundedPanel>
      <RoundedPanel className="p-0 m-auto">
        <Table
          renderHeaderContent={<h5>SOA - SEP 2020</h5>}
          headers={['id', 'amount', 'description', 'rate', 'area', 'date']}
        >
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <strong>
                  <Currency noCurrencyColor currency={1280.5} />
                </strong>
              </td>
              <td>CONDO DUES</td>
              <td>60</td>
              <td>90.5</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>1</td>
              <td>
                <strong>
                  <Currency noCurrencyColor currency={1280.5} />
                </strong>
              </td>
              <td>CONDO DUES</td>
              <td>60</td>
              <td>90.5</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>1</td>
              <td>
                <strong>
                  <Currency noCurrencyColor currency={1280.5} />
                </strong>
              </td>
              <td>CONDO DUES</td>
              <td>60</td>
              <td>90.5</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>1</td>
              <td>
                <strong>
                  <Currency noCurrencyColor currency={1280.5} />
                </strong>
              </td>
              <td>CONDO DUES</td>
              <td>60</td>
              <td>90.5</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
          </tbody>
        </Table>
      </RoundedPanel>
    </>
  );
};

export default PropertyStatementOfAccount;
