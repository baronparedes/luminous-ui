import {useState} from 'react';
import {Button, ButtonProps} from 'react-bootstrap';

import ModalContainer from '../../@ui/ModalContainer';

type Props = {
  amount?: number;
  buttonLabel: string;
};

const ProcessPayment = ({
  amount,
  buttonLabel,
  ...buttonProps
}: Props & ButtonProps) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Button {...buttonProps} onClick={() => setToggle(true)}>
        {buttonLabel}
      </Button>
      <ModalContainer
        header={<h5>Process Payment</h5>}
        toggle={toggle}
        onClose={() => setToggle(false)}
      >
        Pay now! {amount}
      </ModalContainer>
    </>
  );
};

export default ProcessPayment;
