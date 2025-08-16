import {renderWithProvider} from '../../../../@utils/test-renderers';
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

jest.mock('../SettingMinApprovers', () => () => {
  return <div data-testid="mock-setting-min-approvers">Min Approvers</div>;
});

describe('SettingsView', () => {
  it('should render', () => {
    const {getByTestId, getAllByTestId} = renderWithProvider(<SettingsView />);
    expect(getAllByTestId('mock-setting-markup')).toHaveLength(2);
    expect(getByTestId('mock-setting-billing')).toBeInTheDocument();
    expect(getByTestId('mock-setting-charges')).toBeInTheDocument();
    expect(getByTestId('mock-setting-min-approvers')).toBeInTheDocument();
    expect(getByTestId('mock-setting-expense-category')).toBeInTheDocument();
  });
});
