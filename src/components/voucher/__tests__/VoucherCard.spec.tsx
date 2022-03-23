import faker from 'faker';

import {
  generateFakeProfileAttr,
  generateFakeVoucher,
} from '../../../@utils/fake-models';
import {getNames} from '../../../@utils/helpers';
import {renderWithRouter} from '../../../@utils/test-renderers';
import {VoucherAttr} from '../../../Api';
import VoucherCard from '../VoucherCard';

describe('VoucherCard', () => {
  it('should render', () => {
    const mockedVoucher: VoucherAttr = {
      ...generateFakeVoucher(),
      requestedByProfile: generateFakeProfileAttr(),
      comments: undefined,
    };
    const {getByText, queryByText} = renderWithRouter(
      <VoucherCard voucher={mockedVoucher} />
    );

    expect(queryByText(/comments/i)).not.toBeInTheDocument();
    expect(getByText(`V-${mockedVoucher.series}`)).toBeInTheDocument();
    expect(
      getByText(`requested by ${mockedVoucher.requestedByProfile?.name}`)
    ).toBeInTheDocument();
    expect(getByText(mockedVoucher.status.toUpperCase())).toBeInTheDocument();
  });

  it('should render comments', () => {
    const mockedVoucher: VoucherAttr = {
      ...generateFakeVoucher(),
      requestedByProfile: generateFakeProfileAttr(),
      comments: faker.random.words(5),
    };
    const {getByText} = renderWithRouter(
      <VoucherCard voucher={mockedVoucher} />
    );

    expect(getByText(/comments/i)).toBeInTheDocument();
    expect(getByText(mockedVoucher.comments as string)).toBeInTheDocument();
  });

  it('should render approved by profiles', () => {
    const mockedVoucher: VoucherAttr = {
      ...generateFakeVoucher(),
      requestedByProfile: generateFakeProfileAttr(),
      approverProfiles: [generateFakeProfileAttr(), generateFakeProfileAttr()],
      status: 'approved',
    };
    const {getByText} = renderWithRouter(
      <VoucherCard voucher={mockedVoucher} />
    );
    expect(
      getByText(`by ${getNames(mockedVoucher.approverProfiles)}`)
    ).toBeInTheDocument();
  });

  it('should render rejected by profile', () => {
    const mockedVoucher: VoucherAttr = {
      ...generateFakeVoucher(),
      requestedByProfile: generateFakeProfileAttr(),
      rejectedByProfile: generateFakeProfileAttr(),
      status: 'rejected',
    };
    const {getByText} = renderWithRouter(
      <VoucherCard voucher={mockedVoucher} />
    );
    expect(
      getByText(`by ${mockedVoucher.rejectedByProfile?.name}`)
    ).toBeInTheDocument();
  });
});
