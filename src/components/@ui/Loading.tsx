import {FaSpinner} from 'react-icons/fa';

type Props = {
  size?: number;
};

const Loading = (props: Props) => {
  return (
    <div className="text-center d-block" role="progressbar">
      <FaSpinner className="fa-spin" size={props.size} />
    </div>
  );
};

Loading.defaultProps = {
  size: 40,
};

export default Loading;
