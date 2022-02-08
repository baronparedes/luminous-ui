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
    year: 2022,
    property: {
      id: 1,
      code: 'G-111',
      address: 'Pasig City Philippines',
      floorArea: 33.1,
      status: 'active',
    },
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
