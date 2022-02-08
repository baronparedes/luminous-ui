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

  it('should render', () => {
    const {asFragment} = render(<PaperTransactionHistory {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
