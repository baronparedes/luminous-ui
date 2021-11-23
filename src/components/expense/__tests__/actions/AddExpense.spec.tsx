import faker from 'faker';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {currencyFormat} from '../../../../@utils/currencies';
import {
  generateFakeCategory,
  generateFakeExpense,
} from '../../../../@utils/fake-models';
import {renderWithProvider} from '../../../../@utils/test-renderers';
import {ExpenseAttr} from '../../../../Api';
import {settingActions} from '../../../../store/reducers/setting.reducer';
import AddExpense from '../../actions/AddExpense';

describe('AddExpense', () => {
  const expectedCategories = [generateFakeCategory(), generateFakeCategory()];

  function generateMockExpense() {
    const randomCategory = faker.random.arrayElement(expectedCategories);
    const subCategory = faker.random.arrayElement(
      JSON.parse(randomCategory.subCategories)
    );
    const mockedExpense: ExpenseAttr = {
      ...generateFakeExpense(),
      categoryId: Number(randomCategory.id),
      category: subCategory as string,
    };
    return mockedExpense;
  }

  async function renderTarget(onAddExpense?: (data: ExpenseAttr) => void) {
    const target = renderWithProvider(
      <AddExpense onAddExpense={onAddExpense} title="toggle" />,
      store =>
        store.dispatch(settingActions.updateCategories(expectedCategories))
    );

    expect(target.getByTitle(/toggle/i)).toBeInTheDocument();

    userEvent.click(target.getByTitle(/toggle/i));
    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    const descriptionInput = target.getByPlaceholderText(
      /description/i
    ) as HTMLInputElement;
    const categoryInput = target.getByPlaceholderText(
      /^category$/i
    ) as HTMLSelectElement;
    const quantityInput = target.getByPlaceholderText(
      /quantity/i
    ) as HTMLInputElement;
    const unitCostInput = target.getByPlaceholderText(
      /unit cost/i
    ) as HTMLInputElement;

    const submitButton = target.getByText(/add expense/i, {
      selector: 'button',
    }) as HTMLButtonElement;
    const totalExpenseContainer = target.getByText(/total expense/i)
      .parentElement as HTMLElement;

    expect(descriptionInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
    expect(quantityInput).toBeInTheDocument();
    expect(unitCostInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(totalExpenseContainer).toBeInTheDocument();

    const fillupExpense = async (formData: ExpenseAttr) => {
      userEvent.type(descriptionInput, formData.description);
      userEvent.clear(quantityInput);
      userEvent.type(quantityInput, formData.quantity.toString());
      userEvent.clear(unitCostInput);
      userEvent.type(unitCostInput, formData.unitCost.toString());
      userEvent.selectOptions(categoryInput, formData.categoryId.toString());

      const subCategoryInput = target.queryByPlaceholderText(
        /^sub category$/i
      ) as HTMLSelectElement;

      await waitFor(() => expect(subCategoryInput).toBeInTheDocument());
      userEvent.selectOptions(subCategoryInput, formData.category.toString());
    };

    return {
      ...target,
      fillupExpense,
      descriptionInput,
      quantityInput,
      unitCostInput,
      categoryInput,
      submitButton,
      totalExpenseContainer,
    };
  }

  it('should render and fill up and submit form', async () => {
    const mockedExpense = generateMockExpense();
    const mockOnAddExpense = jest.fn();
    const {fillupExpense, submitButton, totalExpenseContainer} =
      await renderTarget(mockOnAddExpense);

    await fillupExpense(mockedExpense);

    await waitFor(() => {
      within(totalExpenseContainer).getByText(
        currencyFormat(mockedExpense.totalCost)
      );
    });

    userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockOnAddExpense).toHaveBeenCalled();
      expect(mockOnAddExpense).toHaveBeenCalledWith(mockedExpense);
    });
  });

  it.each`
    field                | emptyValue
    ${/^category$/i}     | ${'Choose a category'}
    ${/^sub category$/i} | ${'Choose a sub category'}
  `('should require $field select input', async ({field, emptyValue}) => {
    const mockedExpense = generateMockExpense();
    const mockOnAddExpense = jest.fn();
    const {fillupExpense, submitButton, getByPlaceholderText, getByRole} =
      await renderTarget(mockOnAddExpense);

    await fillupExpense(mockedExpense);

    userEvent.selectOptions(getByPlaceholderText(field), emptyValue);
    userEvent.click(submitButton);
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
  });

  it.each`
    field
    ${/quantity/i}
    ${/unit cost/i}
  `(
    'should require $field input and should be greater than 0',
    async ({field}) => {
      const mockedExpense = generateMockExpense();
      const mockOnAddExpense = jest.fn();
      const {
        fillupExpense,
        submitButton,
        getByPlaceholderText,
        getByRole,
        getByText,
      } = await renderTarget(mockOnAddExpense);

      await fillupExpense(mockedExpense);

      userEvent.clear(getByPlaceholderText(field));
      userEvent.click(submitButton);
      await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

      userEvent.type(getByPlaceholderText(field), '0');
      userEvent.click(submitButton);
      await waitFor(() =>
        expect(getByText(/should be greater than 0/i)).toBeInTheDocument()
      );

      await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    }
  );

  it.each`
    field
    ${/description/i}
  `('should require $field input and not be empty', async ({field}) => {
    const mockedExpense = generateMockExpense();
    const mockOnAddExpense = jest.fn();
    const {
      fillupExpense,
      submitButton,
      getByPlaceholderText,
      getByRole,
      getByText,
    } = await renderTarget(mockOnAddExpense);

    await fillupExpense(mockedExpense);

    userEvent.clear(getByPlaceholderText(field));
    userEvent.click(submitButton);
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

    userEvent.type(getByPlaceholderText(field), ' ');
    userEvent.click(submitButton);
    await waitFor(() =>
      expect(getByText(/should not be empty/i)).toBeInTheDocument()
    );

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
  });
});
