import {Badge} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {getNames} from '../../@utils/helpers';
import routes from '../../@utils/routes';
import {VoucherAttr} from '../../Api';

type Props = {
  voucher: VoucherAttr;
};

const STATUS_VARIANT = {
  pending: 'primary',
  rejected: 'danger',
  approved: 'success',
};

const Vouchercard = ({voucher}: Props) => {
  return (
    <>
      <Link className="text-underline" to={routes.PURCHASE_ORDER(voucher.id)}>
        <h4>V-{voucher.id}</h4>
      </Link>
      <div>
        <small>
          <p className="text-wrap">
            requested by {voucher.requestedByProfile?.name}
          </p>
        </small>
        <p className="text-wrap">{voucher.description}</p>
      </div>
      {voucher.comments && (
        <div className="text-muted">
          <div>
            <small>comments</small>
          </div>
          <p className="text-wrap">{voucher.comments}</p>
        </div>
      )}
      <div className="mt-2">
        <Badge variant={STATUS_VARIANT[voucher.status]}>
          {voucher.status.toUpperCase()}
        </Badge>
        {voucher.status === 'approved' &&
          voucher.approverProfiles &&
          voucher.approverProfiles.length > 0 && (
            <small className="text-muted ml-2">
              by {getNames(voucher.approverProfiles)}
            </small>
          )}
        {voucher.status === 'rejected' && voucher.rejectedByProfile && (
          <small className="text-muted ml-2">
            by {voucher.rejectedByProfile?.name}
          </small>
        )}
      </div>
    </>
  );
};

export default Vouchercard;