import faker from 'faker';

import {renderHook} from '@testing-library/react-hooks';

import {
  getCurrentMonthYear,
  toTransactionPeriodFromDate,
} from '../../@utils/dates';
import {
  generateFakeCharge,
  generateFakeProperty,
} from '../../@utils/fake-models';
import {DEFAULTS} from '../../constants';
import {useWaterReadingDataTransformer} from '../useWaterReadingDataTransformer';
import {WaterReadingData} from '../useWaterReadingFile';

describe('useWaterReadingDataTransformer', () => {
  const charges = [
    generateFakeCharge(),
    {
      ...generateFakeCharge(),
      id: DEFAULTS.WATER_CHARGE_ID,
    },
  ];

  const period = getCurrentMonthYear();

  const properties = [
    {...generateFakeProperty(), code: 'G-100'},
    {...generateFakeProperty(), code: 'G-200'},
    {...generateFakeProperty(), code: 'G-300'},
  ];

  it('should return no error when target charge found', () => {
    const target = renderHook(() =>
      useWaterReadingDataTransformer([], charges, undefined, undefined)
    );

    expect(target.result.current.error).toEqual(undefined);
    expect(target.result.current.parseErrors).toEqual([]);
    expect(target.result.current.transactions).toEqual([]);
  });

  it('should return error when target charge is not found', () => {
    const target = renderHook(() =>
      useWaterReadingDataTransformer(
        [],
        [generateFakeCharge()],
        undefined,
        undefined
      )
    );

    expect(target.result.current.error).toEqual(
      'unable to locate charge for water utility'
    );
    expect(target.result.current.parseErrors).toEqual([]);
    expect(target.result.current.transactions).toEqual([]);
  });

  it('should return parse errors when there are no reading available for a property', () => {
    const data: WaterReadingData[] = [
      {
        unitNumber: faker.random.alphaNumeric(5),
        previousReading: 1,
        presentReading: 1,
        rate: null,
      },
    ];
    const target = renderHook(() =>
      useWaterReadingDataTransformer(data, charges, properties, period)
    );

    expect(target.result.current.error).toEqual(undefined);
    expect(target.result.current.transactions).toEqual([]);
    expect(target.result.current.parseErrors).toEqual(
      properties.map(p => p.code)
    );
  });

  it('should transfrom data to transactions', () => {
    const data: WaterReadingData[] = [
      {
        unitNumber: properties[0].code,
        previousReading: faker.datatype.number({min: 1000, max: 1300}),
        presentReading: faker.datatype.number({min: 1301, max: 1600}),
        rate: faker.datatype.number(),
      },
      {
        unitNumber: properties[1].code,
        previousReading: faker.datatype.number({min: 1000, max: 1300}),
        presentReading: faker.datatype.number({min: 1301, max: 1600}),
        rate: faker.datatype.number(),
      },
      {
        unitNumber: properties[2].code,
        previousReading: faker.datatype.number({min: 1000, max: 1300}),
        presentReading: faker.datatype.number({min: 1301, max: 1600}),
        rate: faker.datatype.number(),
      },
    ];
    const target = renderHook(() =>
      useWaterReadingDataTransformer(data, charges, properties, period)
    );

    expect(target.result.current.error).toEqual(undefined);
    expect(target.result.current.parseErrors).toEqual([]);
    expect(target.result.current.transactions.length).toEqual(3);

    for (const actual of target.result.current.transactions) {
      const expectedProperty = properties.find(
        p => p.code === actual.property?.code
      );
      const expected = data.find(d => d.unitNumber === actual.property?.code);
      const expectedUsage =
        Number(expected?.presentReading) - Number(expected?.previousReading);
      const expectedComments = {
        previousReading: expected?.previousReading,
        presentReading: expected?.presentReading,
        usage: expectedUsage,
      };
      expect(actual.chargeId).toEqual(DEFAULTS.WATER_CHARGE_ID);
      expect(actual.propertyId).toEqual(expectedProperty?.id);
      expect(actual.comments).toEqual(JSON.stringify(expectedComments));
      expect(
        toTransactionPeriodFromDate(new Date(actual.transactionPeriod))
      ).toEqual(period);
      expect(actual.transactionType).toEqual('charged');
      expect(actual.rateSnapshot).toEqual(expected?.rate);
      expect(actual.amount).toEqual(Number(expected?.rate) * expectedUsage);
      expect(actual.batchId).toBeDefined();
    }
  });
});
