import {render} from '@testing-library/react';

import PaperPaymentHistory from '../PaperPaymentHistory';

describe('PaperPaymentHistory', () => {
  const props: React.ComponentProps<typeof PaperPaymentHistory> = {
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
        createdAt: '2022-02-01',
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
  };

  it('should render', () => {
    const {asFragment} = render(<PaperPaymentHistory {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
