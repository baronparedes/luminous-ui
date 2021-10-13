import faker from 'faker';
import nock from 'nock';

import {fireEvent, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {ApprovedAny} from '../../../../@types';
import {currencyFormat, roundOff} from '../../../../@utils/currencies';
import {
  generateFakeCharge,
  generateFakeProfile,
  generateFakeTransaction,
} from '../../../../@utils/fake-models';
import {sanitizeTransaction} from '../../../../@utils/helpers';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import {toTransaction} from '../../actions/AdjustedTransactions';
import AdjustTransactions, {
  toWaivedTransaction,
} from '../../actions/AdjustTransactions';

describe('AdjustTransactions', () => {
  const base = 'http://localhost';
  const profile = generateFakeProfile();
  const propertyId = faker.datatype.number();
  const expectedCharge = generateFakeCharge();
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

  async function renderTarget(currentTransactions = transactions) {
    nock(base).get('/api/charge/getAllCharges').reply(200, [expectedCharge]);

    const target = renderWithProviderAndRestful(
      <AdjustTransactions
        propertyId={propertyId}
        buttonLabel="adjust transactions"
        currentTransactions={currentTransactions}
      />,
      base,
      store => store.dispatch(profileActions.signIn({me: profile}))
    );

    const toggleButton = target.getByText(/adjust transactions/i);
    fireEvent.click(toggleButton);

    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());
    await waitFor(() =>
      expect(target.getByTitle(/add transaction/i)).toBeEnabled()
    );

    expect(
      target.getByText(/you can add adjustments by clicking the add button/i)
    ).toBeInTheDocument();

    const addTransactionButton = target.getByTitle(/add transaction/i);
    const saveAdjustmentsButton = target.getByText(/save adjustments/i);

    return {
      ...target,
      saveAdjustmentsButton,
      addTransactionButton,
    };
  }

  it('should render no transactions found', async () => {
    const {getByText} = await renderTarget([]);
    await waitFor(() =>
      expect(getByText(/no waivable transactions found/i)).toBeInTheDocument()
    );
  });

  it('should render transactions', async () => {
    const {saveAdjustmentsButton, getByText, queryByText} =
      await renderTarget();

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
    userEvent.click(waiveButton);

    await waitFor(() => expect(getByRole('form')).toBeInTheDocument());
    userEvent.type(getByPlaceholderText(/comments/i), expectedComment);
    userEvent.click(within(getByRole('form')).getByText(/waive/i));
    await waitFor(() => expect(queryByRole('form')).not.toBeInTheDocument());

    userEvent.click(saveAdjustmentsButton);
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    expect(window.confirm).toBeCalled();
  });

  it('should enable save button when a transaction is adjusted and transactions can be saved', async () => {
    const {
      addTransactionButton,
      saveAdjustmentsButton,
      getByRole,
      getByPlaceholderText,
      getByTestId,
      getByText,
      queryByRole,
    } = await renderTarget([]);
    const expectedComment = faker.random.words(10);
    const expectedAmount = faker.datatype.number();

    const expectedTransaction = toTransaction(
      {
        amount: expectedAmount,
        chargeId: Number(expectedCharge.id),
        comments: expectedComment,
      },
      propertyId
    );

    nock(base)
      .post(
        '/api/transaction/postTransactions',
        [sanitizeTransaction(expectedTransaction)] as ApprovedAny // nock does not accept arrays for some reason
      )
      .reply(200);

    window.confirm = jest.fn().mockImplementation(() => true);

    userEvent.click(addTransactionButton);
    await waitFor(() => expect(getByRole('form')).toBeInTheDocument());

    const formContainer = getByRole('form') as HTMLFormElement;
    const chargeSelect = getByPlaceholderText(/charge id/) as HTMLSelectElement;
    expect(chargeSelect.value).toEqual('Please select a charge code');

    userEvent.selectOptions(chargeSelect, Number(expectedCharge.id).toString());
    userEvent.type(getByPlaceholderText(/comments/i), expectedComment);
    userEvent.type(getByPlaceholderText(/amount/i), expectedAmount.toString());

    await waitFor(() => expect(formContainer.checkValidity()).toBeTruthy);
    userEvent.click(getByText(/add/i, {selector: 'button'}));

    const containerTestId = `adjusted-transaction-${expectedCharge.id}`;
    await waitFor(() =>
      expect(getByTestId(containerTestId)).toBeInTheDocument()
    );
    await waitFor(() => expect(saveAdjustmentsButton).toBeEnabled());

    userEvent.click(saveAdjustmentsButton);
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    expect(window.confirm).toBeCalled();
  });
});
