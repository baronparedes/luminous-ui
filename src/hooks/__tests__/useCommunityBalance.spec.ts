import faker from 'faker';
import nock from 'nock';

import {waitFor} from '@testing-library/react';

import {generateFakeCharge} from '../../@utils/fake-models';
import {renderHookWithProviderAndRestful} from '../../@utils/test-renderers';
import {ChargeCollected, DisbursementBreakdownView} from '../../Api';
import {DEFAULTS} from '../../constants';
import {useCommunityBalance} from '../useCommunityBalance';

describe('useCommunityBalance', () => {
  const base = 'http://localhost';

  it('should render available community balance', async () => {
    const collected = faker.datatype.number();
    const disbursed = faker.datatype.number();
    const expectedBalance = collected - disbursed;
    const collectedCharges: ChargeCollected[] = [
      {
        charge: {...generateFakeCharge(), passOn: true},
        amount: faker.datatype.number(),
      },
      {
        charge: {...generateFakeCharge(), passOn: false},
        amount: collected,
      },
    ];

    const disbursements: DisbursementBreakdownView[] = [
      {
        code: DEFAULTS.COMMUNITY_EXPENSE,
        amount: disbursed,
      },
    ];

    nock(base)
      .get('/api/charge/getAllCollectedCharges')
      .reply(200, collectedCharges);

    nock(base)
      .get('/api/disbursement/getDisbursementBreakdown')
      .reply(200, disbursements);

    const {result} = renderHookWithProviderAndRestful(
      () => useCommunityBalance(),
      base
    );

    await waitFor(() => expect(result.current.data).toEqual(expectedBalance));
  });
});
