import faker from 'faker';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {currencyFormat} from '../../../@utils/currencies';
import {generateFakeVoucher} from '../../../@utils/fake-models';
import {renderWithRouter} from '../../../@utils/test-renderers';
import {VoucherAttr} from '../../../Api';
import VoucherList from '../VoucherList';

describe('VoucherList', () => {
  const mockedVouchers = [
    generateFakeVoucher(),
    generateFakeVoucher(),
    generateFakeVoucher(),
  ];

  function assertVouchers(
    target: ReturnType<typeof renderWithRouter>,
    expectedVouchers: VoucherAttr[]
  ) {
    const {getByText} = target;
    const expectedHeaders = [
      'id',
      'description',
      'requested by',
      'requested date',
      'total cost',
    ];
    for (const expectedHeader of expectedHeaders) {
      expect(getByText(expectedHeader, {selector: 'th'})).toBeInTheDocument();
    }
    for (const voucher of expectedVouchers) {
      const container = getByText(`V-${Number(voucher.id)}`, {
        selector: 'a',
      }).parentElement?.parentElement as HTMLElement;
      expect(
        within(container).getByText(voucher.description)
      ).toBeInTheDocument();
      expect(
        within(container).getByText(voucher.requestedByProfile?.name as string)
      ).toBeInTheDocument();
      expect(
        within(container).getByText(voucher.requestedDate)
      ).toBeInTheDocument();
      expect(
        within(container).getByText(currencyFormat(voucher.totalCost))
      ).toBeInTheDocument();
    }
  }

  it('should render pending vouchers', async () => {
    const target = renderWithRouter(
      <VoucherList selectedStatus={'pending'} vouchers={mockedVouchers} />
    );

    const {getByText} = target;

    expect(getByText(/pending/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/pending/i, {selector: 'button'})).toBeDisabled();

    expect(getByText(/approved/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/approved/i, {selector: 'button'})).toBeEnabled();

    expect(getByText(/rejected/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/approved/i, {selector: 'button'})).toBeEnabled();

    await waitFor(() =>
      expect(getByText('Vouchers (pending)')).toBeInTheDocument()
    );

    await waitFor(() => {
      assertVouchers(target, mockedVouchers);
    });
  });

  it('should render and select a status', async () => {
    const items = ['approved', 'rejected'];
    const selectedStatus = faker.random.arrayElement(items);
    const selectedStatusRegEx = new RegExp(selectedStatus, 'i');
    const onSelectedStatusChangeMock = jest.fn();
    const target = renderWithRouter(
      <VoucherList
        selectedStatus={'pending'}
        vouchers={[]}
        onSelectedStatusChange={onSelectedStatusChangeMock}
      />
    );

    const {getByText} = target;

    userEvent.click(getByText(selectedStatusRegEx, {selector: 'button'}));
    expect(onSelectedStatusChangeMock).toHaveBeenCalledWith(selectedStatus);
  });
});
