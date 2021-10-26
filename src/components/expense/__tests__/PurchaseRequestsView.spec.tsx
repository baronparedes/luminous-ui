import faker from 'faker';

import {render} from '@testing-library/react';

import {currencyFormat} from '../../../@utils/currencies';
import {useAvailableBalance} from '../../../hooks/useAvailableBalance';
import ExpenseView from '../ExpenseView';

jest.mock('../../../hooks/useAvailableBalance');

describe('PurchaseRequestsView', () => {
  const useAvailableBalanceMock = useAvailableBalance as jest.MockedFunction<
    typeof useAvailableBalance
  >;

  it('should render', async () => {
    const expectedAmount = faker.datatype.number();

    useAvailableBalanceMock.mockReturnValue({
      data: expectedAmount,
      loading: false,
      error: null,
    });

    const {getByText} = render(<ExpenseView />);

    expect(getByText(/available funds/i)).toBeInTheDocument();
    expect(getByText(/create new request/i)).toBeInTheDocument();
    expect(getByText(currencyFormat(expectedAmount))).toBeInTheDocument();
  });
});
