import classNames from 'classnames';
import {FaSpinner} from 'react-icons/fa';

type Props = {
  size?: number;
  className?: string;
};

const Loading = (props: Props) => {
  return (
    <div
      className={classNames('text-center d-block', props.className)}
      role="progressbar"
    >
      <FaSpinner className="fa-spin" size={props.size} />
    </div>
  );
};

Loading.defaultProps = {
  size: 40,
};

export default Loading;
