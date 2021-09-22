import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AuthProfile, PropertyAccount} from '../../Api';
import {AppThunk} from '../../store';
import localStore from '../local';

export type ProfileState = {
  me?: AuthProfile;
  propertyAccounts?: PropertyAccount[];
  token?: string;
};

export type UpdateCurrentProfilePayload = {
  name: string;
  email: string;
  mobileNumber?: string;
  remarks?: string;
};

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
    updatePropertyAccounts: (
      state,
      action: PayloadAction<PropertyAccount[]>
    ) => {
      state.propertyAccounts = action.payload;
    },
    updateCurrentProfile: (
      state,
      action: PayloadAction<UpdateCurrentProfilePayload>
    ) => {
      if (state.me) {
        state.me.email = action.payload.email;
        state.me.name = action.payload.name;
        state.me.mobileNumber = action.payload.mobileNumber;
        state.me.remarks = action.payload.remarks;
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
