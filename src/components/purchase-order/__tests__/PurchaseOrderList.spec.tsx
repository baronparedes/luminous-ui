import faker from 'faker';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {currencyFormat} from '../../../@utils/currencies';
import {generateFakePurchaseOrder} from '../../../@utils/fake-models';
import {renderWithRouter} from '../../../@utils/test-renderers';
import {PurchaseOrderAttr} from '../../../Api';
import PurchaseOrderList from '../PurchaseOrderList';

describe('PurchaseOrderList', () => {
  const mockedPurchaseOrders = [
    generateFakePurchaseOrder(),
    generateFakePurchaseOrder(),
    generateFakePurchaseOrder(),
  ];

  function assertPurchaseOrders(
    target: ReturnType<typeof renderWithRouter>,
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

  it('should render pending purchase requests', async () => {
    const target = renderWithRouter(
      <PurchaseOrderList
        selectedStatus={'pending'}
        purchaseOrders={mockedPurchaseOrders}
      />
    );

    const {getByText} = target;

    expect(getByText(/pending/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/pending/i, {selector: 'button'})).toBeDisabled();

    expect(getByText(/approved/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/approved/i, {selector: 'button'})).toBeEnabled();

    expect(getByText(/rejected/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/approved/i, {selector: 'button'})).toBeEnabled();

    await waitFor(() =>
      expect(getByText('Purchase Orders (pending)')).toBeInTheDocument()
    );

    await waitFor(() => {
      assertPurchaseOrders(target, mockedPurchaseOrders);
    });
  });

  it('should render and select a status', async () => {
    const items = ['approved', 'rejected'];
    const selectedStatus = faker.random.arrayElement(items);
    const selectedStatusRegEx = new RegExp(selectedStatus, 'i');
    const onSelectedStatusChangeMock = jest.fn();
    const target = renderWithRouter(
      <PurchaseOrderList
        selectedStatus={'pending'}
        purchaseOrders={[]}
        onSelectedStatusChange={onSelectedStatusChangeMock}
      />
    );

    const {getByText} = target;

    userEvent.click(getByText(selectedStatusRegEx, {selector: 'button'}));
    expect(onSelectedStatusChangeMock).toHaveBeenCalledWith(selectedStatus);
  });
});
