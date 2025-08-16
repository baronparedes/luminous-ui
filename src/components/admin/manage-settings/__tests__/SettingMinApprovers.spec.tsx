import {render} from '@testing-library/react';
import {Provider} from 'react-redux';

import {DEFAULTS, SETTING_KEYS} from '../../../../constants';
import {createStore} from '../../../../store';
import {settingActions} from '../../../../store/reducers/setting.reducer';
import SettingMinApprovers from '../SettingMinApprovers';

describe('SettingMinApprovers', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it('should render with default value', () => {
    const {getByDisplayValue} = render(
      <Provider store={store}>
        <SettingMinApprovers />
      </Provider>
    );

    expect(
      getByDisplayValue(DEFAULTS.MIN_APPROVERS.toString())
    ).toBeInTheDocument();
  });

  it('should render with stored setting value', () => {
    const expectedValue = '5';
    store.dispatch(
      settingActions.updateSetting({
        key: SETTING_KEYS.MIN_APPROVERS,
        value: expectedValue,
      })
    );

    const {getByDisplayValue} = render(
      <Provider store={store}>
        <SettingMinApprovers />
      </Provider>
    );

    expect(getByDisplayValue(expectedValue)).toBeInTheDocument();
  });
});
