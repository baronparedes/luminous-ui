import faker from 'faker';

import {
  getByPlaceholderText,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeCharge,
  generateFakeTransaction,
} from '../../../../@utils/fake-models';
import {TransactionAttr} from '../../../../Api';
import AdjustedTransactions, {
  toTransaction,
} from '../../actions/AdjustedTransactions';

describe('AdjustedTransactions', () => {
  const propertyId = faker.datatype.number();
  it('should render', () => {
    const {getByText, getByTitle} = render(
      <AdjustedTransactions
        adjustedTransactions={[]}
        propertyId={propertyId}
        disabled={true}
      />
    );
    expect(getByText(/manual adjustments/i)).toBeInTheDocument();
    expect(
      getByText(/You can add adjustments by clicking the add button/i)
    ).toBeInTheDocument();
    expect(getByTitle(/add transaction/i)).toBeInTheDocument();
    expect(getByTitle(/add transaction/i)).toBeDisabled();
  });

  it('should render and not display charge when it is already added as an adjustment', async () => {
    const expectedCharge1 = generateFakeCharge();
    const expectedCharge2 = generateFakeCharge();
    const mockedTransaction: TransactionAttr = {
      ...generateFakeTransaction(),
      chargeId: Number(expectedCharge1.id),
      charge: expectedCharge1,
    };

    const {getByTitle, getByRole, getByPlaceholderText} = render(
      <AdjustedTransactions
        adjustedTransactions={[mockedTransaction]}
        charges={[expectedCharge1, expectedCharge2]}
        propertyId={propertyId}
      />
    );

    userEvent.click(getByTitle(/add transaction/i));
    await waitFor(() => {
      expect(getByRole('dialog')).toBeInTheDocument();
      expect(getByRole('form')).toBeInTheDocument();
    });

    const selectCharge = getByPlaceholderText(
      /charge id/i
    ) as HTMLSelectElement;
    const options = within(selectCharge).queryByText(expectedCharge1.code);
    expect(options).not.toBeInTheDocument();
  });

  it('should render and add transaction', async () => {
    const mockedOnTransactionAdjusted = jest.fn();
    const expectedCharge = generateFakeCharge();
    const expectedComment = faker.random.words(10);
    const expectedAmount = faker.datatype.number();
    const {getByTitle, getByRole, getByPlaceholderText, getByText} = render(
      <AdjustedTransactions
        adjustedTransactions={[]}
        charges={[expectedCharge]}
        propertyId={propertyId}
        onTransactionAdjusted={mockedOnTransactionAdjusted}
      />
    );

    userEvent.click(getByTitle(/add transaction/i));
    await waitFor(() => {
      expect(getByRole('dialog')).toBeInTheDocument();
      expect(getByRole('form')).toBeInTheDocument();
    });

    userEvent.selectOptions(
      getByPlaceholderText(/charge id/i),
      Number(expectedCharge.id).toString()
    );
    userEvent.type(getByPlaceholderText(/comments/i), expectedComment);
    userEvent.type(getByPlaceholderText(/amount/i), expectedAmount.toString());

    userEvent.click(getByText(/add/i, {selector: 'button'}));

    await waitFor(() => {
      expect(mockedOnTransactionAdjusted).toBeCalled();
      expect(mockedOnTransactionAdjusted).toBeCalledWith(
        toTransaction(
          {
            amount: expectedAmount,
            comments: expectedComment,
            chargeId: Number(expectedCharge.id),
          },
          propertyId
        )
      );
    });
  });

  it('should render and remove tranasction', async () => {
    const mockedOnTransactionAdjustedRemoved = jest.fn();
    const expectedTransaction = generateFakeTransaction();
    const mockedTransactions = [expectedTransaction];
    const {getByTitle} = render(
      <AdjustedTransactions
        adjustedTransactions={mockedTransactions}
        propertyId={propertyId}
        onTransactionAdjustedRemoved={mockedOnTransactionAdjustedRemoved}
      />
    );
    expect(getByTitle(/remove/i)).toBeEnabled();
    userEvent.click(getByTitle(/remove/i));

    expect(mockedOnTransactionAdjustedRemoved).toBeCalled();
    expect(mockedOnTransactionAdjustedRemoved).toBeCalledWith(
      expectedTransaction
    );
  });
});
