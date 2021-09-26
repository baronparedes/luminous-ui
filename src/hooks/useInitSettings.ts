import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useGetAllSettings} from '../Api';
import {settingActions} from '../store/reducers/setting.reducer';

export function useInitSettings() {
  const dispatch = useDispatch();
  const {data, refetch} = useGetAllSettings({lazy: true});

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    dispatch(settingActions.init(data ?? []));
  }, [data]);
}
