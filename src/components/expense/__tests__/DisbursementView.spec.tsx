import faker from 'faker';

import {render} from '@testing-library/react';

import {currencyFormat} from '../../../@utils/currencies';
import {usePassOnBalance} from '../../../hooks/usePassOnBalance';
import DisbursementView from '../DisbursementView';

jest.mock('../../../hooks/usePassOnBalance');

describe('DisbursementView', () => {
  const usePassOnBalanceMock = usePassOnBalance as jest.MockedFunction<
    typeof usePassOnBalance
  >;

  it('should render', async () => {
    const expectedChargeBalance1 = {
      balance: Number(faker.finance.amount()),
      chargeId: faker.datatype.number(),
      code: faker.random.alphaNumeric(6),
    };
    const expectedChargeBalance2 = {
      balance: Number(faker.finance.amount()),
      chargeId: faker.datatype.number(),
      code: faker.random.alphaNumeric(6),
    };

    usePassOnBalanceMock.mockReturnValue({
      data: [expectedChargeBalance1, expectedChargeBalance2],
      loading: false,
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
