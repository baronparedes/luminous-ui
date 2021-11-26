import nock from 'nock';

import {fireEvent, waitFor} from '@testing-library/react';

import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {SettingAttr} from '../../../../Api';
import {SETTING_KEYS} from '../../../../constants';
import {settingActions} from '../../../../store/reducers/setting.reducer';
import SettingMarkup from '../SettingMarkup';

describe('SettingMarkup', () => {
  it('should render and save', async () => {
    const base = 'http://localhost';
    const expectedKey = SETTING_KEYS.SOA_NOTES;
    const expected = '<h1>Test Notes</h1>\n';
    const setting: SettingAttr = {
      key: expectedKey,
      value: "<script>alert('hello world')</script><h1>Test Notes</h1>",
    };

    nock(base)
      .patch('/api/setting/updateSettingValue', {
        key: expectedKey,
        value: expected,
      })
      .reply(200);

    const {getByText, getByRole, queryByRole, store} =
      renderWithProviderAndRestful(
        <SettingMarkup
          settingKey={expectedKey}
          heading="Statement of Account"
        />,
        base,
        store => store.dispatch(settingActions.init([setting]))
      );
    expect(getByText(/^notes$/i)).toBeInTheDocument();
    expect(getByText(/save/i)).toBeInTheDocument();
    expect(getByText(/^Test Notes$/i)).toBeInTheDocument();

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
