import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {ThunkAction} from 'redux-thunk';

import {Action, combineReducers, configureStore} from '@reduxjs/toolkit';

import profileReducer from './reducers/profile.reducer';
import settingReducer from './reducers/setting.reducer';

const rootReducer = combineReducers({
  profile: profileReducer,
  setting: settingReducer,
});

const store = createStore();

export function createStore() {
  return configureStore({
    reducer: rootReducer,
  });
}
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export const useRootState: TypedUseSelectorHook<RootState> = useSelector;
export default store;
