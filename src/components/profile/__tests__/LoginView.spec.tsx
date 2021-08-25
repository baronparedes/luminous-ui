import {render} from '@testing-library/react';

import LoginView from '../LoginView';

jest.mock('components/profile/LoginForm', () => () => {
  return <div>login-form</div>;
});

describe('LoginView', () => {
  it('should render', () => {
    const {getByText} = render(<LoginView />);
    expect(getByText('login-form')).toBeInTheDocument();
  });
});
