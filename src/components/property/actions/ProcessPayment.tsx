import {useState} from 'react';
import {Button} from 'react-bootstrap';

import ModalContainer from '../../@ui/ModalContainer';

type Props = {
  amount?: number;
};

const ProcessPayment = ({amount}: Props) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Button className="mb-2 w-100" onClick={() => setToggle(true)}>
        process payment
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
