import {fireEvent, render, waitFor} from '@testing-library/react';

import {generateFakeProfile} from '../../../@utils/fake-models';
import AvatarProfile from '../AvatarProfile';

jest.mock('../ChangePasswordForm', () => () => {
  return <div>change-password-form</div>;
});

jest.mock('../UpdateBasicDetailsForm', () => () => {
  return <div>update-basic-details-form</div>;
});

describe('AvatarProfile', () => {
  it('should render and display modal', async () => {
    const profile = {
      ...generateFakeProfile(),
      name: 'George W Bush',
    };
    const expectedInitials = 'GB';
    const {getByText, getByRole} = render(<AvatarProfile profile={profile} />);
    const avatarEl = getByText(expectedInitials);

    expect(avatarEl).toBeInTheDocument();

    fireEvent.click(avatarEl);
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    expect(getByText('update-basic-details-form')).toBeInTheDocument();
    expect(getByText('change-password-form')).toBeInTheDocument();
  });
});
