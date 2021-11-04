import {useState} from 'react';
import {Button, ButtonProps} from 'react-bootstrap';
import {FaCheck, FaSpinner} from 'react-icons/fa';

import {useNotifyApprovers} from '../../../Api';

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
  const {mutate, loading} = useNotifyApprovers({id: purchaseOrderId});

  const handleOnClick = () => {
    mutate().then(() => setNotified(true));
  };

  return (
    <>
      <Button
        {...buttonProps}
        onClick={handleOnClick}
        disabled={loading || notified}
      >
        {buttonLabel}
        {notified && <FaCheck className="ml-2" />}
        {loading && <FaSpinner className="fa-spin ml-2" />}
      </Button>
    </>
  );
};

export default NotifyApprovers;
