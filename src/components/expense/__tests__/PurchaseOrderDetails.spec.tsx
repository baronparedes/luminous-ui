import {render} from '@testing-library/react';

import {currencyFormat} from '../../../@utils/currencies';
import {generateFakePurchaseOrder} from '../../../@utils/fake-models';
import PurchaseOrderDetails from '../PurchaseOrderDetails';

jest.mock('../PurchaseOrderCard', () => () => {
  return <div data-testid="mock-purchase-order-card">Purchase Order Card</div>;
});

describe('PurchaseOrderDetails', () => {
  it('should render', () => {
    const mockedPurchaseOrder = generateFakePurchaseOrder();
    const {getByText, getByTestId} = render(
      <PurchaseOrderDetails purchaseOrder={mockedPurchaseOrder} />
    );
    expect(getByText(/total cost/i)).toBeInTheDocument();
    expect(
      getByText(currencyFormat(mockedPurchaseOrder.totalCost))
    ).toBeInTheDocument();
    expect(getByTestId('mock-purchase-order-card')).toBeInTheDocument();
  });
});
