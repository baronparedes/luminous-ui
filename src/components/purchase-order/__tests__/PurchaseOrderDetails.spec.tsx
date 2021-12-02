import {render} from '@testing-library/react';

import {currencyFormat} from '../../../@utils/currencies';
import {generateFakePurchaseOrder} from '../../../@utils/fake-models';
import PurchaseOrderDetails from '../PurchaseOrderDetails';

jest.mock('../PurchaseOrderCard', () => () => {
  return <div data-testid="mock-purchaseOrder-card">PurchaseOrder Card</div>;
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
    expect(getByTestId('mock-purchaseOrder-card')).toBeInTheDocument();
    expect(getByText(mockedPurchaseOrder.vendorName)).toBeInTheDocument();
    expect(getByText(mockedPurchaseOrder.fulfillmentDate)).toBeInTheDocument();
    expect(
      getByText(mockedPurchaseOrder.otherDetails as string)
    ).toBeInTheDocument();
  });
});
