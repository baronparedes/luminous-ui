import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {CategoryAttr, SettingAttr} from '../../Api';

export type SettingState = {
  values: SettingAttr[];
  categories: CategoryAttr[];
};

export type UpdateSettingPayload = {
  key: string;
  value: string;
};

const initialState: SettingState = {values: [], categories: []};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<SettingAttr[]>) => {
      state.values = action.payload;
    },
    updateSetting: (state, action: PayloadAction<UpdateSettingPayload>) => {
      state.values = state.values.filter(s => s.key !== action.payload.key);
      state.values.push({
        key: action.payload.key,
        value: action.payload.value,
      });
    },
    updateCategories: (state, action: PayloadAction<CategoryAttr[]>) => {
      state.categories = action.payload;
    },
  },
});

const {actions, reducer} = settingSlice;
export const settingActions = {
  ...actions,
};
export default reducer;
