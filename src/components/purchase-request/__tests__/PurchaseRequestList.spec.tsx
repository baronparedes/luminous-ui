import faker from 'faker';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {currencyFormat} from '../../../@utils/currencies';
import {generateFakePurchaseRequest} from '../../../@utils/fake-models';
import {renderWithRouter} from '../../../@utils/test-renderers';
import {PurchaseRequestAttr} from '../../../Api';
import PurchaseRequestList from '../PurchaseRequestList';

describe('PurchaseRequestList', () => {
  const mockedPurchaseRequests = [
    generateFakePurchaseRequest(),
    generateFakePurchaseRequest(),
    generateFakePurchaseRequest(),
  ];

  function assertPurchaseRequests(
    target: ReturnType<typeof renderWithRouter>,
    expectedPurchaseRequests: PurchaseRequestAttr[]
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
    for (const purchaseRequest of expectedPurchaseRequests) {
      const container = getByText(`PR-${purchaseRequest.series}`, {
        selector: 'a',
      }).parentElement?.parentElement as HTMLElement;
      expect(
        within(container).getByText(purchaseRequest.description)
      ).toBeInTheDocument();
      expect(
        within(container).getByText(
          purchaseRequest.requestedByProfile?.name as string
        )
      ).toBeInTheDocument();
      expect(
        within(container).getByText(purchaseRequest.requestedDate)
      ).toBeInTheDocument();
      expect(
        within(container).getByText(currencyFormat(purchaseRequest.totalCost))
      ).toBeInTheDocument();
    }
  }

  it('should render pending purchase requests', async () => {
    const target = renderWithRouter(
      <PurchaseRequestList
        selectedStatus={'pending'}
        purchaseRequests={mockedPurchaseRequests}
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
      expect(getByText('Purchase Requests (pending)')).toBeInTheDocument()
    );

    await waitFor(() => {
      assertPurchaseRequests(target, mockedPurchaseRequests);
    });
  });

  it('should render and select a status', async () => {
    const items = ['approved', 'rejected'];
    const selectedStatus = faker.random.arrayElement(items);
    const selectedStatusRegEx = new RegExp(selectedStatus, 'i');
    const onSelectedStatusChangeMock = jest.fn();
    const target = renderWithRouter(
      <PurchaseRequestList
        selectedStatus={'pending'}
        purchaseRequests={[]}
        onSelectedStatusChange={onSelectedStatusChangeMock}
      />
    );

    const {getByText} = target;

    userEvent.click(getByText(selectedStatusRegEx, {selector: 'button'}));
    expect(onSelectedStatusChangeMock).toHaveBeenCalledWith(selectedStatus);
  });
});
