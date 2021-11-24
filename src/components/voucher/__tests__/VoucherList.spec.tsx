import faker from 'faker';
import nock from 'nock';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {currencyFormat} from '../../../@utils/currencies';
import {generateFakeVoucher} from '../../../@utils/fake-models';
import {renderWithProviderAndRouterAndRestful} from '../../../@utils/test-renderers';
import {VoucherAttr} from '../../../Api';
import VoucherList from '../VoucherList';

describe('VoucherList', () => {
  const base = 'http://localhost';
  const chargeId = faker.datatype.number();

  const mockedVouchersPending: VoucherAttr[] = [
    {...generateFakeVoucher(), status: 'pending', chargeId},
    {...generateFakeVoucher(), status: 'pending', chargeId},
  ];

  const mockedVouchersApproved: VoucherAttr[] = [
    {...generateFakeVoucher(), status: 'approved', chargeId},
    {...generateFakeVoucher(), status: 'approved', chargeId},
  ];

  const mockedVouchersRejected: VoucherAttr[] = [
    {...generateFakeVoucher(), status: 'rejected', chargeId},
    {...generateFakeVoucher(), status: 'rejected', chargeId},
  ];

  function assertVouchers(
    target: ReturnType<typeof renderWithProviderAndRouterAndRestful>,
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

  it('should render and fetch pending vouchers by default', async () => {
    nock(base)
      .get(`/api/voucher/getAllVouchersByChargeAndStatus/${chargeId}/pending`)
      .reply(200, mockedVouchersPending);

    const target = renderWithProviderAndRouterAndRestful(
      <VoucherList chargeId={chargeId} />,
      base
    );

    const {getByText} = target;

    expect(getByText(/pending/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/pending/i, {selector: 'button'})).toBeDisabled();

    expect(getByText(/approved/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/rejected/i, {selector: 'button'})).toBeInTheDocument();

    await waitFor(() =>
      expect(getByText('Voucher (pending)')).toBeInTheDocument()
    );

    await waitFor(() => {
      assertVouchers(target, mockedVouchersPending);
    });
  });

  it('should render and fetch approved vouchers', async () => {
    nock(base)
      .get(`/api/voucher/getAllVouchersByChargeAndStatus/${chargeId}/pending`)
      .reply(200, mockedVouchersPending);

    nock(base)
      .get(`/api/voucher/getAllVouchersByChargeAndStatus/${chargeId}/approved`)
      .reply(200, mockedVouchersApproved);

    const target = renderWithProviderAndRouterAndRestful(
      <VoucherList chargeId={chargeId} />,
      base
    );

    const {getByText} = target;

    userEvent.click(getByText(/approved/i, {selector: 'button'}));

    expect(getByText(/pending/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/pending/i, {selector: 'button'})).toBeEnabled();

    expect(getByText(/approved/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/approved/i, {selector: 'button'})).toBeDisabled();

    await waitFor(() =>
      expect(getByText('Voucher (approved)')).toBeInTheDocument()
    );

    await waitFor(() => {
      assertVouchers(target, mockedVouchersApproved);
    });
  });

  it('should render and fetch rejected vouchers', async () => {
    nock(base)
      .get(`/api/voucher/getAllVouchersByChargeAndStatus/${chargeId}/pending`)
      .reply(200, mockedVouchersPending);

    nock(base)
      .get(`/api/voucher/getAllVouchersByChargeAndStatus/${chargeId}/rejected`)
      .reply(200, mockedVouchersRejected);

    const target = renderWithProviderAndRouterAndRestful(
      <VoucherList chargeId={chargeId} />,
      base
    );

    const {getByText} = target;

    userEvent.click(getByText(/rejected/i, {selector: 'button'}));

    expect(getByText(/pending/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/pending/i, {selector: 'button'})).toBeEnabled();

    expect(getByText(/rejected/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/rejected/i, {selector: 'button'})).toBeDisabled();

    await waitFor(() =>
      expect(getByText('Voucher (rejected)')).toBeInTheDocument()
    );

    await waitFor(() => {
      assertVouchers(target, mockedVouchersRejected);
    });
  });
});
