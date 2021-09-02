import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AuthProfile} from '../../Api';
import {AppThunk} from '../../store';
import localStore from '../local';

export type ProfileState = {
  me?: AuthProfile;
  token?: string;
};

export type UpdateCurrentProfilePayload = {name: string; email: string};

const PROFILE_KEY = 'LUMINOUS_PROFILE_KEY';

export const getProfileFromLocalStorage = () => {
  const state = localStore.getItem(PROFILE_KEY);
  if (state) {
    return {
      ...JSON.parse(state),
    };
  }
  return {};
};

const initialState: ProfileState = getProfileFromLocalStorage();

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<ProfileState>) => {
      state.me = action.payload.me;
      state.token = action.payload.token;
    },
    signOut: state => {
      state.me = undefined;
      state.token = undefined;
    },
    updateCurrentProfile: (
      state,
      action: PayloadAction<UpdateCurrentProfilePayload>
    ) => {
      if (state.me) {
        state.me.email = action.payload.email;
        state.me.name = action.payload.name;
      }
    },
  },
});

const signIn =
  (payload: ProfileState): AppThunk =>
  dispatch => {
    const state = JSON.stringify(payload);
    localStore.setItem(PROFILE_KEY, state);
    dispatch(actions.signIn(payload));
  };

const signOut = (): AppThunk => dispatch => {
  localStore.removeItem(PROFILE_KEY);
  dispatch(actions.signOut());
};

const {actions, reducer} = profileSlice;
export const profileActions = {
  ...actions,
  signIn,
  signOut,
};
export default reducer;
