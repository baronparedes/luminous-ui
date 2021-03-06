import faker from 'faker';
import nock from 'nock';
import {Route} from 'react-router-dom';

import {waitFor} from '@testing-library/react';

import {
  generateFakeCharge,
  generateFakeProfile,
  generateFakePropertyAccount,
} from '../../../@utils/fake-models';
import routes from '../../../@utils/routes';
import {renderWithProviderAndRouterAndRestful} from '../../../@utils/test-renderers';
import {ProfileType} from '../../../Api';
import {profileActions} from '../../../store/reducers/profile.reducer';
import AdjustTransactions from '../actions/AdjustTransactions';
import PrintStatements from '../actions/PrintStatements';
import ViewPaymentHistory from '../actions/ViewPaymentHistory';
import PropertyAssignmentCard from '../PropertyAssignmentCard';
import PropertyDetails from '../PropertyDetails';
import PropertyStatementOfAccount from '../PropertyStatementOfAccount';
import PropertyView from '../PropertyView';

type PropertyDetailsProps = React.ComponentProps<typeof PropertyDetails>;

type PropertyStatementOfAccountProps = React.ComponentProps<
  typeof PropertyStatementOfAccount
>;

type PropertyAssignmentCardProps = React.ComponentProps<
  typeof PropertyAssignmentCard
>;

type PrintStatementsProps = React.ComponentProps<typeof PrintStatements>;

type ViewPaymentHistoryProps = React.ComponentProps<typeof ViewPaymentHistory>;

type AdjustTransactionsProps = React.ComponentProps<typeof AdjustTransactions>;

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
  '../actions/PrintStatements',
  () =>
    ({buttonLabel}: PrintStatementsProps) => {
      return <button>{buttonLabel}</button>;
    }
);

jest.mock(
  '../actions/ViewPaymentHistory',
  () =>
    ({buttonLabel}: ViewPaymentHistoryProps) => {
      return <button>{buttonLabel}</button>;
    }
);

jest.mock(
  '../actions/AdjustTransactions',
  () =>
    ({buttonLabel}: AdjustTransactionsProps) => {
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
    const mockedCharge = generateFakeCharge();

    nock(base)
      .get(`/api/property-account/getPropertyAccount/${propertyId}`)
      .reply(200, mockedPropertyAccount);

    nock(base).get('/api/charge/getAllCharges').reply(200, [mockedCharge]);

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
      expect(count).toEqual(mockedPropertyAccount.assignedProfiles?.length);
    });

    expect(target.getByText(/print statements/i)).toBeInTheDocument();
    expect(target.getByText(/view payment history/i)).toBeInTheDocument();
    expect(target.getByText(/view transaction history/i)).toBeInTheDocument();

    return {
      ...target,
    };
  }

  it('should render', async () => {
    const {queryByText} = await renderTarget();
    await waitFor(() => {
      expect(queryByText(/process payment/i)).not.toBeInTheDocument();
      expect(queryByText(/adjustments/i)).not.toBeInTheDocument();
    });
  });

  it('should render when role is admin', async () => {
    const {getByText} = await renderTarget({isAdmin: true});
    await waitFor(() => {
      expect(getByText(/process payment/i)).toBeInTheDocument();
      expect(getByText(/adjustments/i)).toBeInTheDocument();
    });
  });
});
