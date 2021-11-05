import 'isomorphic-fetch';

import faker from 'faker';
import nock from 'nock';

import {Matcher, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  renderWithProvider,
  renderWithRestful,
} from '../../../@utils/test-renderers';
import ForgotPasswordForm from '../ForgotPasswordForm';

describe('ForgotPasswordForm', () => {
  const base = 'http://localhost';

  async function assertForgotPassword(
    responseCode: number,
    onForgotPassword?: () => void
  ) {
    const username = faker.internet.userName();
    const email = faker.internet.email();

    nock(base)
      .post('/api/profile/resetPassword', {
        username,
        email,
      })
      .reply(responseCode, responseCode === 500 ? 'err' : undefined);

    const target = renderWithRestful(
      <ForgotPasswordForm onForgotPassword={onForgotPassword} />,
      base
    );

    const emailInput = target.getByPlaceholderText(
      /email/i
    ) as HTMLInputElement;
    const usernameInput = target.getByPlaceholderText(
      /username/i
    ) as HTMLInputElement;

    userEvent.type(emailInput, email);
    userEvent.type(usernameInput, username);

    userEvent.click(target.getByText(/reset password/i));

    return {
      ...target,
    };
  }

  async function enterInputThenSubmitForm(matcher: Matcher, value: string) {
    const {getByText, getByPlaceholderText, getByRole} = renderWithProvider(
      <ForgotPasswordForm />
    );

    const input = getByPlaceholderText(matcher) as HTMLInputElement;

    userEvent.clear(input);
    userEvent.type(input, value);
    await waitFor(() => expect(input.value).toBe(value));

    userEvent.click(getByText(/reset password$/i));

    await waitFor(() =>
      expect((getByRole('form') as HTMLFormElement).checkValidity()).toBe(false)
    );
  }

  it('should render', async () => {
    const {getByPlaceholderText, getByText} = renderWithRestful(
      <ForgotPasswordForm />,
      base
    );
    expect(getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(getByText(/reset password/i)).toBeInTheDocument();
  });

  it('should fail reset password and show error', async () => {
    const {getByRole} = await assertForgotPassword(404);
    await waitFor(() => {
      expect(getByRole('error').textContent).toMatch(
        /unable to reset password*/
      );
    });
  });

  it('should successfully reset password', async () => {
    const mockOnForgotPassword = jest.fn();
    const {getByRole} = await assertForgotPassword(204, mockOnForgotPassword);
    await waitFor(() => expect(getByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(mockOnForgotPassword).toBeCalled());
  });

  it('should require email input', async () => {
    await enterInputThenSubmitForm(/username/i, faker.internet.userName());
  });

  it('should require username input', async () => {
    await enterInputThenSubmitForm(/email/i, faker.internet.email());
  });
});
