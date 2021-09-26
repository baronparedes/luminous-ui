import faker from 'faker';
import nock from 'nock';

import {fireEvent, waitFor} from '@testing-library/react';

import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {SettingAttr} from '../../../../Api';
import {SETTING_KEYS} from '../../../../constants';
import {settingActions} from '../../../../store/reducers/setting.reducer';
import SettingBillingCutoff from '../SettingBillingCutoff';

describe('SettingBillingCutoff', () => {
  it('should render and save', async () => {
    const base = 'http://localhost';
    const expectedKey = SETTING_KEYS.BILLING_CUTOFF_DAY;
    const expected = faker.datatype.number({min: 1, max: 30}).toString();
    const setting: SettingAttr = {
      key: expectedKey,
      value: '10',
    };

    nock(base)
      .patch('/api/setting/updateSettingValue', {
        key: expectedKey,
        value: expected,
      })
      .reply(200);

    const {getByText, getByPlaceholderText, getByRole, queryByRole, store} =
      renderWithProviderAndRestful(<SettingBillingCutoff />, base, store =>
        store.dispatch(settingActions.init([setting]))
      );
    expect(getByPlaceholderText(/billing/i)).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText(/billing/i), {
      target: {value: expected},
    });
    fireEvent.click(getByText(/save/i));
    await waitFor(() => expect(getByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => {
      const actual = store
        .getState()
        .setting.values.find(s => s.key === expectedKey)?.value;
      expect(actual).toEqual(expected);
    });
  });
});
