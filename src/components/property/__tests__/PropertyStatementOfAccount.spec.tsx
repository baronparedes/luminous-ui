import {getByRole, render, within} from '@testing-library/react';

import {currencyFormat, roundOff} from '../../../@utils/currencies';
import {generateFakePropertyAccount} from '../../../@utils/fake-models';
import {sumTransactions} from '../../../@utils/helpers';
import {TransactionAttr} from '../../../Api';
import PropertyStatementOfAccount from '../PropertyStatementOfAccount';

describe('PropertyStatementOfAccount', () => {
  beforeAll(() => {
    const targetMonth = 9 - 1; // This is September, since JS Date month are zero indexed;
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, targetMonth));
  });

  afterAll(() => jest.useRealTimers());

  it('should render', () => {
    const mockedPropertyAccount = generateFakePropertyAccount();

    const expectedCurrentBalance = sumTransactions(
      mockedPropertyAccount.transactions
    );
    const expectedPreviousBalance =
      mockedPropertyAccount.balance - expectedCurrentBalance;

    const expectedHeaders = ['area', 'charge code', 'rate', 'amount'];

    const {getByText, getByRole} = render(
      <PropertyStatementOfAccount propertyAccount={mockedPropertyAccount} />
    );

    const previousBalanceContainer = getByText(/previous balance/i)
      .parentElement as HTMLElement;
    const currentBalanceContainer = getByText(/current balance/i)
      .parentElement as HTMLElement;

    expect(previousBalanceContainer).toBeInTheDocument();
    expect(currentBalanceContainer).toBeInTheDocument();
    within(previousBalanceContainer).getByText(
      currencyFormat(roundOff(expectedPreviousBalance))
    );
    within(currentBalanceContainer).getByText(
      currencyFormat(roundOff(expectedCurrentBalance))
    );

    expect(getByText(/soa - sep 2021/i)).toBeInTheDocument();

    for (const expectedHeader of expectedHeaders) {
      expect(getByText(expectedHeader, {selector: 'th'})).toBeInTheDocument();
    }

    const actualTransactions =
      mockedPropertyAccount.transactions as TransactionAttr[];
    if (actualTransactions) {
      const rowContainer = getByRole('table').querySelector(
        'tbody'
      ) as HTMLElement;
      expect(rowContainer).not.toBeNull();

      const rows = within(rowContainer).getAllByRole('row');
      expect(rows.length).toEqual(actualTransactions.length);

      rows.map((row, i) => {
        const expectedTransaction = actualTransactions[i] as TransactionAttr;
        expect(
          within(row).getByText(
            mockedPropertyAccount.property?.floorArea as number
          )
        ).toBeInTheDocument();
        expect(
          within(row).getByText(expectedTransaction.charge?.code as string)
        ).toBeInTheDocument();
        expect(
          within(row).getByText(expectedTransaction.charge?.rate as number)
        ).toBeInTheDocument();
        expect(
          within(row).getByText(
            currencyFormat(roundOff(expectedTransaction.amount))
          )
        ).toBeInTheDocument();
      });
    }
  });
});
