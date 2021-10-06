import {PaymentDetailAttr} from '../../Api';
import {Currency} from './Currency';

type Props = {
  paymentDetail: PaymentDetailAttr;
  totalCollected: number;
  noCurrencyColor?: boolean;
};

const PaymentDetail = ({
  paymentDetail,
  totalCollected,
  noCurrencyColor,
}: Props) => {
  return (
    <>
      <div className="d-inline pr-2">
        <span className="text-muted pr-2">OR#</span>
        {paymentDetail.orNumber}
      </div>
      <div className="d-inline pr-2">
        <span className="text-muted pr-2">received</span>
        {paymentDetail.paymentType}
      </div>
      <div className="d-inline pr-2">
        <span className="text-muted pr-2">with an amount of</span>
        <Currency currency={totalCollected} noCurrencyColor={noCurrencyColor} />
      </div>
      {paymentDetail.paymentType === 'check' && (
        <div className="text-muted">
          <small className="pr-3">
            <span>{paymentDetail.checkIssuingBank}</span>
          </small>
          <small className="pr-3">
            <span>{paymentDetail.checkNumber}</span>
          </small>
          <small>
            <span>{paymentDetail.checkPostingDate}</span>
          </small>
        </div>
      )}
    </>
  );
};

export default PaymentDetail;
