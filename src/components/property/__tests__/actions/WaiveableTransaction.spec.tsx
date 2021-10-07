import faker from 'faker';

import {fireEvent, render, waitFor, within} from '@testing-library/react';

import {generateFakeTransaction} from '../../../../@utils/fake-models';
import WaivableTransaction from '../../actions/WaivableTranasction';

describe('WaivableTransaction', () => {
  it('should render and toggle waive and undo', async () => {
    const mockOnTransactionWaived = jest.fn();
    const mockOnTransactionWaiveCancelled = jest.fn();
    const expectedComments = faker.random.words(5);
    const expectedTransaction = generateFakeTransaction();
    const {getByText, getByRole, getByPlaceholderText} = render(
      <WaivableTransaction
        transaction={expectedTransaction}
        onTransactionWaived={mockOnTransactionWaived}
        onTransactionWaiveCancelled={mockOnTransactionWaiveCancelled}
      />
    );

    fireEvent.click(getByText(/waive/));
    await waitFor(() => expect(getByRole('form')).toBeInTheDocument());

    fireEvent.change(getByPlaceholderText(/comments/i), {
      target: {value: expectedComments},
    });
    fireEvent.click(within(getByRole('form')).getByText(/waive/));
    await waitFor(() => expect(getByText(/undo/)).toBeInTheDocument());

    fireEvent.click(getByText(/undo/));
    await waitFor(() => expect(getByText(/waive/)).toBeInTheDocument());

    expect(mockOnTransactionWaived).toBeCalled();
    expect(mockOnTransactionWaived).toBeCalledWith(
      expectedTransaction,
      expectedComments
    );

    expect(mockOnTransactionWaiveCancelled).toBeCalled();
    expect(mockOnTransactionWaiveCancelled).toBeCalledWith(expectedTransaction);
  });
});
