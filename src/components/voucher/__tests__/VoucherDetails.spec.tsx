import {render} from '@testing-library/react';

import {currencyFormat} from '../../../@utils/currencies';
import {generateFakeVoucher} from '../../../@utils/fake-models';
import VoucherDetails from '../VoucherDetails';

jest.mock('../VoucherCard', () => () => {
  return <div data-testid="mock-voucher-card">Voucher Card</div>;
});

describe('VoucherDetails', () => {
  it('should render', () => {
    const mockedVoucher = generateFakeVoucher();
    const {getByText, getByTestId} = render(
      <VoucherDetails voucher={mockedVoucher} />
    );
    expect(getByText(/total cost/i)).toBeInTheDocument();
    expect(
      getByText(currencyFormat(mockedVoucher.totalCost))
    ).toBeInTheDocument();
    expect(getByTestId('mock-voucher-card')).toBeInTheDocument();
  });
});
