import faker from 'faker';

import {fireEvent, render, waitFor} from '@testing-library/react';

import ProcessAmountInput from '../../actions/ProcessAmountInput';

describe('ProcessAmountInput', () => {
  it('should render', () => {
    const {queryAllByRole} = render(<ProcessAmountInput />);
    expect(queryAllByRole('button').length).toEqual(0);
  });

  it('should render buttons', () => {
    const buttonLabel = faker.random.words();
    const mockOnRemove = jest.fn();
    const {queryAllByRole} = render(
      <ProcessAmountInput buttonLabel={buttonLabel} onRemove={mockOnRemove} />
    );
    expect(queryAllByRole('button').length).toEqual(2);
  });

  it('should handle values on change', async () => {
    const value = faker.datatype.number();
    const chargeId = faker.datatype.number();
    const mockOnChange = jest.fn();
    const {getByPlaceholderText} = render(
      <ProcessAmountInput
        amount={100}
        chargeId={chargeId}
        onChange={mockOnChange}
      />
    );

    fireEvent.change(getByPlaceholderText(/amount to pay/i), {
      target: {value},
    });

    await waitFor(() => {
      expect(mockOnChange).toBeCalledTimes(1);
      expect(mockOnChange).toBeCalledWith({amount: value, chargeId});
    });
  });

  it('should handle removing an amount', async () => {
    const amount = faker.datatype.number();
    const chargeId = faker.datatype.number();
    const mockOnRemove = jest.fn();
    const {getByTitle} = render(
      <ProcessAmountInput
        amount={amount}
        chargeId={chargeId}
        onRemove={mockOnRemove}
      />
    );

    await waitFor(() => expect(getByTitle(/remove/i)).toBeInTheDocument());
    fireEvent.click(getByTitle(/remove/i));

    await waitFor(() => {
      expect(mockOnRemove).toBeCalledTimes(1);
      expect(mockOnRemove).toBeCalledWith(chargeId);
    });
  });

  it.each`
    invalidValue | description
    ${'abc'}     | ${'should not accept string values'}
    ${10.333}    | ${'should not accept values that has more than 2 decimal places'}
    ${-1}        | ${'should not accept values that is less than 0'}
    ${0}         | ${'should not accept zero value'}
  `('$description', async ({invalidValue}) => {
    const chargeId = faker.datatype.number();
    const mockOnSubmit = jest.fn();
    const {getByPlaceholderText, getByText} = render(
      <ProcessAmountInput
        amount={100}
        chargeId={chargeId}
        buttonLabel="submit"
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(getByPlaceholderText(/amount to pay/i), {
      target: {value: invalidValue},
    });
    fireEvent.click(getByText(/submit/i));
    await waitFor(() => {
      expect(mockOnSubmit).not.toBeCalled();
    });
  });
});
