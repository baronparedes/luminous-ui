import faker from 'faker';
import nock from 'nock';

import {fireEvent, waitFor, within} from '@testing-library/react';

import {getCurrentMonthYearRelativeToCutoff} from '../../../../@utils/dates';
import {generateFakeTransaction} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {DEFAULTS} from '../../../../constants';
import ProcessPayment from '../../actions/ProcessPayment';

describe('ProcessPayment', () => {
  const base = 'http://localhost';
  it('should render', async () => {
    renderWithProviderAndRestful(
      <ProcessPayment
        propertyId={1}
        amount={100}
        buttonLabel="process payment"
      />,
      base
    );
  });

  it('should suggest breakdown and collect payment', async () => {
    const propertyId = faker.datatype.number();
    const amountToProcess = faker.datatype.number({min: 1000});
    const period = getCurrentMonthYearRelativeToCutoff(
      DEFAULTS.BILLING_CUTOFF_DAY
    );
    const mockTransactions = [
      generateFakeTransaction(),
      generateFakeTransaction(),
    ];

    nock(base)
      .get(
        `/api/transaction/suggestPaymentBreakdown/${propertyId}?amount=${amountToProcess}&year=${period.year}&month=${period.month}`
      )
      .reply(200, mockTransactions);

    nock(base).post('/api/transaction/postCollections').reply(204);

    const {getByText, getByRole, queryByRole} = renderWithProviderAndRestful(
      <ProcessPayment
        propertyId={propertyId}
        amount={amountToProcess}
        buttonLabel="process payment"
      />,
      base
    );

    const toggleModalButton = getByText(/process payment/i, {
      selector: 'button',
    });
    fireEvent.click(toggleModalButton);
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

    const computeButton = getByText(/compute/i, {selector: 'button'});
    expect(computeButton).toBeInTheDocument();

    const amountContainer = computeButton.parentElement as HTMLElement;
    const amountToProcessInput = within(amountContainer).getByPlaceholderText(
      /amount/i
    ) as HTMLInputElement;

    expect(amountToProcessInput.value).toEqual(amountToProcess.toString());
    fireEvent.click(computeButton);

    for (const t of mockTransactions) {
      await waitFor(() =>
        expect(getByText(t.charge?.code as string)).toBeInTheDocument()
      );

      const container = getByText(t.charge?.code as string).parentElement
        ?.parentElement as HTMLElement;
      expect(container).toBeInTheDocument();

      const form = within(container).getByRole('form');
      expect(form).toBeInTheDocument();

      const amountInput = within(form).getByPlaceholderText(
        /amount/i
      ) as HTMLInputElement;
      expect(amountInput.value).toEqual(t.amount.toString());
    }

    await waitFor(() => getByText(/collect/i, {selector: 'button'}));
    fireEvent.click(getByText(/collect/i, {selector: 'button'}));

    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
  });
});
