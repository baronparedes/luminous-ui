import {EntityError} from '../../Api';
import ErrorInfo from './ErrorInfo';

type Props = {
  error: EntityError | string;
};

export const RequestErrorInfo = ({error}: Props) => {
  if (typeof error === 'string') {
    return <ErrorInfo>{error}</ErrorInfo>;
  }

  if (error.fieldErrors) {
    return (
      <ErrorInfo>
        <ul>
          {error.fieldErrors.map(fe => {
            return <li>{fe.message}</li>;
          })}
        </ul>
      </ErrorInfo>
    );
  }

  return <ErrorInfo>{error.message}</ErrorInfo>;
};
