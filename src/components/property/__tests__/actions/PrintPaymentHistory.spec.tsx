import * as reactToPrint from 'react-to-print';

import {fireEvent, waitFor} from '@testing-library/react';

import {renderWithProvider} from '../../../../@utils/test-renderers';
import PrintPaymentHistory from '../../actions/PrintPaymentHistory';

describe('PrintPaymentHistory', () => {
  const props: React.ComponentProps<typeof PrintPaymentHistory> = {
    buttonLabel: 'print',
    availablePeriods: ['JAN', 'FEB'],
    year: 2022,
    property: {
      id: 1,
      code: 'G-111',
      address: 'Pasig City Philippines',
      floorArea: 33.1,
      status: 'active',
    },
    paymentHistory: [
      {
        amount: 1000,
        code: 'Charge 1',
        collectedBy: 'Jhon Doe',
        orNumber: 'OR#1',
        paymentType: 'cash',
        transactionPeriod: '2022-01-01',
      },
      {
        amount: 1000,
        code: 'Charge 2',
        collectedBy: 'Jhon Doe',
        orNumber: 'OR#2',
        paymentType: 'check',
        transactionPeriod: '2022-02-01',
        checkIssuingBank: 'Bank of America',
        checkNumber: 'BA-123-123',
        checkPostingDate: '2022-02-28',
      },
    ],
  };
  it('should render and print', async () => {
    const handlePrintFn = jest.fn();
    const mocked = jest.spyOn(reactToPrint, 'useReactToPrint');
    mocked.mockImplementation(() => handlePrintFn);

    const {getByText} = renderWithProvider(<PrintPaymentHistory {...props} />);

    const button = getByText(/print/i, {selector: 'button'});
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(1));
  });
});
