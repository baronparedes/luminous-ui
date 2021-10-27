import {useState} from 'react';
import {Button, ButtonGroup, Col, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import routes from '../../@utils/routes';
import {RequestStatus, useGetAllPurchaseOrderByStatus} from '../../Api';
import {Currency} from '../@ui/Currency';
import ErrorInfo from '../@ui/ErrorInfo';
import RoundedPanel from '../@ui/RoundedPanel';
import {Table} from '../@ui/Table';

const PurchaseOrderList = () => {
  const [selectedStatus, setSelectedStatus] =
    useState<RequestStatus>('pending');
  const {data, error, loading} = useGetAllPurchaseOrderByStatus({
    status: selectedStatus,
  });

  const handleOnStatusChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedStatus(
      e.currentTarget.textContent?.toLowerCase() as RequestStatus
    );
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
          renderFooterContent={
            <>
              {error && (
                <div className="m-2 pb-2">
                  <ErrorInfo>{error.message}</ErrorInfo>
                </div>
              )}
            </>
          }
          renderHeaderContent={
            <>
              <Row>
                <Col className="mb-2">
                  <div className="center-content">
                    <h5 className="m-auto">
                      Purchase Request ({selectedStatus})
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
          {data && !loading && !error && (
            <tbody>
              {data.map(row => {
                return (
                  <tr key={Number(row.id)}>
                    <td>
                      <Link
                        className="text-underline"
                        to={routes.PURCHASE_ORDER(row.id)}
                      >
                        PO-{row.id}
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
