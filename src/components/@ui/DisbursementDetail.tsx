import {formatDate} from '../../@utils/dates';
import {DisbursementAttr} from '../../Api';
import {Currency} from './Currency';

type Props = {
  disbursement: DisbursementAttr;
  noCurrencyColor?: boolean;
};

const DisbursementDetail = ({disbursement, noCurrencyColor}: Props) => {
  return (
    <>
      <div>{disbursement.details}</div>
      <div>
        <div className="d-inline pr-2">
          {disbursement.releasedByProfile && (
            <span className="pr-2">{disbursement.releasedByProfile.name}</span>
          )}
          <span className="text-muted pr-2">released</span>
          <strong>{disbursement.paymentType}</strong>
        </div>
        <div className="d-inline pr-2">
          <span className="text-muted pr-2">on</span>
          <strong>{formatDate(disbursement.createdAt, 'YYYY-MM-DD')}</strong>
        </div>
        <div className="d-inline pr-2">
          <span className="text-muted pr-2">with an amount of</span>
          <strong>
            <Currency
              currency={disbursement.amount}
              noCurrencyColor={noCurrencyColor}
            />
          </strong>
        </div>
        {disbursement.paymentType === 'check' && (
          <div className="text-muted">
            <small className="pr-3">
              <span>{disbursement.checkIssuingBank}</span>
            </small>
            <small className="pr-3">
              <span>{disbursement.checkNumber}</span>
            </small>
            <small>
              <span>
                {formatDate(disbursement.checkPostingDate, 'YYYY-MM-DD')}
              </span>
            </small>
          </div>
        )}
        {disbursement.paymentType === 'bank-transfer' && (
          <div className="text-muted">
            <small className="pr-3">
              <span>{disbursement.transferBank}</span>
            </small>
            <small className="pr-3">
              <span>{disbursement.referenceNumber}</span>
            </small>
            <small>
              <span>{formatDate(disbursement.transferDate, 'YYYY-MM-DD')}</span>
            </small>
          </div>
        )}
        {disbursement.paymentType === 'gcash' && (
          <div className="text-muted">
            <small className="pr-3">
              <span>{disbursement.transferTo}</span>
            </small>
            <small className="pr-3">
              <span>{disbursement.referenceNumber}</span>
            </small>
            <small>
              <span>{formatDate(disbursement.transferDate, 'YYYY-MM-DD')}</span>
            </small>
          </div>
        )}
        {disbursement.charge && (
          <>
            <span className="text-muted pr-2">for</span>
            {disbursement.charge.code}
          </>
        )}
      </div>
    </>
  );
};

export default DisbursementDetail;
