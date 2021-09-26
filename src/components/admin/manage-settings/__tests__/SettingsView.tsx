import {render} from '@testing-library/react';

import SettingsView from '../SettingsView';

jest.mock('../SettingSOA', () => () => {
  return <div data-testid="mock-setting-soa">Setting SOA</div>;
});

jest.mock('../SettingBillingCutoff', () => () => {
  return <div data-testid="mock-setting-billing">Setting Billing</div>;
});

describe('SettingsView', () => {
  it('should render', () => {
    const {getByTestId} = render(<SettingsView />);
    expect(getByTestId('mock-setting-soa')).toBeInTheDocument();
    expect(getByTestId('mock-setting-billing')).toBeInTheDocument();
  });
});
