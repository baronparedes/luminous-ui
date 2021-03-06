import {useState} from 'react';
import {ButtonProps} from 'react-bootstrap';

import {useNotifyPurchaseOrderApprovers} from '../../../Api';
import ButtonLoading from '../../@ui/ButtonLoading';

type Props = {
  purchaseOrderId: number;
  buttonLabel: string;
};

const NotifyApprovers = ({
  purchaseOrderId,
  buttonLabel,
  ...buttonProps
}: Props & ButtonProps) => {
  const [notified, setNotified] = useState(false);
  const {mutate, loading} = useNotifyPurchaseOrderApprovers({
    id: purchaseOrderId,
  });

  const handleOnClick = () => {
    mutate().then(() => setNotified(true));
  };

  return (
    <>
      <ButtonLoading
        {...buttonProps}
        onClick={handleOnClick}
        disabled={loading || notified}
        loading={loading}
        checked={notified}
      >
        {buttonLabel}
      </ButtonLoading>
    </>
  );
};

export default NotifyApprovers;
