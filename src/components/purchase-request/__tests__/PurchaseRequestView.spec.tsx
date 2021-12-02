import faker from 'faker';
import nock from 'nock';
import {Route} from 'react-router-dom';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeProfile,
  generateFakePurchaseRequest,
} from '../../../@utils/fake-models';
import routes from '../../../@utils/routes';
import {renderWithProviderAndRouterAndRestful} from '../../../@utils/test-renderers';
import {ProfileType, PurchaseRequestAttr, RequestStatus} from '../../../Api';
import {profileActions} from '../../../store/reducers/profile.reducer';
import ExpenseTable from '../../@ui/ExpenseTable';
import ManageVoucherOrOrder from '../../@ui/ManageVoucherOrOrder';
import ApprovePurchaseRequest from '../actions/ApprovePurchaseRequest';
import NotifyApprovers from '../actions/NotifyApprovers';
import RejectPurchaseRequest from '../actions/RejectPurchaseRequest';
import PurchaseRequestDetails from '../PurchaseRequestDetails';
import PurchaseRequestView from '../PurchaseRequestView';

type PurchaseRequestDetailsProps = React.ComponentProps<
  typeof PurchaseRequestDetails
>;

type ExpenseTableProps = React.ComponentProps<typeof ExpenseTable>;

type ApprovePurchaseRequestProps = React.ComponentProps<
  typeof ApprovePurchaseRequest
>;

type RejectPurchaseRequestProps = React.ComponentProps<
  typeof RejectPurchaseRequest
>;

type NotifyApproversProps = React.ComponentProps<typeof NotifyApprovers>;

type ManageVoucherOrOrderProps = React.ComponentProps<
  typeof ManageVoucherOrOrder
>;

jest.mock(
  '../PurchaseRequestDetails',
  () => (props: PurchaseRequestDetailsProps) => {
    return <div data-testid="mock-pr-details">{JSON.stringify(props)}</div>;
  }
);

jest.mock('../../@ui/ExpenseTable', () => (props: ExpenseTableProps) => {
  return (
    <div data-testid="mock-pr-expenses">
      {JSON.stringify(props.expenses)}
      <div>{props.appendHeaderContent}</div>
    </div>
  );
});

jest.mock(
  '../actions/ApprovePurchaseRequest',
  () => (props: ApprovePurchaseRequestProps) => {
    return <div data-testid="mock-approve">{JSON.stringify(props)}</div>;
  }
);

jest.mock(
  '../actions/RejectPurchaseRequest',
  () => (props: RejectPurchaseRequestProps) => {
    return <div data-testid="mock-reject">{JSON.stringify(props)}</div>;
  }
);

jest.mock('../actions/NotifyApprovers', () => (props: NotifyApproversProps) => {
  return <div data-testid="mock-notify">{JSON.stringify(props)}</div>;
});

jest.mock(
  '../../@ui/ManageVoucherOrOrder',
  () => (props: ManageVoucherOrOrderProps) => {
    return (
      <div
        data-testid="mock-modify-pr"
        onClick={() =>
          props.onSave &&
          props.onSave({
            chargeId: 1,
            description: 'mocked-description',
            requestedBy: 1,
            requestedDate: 'mocked-request-date',
            expenses: [
              {
                category: 'mocked-category',
                categoryId: 1,
                description: 'mocked-e-description',
                quantity: 1,
                totalCost: 1,
                unitCost: 1,
              },
            ],
          })
        }
      >
        {props.buttonLabel}
      </div>
    );
  }
);

describe('PurchaseRequestView', () => {
  const base = 'http://localhost';

  async function renderTarget(opts?: {
    isAdmin?: boolean;
    status?: RequestStatus;
  }) {
    const type: ProfileType = opts?.isAdmin ? 'admin' : 'unit owner';
    const status: RequestStatus = opts?.status ?? 'pending';
    const purchaseRequestId = faker.datatype.number();
    const mockedProfile = generateFakeProfile(type);
    const mockedPurchaseRequest: PurchaseRequestAttr = {
      ...generateFakePurchaseRequest(),
      id: purchaseRequestId,
      status,
    };

    nock(base)
      .get(`/api/purchase-request/getPurchaseRequest/${purchaseRequestId}`)
      .reply(200, mockedPurchaseRequest);

    const target = renderWithProviderAndRouterAndRestful(
      <Route
        path={routes.PURCHASE_REQUEST(':id')}
        component={PurchaseRequestView}
      />,
      base,
      store => {
        store.dispatch(profileActions.signIn({me: mockedProfile}));
      },
      history => {
        history.push(routes.PURCHASE_REQUEST(purchaseRequestId));
      }
    );

    await waitFor(() => {
      expect(target.history.location.pathname).toEqual(
        routes.PURCHASE_REQUEST(purchaseRequestId)
      );
    });

    await waitFor(() => {
      expect(target.queryByRole('loading')).not.toBeInTheDocument();
    });

    await waitFor(() =>
      expect(target.getByTestId('mock-pr-details')).toBeInTheDocument()
    );

    await waitFor(() => {
      expect(target.getByTestId('mock-pr-expenses')).toBeInTheDocument();
      expect(target.getByTitle(/print purchase request/i)).toBeInTheDocument();
    });

    return {
      ...target,
      mockedPurchaseRequest,
    };
  }

  it('should render and display actions', async () => {
    const {getByTestId} = await renderTarget({
      status: 'pending',
      isAdmin: true,
    });

    await waitFor(() =>
      expect(getByTestId('mock-modify-pr')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(getByTestId('mock-approve')).toBeInTheDocument()
    );
    await waitFor(() => expect(getByTestId('mock-reject')).toBeInTheDocument());
    await waitFor(() => expect(getByTestId('mock-notify')).toBeInTheDocument());
  });

  it('should render and hide actions', async () => {
    const status = faker.random.arrayElement<RequestStatus>([
      'approved',
      'rejected',
    ]);
    const isAdmin = faker.datatype.boolean();
    const {queryByTestId, queryByText} = await renderTarget({status, isAdmin});

    await waitFor(() =>
      expect(queryByTestId('mock-approve')).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByTestId('mock-reject')).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByTestId('mock-notify')).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByText('modify request')).not.toBeInTheDocument()
    );

    if (isAdmin && status === 'approved') {
      await waitFor(() =>
        expect(queryByText('new purchase order')).toBeInTheDocument()
      );
    }
  });

  it('should modify purchase request', async () => {
    const {mockedPurchaseRequest, getByTestId, queryByRole} =
      await renderTarget({
        status: 'pending',
        isAdmin: true,
      });

    nock(base)
      .patch(
        `/api/purchase-request/updatePurchaseRequest/${mockedPurchaseRequest.id}`,
        body => {
          expect(body).toEqual({
            chargeId: 1,
            description: 'mocked-description',
            requestedBy: 1,
            requestedDate: 'mocked-request-date',
            expenses: [
              {
                category: 'mocked-category',
                categoryId: 1,
                description: 'mocked-e-description',
                quantity: 1,
                totalCost: 1,
                unitCost: 1,
              },
            ],
          });
          return true;
        }
      )
      .reply(200);

    await waitFor(() =>
      expect(getByTestId('mock-modify-pr')).toBeInTheDocument()
    );

    userEvent.click(getByTestId('mock-modify-pr'));
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );
  });
});
