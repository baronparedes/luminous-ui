import nock from 'nock';

import {waitFor} from '@testing-library/react';

import {currencyFormat, roundOff} from '../../../@utils/currencies';
import {
  generateFakeProfile,
  generateFakePropertyAccount,
} from '../../../@utils/fake-models';
import {sum} from '../../../@utils/helpers';
import {renderWithProviderAndRestful} from '../../../@utils/test-renderers';
import {profileActions} from '../../../store/reducers/profile.reducer';
import PropertyDetails from '../../property/PropertyDetails';
import MyProfileCard from '../MyProfileCard';
import MyProfileView from '../MyProfileView';

type PropertyDetailsProps = React.ComponentProps<typeof PropertyDetails>;
type MyProfileCardProps = React.ComponentProps<typeof MyProfileCard>;

jest.mock('../MyProfileCard', () => ({profile}: MyProfileCardProps) => {
  return <div data-testid="mock-profile-card">{JSON.stringify(profile)}</div>;
});

jest.mock(
  '../../property/PropertyDetails',
  () =>
    ({propertyAccount}: PropertyDetailsProps) => {
      const {propertyId} = propertyAccount;
      return (
        <div data-testid={`mock-profile-details-${propertyId}`}>
          {JSON.stringify(propertyAccount)}
        </div>
      );
    }
);

describe('MyProfileView', () => {
  it('should render currently logged in profile', async () => {
    const base = 'http://localhost';
    const mockedProfile = generateFakeProfile();
    const mockedPropertyAccounts = [
      generateFakePropertyAccount(),
      generateFakePropertyAccount(),
    ];
    const expctedTotalBalance = sum(mockedPropertyAccounts.map(p => p.balance));

    nock(base)
      .get(`/api/property/getPropertyAccountsByProfile/${mockedProfile.id}`)
      .reply(200, mockedPropertyAccounts);

    const target = renderWithProviderAndRestful(<MyProfileView />, base);
    target.store.dispatch(
      profileActions.signIn({
        me: mockedProfile,
      })
    );
    await waitFor(() => {
      expect(target.getByTestId('mock-profile-card').textContent).toEqual(
        JSON.stringify(mockedProfile)
      );
    });
    for (const pa of mockedPropertyAccounts) {
      await waitFor(() => {
        expect(
          target.getByTestId(`mock-profile-details-${pa.propertyId}`)
            .textContent
        ).toEqual(JSON.stringify(pa));
      });
    }

    await waitFor(() => {
      expect(
        target.getByText(currencyFormat(roundOff(expctedTotalBalance)))
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      const accounts = target.store.getState().profile.propertyAccounts;
      expect(accounts).toEqual(mockedPropertyAccounts);
    });
  });
});
