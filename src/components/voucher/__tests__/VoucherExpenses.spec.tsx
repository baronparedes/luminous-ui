import {render, within} from '@testing-library/react';

import {currencyFormat} from '../../../@utils/currencies';
import {generateFakeExpense} from '../../../@utils/fake-models';
import VoucherExpenses from '../VoucherExpenses';

describe('VoucherExpenses', () => {
  it('should render', () => {
    const expectedHeaders = [
      'category',
      'description',
      'quantity',
      'unit cost',
      'total cost',
    ];

    const mockedExpenses = [generateFakeExpense(), generateFakeExpense()];
    const {getByText, getByTestId} = render(
      <VoucherExpenses
        expenses={mockedExpenses}
        appendHeaderContent={<div data-testid="mock-header-content" />}
      />
    );

    expect(getByTestId('mock-header-content')).toBeInTheDocument();

    for (const expectedHeader of expectedHeaders) {
      expect(getByText(expectedHeader, {selector: 'th'})).toBeInTheDocument();
    }
    for (const expense of mockedExpenses) {
      const container = getByText(expense.category)
        .parentElement as HTMLElement;
      expect(
        within(container).getByText(expense.description)
      ).toBeInTheDocument();
      expect(within(container).getByText(expense.quantity)).toBeInTheDocument();
      expect(
        within(container).getByText(currencyFormat(expense.unitCost))
      ).toBeInTheDocument();
      expect(
        within(container).getByText(currencyFormat(expense.totalCost))
      ).toBeInTheDocument();
    }
  });
});
