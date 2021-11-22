import faker from 'faker';

import {render} from '@testing-library/react';

import {currencyFormat} from '../../../@utils/currencies';
import {useCommunityBalance} from '../../../hooks/useCommunityBalance';
import ExpenseView from '../ExpenseView';

jest.mock('../../../hooks/useCommunityBalance');

jest.mock('../VoucherList', () => () => {
  return <div data-testid="mock-voucher-list" />;
});

jest.mock('../actions/CreateVoucher', () => () => {
  return <div data-testid="mock-create-voucher" />;
});

describe('ExpenseView', () => {
  const useCommunityBalanceMock = useCommunityBalance as jest.MockedFunction<
    typeof useCommunityBalance
  >;

  it('should render', async () => {
    const expectedAmount = faker.datatype.number();

    useCommunityBalanceMock.mockReturnValue({
      data: expectedAmount,
      loading: false,
    });

    const {getByText, getByTestId} = render(<ExpenseView />);

    expect(getByText(/available funds/i)).toBeInTheDocument();
    expect(getByText(currencyFormat(expectedAmount))).toBeInTheDocument();
    expect(getByTestId('mock-voucher-list')).toBeInTheDocument();
    expect(getByTestId('mock-create-voucher')).toBeInTheDocument();
  });
});
