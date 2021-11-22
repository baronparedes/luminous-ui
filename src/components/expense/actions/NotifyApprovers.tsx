import {useState} from 'react';
import {ButtonProps} from 'react-bootstrap';

import {useNotifyApprovers} from '../../../Api';
import ButtonLoading from '../../@ui/ButtonLoading';

type Props = {
  voucherId: number;
  buttonLabel: string;
};

const NotifyApprovers = ({
  voucherId,
  buttonLabel,
  ...buttonProps
}: Props & ButtonProps) => {
  const [notified, setNotified] = useState(false);
  const {mutate, loading} = useNotifyApprovers({id: voucherId});

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
