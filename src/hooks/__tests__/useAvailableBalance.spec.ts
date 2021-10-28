import faker from 'faker';
import nock from 'nock';

import {generateFakeCharge} from '../../@utils/fake-models';
import {renderHookWithProviderAndRestful} from '../../@utils/test-renderers';
import {ChargeCollected, DisbursementBreakdownView} from '../../Api';
import {DEFAULTS} from '../../constants';
import {useAvailableBalance} from '../useAvailableBalance';

describe('useAvailableBalance', () => {
  const base = 'http://localhost';

  it('should render available balance', async () => {
    const expectedBalance = faker.datatype.number();
    const collectedCharges: ChargeCollected[] = [
      {
        charge: {...generateFakeCharge(), passOn: true},
        amount: faker.datatype.number(),
      },
      {
        charge: {...generateFakeCharge(), passOn: false},
        amount: expectedBalance,
      },
    ];

    const disbursements: DisbursementBreakdownView[] = [
      {
        code: DEFAULTS.COMMUNITY_EXPENSE,
        amount: faker.datatype.number(),
      },
    ];

    nock(base)
      .get('/api/charge/getAllCollectedCharges')
      .reply(200, collectedCharges);

    nock(base)
      .get('/api/disbursement/getDisbursementBreakdown')
      .reply(200, disbursements);

    const {waitForNextUpdate, result} = renderHookWithProviderAndRestful(
      () => useAvailableBalance(),
      base
    );

    await waitForNextUpdate();
    expect(result.current.data).toEqual(expectedBalance);
  });
});
