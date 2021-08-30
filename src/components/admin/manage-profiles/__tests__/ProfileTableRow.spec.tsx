import nock from 'nock';

import {fireEvent, waitFor, within} from '@testing-library/react';

import {generateFakeProfile} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {AuthProfile} from '../../../../Api';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import ProfileTableRow from '../ProfileTableRow';

describe('ProfilesTableRow', () => {
  const base = 'http://localhost';
  const mockedProfile = generateFakeProfile();

  afterEach(() => jest.clearAllMocks());

  function renderTarget(profile: AuthProfile) {
    return renderWithProviderAndRestful(
      <table>
        <tbody>
          <ProfileTableRow profile={profile} />
        </tbody>
      </table>,
      base
    );
  }

  it.each`
    status        | to
    ${'active'}   | ${'inactive'}
    ${'inactive'} | ${'active'}
  `('should update profile status to $to', async ({status, to}) => {
    const targetProfile: AuthProfile = {...mockedProfile, status};
    const {getByText} = renderTarget(targetProfile);
    const container = getByText(targetProfile.username)
      .parentElement as HTMLElement;
    const updateStatusButton = within(container).getByLabelText(
      /update status/i,
      {
        selector: 'button',
      }
    );

    nock(base)
      .patch(
        `/api/profile/updateProfileStatus/${targetProfile.id}?status=${to}`
      )
      .reply(204);

    fireEvent.click(updateStatusButton);
    await waitFor(() =>
      expect(within(container).getByText(to)).toBeInTheDocument()
    );
  });

  it('should not render current profile', async () => {
    const {queryByText, store} = renderTarget(mockedProfile);
    store.dispatch(
      profileActions.signIn({
        me: mockedProfile,
      })
    );
    expect(queryByText(mockedProfile.username)).not.toBeInTheDocument();
  });

  it('should render', async () => {
    const {getByText} = renderTarget(mockedProfile);
    const container = getByText(mockedProfile.username)
      .parentElement as HTMLElement;
    expect(within(container).getByText(mockedProfile.id)).toBeInTheDocument();
    expect(
      within(container).getByText(mockedProfile.username)
    ).toBeInTheDocument();
    expect(within(container).getByText(mockedProfile.name)).toBeInTheDocument();
    expect(
      within(container).getByText(mockedProfile.email)
    ).toBeInTheDocument();
    expect(within(container).getByText(mockedProfile.type)).toBeInTheDocument();
    expect(
      within(container).getByText(mockedProfile.status)
    ).toBeInTheDocument();
    expect(
      within(container).getByLabelText(/update$/i, {selector: 'button'})
    ).toBeInTheDocument();
    expect(
      within(container).getByLabelText(/update status/i, {
        selector: 'button',
      })
    ).toBeInTheDocument();
  });
});
