import faker from 'faker';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {ApprovedAny} from '../../../@types';
import {currencyFormat} from '../../../@utils/currencies';
import {
  generateFakeExpense,
  generateFakeProfile,
} from '../../../@utils/fake-models';
import {renderWithProvider} from '../../../@utils/test-renderers';
import {CreateVoucherOrOrder} from '../../../Api';
import {profileActions} from '../../../store/reducers/profile.reducer';
import AddExpense from '../AddExpense';
import ManageVoucherOrOrder from '../ManageVoucherOrOrder';

type AddExpenseProps = React.ComponentProps<typeof AddExpense>;

const mockedExpense = generateFakeExpense();

jest.mock(
  '../AddExpense',
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

describe('ManageVoucherOrOrder', () => {
  const mockedProfile = generateFakeProfile();
  const chargeId = faker.datatype.number();
  const fakeTitle = faker.random.words();

  async function renderTarget(props?: {
    onSave?: (data: CreateVoucherOrOrder) => void;
    hasOrderData?: boolean;
    purchaseRequestId?: number;
  }) {
    const target = renderWithProvider(
      <ManageVoucherOrOrder
        chargeId={chargeId}
        buttonLabel={'toggle'}
        title={fakeTitle}
        {...props}
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
      await renderTarget({onSave: mockOnCreatePurchaseRequest});

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

  it('should render and create a new purchase order', async () => {
    window.confirm = jest.fn().mockImplementation(() => true);

    const mockOnCreatePurchaseRequest = jest.fn();
    const expectedBody: CreateVoucherOrOrder = {
      description: faker.random.words(2),
      requestedBy: Number(mockedProfile.id),
      requestedDate: new Date().toISOString(),
      expenses: [mockedExpense],
      chargeId,
      orderData: {
        purchaseRequestId: faker.datatype.number(),
        fulfillmentDate: faker.date.future().toISOString(),
        otherDetails: faker.random.words(5),
        vendorName: faker.random.words(2),
      },
    };

    const {
      addExpenseButton,
      descriptionInput,
      saveButton,
      getByPlaceholderText,
      queryByRole,
    } = await renderTarget({
      onSave: mockOnCreatePurchaseRequest,
      hasOrderData: true,
      purchaseRequestId: expectedBody.orderData?.purchaseRequestId,
    });

    const vendorNameInput = getByPlaceholderText(/vendor name/i);
    const fulfillmentDateInput = getByPlaceholderText(/fulfillment date/i);
    const otherDetailsInput = getByPlaceholderText(/other details/i);

    userEvent.type(descriptionInput, expectedBody.description);
    if (expectedBody.orderData) {
      userEvent.type(vendorNameInput, expectedBody.orderData.vendorName);
      userEvent.type(
        fulfillmentDateInput,
        expectedBody.orderData.fulfillmentDate
      );
      userEvent.type(otherDetailsInput, expectedBody.orderData.otherDetails);
    }
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
          orderData: {
            vendorName: expectedBody.orderData?.vendorName,
            otherDetails: expectedBody.orderData?.otherDetails,
            fulfillmentDate: expectedBody.orderData?.fulfillmentDate.substr(
              0,
              10
            ),
            purchaseRequestId: expectedBody.orderData?.purchaseRequestId,
          },
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
