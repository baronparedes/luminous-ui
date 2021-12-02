import * as reactToPrint from 'react-to-print';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {generateFakePurchaseOrder} from '../../../../@utils/fake-models';
import {renderWithProvider} from '../../../../@utils/test-renderers';
import {PurchaseOrderAttr, SettingAttr} from '../../../../Api';
import {SETTING_KEYS} from '../../../../constants';
import {settingActions} from '../../../../store/reducers/setting.reducer';
import PrintPurchaseOrder from '../../actions/PrintPurchaseOrder';

describe('PrintPurchaseOrder', () => {
  const mockedPurchaseOrder: PurchaseOrderAttr = {
    ...generateFakePurchaseOrder(),
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
      <PrintPurchaseOrder
        buttonLabel="print"
        purchaseOrder={mockedPurchaseOrder}
      />,
      store => store.dispatch(settingActions.init(settings))
    );

    const button = getByText(/print/i, {selector: 'button'});
    expect(button).toBeInTheDocument();

    userEvent.click(button);
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(1));
  });
});
