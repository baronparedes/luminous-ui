import {render} from '@testing-library/react';

import {generateFakeProfile} from '../../../@utils/fake-models';
import MyProfileCard from '../MyProfileCard';

describe('MyProfileCard', () => {
  it('should render', () => {
    const mockedProfile = {
      ...generateFakeProfile(),
      name: 'George W Bush',
    };
    const {getByText} = render(<MyProfileCard profile={mockedProfile} />);
    expect(getByText('GB')).toBeInTheDocument();
    expect(getByText(mockedProfile.username)).toBeInTheDocument();
    expect(getByText(mockedProfile.name)).toBeInTheDocument();
    expect(getByText(mockedProfile.email)).toBeInTheDocument();
    expect(getByText(mockedProfile.mobileNumber as string)).toBeInTheDocument();
  });
});
