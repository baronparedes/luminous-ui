import * as reactToPrint from 'react-to-print';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeDisbursement,
  generateFakeVoucher,
} from '../../../../@utils/fake-models';
import {renderWithProvider} from '../../../../@utils/test-renderers';
import {SettingAttr, VoucherAttr} from '../../../../Api';
import {SETTING_KEYS} from '../../../../constants';
import {settingActions} from '../../../../store/reducers/setting.reducer';
import PrintVoucher from '../../actions/PrintVoucher';

describe('PrintVoucher', () => {
  const mockedVoucher: VoucherAttr = {
    ...generateFakeVoucher(),
    disbursements: [generateFakeDisbursement()],
  };

  const settings: SettingAttr[] = [
    {
      key: SETTING_KEYS.PR_NOTES,
      value: '<h1>Notes</h1>',
    },
  ];

  it('should render and print', async () => {
    const handlePrintFn = jest.fn();
    const mocked = jest.spyOn(reactToPrint, 'useReactToPrint');
    mocked.mockImplementation(() => handlePrintFn);

    const {getByText} = renderWithProvider(
      <PrintVoucher buttonLabel="print" voucher={mockedVoucher} />,
      store => store.dispatch(settingActions.init(settings))
    );

    const button = getByText(/print/i, {selector: 'button'});
    expect(button).toBeInTheDocument();

    userEvent.click(button);
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(1));
  });
});
