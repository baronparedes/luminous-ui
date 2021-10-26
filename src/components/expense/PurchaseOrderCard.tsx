import {Badge} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import routes from '../../@utils/routes';
import {PurchaseOrderAttr} from '../../Api';

type Props = {
  purchaseOrder: PurchaseOrderAttr;
};

const STATUS_VARIANT = {
  pending: 'primary',
  rejected: 'danger',
  approved: 'success',
};

const PurchaseOrdercard = ({purchaseOrder}: Props) => {
  return (
    <>
      <Link
        className="text-underline"
        to={routes.PURCHASE_ORDER(purchaseOrder.id)}
      >
        <h4>PO-{purchaseOrder.id}</h4>
      </Link>
      <div>
        <p className="text-wrap">{purchaseOrder.description}</p>
      </div>
      <div className="mt-2">
        <Badge variant={STATUS_VARIANT[purchaseOrder.status]}>
          {purchaseOrder.status.toUpperCase()}
        </Badge>
      </div>
      <div className="text-muted">{purchaseOrder.comments}</div>
    </>
  );
};

export default PurchaseOrdercard;
