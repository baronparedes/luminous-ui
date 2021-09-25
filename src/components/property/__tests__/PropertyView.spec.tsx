import faker from 'faker';
import nock from 'nock';
import {Route} from 'react-router-dom';

import {waitFor} from '@testing-library/react';

import {
  generateFakeProfile,
  generateFakePropertyAccount,
  generateFakePropertyAssignment,
} from '../../../@utils/fake-models';
import routes from '../../../@utils/routes';
import {renderWithProviderAndRouterAndRestful} from '../../../@utils/test-renderers';
import {ProfileType} from '../../../Api';
import {profileActions} from '../../../store/reducers/profile.reducer';
import PrintStatementOfAccount from '../actions/PrintStatementOfAccount';
import PropertyAssignmentCard from '../PropertyAssignmentCard';
import PropertyDetails from '../PropertyDetails';
import PropertyStatementOfAccount from '../PropertyStatementOfAccount';
import {PropertyView} from '../PropertyView';

type PropertyDetailsProps = React.ComponentProps<typeof PropertyDetails>;

type PropertyStatementOfAccountProps = React.ComponentProps<
  typeof PropertyStatementOfAccount
>;

type PropertyAssignmentCardProps = React.ComponentProps<
  typeof PropertyAssignmentCard
>;

type PrintStatementOfAccountProps = React.ComponentProps<
  typeof PrintStatementOfAccount
>;

jest.mock('../PropertyDetails', () => (props: PropertyDetailsProps) => {
  return <div data-testid="mock-property-details">{JSON.stringify(props)}</div>;
});

jest.mock(
  '../PropertyStatementOfAccount',
  () => (props: PropertyStatementOfAccountProps) => {
    return <div data-testid="mock-property-soa">{JSON.stringify(props)}</div>;
  }
);

jest.mock(
  '../PropertyAssignmentCard',
  () => (props: PropertyAssignmentCardProps) => {
    return (
      <div data-testid="mock-property-assignment-card">
        {JSON.stringify(props)}
      </div>
    );
  }
);

jest.mock(
  '../actions/PrintStatementOfAccount',
  () =>
    ({buttonLabel}: PrintStatementOfAccountProps) => {
      return <button>{buttonLabel}</button>;
    }
);

describe('PropertyView', () => {
  const base = 'http://localhost';

  async function renderTarget(opts?: {isAdmin?: boolean}) {
    const type: ProfileType = opts?.isAdmin ? 'admin' : 'unit owner';
    const propertyId = faker.datatype.number();
    const mockedProfile = generateFakeProfile(type);
    const mockedPropertyAccount = generateFakePropertyAccount();
    const mockedPropertyAssignments = [
      generateFakePropertyAssignment(),
      generateFakePropertyAssignment(),
    ];

    nock(base)
      .get(`/api/property/getPropertyAccount/${propertyId}`)
      .reply(200, mockedPropertyAccount);

    nock(base)
      .get(`/api/property/getPropertyAssignments/${propertyId}`)
      .reply(200, mockedPropertyAssignments);

    const target = renderWithProviderAndRouterAndRestful(
      <Route path={routes.PROPERTY(':id')} component={PropertyView} />,
      base,
      store => {
        store.dispatch(profileActions.signIn({me: mockedProfile}));
      },
      history => {
        history.push(routes.PROPERTY(propertyId));
      }
    );
    await waitFor(() => {
      expect(target.history.location.pathname).toEqual(
        routes.PROPERTY(propertyId)
      );
    });
    await waitFor(() => {
      const loading = target.queryAllByRole('loading');
      expect(loading.length).toEqual(0);
    });
    await waitFor(() =>
      expect(target.getByTestId('mock-property-details')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(target.getByTestId('mock-property-soa')).toBeInTheDocument()
    );
    await waitFor(() => {
      const count = target.getAllByTestId(
        'mock-property-assignment-card'
      ).length;
      expect(count).toEqual(mockedPropertyAssignments.length);
    });

    expect(target.getByText(/print current statement/i)).toBeInTheDocument();
    expect(target.getByText(/view previous statements/i)).toBeInTheDocument();

    return {
      ...target,
    };
  }

  it('should render', async () => {
    const {queryByText} = await renderTarget();
    await waitFor(() => {
      expect(queryByText(/process payment/i)).not.toBeInTheDocument();
      expect(queryByText(/waive a transaction/i)).not.toBeInTheDocument();
    });
  });

  it('should render when role is admin', async () => {
    const {getByText} = await renderTarget({isAdmin: true});
    await waitFor(() => {
      expect(getByText(/process payment/i)).toBeInTheDocument();
      expect(getByText(/waive a transaction/i)).toBeInTheDocument();
    });
  });
});
