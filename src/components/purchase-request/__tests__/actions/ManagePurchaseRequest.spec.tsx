import faker from 'faker';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {ApprovedAny} from '../../../../@types';
import {currencyFormat} from '../../../../@utils/currencies';
import {
  generateFakeExpense,
  generateFakeProfile,
} from '../../../../@utils/fake-models';
import {renderWithProvider} from '../../../../@utils/test-renderers';
import {CreateVoucherOrOrder} from '../../../../Api';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import AddExpense from '../../../@ui/AddExpense';
import ManagePurchaseRequest from '../../actions/ManagePurchaseRequest';

type AddExpenseProps = React.ComponentProps<typeof AddExpense>;

const mockedExpense = generateFakeExpense();

jest.mock(
  '../../../@ui/AddExpense',
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

describe('ManagePurchaseRequest', () => {
  const mockedProfile = generateFakeProfile();
  const chargeId = faker.datatype.number();
  const fakeTitle = faker.random.words();

  async function renderTarget(onSave?: (data: CreateVoucherOrOrder) => void) {
    const target = renderWithProvider(
      <ManagePurchaseRequest
        chargeId={chargeId}
        buttonLabel={'toggle'}
        onSave={onSave}
        title={fakeTitle}
      />,
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

    expect(target.getByText(fakeTitle)).toBeInTheDocument();

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

  it('should render and create a new purchase request', async () => {
    window.confirm = jest.fn().mockImplementation(() => true);

    const mockOnCreatePurchaseRequest = jest.fn();
    const expectedBody: CreateVoucherOrOrder = {
      description: faker.random.words(2),
      requestedBy: Number(mockedProfile.id),
      requestedDate: new Date().toISOString(),
      expenses: [mockedExpense],
      chargeId,
    };

    const {addExpenseButton, descriptionInput, saveButton, queryByRole} =
      await renderTarget(mockOnCreatePurchaseRequest);

    userEvent.type(descriptionInput, expectedBody.description);
    userEvent.click(addExpenseButton);
    userEvent.click(saveButton);

    await waitFor(() => expect(window.confirm).toHaveBeenCalled());
    await waitFor(() => {
      expect(mockOnCreatePurchaseRequest).toHaveBeenCalled();
      expect(mockOnCreatePurchaseRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          description: expectedBody.description,
          requestedBy: expectedBody.requestedBy,
          expenses: expectedBody.expenses,
          chargeId,
        })
      );
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
