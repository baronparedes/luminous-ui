import React from 'react';

import {render} from '@testing-library/react';

import {generateFakeDisbursement} from '../../../@utils/fake-models';
import DisbursementDetail from '../../@ui/DisbursementDetail';
import PurchaseOrderDisbursements from '../PurchaseOrderDisbursements';

type DisbursementDetailProps = React.ComponentProps<typeof DisbursementDetail>;

jest.mock(
  '../../@ui/DisbursementDetail',
  () =>
    ({disbursement}: DisbursementDetailProps) => {
      return <div>{disbursement.id}</div>;
    }
);

describe('PurchaseOrderDisbursements', () => {
  it('should render', () => {
    const mockedDisbursements = [
      generateFakeDisbursement(),
      generateFakeDisbursement(),
    ];
    const {getByText} = render(
      <PurchaseOrderDisbursements disbursements={mockedDisbursements} />
    );
    for (const expected of mockedDisbursements) {
      expect(getByText(Number(expected.id).toString())).toBeInTheDocument();
    }
  });
});
