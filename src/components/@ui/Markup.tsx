import sanitize from 'sanitize-html';

type Props = {
  value: string;
};

const Markup = ({value}: Props) => {
  return <div dangerouslySetInnerHTML={{__html: sanitize(value)}}></div>;
};

export default Markup;
