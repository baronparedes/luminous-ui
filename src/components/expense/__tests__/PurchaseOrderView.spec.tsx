import faker from 'faker';
import nock from 'nock';
import {Route} from 'react-router-dom';

import {waitFor} from '@testing-library/react';

import {
  generateFakeProfile,
  generateFakePurchaseOrder,
} from '../../../@utils/fake-models';
import routes from '../../../@utils/routes';
import {renderWithProviderAndRouterAndRestful} from '../../../@utils/test-renderers';
import {ProfileType, PurchaseOrderAttr, RequestStatus} from '../../../Api';
import {profileActions} from '../../../store/reducers/profile.reducer';
import ApprovePurchaseOrder from '../actions/ApprovePurchaseOrder';
import NotifyApprovers from '../actions/NotifyApprovers';
import RejectPurchaseOrder from '../actions/RejectPurchaseOrder';
import PurchaseOrderDetails from '../PurchaseOrderDetails';
import PurchaseOrderDisbursements from '../PurchaseOrderDisbursements';
import PurchaseOrderExpenses from '../PurchaseOrderExpenses';
import PurchaseOrderView from '../PurchaseOrderView';

type PurchaseOrderDetailsProps = React.ComponentProps<
  typeof PurchaseOrderDetails
>;

type PurchaseOrderExpensesProps = React.ComponentProps<
  typeof PurchaseOrderExpenses
>;

type PurchaseOrderDisbursementsProps = React.ComponentProps<
  typeof PurchaseOrderDisbursements
>;

type ApprovePurchaseOrderProps = React.ComponentProps<
  typeof ApprovePurchaseOrder
>;

type RejectPurchaseOrderProps = React.ComponentProps<
  typeof RejectPurchaseOrder
>;

type NotifyApproversProps = React.ComponentProps<typeof NotifyApprovers>;

jest.mock(
  '../PurchaseOrderDetails',
  () => (props: PurchaseOrderDetailsProps) => {
    return (
      <div data-testid="mock-purchase-order-details">
        {JSON.stringify(props)}
      </div>
    );
  }
);

jest.mock(
  '../PurchaseOrderExpenses',
  () => (props: PurchaseOrderExpensesProps) => {
    return (
      <div data-testid="mock-purchase-order-expenses">
        {JSON.stringify(props)}
      </div>
    );
  }
);

jest.mock(
  '../PurchaseOrderDisbursements',
  () => (props: PurchaseOrderDisbursementsProps) => {
    return (
      <div data-testid="mock-purchase-order-disbursements">
        {JSON.stringify(props)}
      </div>
    );
  }
);

jest.mock(
  '../actions/ApprovePurchaseOrder',
  () => (props: ApprovePurchaseOrderProps) => {
    return <div data-testid="mock-approve">{JSON.stringify(props)}</div>;
  }
);

jest.mock(
  '../actions/RejectPurchaseOrder',
  () => (props: RejectPurchaseOrderProps) => {
    return <div data-testid="mock-reject">{JSON.stringify(props)}</div>;
  }
);

jest.mock('../actions/NotifyApprovers', () => (props: NotifyApproversProps) => {
  return <div data-testid="mock-notify">{JSON.stringify(props)}</div>;
});

describe('PurchaseOrderView', () => {
  const base = 'http://localhost';

  async function renderTarget(opts?: {
    isAdmin?: boolean;
    status?: RequestStatus;
  }) {
    const type: ProfileType = opts?.isAdmin ? 'admin' : 'unit owner';
    const status: RequestStatus = opts?.status ?? 'pending';
    const purchaseOrderId = faker.datatype.number();
    const mockedProfile = generateFakeProfile(type);
    const mockedPurchaseOrder: PurchaseOrderAttr = {
      ...generateFakePurchaseOrder(),
      id: purchaseOrderId,
      status,
    };

    nock(base)
      .get(`/api/purchase-order/getPurchaseOrder/${purchaseOrderId}`)
      .reply(200, mockedPurchaseOrder);

    const target = renderWithProviderAndRouterAndRestful(
      <Route
        path={routes.PURCHASE_ORDER(':id')}
        component={PurchaseOrderView}
      />,
      base,
      store => {
        store.dispatch(profileActions.signIn({me: mockedProfile}));
      },
      history => {
        history.push(routes.PURCHASE_ORDER(purchaseOrderId));
      }
    );
    await waitFor(() => {
      expect(target.history.location.pathname).toEqual(
        routes.PURCHASE_ORDER(purchaseOrderId)
      );
    });

    await waitFor(() => {
      expect(target.queryByRole('loading')).not.toBeInTheDocument();
    });

    await waitFor(() =>
      expect(
        target.getByTestId('mock-purchase-order-details')
      ).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        target.getByTestId('mock-purchase-order-expenses')
      ).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        target.getByTestId('mock-purchase-order-disbursements')
      ).toBeInTheDocument()
    );

    return {
      ...target,
    };
  }

  it('should render and display actions', async () => {
    const {getByTestId} = await renderTarget({
      status: 'pending',
      isAdmin: true,
    });

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
    const {queryByTestId} = await renderTarget({status, isAdmin});

    await waitFor(() =>
      expect(queryByTestId('mock-approve')).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByTestId('mock-reject')).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByTestId('mock-notify')).not.toBeInTheDocument()
    );
  });
});
