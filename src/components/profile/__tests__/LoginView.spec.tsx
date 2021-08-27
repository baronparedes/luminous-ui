import {fireEvent, render, waitFor} from '@testing-library/react';

import LoginView from '../LoginView';

jest.mock('../LoginForm', () => () => {
  return <div>login-form</div>;
});

jest.mock('../RegisterForm', () => () => {
  return <div>register-form</div>;
});

describe('LoginView', () => {
  it('should render', () => {
    const {getByText} = render(<LoginView />);
    expect(getByText(/register/i)).toBeInTheDocument();
    expect(getByText('login-form')).toBeInTheDocument();
  });

  it('should toggle between registration and login', async () => {
    const {getByText} = render(<LoginView />);
    fireEvent.click(getByText(/register/i));
    await waitFor(() => expect(getByText('register-form')).toBeInTheDocument());

    fireEvent.click(getByText(/back to login/i));
    await waitFor(() => expect(getByText('login-form')).toBeInTheDocument());
  });
});
