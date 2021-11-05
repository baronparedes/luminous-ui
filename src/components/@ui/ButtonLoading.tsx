import {Button, ButtonProps} from 'react-bootstrap';
import {FaCheck} from 'react-icons/fa';

import Loading from './Loading';

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
        {loading && (
          <div className="ml-2">
            <Loading />
          </div>
        )}
      </Button>
    </>
  );
};

export default ButtonLoading;
