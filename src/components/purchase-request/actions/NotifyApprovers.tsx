import {useState} from 'react';
import {ButtonProps} from 'react-bootstrap';

import {useNotifyPurchaseRequestApprovers} from '../../../Api';
import ButtonLoading from '../../@ui/ButtonLoading';

type Props = {
  purchaseRequestId: number;
  buttonLabel: string;
};

const NotifyApprovers = ({
  purchaseRequestId,
  buttonLabel,
  ...buttonProps
}: Props & ButtonProps) => {
  const [notified, setNotified] = useState(false);
  const {mutate, loading} = useNotifyPurchaseRequestApprovers({
    id: purchaseRequestId,
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
