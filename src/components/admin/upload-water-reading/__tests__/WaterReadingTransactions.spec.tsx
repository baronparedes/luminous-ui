import faker from 'faker';

import {render, within} from '@testing-library/react';

import {currencyFormat, roundOff} from '../../../../@utils/currencies';
import {formatDate} from '../../../../@utils/dates';
import {
  generateFakeProperty,
  generateFakeTransaction,
} from '../../../../@utils/fake-models';
import {
  compareTransaction,
  generateNumberedSeries,
} from '../../../../@utils/helpers';
import {TransactionAttr} from '../../../../Api';
import WaterReadingTransactions from '../WaterReadingTransactions';

describe('WaterReadingTransactions', () => {
  it('should render an empty list and header content', () => {
    const {getByText, getAllByRole} = render(
      <WaterReadingTransactions
        transactions={[]}
        renderHeaderContent={<h1>Header Content</h1>}
      />
    );
    expect(getAllByRole('row').length).toEqual(1);
    expect(getByText(/header content/i)).toBeInTheDocument();
  });

  it('should render sorted transactions', () => {
    const transactions = generateNumberedSeries(10).map(() => {
      const property = generateFakeProperty();
      const comments = {
        previousReading: faker.datatype.number(),
        presentReading: faker.datatype.number(),
        usage: faker.datatype.number(),
      };
      const t: TransactionAttr = {
        ...generateFakeTransaction(),
        property,
        propertyId: Number(property.id),
        comments: JSON.stringify(comments),
      };
      return t;
    });

    const expectedHeaders = [
      'unit',
      'amount',
      'period',
      'previous',
      'current',
      'usage',
    ];

    const {getByText, getAllByRole} = render(
      <WaterReadingTransactions transactions={transactions} />
    );
    for (const expectedHeader of expectedHeaders) {
      expect(getByText(expectedHeader, {selector: 'th'})).toBeInTheDocument();
    }

    const rows = getAllByRole('row');
    const expectedTransactions = transactions
      .filter(t => t.transactionType === 'charged')
      .filter(t => t.amount > 0)
      .sort(compareTransaction);

    // We are starting at 1 to skip the header
    for (let index = 1; index < rows.length; index++) {
      const container = rows[index];
      const expected = expectedTransactions[index - 1];
      const expectedReading = JSON.parse(expected.comments as string);
      expect(
        within(container).getByText(expected.property?.code as string)
      ).toBeInTheDocument();
      expect(
        within(container).getByText(currencyFormat(roundOff(expected.amount)))
      ).toBeInTheDocument();
      expect(
        within(container).getByText(formatDate(expected.transactionPeriod))
      ).toBeInTheDocument();
      expect(
        within(container).getByText(expectedReading.previousReading)
      ).toBeInTheDocument();
      expect(
        within(container).getByText(expectedReading.presentReading)
      ).toBeInTheDocument();
      expect(
        within(container).getByText(expectedReading.usage)
      ).toBeInTheDocument();
    }
  });
});
