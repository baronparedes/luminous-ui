import {Col, Row} from 'react-bootstrap';

import {ExpenseAttr} from '../../Api';
import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';
import {Table} from '../@ui/Table';

type Props = {
  expenses?: ExpenseAttr[];
};

const PurchaseOrderExpenses = ({expenses}: Props) => {
  return (
    <>
      <RoundedPanel>
        <Table
          renderHeaderContent={
            <>
              <Row>
                <Col>
                  <div className="center-content">
                    <h5 className="m-auto">Expenses</h5>
                  </div>
                </Col>
              </Row>
            </>
          }
          headers={[
            'category',
            'description',
            'quantity',
            'unit cost',
            'total cost',
          ]}
        >
          <tbody>
            {expenses &&
              expenses.map((e, i) => {
                return (
                  <tr key={i}>
                    <td>{e.category}</td>
                    <td>{e.description}</td>
                    <td>{e.quantity}</td>
                    <td>
                      <strong>
                        <Currency noCurrencyColor currency={e.unitCost} />
                      </strong>
                    </td>
                    <td>
                      <strong>
                        <Currency noCurrencyColor currency={e.totalCost} />
                      </strong>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </RoundedPanel>
    </>
  );
};

export default PurchaseOrderExpenses;
