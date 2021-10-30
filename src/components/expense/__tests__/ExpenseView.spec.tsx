import faker from 'faker';

import {render} from '@testing-library/react';

import {currencyFormat} from '../../../@utils/currencies';
import {useAvailableBalance} from '../../../hooks/useAvailableBalance';
import ExpenseView from '../ExpenseView';

jest.mock('../../../hooks/useAvailableBalance');

jest.mock('../PurchaseOrderList', () => () => {
  return <div data-testid="mock-purchase-order-list" />;
});

jest.mock('../actions/CreatePurchaseOrder', () => () => {
  return <div data-testid="mock-create-purchase-order" />;
});

describe('ExpenseView', () => {
  const useAvailableBalanceMock = useAvailableBalance as jest.MockedFunction<
    typeof useAvailableBalance
  >;

  it('should render', async () => {
    const expectedAmount = faker.datatype.number();

    useAvailableBalanceMock.mockReturnValue({
      data: expectedAmount,
      loading: false,
    });

    const {getByText, getByTestId} = render(<ExpenseView />);

    expect(getByText(/available funds/i)).toBeInTheDocument();
    expect(getByText(currencyFormat(expectedAmount))).toBeInTheDocument();
    expect(getByTestId('mock-purchase-order-list')).toBeInTheDocument();
    expect(getByTestId('mock-create-purchase-order')).toBeInTheDocument();
  });
});
