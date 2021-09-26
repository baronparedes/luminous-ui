import nock from 'nock';

import {fireEvent, waitFor} from '@testing-library/react';

import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {SettingAttr} from '../../../../Api';
import {SETTING_KEYS} from '../../../../constants';
import {settingActions} from '../../../../store/reducers/setting.reducer';
import SettingSOA from '../SettingSOA';

describe('SettingSOA', () => {
  it('should render and save', async () => {
    const base = 'http://localhost';
    const expected = '<h1>Test SOA Notes</h1>\n';
    const setting: SettingAttr = {
      key: SETTING_KEYS.SOA_NOTES,
      value: "<script>alert('hello world')</script><h1>Test SOA Notes</h1>",
    };

    nock(base)
      .patch('/api/setting/updateSettingValue', {
        key: SETTING_KEYS.SOA_NOTES,
        value: expected,
      })
      .reply(200);

    const {getByText, getByRole, queryByRole, store} =
      renderWithProviderAndRestful(<SettingSOA />, base, store =>
        store.dispatch(settingActions.init([setting]))
      );
    expect(getByText(/^notes$/i)).toBeInTheDocument();
    expect(getByText(/save/i)).toBeInTheDocument();
    expect(getByText(/^Test SOA Notes$/i)).toBeInTheDocument();

    fireEvent.click(getByText(/save/i));
    await waitFor(() => expect(getByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => {
      const actual = store
        .getState()
        .setting.values.find(s => s.key === SETTING_KEYS.SOA_NOTES)?.value;
      expect(actual).toEqual(expected);
    });
  });
});
