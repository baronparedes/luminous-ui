import faker from 'faker';

import {fireEvent, render, waitFor} from '@testing-library/react';

import PropertyAssignmentCard, {
  AssignedProfile,
} from '../PropertyAssignmentCard';

describe('PropertyAssignmentCard', () => {
  it('should render', async () => {
    const profile: AssignedProfile = {
      profileId: faker.datatype.number(),
      name: faker.datatype.string(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      mobileNumber: faker.phone.phoneNumber(),
    };
    const onRemoveMock = jest.fn();

    const {getByText, getByLabelText} = render(
      <PropertyAssignmentCard {...profile} onRemove={onRemoveMock} />
    );

    expect(getByText(profile.name)).toBeInTheDocument();
    expect(getByText(profile.username)).toBeInTheDocument();
    expect(getByText(profile.email)).toBeInTheDocument();
    expect(getByText(profile.mobileNumber as string)).toBeInTheDocument();
    expect(getByLabelText(/remove/i)).toBeInTheDocument();

    fireEvent.click(getByLabelText(/remove/i));
    await waitFor(() => expect(onRemoveMock).toBeCalledWith(profile.profileId));
  });
});
