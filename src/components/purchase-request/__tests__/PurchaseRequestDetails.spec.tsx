import {render} from '@testing-library/react';

import {currencyFormat} from '../../../@utils/currencies';
import {generateFakePurchaseRequest} from '../../../@utils/fake-models';
import PurchaseRequestDetails from '../PurchaseRequestDetails';

jest.mock('../PurchaseRequestCard', () => () => {
  return (
    <div data-testid="mock-purchaseRequest-card">PurchaseRequest Card</div>
  );
});

describe('PurchaseRequestDetails', () => {
  it('should render', () => {
    const mockedPurchaseRequest = generateFakePurchaseRequest();
    const {getByText, getByTestId} = render(
      <PurchaseRequestDetails purchaseRequest={mockedPurchaseRequest} />
    );
    expect(getByText(/total cost/i)).toBeInTheDocument();
    expect(
      getByText(currencyFormat(mockedPurchaseRequest.totalCost))
    ).toBeInTheDocument();
    expect(getByTestId('mock-purchaseRequest-card')).toBeInTheDocument();
  });
});
