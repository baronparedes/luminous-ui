import {Badge} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {getNames} from '../../@utils/helpers';
import routes from '../../@utils/routes';
import {PurchaseRequestAttr} from '../../Api';

type Props = {
  purchaseRequest: PurchaseRequestAttr;
};

const STATUS_VARIANT = {
  pending: 'primary',
  rejected: 'danger',
  approved: 'success',
};

const PurchaseRequestCard = ({purchaseRequest}: Props) => {
  return (
    <>
      <Link className="text-underline" to={routes.VOUCHER(purchaseRequest.id)}>
        <h4>PR-{purchaseRequest.id}</h4>
      </Link>
      <div>
        <small>
          <p className="text-wrap">
            requested by {purchaseRequest.requestedByProfile?.name}
          </p>
        </small>
        <p className="text-wrap">{purchaseRequest.description}</p>
      </div>
      {purchaseRequest.comments && (
        <div className="text-muted">
          <div>
            <small>comments</small>
          </div>
          <p className="text-wrap">{purchaseRequest.comments}</p>
        </div>
      )}
      <div className="mt-2">
        <Badge variant={STATUS_VARIANT[purchaseRequest.status]}>
          {purchaseRequest.status.toUpperCase()}
        </Badge>
        {purchaseRequest.status === 'approved' &&
          purchaseRequest.approverProfiles &&
          purchaseRequest.approverProfiles.length > 0 && (
            <small className="text-muted ml-2">
              by {getNames(purchaseRequest.approverProfiles)}
            </small>
          )}
        {purchaseRequest.status === 'rejected' &&
          purchaseRequest.rejectedByProfile && (
            <small className="text-muted ml-2">
              by {purchaseRequest.rejectedByProfile?.name}
            </small>
          )}
      </div>
    </>
  );
};

export default PurchaseRequestCard;
