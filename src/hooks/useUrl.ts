import {useLocation, useParams} from 'react-router-dom';

type Props = {
  [x: string]: string;
};

export function useUrl() {
  const query = new URLSearchParams(useLocation().search);
  const {id, ...rest} = useParams<Props>();
  return {
    id: isNaN(Number(id)) ? undefined : Number(id),
    ...rest,
    queryString: query.get,
  };
}
