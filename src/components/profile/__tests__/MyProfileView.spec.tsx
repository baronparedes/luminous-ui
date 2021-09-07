import {generateFakeProfile} from '../../../@utils/fake-models';
import {renderWithProvider} from '../../../@utils/test-renderers';
import {profileActions} from '../../../store/reducers/profile.reducer';
import MyProfileCard from '../MyProfileCard';
import MyProfileView from '../MyProfileView';

type MyProfileCardProps = React.ComponentProps<typeof MyProfileCard>;

jest.mock('../MyProfileCard', () => ({profile}: MyProfileCardProps) => {
  return <div data-testid="mock-profile-card">{JSON.stringify(profile)}</div>;
});

describe('MyProfileView', () => {
  it('should render currently logged in profile', async () => {
    const mockedProfile = generateFakeProfile();
    const {getByTestId, store} = renderWithProvider(<MyProfileView />);
    store.dispatch(
      profileActions.signIn({
        me: mockedProfile,
      })
    );
    expect(getByTestId('mock-profile-card').textContent).toEqual(
      JSON.stringify(mockedProfile)
    );
  });
});
