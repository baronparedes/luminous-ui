import React from 'react';

import {render} from '@testing-library/react';

import {generateFakeDisbursement} from '../../../@utils/fake-models';
import DisbursementDetail from '../../@ui/DisbursementDetail';
import VoucherDisbursements from '../VoucherDisbursements';

type DisbursementDetailProps = React.ComponentProps<typeof DisbursementDetail>;

jest.mock(
  '../../@ui/DisbursementDetail',
  () =>
    ({disbursement}: DisbursementDetailProps) => {
      return <div>{disbursement.id}</div>;
    }
);

describe('VoucherDisbursements', () => {
  it('should render', () => {
    const mockedDisbursements = [
      generateFakeDisbursement(),
      generateFakeDisbursement(),
    ];
    const {getByText} = render(
      <VoucherDisbursements disbursements={mockedDisbursements} />
    );
    for (const expected of mockedDisbursements) {
      expect(getByText(Number(expected.id).toString())).toBeInTheDocument();
    }
  });
});
