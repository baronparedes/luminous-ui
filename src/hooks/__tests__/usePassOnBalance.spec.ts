import faker from 'faker';
import nock from 'nock';

import {waitFor} from '@testing-library/react';

import {generateFakeCharge} from '../../@utils/fake-models';
import {renderHookWithProviderAndRestful} from '../../@utils/test-renderers';
import {ChargeCollected, DisbursementBreakdownView} from '../../Api';
import {usePassOnBalance} from '../usePassOnBalance';

describe('usePassOnBalance', () => {
  const base = 'http://localhost';

  it('should render available pass on balance', async () => {
    const collected = faker.datatype.number();
    const disbursed = faker.datatype.number();
    const expectedBalance = collected - disbursed;
    const expectedChargeCode = faker.random.alphaNumeric(6);
    const expectedChargeId = faker.datatype.number();
    const collectedCharges: ChargeCollected[] = [
      {
        charge: {
          ...generateFakeCharge(),
          passOn: true,
          id: expectedChargeId,
          code: expectedChargeCode,
        },
        amount: collected,
      },
      {
        charge: {...generateFakeCharge(), passOn: false},
        amount: faker.datatype.number(),
      },
    ];

    const disbursements: DisbursementBreakdownView[] = [
      {
        code: expectedChargeCode,
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
      () => usePassOnBalance(),
      base
    );

    await waitFor(() =>
      expect(result.current.data[0]).toEqual({
        balance: expectedBalance,
        chargeId: expectedChargeId,
        code: expectedChargeCode,
      })
    );
  });
});
