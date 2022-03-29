import * as reactToPrint from 'react-to-print';

import {fireEvent, waitFor} from '@testing-library/react';

import {renderWithProvider} from '../../../../@utils/test-renderers';
import {ChargeAttr} from '../../../../Api';
import PrintTransactionHistory from '../../actions/PrintTransactionHistory';

describe('PrintTransactionHistory', () => {
  const charge: ChargeAttr = {
    code: 'ESTATE DUES',
    chargeType: 'unit',
    communityId: 1,
    postingType: 'monthly',
    rate: 100,
  };
  const props: React.ComponentProps<typeof PrintTransactionHistory> = {
    buttonLabel: 'print',
    property: {
      id: 1,
      code: 'G-111',
      address: 'Pasig City Philippines',
      floorArea: 33.1,
      status: 'active',
    },
    data: {
      targetYear: 2022,
      previousBalance: 0,
      transactionHistory: [
        {
          amount: 1000,
          charge: charge,
          chargeId: 1,
          propertyId: 1,
          transactionPeriod: '2022-01-01',
          transactionType: 'charged',
        },
        {
          amount: 1000,
          charge: charge,
          chargeId: 1,
          propertyId: 1,
          transactionPeriod: '2022-01-01',
          transactionType: 'collected',
        },
      ],
      paymentHistory: [
        {
          amount: 1000,
          code: 'Charge 1',
          collectedBy: 'Jhon Doe',
          orNumber: 'OR#1',
          paymentType: 'cash',
          transactionPeriod: '2022-01-01',
          createdAt: '2022-01-01',
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
          createdAt: '2022-02-01',
        },
      ],
    },
  };

  it('should render and print', async () => {
    const handlePrintFn = jest.fn();
    const mocked = jest.spyOn(reactToPrint, 'useReactToPrint');
    mocked.mockImplementation(() => handlePrintFn);

    const {getByText} = renderWithProvider(
      <PrintTransactionHistory {...props} />
    );

    const button = getByText(/print/i, {selector: 'button'});
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    await waitFor(() => expect(handlePrintFn).toBeCalledTimes(1));
  });
});
