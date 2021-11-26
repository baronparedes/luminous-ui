import {render} from '@testing-library/react';

import SettingsView from '../SettingsView';

jest.mock('../SettingMarkup', () => () => {
  return <div data-testid="mock-setting-markup" />;
});

jest.mock('../SettingBillingCutoff', () => () => {
  return <div data-testid="mock-setting-billing">Setting Billing</div>;
});

jest.mock('../SettingCharges', () => () => {
  return <div data-testid="mock-setting-charges">Setting Charges</div>;
});

jest.mock('../SettingExpenseCategory', () => () => {
  return (
    <div data-testid="mock-setting-expense-category">Expense Categories</div>
  );
});

describe('SettingsView', () => {
  it('should render', () => {
    const {getByTestId, getAllByTestId} = render(<SettingsView />);
    expect(getAllByTestId('mock-setting-markup')).toHaveLength(2);
    expect(getByTestId('mock-setting-billing')).toBeInTheDocument();
    expect(getByTestId('mock-setting-charges')).toBeInTheDocument();
    expect(getByTestId('mock-setting-expense-category')).toBeInTheDocument();
  });
});
