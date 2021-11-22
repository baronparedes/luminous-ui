import * as reactToPrint from 'react-to-print';

import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeDisbursement,
  generateFakeVoucher,
} from '../../../../@utils/fake-models';
import {VoucherAttr} from '../../../../Api';
import PrintVoucher from '../../actions/PrintVoucher';

describe('PrintVoucher', () => {
  const mockedVoucher: VoucherAttr = {
    ...generateFakeVoucher(),
    disbursements: [generateFakeDisbursement()],
  };

  it('should render and print', async () => {
    const handlePrintFn = jest.fn();
    const mocked = jest.spyOn(reactToPrint, 'useReactToPrint');
    mocked.mockImplementation(() => handlePrintFn);

    const {getByText} = render(
      <PrintVoucher buttonLabel="print" voucher={mockedVoucher} />
    );

    const button = getByText(/print/i, {selector: 'button'});
    expect(button).toBeInTheDocument();

    userEvent.click(button);
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(1));
  });
});
