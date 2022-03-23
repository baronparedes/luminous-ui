import {Button, ButtonGroup, Col, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import routes from '../../@utils/routes';
import {PurchaseOrderAttr, RequestStatus} from '../../Api';
import {Currency} from '../@ui/Currency';
import RoundedPanel from '../@ui/RoundedPanel';
import {Table} from '../@ui/Table';

type Props = {
  onSelectedStatusChange?: (status: RequestStatus) => void;
  loading?: boolean;
  purchaseOrders: PurchaseOrderAttr[] | null;
  selectedStatus: RequestStatus;
};

const PurchaseOrderList = ({
  onSelectedStatusChange,
  loading,
  purchaseOrders,
  selectedStatus,
}: Props) => {
  const handleOnStatusChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const status = e.currentTarget.textContent?.toLowerCase() as RequestStatus;
    onSelectedStatusChange && onSelectedStatusChange(status);
  };
  return (
    <>
      <RoundedPanel className="mt-3 p-0">
        <Table
          loading={loading}
          headers={[
            'id',
            'description',
            'requested by',
            'requested date',
            'total cost',
          ]}
          renderHeaderContent={
            <>
              <Row>
                <Col className="mb-2">
                  <div className="center-content">
                    <h5 className="m-auto">
                      Purchase Orders ({selectedStatus})
                    </h5>
                  </div>
                </Col>
                <Col className="text-right" md={4} sm={12}>
                  <ButtonGroup className="w-100">
                    <Button
                      onClick={handleOnStatusChange}
                      variant="info"
                      disabled={selectedStatus === 'pending'}
                    >
                      Pending
                    </Button>
                    <Button
                      onClick={handleOnStatusChange}
                      variant="success"
                      disabled={selectedStatus === 'approved'}
                    >
                      Approved
                    </Button>
                    <Button
                      onClick={handleOnStatusChange}
                      variant="danger"
                      disabled={selectedStatus === 'rejected'}
                    >
                      Rejected
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </>
          }
        >
          {purchaseOrders && !loading && (
            <tbody>
              {purchaseOrders.map(row => {
                return (
                  <tr key={Number(row.id)}>
                    <td style={{minWidth: '90px'}}>
                      <Link
                        className="text-underline"
                        to={routes.PURCHASE_ORDER(row.id)}
                      >
                        PO-{row.series}
                      </Link>
                    </td>
                    <td>{row.description}</td>
                    <td>{row.requestedByProfile?.name}</td>
                    <td>{row.requestedDate}</td>
                    <td>
                      <Currency noCurrencyColor currency={row.totalCost} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </Table>
      </RoundedPanel>
    </>
  );
};

export default PurchaseOrderList;
