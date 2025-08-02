import faker from 'faker';

import {render} from '@testing-library/react';

import {currencyFormat} from '../../../@utils/currencies';
import {useChargeBalance} from '../../../hooks';
import DisbursementView from '../DisbursementView';

jest.mock('../../../hooks');

describe.skip('DisbursementView', () => {
  const useChargeBalanceMock = useChargeBalance as jest.MockedFunction<
    typeof useChargeBalance
  >;

  it('should render', async () => {
    const expectedChargeBalance1 = {
      balance: Number(faker.finance.amount()),
      chargeId: faker.datatype.number(),
      code: faker.random.alphaNumeric(6),
      passOn: faker.datatype.boolean(),
    };
    const expectedChargeBalance2 = {
      balance: Number(faker.finance.amount()),
      chargeId: faker.datatype.number(),
      code: faker.random.alphaNumeric(6),
      passOn: faker.datatype.boolean(),
    };

    useChargeBalanceMock.mockReturnValue({
      availableBalances: [expectedChargeBalance1, expectedChargeBalance2],
      availableCommunityBalance: {chargeId: 1, code: '', balance: 0},
      loading: false,
      refetch: jest.fn(),
    });

    const {getByText} = render(<DisbursementView />);

    expect(getByText(expectedChargeBalance1.code)).toBeInTheDocument();
    expect(
      getByText(currencyFormat(expectedChargeBalance1.balance))
    ).toBeInTheDocument();

    expect(getByText(expectedChargeBalance2.code)).toBeInTheDocument();
    expect(
      getByText(currencyFormat(expectedChargeBalance2.balance))
    ).toBeInTheDocument();
  });
});
