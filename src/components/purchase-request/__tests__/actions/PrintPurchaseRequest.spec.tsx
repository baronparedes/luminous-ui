import * as reactToPrint from 'react-to-print';

import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {generateFakePurchaseRequest} from '../../../../@utils/fake-models';
import {PurchaseRequestAttr} from '../../../../Api';
import PrintPurchaseRequest from '../../actions/PrintPurchaseRequest';

describe('PrintPurchaseRequest', () => {
  const mockedPurchaseRequest: PurchaseRequestAttr = {
    ...generateFakePurchaseRequest(),
  };

  it('should render and print', async () => {
    const handlePrintFn = jest.fn();
    const mocked = jest.spyOn(reactToPrint, 'useReactToPrint');
    mocked.mockImplementation(() => handlePrintFn);

    const {getByText} = render(
      <PrintPurchaseRequest
        buttonLabel="print"
        purchaseRequest={mockedPurchaseRequest}
      />
    );

    const button = getByText(/print/i, {selector: 'button'});
    expect(button).toBeInTheDocument();

    userEvent.click(button);
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(1));
  });
});
