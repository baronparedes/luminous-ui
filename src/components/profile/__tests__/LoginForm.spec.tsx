import 'isomorphic-fetch';

import faker from 'faker';
import nock from 'nock';

import {cleanup, fireEvent, waitFor} from '@testing-library/react';

import {generateFakeAuthResult} from '../../../@utils/fake-models';
import routes from '../../../@utils/routes';
import {
  renderWithProvider,
  renderWithProviderAndRouterAndRestful,
} from '../../../@utils/test-renderers';
import {AuthResult} from '../../../Api';
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
  const base = 'http://localhost';
  const mockedAuthResult = generateFakeAuthResult();

  async function assertSignIn(result: AuthResult | string, responseCode = 200) {
    const username = faker.name.findName();
    const password = faker.random.alphaNumeric(15);

    nock(base)
      .post('/api/profile/auth')
      .matchHeader('authorization', /^Basic /i)
      .reply(responseCode, result);

    const target = renderWithProviderAndRouterAndRestful(<LoginForm />, base);
    target.history.push(routes.LOGIN);

    const usernameInput = target.getByPlaceholderText(
      /username/i
    ) as HTMLInputElement;
    const passwordInput = target.getByPlaceholderText(
      /password/i
    ) as HTMLInputElement;

    fireEvent.change(usernameInput, {target: {value: username}});
    fireEvent.change(passwordInput, {target: {value: password}});

    await waitFor(() => expect(usernameInput.value).toBe(username));
    await waitFor(() => expect(passwordInput.value).toBe(password));

    fireEvent.click(target.getByText(/sign in/i));

    await waitFor(() =>
      expect(target.getByRole('progressbar')).toBeInTheDocument()
    );

    return {
      ...target,
    };
  }

  async function enterInputThenSubmitForm(name: string, value: string) {
    const {getByText, getByPlaceholderText, getByRole} = renderWithProvider(
      <LoginForm />
    );

    const regex = new RegExp(name, 'i');
    const input = getByPlaceholderText(regex) as HTMLInputElement;

    fireEvent.change(input, {target: {value: value}});
    await waitFor(() => expect(input.value).toBe(value));

    fireEvent.click(getByText(/sign in/i));

    await waitFor(() =>
      expect((getByRole('form') as HTMLFormElement).checkValidity()).toBe(false)
    );
  }

  afterEach(() => {
    cleanup();
    nock.cleanAll();
    jest.clearAllMocks();
  });

  it('should render', async () => {
    const {getByPlaceholderText} = renderWithProvider(<LoginForm />);
    expect(getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('should fail sigin in and show error', async () => {
    const {history, getByRole} = await assertSignIn('err', 500);
    await waitFor(() => {
      expect(getByRole('error').textContent).toMatch(/unable to login*/);
      expect(history.location.pathname).not.toBe(routes.ROOT);
    });
  });

  it('should successfully sign in and redirect to dashboard page', async () => {
    const {store, history} = await assertSignIn(mockedAuthResult, 200);
    await waitFor(() => {
      expect(store.getState().profile.me).toStrictEqual(
        mockedAuthResult.profile
      );
      expect(store.getState().profile.token).toBe(mockedAuthResult.token);
      expect(history.location.pathname).toBe(routes.ROOT);
    });
  });

  it('should require username before signing in', async () => {
    await enterInputThenSubmitForm('password', faker.random.alphaNumeric(10));
  });

  it('should require password before signing in', async () => {
    await enterInputThenSubmitForm('username', faker.name.findName());
  });
});
