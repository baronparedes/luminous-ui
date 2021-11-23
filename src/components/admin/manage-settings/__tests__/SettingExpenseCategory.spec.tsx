import faker from 'faker';
import nock from 'nock';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {generateFakeCategory} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {DEFAULTS} from '../../../../constants';
import SettingExpenseCategory from '../SettingExpenseCategory';

describe('SettingExpenseCategory', () => {
  const base = 'http://localhost';
  const expectedCategories = [generateFakeCategory(), generateFakeCategory()];

  beforeEach(() => {
    nock(base)
      .get('/api/setting/getAllCategories')
      .reply(200, expectedCategories);
  });

  it('should render', async () => {
    const {getByText} = renderWithProviderAndRestful(
      <SettingExpenseCategory />,
      base
    );

    expect(getByText(/expense categories/i)).toBeInTheDocument();
    expect(getByText(/save/i)).toBeInTheDocument();
    expect(getByText(/new category/i)).toBeInTheDocument();

    await waitFor(() => {
      for (const expected of expectedCategories) {
        const tab = getByText(expected.description, {selector: 'a'});
        expect(tab).toBeInTheDocument();
      }
    });
  });

  it('should switch between tabs', async () => {
    const {getByText, getByRole} = renderWithProviderAndRestful(
      <SettingExpenseCategory />,
      base
    );

    await waitFor(() => {
      for (const expected of expectedCategories) {
        const tab = getByText(expected.description, {selector: 'a'});
        expect(tab).toBeInTheDocument();
      }
    });

    for (const expected of expectedCategories) {
      const tab = getByText(expected.description, {selector: 'a'});
      userEvent.click(tab);

      const container = getByRole('tabpanel');
      await waitFor(() => {
        expect(
          within(container).getByPlaceholderText(/description/i)
        ).toHaveValue(expected.description);
      });

      expect(
        within(container).getByPlaceholderText(/enter sub category/i)
      ).toBeInTheDocument();
      expect(
        within(container).getByTitle(/create new sub category/i)
      ).toBeInTheDocument();

      const subCategories = JSON.parse(expected.subCategories);
      for (const expectedSubCat of subCategories) {
        const subCategoryContainer = getByText(expectedSubCat)
          .parentElement as HTMLElement;
        expect(
          within(subCategoryContainer).getByText(expectedSubCat)
        ).toBeInTheDocument();
        expect(
          within(subCategoryContainer).getByTitle(/remove/)
        ).toBeInTheDocument();
      }
    }
  });

  it('should disable save button when category description is invalid', async () => {
    const {getByRole, getByText} = renderWithProviderAndRestful(
      <SettingExpenseCategory />,
      base
    );
    await waitFor(() => expect(getByRole('tabpanel')).toBeInTheDocument());

    userEvent.clear(
      within(getByRole('tabpanel')).getByPlaceholderText(/description/i)
    );
    await waitFor(() =>
      expect(getByText(/save/i, {selector: 'button'})).toBeDisabled()
    );
  });

  it('should save categories', async () => {
    nock(base)
      .get('/api/setting/getAllCategories')
      .reply(200, expectedCategories);

    nock(base)
      .patch('/api/setting/updateCategories', body => {
        expect(body).toEqual([...expectedCategories]);
        return true;
      })
      .reply(200);

    const {queryByRole, getByText, store} = renderWithProviderAndRestful(
      <SettingExpenseCategory />,
      base
    );
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );

    userEvent.click(getByText(/save/i));
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );

    await waitFor(() =>
      expect(store.getState().setting.categories).toEqual([
        ...expectedCategories,
      ])
    );
  });

  it('should add a new category', async () => {
    const newCategory = faker.random.words(2);
    const newExpectedCategories = [
      ...expectedCategories,
      {
        id: faker.datatype.number(),
        communityId: DEFAULTS.COMMUNITY_ID,
        description: newCategory,
        subCategories: '[]',
      },
    ];

    nock(base)
      .get('/api/setting/getAllCategories')
      .reply(200, newExpectedCategories);

    nock(base)
      .patch('/api/setting/updateCategories', body => {
        expect(body).toEqual([
          ...expectedCategories,
          {
            communityId: DEFAULTS.COMMUNITY_ID,
            description: newCategory,
            subCategories: '[]',
          },
        ]);
        return true;
      })
      .reply(200);

    const {getByText, getByRole, queryByRole} = renderWithProviderAndRestful(
      <SettingExpenseCategory />,
      base
    );
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );

    userEvent.click(getByText(/new category/i));
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

    const dialogContainer = getByRole('dialog');
    userEvent.type(
      within(dialogContainer).getByPlaceholderText(/enter a new category/i),
      newCategory
    );
    userEvent.click(within(dialogContainer).getByText(/save/i));

    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => {
      for (const expected of newExpectedCategories) {
        const tab = getByText(expected.description, {selector: 'a'});
        expect(tab).toBeInTheDocument();
      }
    });
  });

  it.each`
    description          | expectedErrorLabel                    | invalidValue
    ${'empty string'}    | ${/should not be empty/i}             | ${' '}
    ${'leading spaces'}  | ${/should not have leading spaces/i}  | ${'    Leading Spaces'}
    ${'trailing spaces'} | ${/should not have trailing spaces/i} | ${'Trailing Spaces   '}
  `(
    'should not accept invalid values [$description]',
    async ({invalidValue, expectedErrorLabel}) => {
      const {getByText, getByRole, queryByRole} = renderWithProviderAndRestful(
        <SettingExpenseCategory />,
        base
      );

      await waitFor(() =>
        expect(queryByRole('progressbar')).not.toBeInTheDocument()
      );

      await waitFor(() => {
        for (const expected of expectedCategories) {
          const tab = getByText(expected.description, {selector: 'a'});
          expect(tab).toBeInTheDocument();
        }
      });

      const tabContainer = getByRole('tabpanel');
      const input = within(tabContainer).getByPlaceholderText(
        /enter sub category/i
      ) as HTMLInputElement;
      const addNewExpenseButton = within(tabContainer).getByTitle(
        /create new sub category/i
      );

      userEvent.type(input, invalidValue);
      userEvent.click(addNewExpenseButton);
      await waitFor(() =>
        expect(
          within(tabContainer).getByText(expectedErrorLabel)
        ).toBeInTheDocument()
      );
      await waitFor(() =>
        expect(within(tabContainer).queryAllByTitle(/remove/i)).toHaveLength(2)
      );
    }
  );

  it('should not add duplicate values and should be required', async () => {
    const expectedCategory = faker.random.words(2);

    const {getByRole, getByText, queryByRole} = renderWithProviderAndRestful(
      <SettingExpenseCategory />,
      base
    );

    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );

    await waitFor(() => {
      for (const expected of expectedCategories) {
        const tab = getByText(expected.description, {selector: 'a'});
        expect(tab).toBeInTheDocument();
      }
    });

    const tabContainer = getByRole('tabpanel');

    const form = within(tabContainer).getByRole('form') as HTMLFormElement;
    const input = within(tabContainer).getByPlaceholderText(
      /enter sub category/i
    ) as HTMLInputElement;
    const addNewExpenseButton = within(tabContainer).getByTitle(
      /create new sub category/i
    );

    userEvent.type(input, expectedCategory);
    userEvent.click(addNewExpenseButton);
    await waitFor(() => expect(form.checkValidity()).toBeTruthy());
    await waitFor(() =>
      expect(within(tabContainer).queryAllByTitle(/remove/i)).toHaveLength(3)
    );

    userEvent.type(input, expectedCategory);
    userEvent.click(addNewExpenseButton);
    await waitFor(() =>
      expect(
        within(tabContainer).getByText(/should be unique/i)
      ).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(within(tabContainer).queryAllByTitle(/remove/i)).toHaveLength(3)
    );

    userEvent.clear(input);
    userEvent.click(addNewExpenseButton);
    await waitFor(() =>
      expect(within(tabContainer).queryAllByTitle(/remove/i)).toHaveLength(3)
    );
  });
});
