import faker from 'faker';
import nock from 'nock';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {SETTING_KEYS} from '../../../../constants';
import {settingActions} from '../../../../store/reducers/setting.reducer';
import SettingExpenseCategory from '../SettingExpenseCategory';

describe('SettingExpenseCategory', () => {
  const base = 'http://localhost';

  it('should render', () => {
    const expectedCategory = faker.random.words(2);
    const {getByText, getByPlaceholderText, getByTitle} =
      renderWithProviderAndRestful(<SettingExpenseCategory />, base, store =>
        store.dispatch(
          settingActions.updateSetting({
            key: SETTING_KEYS.EXPENSE_CATEGORY,
            value: JSON.stringify([expectedCategory]),
          })
        )
      );

    const categoryContainer = getByText(expectedCategory)
      .parentElement as HTMLElement;
    expect(
      within(categoryContainer).getByText(expectedCategory)
    ).toBeInTheDocument();
    expect(within(categoryContainer).getByTitle(/remove/)).toBeInTheDocument();

    expect(getByText(/expense categories/i)).toBeInTheDocument();
    expect(getByText(/save/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/expense category/i)).toBeInTheDocument();
    expect(getByTitle(/create new expense category/i)).toBeInTheDocument();
  });

  it.each`
    description          | expectedErrorLabel                    | invalidValue
    ${'empty string'}    | ${/should not be empty/i}             | ${' '}
    ${'leading spaces'}  | ${/should not have leading spaces/i}  | ${'    Leading Spaces'}
    ${'trailing spaces'} | ${/should not have trailing spaces/i} | ${'Trailing Spaces   '}
  `(
    'should not accept invalid values [$description]',
    async ({invalidValue, expectedErrorLabel}) => {
      const {getByText, getByPlaceholderText, getByTitle, queryAllByTitle} =
        renderWithProviderAndRestful(<SettingExpenseCategory />, base);

      const input = getByPlaceholderText(
        /expense category/i
      ) as HTMLInputElement;
      const addNewExpenseButton = getByTitle(/create new expense category/i);

      userEvent.type(input, invalidValue);
      userEvent.click(addNewExpenseButton);
      await waitFor(() =>
        expect(getByText(expectedErrorLabel)).toBeInTheDocument()
      );
      await waitFor(() => expect(queryAllByTitle(/remove/i)).toHaveLength(0));
    }
  );

  it('should not add duplicate values and should be required', async () => {
    const expectedCategory = faker.random.words(2);

    const {
      getByText,
      getByPlaceholderText,
      getByTitle,
      getByRole,
      queryAllByTitle,
    } = renderWithProviderAndRestful(<SettingExpenseCategory />, base);

    const form = getByRole('form') as HTMLFormElement;
    const input = getByPlaceholderText(/expense category/i) as HTMLInputElement;
    const addNewExpenseButton = getByTitle(/create new expense category/i);

    userEvent.type(input, expectedCategory);
    userEvent.click(addNewExpenseButton);
    await waitFor(() => expect(form.checkValidity()).toBeTruthy());
    await waitFor(() => expect(queryAllByTitle(/remove/i)).toHaveLength(1));

    userEvent.type(input, expectedCategory);
    userEvent.click(addNewExpenseButton);
    await waitFor(() =>
      expect(getByText(/should be unique/i)).toBeInTheDocument()
    );
    await waitFor(() => expect(queryAllByTitle(/remove/i)).toHaveLength(1));

    userEvent.clear(input);
    userEvent.click(addNewExpenseButton);
    await waitFor(() => expect(queryAllByTitle(/remove/i)).toHaveLength(1));
  });

  it('should add and save expense categories', async () => {
    const expectedCategories = [faker.random.words(2), faker.random.words(2)];
    const expectedKey = SETTING_KEYS.EXPENSE_CATEGORY;

    nock(base)
      .patch('/api/setting/updateSettingValue', {
        key: expectedKey,
        value: JSON.stringify(expectedCategories),
      })
      .reply(200);

    const {
      store,
      getByText,
      getByPlaceholderText,
      getByTitle,
      getByRole,
      queryByRole,
    } = renderWithProviderAndRestful(<SettingExpenseCategory />, base);

    const input = getByPlaceholderText(/expense category/i) as HTMLInputElement;
    const addNewExpenseButton = getByTitle(/create new expense category/i);
    const saveButton = getByText(/save/i);

    for (const expected of expectedCategories) {
      userEvent.type(input, expected);
      userEvent.click(addNewExpenseButton);

      await waitFor(() => expect(input.value).toEqual(''));

      const categoryContainer = getByText(expected)
        .parentElement as HTMLElement;
      expect(within(categoryContainer).getByText(expected)).toBeInTheDocument();
      expect(
        within(categoryContainer).getByTitle(/remove/)
      ).toBeInTheDocument();
    }

    userEvent.click(saveButton);
    await waitFor(() => expect(getByRole('progressbar')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );
    await waitFor(() => {
      const actual = store
        .getState()
        .setting.values.find(s => s.key === expectedKey)?.value;
      expect(actual).toEqual(JSON.stringify(expectedCategories));
    });
  });
});
