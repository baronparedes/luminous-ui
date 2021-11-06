import * as reactToPrint from 'react-to-print';

import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeDisbursement,
  generateFakePurchaseOrder,
} from '../../../../@utils/fake-models';
import {PurchaseOrderAttr} from '../../../../Api';
import PrintPurchaseOrder from '../../actions/PrintPurchaseOrder';

describe('PrintPurchaseOrder', () => {
  const mockedPurchaseOrder: PurchaseOrderAttr = {
    ...generateFakePurchaseOrder(),
    disbursements: [generateFakeDisbursement()],
  };

  it('should render and print', async () => {
    const handlePrintFn = jest.fn();
    const mocked = jest.spyOn(reactToPrint, 'useReactToPrint');
    mocked.mockImplementation(() => handlePrintFn);

    const {getByText} = render(
      <PrintPurchaseOrder
        buttonLabel="print"
        purchaseOrder={mockedPurchaseOrder}
      />
    );

    const button = getByText(/print/i, {selector: 'button'});
    expect(button).toBeInTheDocument();

    userEvent.click(button);
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(1));
  });
});
