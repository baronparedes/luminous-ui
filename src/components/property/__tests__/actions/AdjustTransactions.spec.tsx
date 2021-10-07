import faker from 'faker';
import nock from 'nock';

import {fireEvent, waitFor, within} from '@testing-library/react';

import {ApprovedAny} from '../../../../@types';
import {currencyFormat, roundOff} from '../../../../@utils/currencies';
import {
  generateFakeProfile,
  generateFakeTransaction,
} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import AdjustTransactions, {
  toWaivedTransaction,
} from '../../actions/AdjustTransactions';

describe('AdjustTransactions', () => {
  const base = 'http://localhost';

  async function renderTarget() {
    const profile = generateFakeProfile();
    const transactions = [
      generateFakeTransaction(),
      generateFakeTransaction(),
      generateFakeTransaction(),
      generateFakeTransaction(),
      generateFakeTransaction(),
      {
        ...generateFakeTransaction(),
        waivedBy: profile.id,
      },
    ];
    const waivableTranasctions = transactions.filter(t => !t.waivedBy);
    const waivedTranasctions = transactions.filter(t => t.waivedBy);

    const target = renderWithProviderAndRestful(
      <AdjustTransactions
        buttonLabel="adjust transactions"
        currentTransactions={transactions}
      />,
      base,
      store => store.dispatch(profileActions.signIn({me: profile}))
    );

    const toggleButton = target.getByText(/adjust transactions/i);
    fireEvent.click(toggleButton);

    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    const saveAdjustmentsButton = target.getByText(/save adjustments/i);

    return {
      ...target,
      waivableTranasctions,
      waivedTranasctions,
      transactions,
      profile,
      saveAdjustmentsButton,
    };
  }

  it('should render transactions', async () => {
    const {
      waivableTranasctions,
      waivedTranasctions,
      saveAdjustmentsButton,
      getByText,
      queryByText,
    } = await renderTarget();

    for (const expected of waivableTranasctions) {
      expect(getByText(expected.charge?.code as string)).toBeInTheDocument();
      expect(
        getByText(currencyFormat(roundOff(expected.amount)))
      ).toBeInTheDocument();
    }
    for (const expected of waivedTranasctions) {
      expect(
        queryByText(expected.charge?.code as string)
      ).not.toBeInTheDocument();
      expect(
        queryByText(currencyFormat(roundOff(expected.amount)))
      ).not.toBeInTheDocument();
    }
    expect(saveAdjustmentsButton).toBeInTheDocument();
    expect(saveAdjustmentsButton).toBeDisabled();
  });

  it('should enable save button when a tranasction is waived and transactions can be saved', async () => {
    const {
      waivableTranasctions,
      profile,
      saveAdjustmentsButton,
      getByPlaceholderText,
      getByRole,
      getByTestId,
      queryByRole,
    } = await renderTarget();
    const expectedComment = faker.random.words(10);
    const transactionToWaive = faker.random.arrayElement(waivableTranasctions);
    const waivedTransaction = toWaivedTransaction(
      transactionToWaive,
      expectedComment,
      profile.id
    );

    nock(base)
      .post(
        '/api/transaction/postTransactions',
        waivedTransaction.transactions as ApprovedAny // nock does not accept arrays for some reason
      )
      .reply(200);
    window.confirm = jest.fn().mockImplementation(() => true);

    const container = getByTestId(
      `waivable-tranasction-${transactionToWaive.id}`
    );
    const waiveButton = within(container).getByText(/waive/i);
    fireEvent.click(waiveButton);

    await waitFor(() => expect(getByRole('form')).toBeInTheDocument());
    fireEvent.change(getByPlaceholderText(/comments/i), {
      target: {value: expectedComment},
    });
    fireEvent.click(within(getByRole('form')).getByText(/waive/i));
    await waitFor(() => expect(queryByRole('form')).not.toBeInTheDocument());

    fireEvent.click(saveAdjustmentsButton);
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    expect(window.confirm).toBeCalled();
  });
});
