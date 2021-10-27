import nock from 'nock';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {currencyFormat} from '../../../@utils/currencies';
import {generateFakePurchaseOrder} from '../../../@utils/fake-models';
import {renderWithProviderAndRouterAndRestful} from '../../../@utils/test-renderers';
import {PurchaseOrderAttr} from '../../../Api';
import PurchaseOrderList from '../PurchaseOrderList';

describe('PurchaseOrderList', () => {
  const base = 'http://localhost';

  const mockedPurchaseOrdersPending: PurchaseOrderAttr[] = [
    {...generateFakePurchaseOrder(), status: 'pending'},
    {...generateFakePurchaseOrder(), status: 'pending'},
  ];

  const mockedPurchaseOrdersApproved: PurchaseOrderAttr[] = [
    {...generateFakePurchaseOrder(), status: 'approved'},
    {...generateFakePurchaseOrder(), status: 'approved'},
  ];

  const mockedPurchaseOrdersRejected: PurchaseOrderAttr[] = [
    {...generateFakePurchaseOrder(), status: 'rejected'},
    {...generateFakePurchaseOrder(), status: 'rejected'},
  ];

  function assertPurchaseOrders(
    target: ReturnType<typeof renderWithProviderAndRouterAndRestful>,
    expectedPurchaseOrders: PurchaseOrderAttr[]
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
    for (const purchaseOrder of expectedPurchaseOrders) {
      const container = getByText(`PO-${Number(purchaseOrder.id)}`, {
        selector: 'a',
      }).parentElement?.parentElement as HTMLElement;
      expect(
        within(container).getByText(purchaseOrder.description)
      ).toBeInTheDocument();
      expect(
        within(container).getByText(
          purchaseOrder.requestedByProfile?.name as string
        )
      ).toBeInTheDocument();
      expect(
        within(container).getByText(purchaseOrder.requestedDate)
      ).toBeInTheDocument();
      expect(
        within(container).getByText(currencyFormat(purchaseOrder.totalCost))
      ).toBeInTheDocument();
    }
  }

  it('should render and fetch pending purchase orders by default', async () => {
    nock(base)
      .get('/api/purchase-order/getAllPurchaseOrderByStatus/pending')
      .reply(200, mockedPurchaseOrdersPending);

    const target = renderWithProviderAndRouterAndRestful(
      <PurchaseOrderList />,
      base
    );

    const {getByText} = target;

    expect(getByText(/pending/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/pending/i, {selector: 'button'})).toBeDisabled();

    expect(getByText(/approved/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/rejected/i, {selector: 'button'})).toBeInTheDocument();

    await waitFor(() =>
      expect(getByText('Purchase Request (pending)')).toBeInTheDocument()
    );

    await waitFor(() => {
      assertPurchaseOrders(target, mockedPurchaseOrdersPending);
    });
  });

  it('should render and fetch approved purchase orders', async () => {
    nock(base)
      .get('/api/purchase-order/getAllPurchaseOrderByStatus/pending')
      .reply(200, mockedPurchaseOrdersPending);

    nock(base)
      .get('/api/purchase-order/getAllPurchaseOrderByStatus/approved')
      .reply(200, mockedPurchaseOrdersApproved);

    const target = renderWithProviderAndRouterAndRestful(
      <PurchaseOrderList />,
      base
    );

    const {getByText} = target;

    userEvent.click(getByText(/approved/i, {selector: 'button'}));

    expect(getByText(/pending/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/pending/i, {selector: 'button'})).toBeEnabled();

    expect(getByText(/approved/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/approved/i, {selector: 'button'})).toBeDisabled();

    await waitFor(() =>
      expect(getByText('Purchase Request (approved)')).toBeInTheDocument()
    );

    await waitFor(() => {
      assertPurchaseOrders(target, mockedPurchaseOrdersApproved);
    });
  });

  it('should render and fetch rejected purchase orders', async () => {
    nock(base)
      .get('/api/purchase-order/getAllPurchaseOrderByStatus/pending')
      .reply(200, mockedPurchaseOrdersPending);

    nock(base)
      .get('/api/purchase-order/getAllPurchaseOrderByStatus/rejected')
      .reply(200, mockedPurchaseOrdersRejected);

    const target = renderWithProviderAndRouterAndRestful(
      <PurchaseOrderList />,
      base
    );

    const {getByText} = target;

    userEvent.click(getByText(/rejected/i, {selector: 'button'}));

    expect(getByText(/pending/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/pending/i, {selector: 'button'})).toBeEnabled();

    expect(getByText(/rejected/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/rejected/i, {selector: 'button'})).toBeDisabled();

    await waitFor(() =>
      expect(getByText('Purchase Request (rejected)')).toBeInTheDocument()
    );

    await waitFor(() => {
      assertPurchaseOrders(target, mockedPurchaseOrdersRejected);
    });
  });
});
