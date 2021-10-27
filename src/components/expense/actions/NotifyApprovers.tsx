import {Button, ButtonProps} from 'react-bootstrap';

type Props = {
  purchaseOrderId: number;
  buttonLabel: string;
};

const NotifyApprovers = ({
  purchaseOrderId,
  buttonLabel,
  ...buttonProps
}: Props & ButtonProps) => {
  const handleOnClick = () => {
    console.log(purchaseOrderId);
  };

  return (
    <>
      <Button {...buttonProps} onClick={handleOnClick}>
        {buttonLabel}
      </Button>
    </>
  );
};

export default NotifyApprovers;
