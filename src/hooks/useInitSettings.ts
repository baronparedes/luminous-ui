import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useGetAllCategories, useGetAllSettings} from '../Api';
import {settingActions} from '../store/reducers/setting.reducer';

export function useInitSettings() {
  const dispatch = useDispatch();
  const {data: settings, refetch: refetchSettings} = useGetAllSettings({
    lazy: true,
  });
  const {data: categories, refetch: refetchCategories} = useGetAllCategories({
    lazy: true,
  });

  useEffect(() => {
    refetchSettings();
    refetchCategories();
  }, []);

  useEffect(() => {
    dispatch(settingActions.init(settings ?? []));
  }, [settings]);

  useEffect(() => {
    dispatch(settingActions.updateCategories(categories ?? []));
  }, [categories]);
}
