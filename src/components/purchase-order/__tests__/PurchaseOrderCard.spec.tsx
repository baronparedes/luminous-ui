import faker from 'faker';

import {
  generateFakeProfileAttr,
  generateFakePurchaseOrder,
} from '../../../@utils/fake-models';
import {getNames} from '../../../@utils/helpers';
import {renderWithRouter} from '../../../@utils/test-renderers';
import {PurchaseOrderAttr} from '../../../Api';
import PurchaseOrderCard from '../PurchaseOrderCard';

describe('PurchaseOrderCard', () => {
  it('should render', () => {
    const mockedPurchaseOrder: PurchaseOrderAttr = {
      ...generateFakePurchaseOrder(),
      requestedByProfile: generateFakeProfileAttr(),
      comments: undefined,
    };
    const {getByText, queryByText} = renderWithRouter(
      <PurchaseOrderCard purchaseOrder={mockedPurchaseOrder} />
    );

    expect(queryByText(/comments/i)).not.toBeInTheDocument();
    expect(getByText(`PO-${mockedPurchaseOrder.series}`)).toBeInTheDocument();
    expect(
      getByText(`requested by ${mockedPurchaseOrder.requestedByProfile?.name}`)
    ).toBeInTheDocument();
    expect(
      getByText(mockedPurchaseOrder.status.toUpperCase())
    ).toBeInTheDocument();
  });

  it('should render comments', () => {
    const mockedPurchaseOrder: PurchaseOrderAttr = {
      ...generateFakePurchaseOrder(),
      requestedByProfile: generateFakeProfileAttr(),
      comments: faker.random.words(5),
    };
    const {getByText} = renderWithRouter(
      <PurchaseOrderCard purchaseOrder={mockedPurchaseOrder} />
    );

    expect(getByText(/comments/i)).toBeInTheDocument();
    expect(
      getByText(mockedPurchaseOrder.comments as string)
    ).toBeInTheDocument();
  });

  it('should render approved by profiles', () => {
    const mockedPurchaseOrder: PurchaseOrderAttr = {
      ...generateFakePurchaseOrder(),
      requestedByProfile: generateFakeProfileAttr(),
      approverProfiles: [generateFakeProfileAttr(), generateFakeProfileAttr()],
      status: 'approved',
    };
    const {getByText} = renderWithRouter(
      <PurchaseOrderCard purchaseOrder={mockedPurchaseOrder} />
    );
    expect(
      getByText(`by ${getNames(mockedPurchaseOrder.approverProfiles)}`)
    ).toBeInTheDocument();
  });

  it('should render rejected by profile', () => {
    const mockedPurchaseOrder: PurchaseOrderAttr = {
      ...generateFakePurchaseOrder(),
      requestedByProfile: generateFakeProfileAttr(),
      rejectedByProfile: generateFakeProfileAttr(),
      status: 'rejected',
    };
    const {getByText} = renderWithRouter(
      <PurchaseOrderCard purchaseOrder={mockedPurchaseOrder} />
    );
    expect(
      getByText(`by ${mockedPurchaseOrder.rejectedByProfile?.name}`)
    ).toBeInTheDocument();
  });

  it('should render cancelled by profile', () => {
    const mockedPurchaseOrder: PurchaseOrderAttr = {
      ...generateFakePurchaseOrder(),
      requestedByProfile: generateFakeProfileAttr(),
      rejectedByProfile: generateFakeProfileAttr(),
      status: 'cancelled',
    };
    const {getByText} = renderWithRouter(
      <PurchaseOrderCard purchaseOrder={mockedPurchaseOrder} />
    );
    expect(
      getByText(`by ${mockedPurchaseOrder.rejectedByProfile?.name}`)
    ).toBeInTheDocument();
  });
});
