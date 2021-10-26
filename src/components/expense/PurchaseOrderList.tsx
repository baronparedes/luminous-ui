import {Link} from 'react-router-dom';

import routes from '../../@utils/routes';
import {RequestStatus, useGetAllPurchaseOrderByStatus} from '../../Api';
import ErrorInfo from '../@ui/ErrorInfo';
import RoundedPanel from '../@ui/RoundedPanel';
import {Table} from '../@ui/Table';

type Props = {
  status: RequestStatus;
};

const PendingPurchaseOrders = ({status}: Props) => {
  const {data, error, loading} = useGetAllPurchaseOrderByStatus({
    status,
  });

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
          renderHeaderContent={<h4>Purchase Requests</h4>}
        >
          {data && !loading && !error && (
            <tbody>
              {data.map(row => {
                return (
                  <tr>
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
                    <td>{row.totalCost}</td>
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

export default PendingPurchaseOrders;
