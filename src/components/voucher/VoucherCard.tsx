import {Badge} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import {getNames} from '../../@utils/helpers';
import routes from '../../@utils/routes';
import {VoucherAttr} from '../../Api';
import {STATUS_VARIANT} from '../../constants';

type Props = {
  voucher: VoucherAttr;
};

const VoucherCard = ({voucher}: Props) => {
  return (
    <>
      {voucher.charge && (
        <div className="mb-3 text-muted">
          <small>
            <strong>{voucher.charge?.code}</strong>
          </small>
        </div>
      )}
      <Link className="text-underline" to={routes.VOUCHER(voucher.id)}>
        <h4>V-{voucher.series}</h4>
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

export default VoucherCard;
