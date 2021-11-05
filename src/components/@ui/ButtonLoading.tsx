import {Button, ButtonProps} from 'react-bootstrap';
import {FaCheck, FaSpinner} from 'react-icons/fa';

type Props = {
  loading?: boolean;
  checked?: boolean;
};

const ButtonLoading: React.FC<Props & ButtonProps> = ({
  children,
  loading,
  checked,
  ...buttonProps
}) => {
  return (
    <>
      <Button {...buttonProps}>
        {children}
        {checked && <FaCheck className="ml-2" />}
        {loading && <FaSpinner className="fa-spin ml-2" />}
      </Button>
    </>
  );
};

export default ButtonLoading;
