import {render, within} from '@testing-library/react';

import {currencyFormat, roundOff} from '../../../@utils/currencies';
import {generateFakePropertyAccount} from '../../../@utils/fake-models';
import {calculateAccount, sum} from '../../../@utils/helpers';
import {TransactionAttr} from '../../../Api';
import PrintStatementOfAccount from '../actions/PrintStatementOfAccount';
import PropertyStatementOfAccount from '../PropertyStatementOfAccount';

type PrintStatementOfAccountProps = React.ComponentProps<
  typeof PrintStatementOfAccount
>;

jest.mock(
  '../actions/PrintStatementOfAccount',
  () =>
    ({buttonLabel}: PrintStatementOfAccountProps) => {
      return <button>{buttonLabel}</button>;
    }
);

describe('PropertyStatementOfAccount', () => {
  beforeAll(() => {
    const targetMonth = 9 - 1; // This is September, since JS Date month are zero indexed;
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, targetMonth));
  });

  afterAll(() => jest.useRealTimers());

  it('should render', () => {
    const mockedPropertyAccount = generateFakePropertyAccount(10);

    const {
      currentBalance: expectedCurrentBalance,
      previousBalance: expectedPreviousBalance,
      collectionBalance: expectedLessPayments,
    } = calculateAccount(mockedPropertyAccount);

    const expectedHeaders = ['charge code', 'rate', 'amount'];

    const expectedTransactions = mockedPropertyAccount.transactions?.filter(
      t => t.transactionType === 'charged'
    ) as TransactionAttr[];

    const expectedPaymentDetails = mockedPropertyAccount.paymentDetails;

    const {getByText, getByRole, getByTitle} = render(
      <PropertyStatementOfAccount propertyAccount={mockedPropertyAccount} />
    );

    const previousBalanceContainer = getByText(/previous balance/i)
      .parentElement as HTMLElement;
    const currentBalanceContainer = getByText(/current charges/i)
      .parentElement as HTMLElement;
    const lessPaymentsContainer = getByText(/less payments/i)
      .parentElement as HTMLElement;

    expect(previousBalanceContainer).toBeInTheDocument();
    expect(currentBalanceContainer).toBeInTheDocument();
    expect(lessPaymentsContainer).toBeInTheDocument();

    within(previousBalanceContainer).getByText(
      currencyFormat(roundOff(expectedPreviousBalance))
    );
    within(currentBalanceContainer).getByText(
      currencyFormat(roundOff(expectedCurrentBalance))
    );
    within(lessPaymentsContainer).getByText(
      currencyFormat(roundOff(expectedLessPayments))
    );

    expect(getByText(/soa - sep 2021/i)).toBeInTheDocument();
    expect(getByTitle(/print current statement/i)).toBeInTheDocument();

    for (const expectedHeader of expectedHeaders) {
      expect(getByText(expectedHeader, {selector: 'th'})).toBeInTheDocument();
    }

    if (expectedPaymentDetails) {
      for (const item of expectedPaymentDetails) {
        const container = getByText(item.orNumber).parentElement?.parentElement;
        const checkDetails =
          item.paymentType === 'check'
            ? `${item.checkIssuingBank}${item.checkNumber}${item.checkPostingDate}`
            : '';
        const amounts = mockedPropertyAccount.transactions
          ?.filter(t => t.paymentDetailId === item.id)
          .map(t => t.amount);
        const summedAmount = sum(amounts);
        const amount = currencyFormat(roundOff(summedAmount));
        expect(container?.textContent).toEqual(
          `OR#${item.orNumber}received${item.paymentType}with an amount of${amount}${checkDetails}`
        );
      }
    }

    if (expectedTransactions) {
      const rowContainer = getByRole('table').querySelector(
        'tbody'
      ) as HTMLElement;
      expect(rowContainer).not.toBeNull();

      const rows = within(rowContainer).getAllByRole('row');
      expect(rows.length).toEqual(expectedTransactions.length);

      rows.map((row, i) => {
        const expectedTransaction = expectedTransactions[i] as TransactionAttr;
        expect(
          within(row).getByText(expectedTransaction.charge?.code as string)
        ).toBeInTheDocument();
        expect(
          within(row).getByText(expectedTransaction.rateSnapshot as number)
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
