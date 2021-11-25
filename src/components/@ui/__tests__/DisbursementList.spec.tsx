import React from 'react';

import {render} from '@testing-library/react';

import {generateFakeDisbursement} from '../../../@utils/fake-models';
import DisbursementDetail from '../DisbursementDetail';
import DisbursementList from '../DisbursementList';

type DisbursementDetailProps = React.ComponentProps<typeof DisbursementDetail>;

jest.mock(
  '../DisbursementDetail',
  () =>
    ({disbursement}: DisbursementDetailProps) => {
      return <div>{disbursement.id}</div>;
    }
);

describe('DisbursementList', () => {
  it('should render', () => {
    const mockedDisbursements = [
      generateFakeDisbursement(),
      generateFakeDisbursement(),
    ];
    const {getByText} = render(
      <DisbursementList disbursements={mockedDisbursements} />
    );
    for (const expected of mockedDisbursements) {
      expect(getByText(Number(expected.id).toString())).toBeInTheDocument();
    }
  });
});
