import faker from 'faker';
import nock from 'nock';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {ApprovedAny} from '../../../../@types';
import {currencyFormat} from '../../../../@utils/currencies';
import {
  generateFakeExpense,
  generateFakeProfile,
} from '../../../../@utils/fake-models';
import {renderWithProviderAndRouterAndRestful} from '../../../../@utils/test-renderers';
import {CreateVoucher as CreateVoucherAttr} from '../../../../Api';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import AddExpense from '../../actions/AddExpense';
import CreateVoucher from '../../actions/CreateVoucher';

type AddExpenseProps = React.ComponentProps<typeof AddExpense>;

const mockedExpense = generateFakeExpense();

jest.mock(
  '../../actions/AddExpense',
  () =>
    ({onAddExpense, ...buttonProps}: AddExpenseProps) => {
      const onClick = () => {
        onAddExpense && onAddExpense(mockedExpense);
      };
      return (
        <button
          {...(buttonProps as ApprovedAny)}
          onClick={onClick}
          data-testid="mock-add-expense"
        />
      );
    }
);

describe('CreateVoucher', () => {
  const base = 'http://localhost';
  const mockedProfile = generateFakeProfile();

  async function renderTarget(onCreateVoucher?: (id: number) => void) {
    const target = renderWithProviderAndRouterAndRestful(
      <CreateVoucher
        buttonLabel={'toggle'}
        onCreateVoucher={onCreateVoucher}
      />,
      base,
      store => store.dispatch(profileActions.signIn({me: mockedProfile}))
    );

    userEvent.click(target.getByText(/toggle/i));
    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    const minExpenseInfoText = /minimum of 1 expense should be added/i;
    const saveButton = target.getByText(/save$/i, {selector: 'button'});
    const addExpenseButton = target.getByTitle(/add expense/i);
    const descriptionInput = target.getByPlaceholderText(/description/i);
    const totalCostContainer = target.getByText(/^total cost$/i).parentElement
      ?.parentElement as HTMLElement;

    expect(target.getByText(/create new voucher/i)).toBeInTheDocument();

    expect(target.getByText(/^total cost$/i)).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(target.getByText(/expenses/i)).toBeInTheDocument();
    expect(target.getByText(minExpenseInfoText)).toBeInTheDocument();
    expect(addExpenseButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    expect(target.getByTestId('mock-add-expense')).toBeInTheDocument();

    return {
      ...target,
      totalCostContainer,
      descriptionInput,
      minExpenseInfoText,
      saveButton,
      addExpenseButton,
    };
  }

  it('should render', async () => {
    await renderTarget();
  });

  it('should render and create a new voucher', async () => {
    window.confirm = jest.fn().mockImplementation(() => true);

    const mockOnCreateVoucher = jest.fn();
    const voucherId = faker.datatype.number();
    const expectedBody: CreateVoucherAttr = {
      description: faker.random.words(2),
      requestedBy: Number(mockedProfile.id),
      requestedDate: new Date().toISOString(),
      expenses: [mockedExpense],
    };

    nock(base)
      .post('/api/voucher/postVoucher', body => {
        expect(new Date(body.requestedDate).toDateString()).toEqual(
          new Date(expectedBody.requestedDate).toDateString()
        );
        expect({...body, requestedDate: undefined}).toEqual({
          ...expectedBody,
          requestedDate: undefined,
        });
        return true;
      })
      .reply(200, voucherId as ApprovedAny);

    const {addExpenseButton, descriptionInput, saveButton, queryByRole} =
      await renderTarget(mockOnCreateVoucher);

    userEvent.type(descriptionInput, expectedBody.description);
    userEvent.click(addExpenseButton);
    userEvent.click(saveButton);

    await waitFor(() => expect(window.confirm).toHaveBeenCalled());
    await waitFor(() => {
      expect(mockOnCreateVoucher).toHaveBeenCalled();
      expect(mockOnCreateVoucher).toHaveBeenCalledWith(voucherId);
    });
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('should calculate total cost', async () => {
    const {addExpenseButton, totalCostContainer} = await renderTarget();
    const expectedTotalCost = mockedExpense.totalCost * 2;

    userEvent.click(addExpenseButton);
    userEvent.click(addExpenseButton);

    await waitFor(() =>
      expect(
        within(totalCostContainer).getByText(currencyFormat(expectedTotalCost))
      ).toBeInTheDocument()
    );
  });

  it('should enable and disable save button when managing expense', async () => {
    const {
      minExpenseInfoText,
      addExpenseButton,
      saveButton,
      getByText,
      queryByText,
    } = await renderTarget();

    expect(saveButton).toBeDisabled();
    expect(getByText(minExpenseInfoText)).toBeInTheDocument();

    userEvent.click(addExpenseButton);
    expect(saveButton).toBeEnabled();
    expect(queryByText(minExpenseInfoText)).not.toBeInTheDocument();
  });

  it('should require a description and not be empty', async () => {
    window.confirm = jest.fn();

    const {addExpenseButton, saveButton, descriptionInput, getByText} =
      await renderTarget();

    userEvent.click(addExpenseButton);
    userEvent.click(saveButton);

    userEvent.type(descriptionInput, ' ');
    userEvent.click(saveButton);
    await waitFor(() =>
      expect(getByText(/should not be empty/i)).toBeInTheDocument()
    );

    await waitFor(() => expect(window.confirm).not.toHaveBeenCalled());
  });
});
