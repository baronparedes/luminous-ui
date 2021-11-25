import faker from 'faker';

import {
  generateFakeProfileAttr,
  generateFakePurchaseRequest,
} from '../../../@utils/fake-models';
import {getNames} from '../../../@utils/helpers';
import {renderWithRouter} from '../../../@utils/test-renderers';
import {PurchaseRequestAttr} from '../../../Api';
import PurchaseRequestCard from '../PurchaseRequestCard';

describe('PurchaseRequestCard', () => {
  it('should render', () => {
    const mockedPurchaseRequest: PurchaseRequestAttr = {
      ...generateFakePurchaseRequest(),
      requestedByProfile: generateFakeProfileAttr(),
      comments: undefined,
    };
    const {getByText, queryByText} = renderWithRouter(
      <PurchaseRequestCard purchaseRequest={mockedPurchaseRequest} />
    );

    expect(queryByText(/comments/i)).not.toBeInTheDocument();
    expect(getByText(`PR-${mockedPurchaseRequest.id}`)).toBeInTheDocument();
    expect(
      getByText(
        `requested by ${mockedPurchaseRequest.requestedByProfile?.name}`
      )
    ).toBeInTheDocument();
    expect(
      getByText(mockedPurchaseRequest.status.toUpperCase())
    ).toBeInTheDocument();
  });

  it('should render comments', () => {
    const mockedPurchaseRequest: PurchaseRequestAttr = {
      ...generateFakePurchaseRequest(),
      requestedByProfile: generateFakeProfileAttr(),
      comments: faker.random.words(5),
    };
    const {getByText} = renderWithRouter(
      <PurchaseRequestCard purchaseRequest={mockedPurchaseRequest} />
    );

    expect(getByText(/comments/i)).toBeInTheDocument();
    expect(
      getByText(mockedPurchaseRequest.comments as string)
    ).toBeInTheDocument();
  });

  it('should render approved by profiles', () => {
    const mockedPurchaseRequest: PurchaseRequestAttr = {
      ...generateFakePurchaseRequest(),
      requestedByProfile: generateFakeProfileAttr(),
      approverProfiles: [generateFakeProfileAttr(), generateFakeProfileAttr()],
      status: 'approved',
    };
    const {getByText} = renderWithRouter(
      <PurchaseRequestCard purchaseRequest={mockedPurchaseRequest} />
    );
    expect(
      getByText(`by ${getNames(mockedPurchaseRequest.approverProfiles)}`)
    ).toBeInTheDocument();
  });

  it('should render rejected by profile', () => {
    const mockedPurchaseRequest: PurchaseRequestAttr = {
      ...generateFakePurchaseRequest(),
      requestedByProfile: generateFakeProfileAttr(),
      rejectedByProfile: generateFakeProfileAttr(),
      status: 'rejected',
    };
    const {getByText} = renderWithRouter(
      <PurchaseRequestCard purchaseRequest={mockedPurchaseRequest} />
    );
    expect(
      getByText(`by ${mockedPurchaseRequest.rejectedByProfile?.name}`)
    ).toBeInTheDocument();
  });
});
