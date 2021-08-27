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
import RegisterForm from '../RegisterForm';

describe('RegisterForm', () => {
  const base = 'http://localhost';
  const mockedAuthResult = generateFakeAuthResult();

  async function fillupRegistrion() {
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const confirmPassword = password;
    const fullname = faker.name.findName();
    const email = faker.internet.email();

    const target = renderWithProviderAndRouterAndRestful(
      <RegisterForm />,
      base
    );

    const usernameInput = target.getByPlaceholderText(
      /username/i
    ) as HTMLInputElement;
    const passwordInput = target.getByPlaceholderText(
      /^password/i
    ) as HTMLInputElement;
    const fullnameInput = target.getByPlaceholderText(
      /fullname/i
    ) as HTMLInputElement;
    const emailInput = target.getByPlaceholderText(
      /email/i
    ) as HTMLInputElement;
    const confirmPasswordInput = target.getByPlaceholderText(
      /confirm password/i
    ) as HTMLInputElement;

    fireEvent.change(usernameInput, {target: {value: username}});
    fireEvent.change(passwordInput, {target: {value: password}});
    fireEvent.change(fullnameInput, {target: {value: fullname}});
    fireEvent.change(emailInput, {target: {value: email}});
    fireEvent.change(confirmPasswordInput, {target: {value: confirmPassword}});

    return {
      username,
      password,
      email,
      fullname,
      confirmPassword,
      usernameInput,
      passwordInput,
      emailInput,
      fullnameInput,
      confirmPasswordInput,
      target,
    };
  }

  async function assertRegistration(
    result: AuthResult | string,
    responseCode = 200
  ) {
    nock(base).post('/api/profile/register').reply(responseCode, result);

    const {
      username,
      password,
      email,
      fullname,
      confirmPassword,
      usernameInput,
      passwordInput,
      emailInput,
      fullnameInput,
      confirmPasswordInput,
      target,
    } = await fillupRegistrion();

    await waitFor(() => {
      expect(usernameInput.value).toBe(username);
      expect(passwordInput.value).toBe(password);
      expect(fullnameInput.value).toBe(fullname);
      expect(emailInput.value).toBe(email);
      expect(confirmPasswordInput.value).toBe(confirmPassword);
    });

    fireEvent.click(target.getByText(/register/i));

    await waitFor(() =>
      expect(target.getByRole('progressbar')).toBeInTheDocument()
    );

    return {
      ...target,
    };
  }

  afterEach(() => {
    cleanup();
    nock.cleanAll();
    jest.clearAllMocks();
  });

  it('should render', () => {
    const {getByPlaceholderText, getByText} = renderWithProvider(
      <RegisterForm />
    );
    expect(getByPlaceholderText(/fullname/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/^password/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(getByText(/register/i)).toBeInTheDocument();
    expect(getByText(/clear/i)).toBeInTheDocument();
  });

  it('should fill up and clear form', async () => {
    const {
      usernameInput,
      passwordInput,
      emailInput,
      fullnameInput,
      confirmPasswordInput,
      target,
    } = await fillupRegistrion();

    fireEvent.click(target.getByText(/clear/i));

    await waitFor(() => {
      expect(usernameInput.value).toBe('');
      expect(passwordInput.value).toBe('');
      expect(fullnameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(confirmPasswordInput.value).toBe('');
    });
  });

  it('should successfully register and redirect to dashboard page', async () => {
    const {store, history} = await assertRegistration(mockedAuthResult, 200);
    await waitFor(() => {
      expect(store.getState().profile.me).toStrictEqual(
        mockedAuthResult.profile
      );
      expect(store.getState().profile.token).toBe(mockedAuthResult.token);
      expect(history.location.pathname).toBe(routes.DASHBOARD);
    });
  });

  it('should fail registration in and show error', async () => {
    const {history, getByRole} = await assertRegistration('err', 500);
    await waitFor(() => {
      expect(getByRole('error').textContent).toMatch(/unable to register*/);
      expect(history.location.pathname).not.toBe(routes.DASHBOARD);
    });
  });

  describe('when validating registration form', () => {
    it('should match password and confirm password input', async () => {
      const {target} = await fillupRegistrion();
      fireEvent.change(target.getByPlaceholderText('confirm password'), {
        target: {value: faker.internet.password()},
      });
      fireEvent.click(target.getByText(/register/i));
      await waitFor(() =>
        expect(target.getByText(/password does not match/i)).toBeInTheDocument()
      );
    });

    it.each`
      field
      ${'fullname'}
      ${'email'}
      ${'username'}
      ${'password'}
      ${'confirm password'}
    `('should require $field input', async ({field}) => {
      const {target} = await fillupRegistrion();
      fireEvent.change(target.getByPlaceholderText(field), {
        target: {value: ''},
      });
      fireEvent.click(target.getByText(/register/i));
      await waitFor(() =>
        expect(
          (target.getByRole('form') as HTMLFormElement).checkValidity()
        ).toBe(false)
      );
    });
  });
});
