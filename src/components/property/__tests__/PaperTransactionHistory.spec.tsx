import {render} from '@testing-library/react';

import {ChargeAttr} from '../../../Api';
import PaperTransactionHistory from '../PaperTransactionHistory';

describe('PaperTransactionHistory', () => {
  const charge: ChargeAttr = {
    code: 'ESTATE DUES',
    chargeType: 'unit',
    communityId: 1,
    postingType: 'monthly',
    rate: 100,
  };
  const props: React.ComponentProps<typeof PaperTransactionHistory> = {
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
    },
  };

  it('should render', () => {
    const {asFragment} = render(<PaperTransactionHistory {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
