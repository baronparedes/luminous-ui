import faker from 'faker';
import nock from 'nock';

import {waitFor} from '@testing-library/react';

import {generateFakeCharge} from '../../@utils/fake-models';
import {renderHookWithProviderAndRestful} from '../../@utils/test-renderers';
import {ChargeCollected, DisbursementBreakdownView} from '../../Api';
import {DEFAULTS} from '../../constants';
import {useChargeBalance} from '../useChargeBalance';

describe('useChargeBalance', () => {
  const base = 'http://localhost';

  it('should render available charge balances', async () => {
    const collected = faker.datatype.number();
    const disbursed = faker.datatype.number();
    const expectedBalance = collected - disbursed;
    const expectedChargeCode = faker.random.alphaNumeric(6);
    const expectedChargeId = faker.datatype.number();
    const collectedCharges: ChargeCollected[] = [
      {
        charge: {
          ...generateFakeCharge(),
          id: expectedChargeId,
          code: expectedChargeCode,
          passOn: true,
        },
        amount: collected,
      },
    ];

    const disbursements: DisbursementBreakdownView[] = [
      {
        code: expectedChargeCode,
        amount: disbursed,
        passOn: true,
      },
    ];

    nock(base)
      .get('/api/charge/getAllCollectedCharges')
      .reply(200, collectedCharges);

    nock(base)
      .get('/api/disbursement/getDisbursementBreakdown')
      .reply(200, disbursements);

    const {result} = renderHookWithProviderAndRestful(
      () => useChargeBalance(),
      base
    );

    await waitFor(() => {
      expect(result.current.availableBalances).toHaveLength(1);
      expect(result.current.availableBalances[0]).toEqual({
        balance: expectedBalance,
        chargeId: expectedChargeId,
        code: expectedChargeCode,
      });
      expect(result.current.availableCommunityBalance.balance).toEqual(0);
    });
  });

  it('should render available community balance', async () => {
    const collected = faker.datatype.number();
    const disbursed = faker.datatype.number();
    const expectedBalance = collected - disbursed;
    const collectedCharges: ChargeCollected[] = [
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
      () => useChargeBalance(),
      base
    );

    await waitFor(() => {
      expect(result.current.availableCommunityBalance).toEqual({
        chargeId: 0,
        code: DEFAULTS.COMMUNITY_EXPENSE,
        balance: expectedBalance,
      });
      expect(result.current.availableBalances).toHaveLength(0);
    });
  });
});
