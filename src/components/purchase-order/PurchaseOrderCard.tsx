import {Badge} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {getNames} from '../../@utils/helpers';
import routes from '../../@utils/routes';
import {PurchaseOrderAttr} from '../../Api';
import {STATUS_VARIANT} from '../../constants';

type Props = {
  purchaseOrder: PurchaseOrderAttr;
};

const PurchaseOrderCard = ({purchaseOrder}: Props) => {
  return (
    <>
      <Link
        className="text-underline"
        to={routes.PURCHASE_REQUEST(purchaseOrder.id)}
      >
        <h4>PO-{purchaseOrder.series ?? purchaseOrder.id}</h4>
      </Link>
      <div>
        <small>
          <p className="text-wrap">
            requested by {purchaseOrder.requestedByProfile?.name}
          </p>
        </small>
        <p className="text-wrap">{purchaseOrder.description}</p>
      </div>
      {purchaseOrder.comments && (
        <div className="text-muted">
          <div>
            <small>comments</small>
          </div>
          <p className="text-wrap">{purchaseOrder.comments}</p>
        </div>
      )}
      <div className="mt-2">
        <Badge variant={STATUS_VARIANT[purchaseOrder.status]}>
          {purchaseOrder.status.toUpperCase()}
        </Badge>
        {purchaseOrder.status === 'approved' &&
          purchaseOrder.approverProfiles &&
          purchaseOrder.approverProfiles.length > 0 && (
            <small className="text-muted ml-2">
              by {getNames(purchaseOrder.approverProfiles)}
            </small>
          )}
        {['rejected', 'cancelled'].includes(purchaseOrder.status) &&
          purchaseOrder.rejectedByProfile && (
            <small className="text-muted ml-2">
              by {purchaseOrder.rejectedByProfile?.name}
            </small>
          )}
      </div>
    </>
  );
};

export default PurchaseOrderCard;
