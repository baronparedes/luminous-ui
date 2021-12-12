import faker from 'faker';
import nock from 'nock';
import {Route} from 'react-router-dom';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeDisbursement,
  generateFakeProfile,
  generateFakePurchaseOrder,
} from '../../../@utils/fake-models';
import routes from '../../../@utils/routes';
import {renderWithProviderAndRouterAndRestful} from '../../../@utils/test-renderers';
import {
  DisbursementAttr,
  ProfileType,
  PurchaseOrderAttr,
  RequestStatus,
} from '../../../Api';
import {profileActions} from '../../../store/reducers/profile.reducer';
import DisbursementList from '../../@ui/DisbursementList';
import ExpenseTable from '../../@ui/ExpenseTable';
import ManageVoucherOrOrder from '../../@ui/ManageVoucherOrOrder';
import ApprovePurchaseOrder from '../actions/ApprovePurchaseOrder';
import CancelPurchaseOrder from '../actions/CancelPurchaseOrder';
import NotifyApprovers from '../actions/NotifyApprovers';
import RejectPurchaseOrder from '../actions/RejectPurchaseOrder';
import PurchaseOrderDetails from '../PurchaseOrderDetails';
import PurchaseOrderView from '../PurchaseOrderView';

type PurchaseOrderDetailsProps = React.ComponentProps<
  typeof PurchaseOrderDetails
>;

type ExpenseTableProps = React.ComponentProps<typeof ExpenseTable>;

type ApprovePurchaseOrderProps = React.ComponentProps<
  typeof ApprovePurchaseOrder
>;

type RejectPurchaseOrderProps = React.ComponentProps<
  typeof RejectPurchaseOrder
>;

type CancelPurchaseOrderProps = React.ComponentProps<
  typeof CancelPurchaseOrder
>;

type NotifyApproversProps = React.ComponentProps<typeof NotifyApprovers>;

type DisbursementListProps = React.ComponentProps<typeof DisbursementList>;

type ManageVoucherOrOrderProps = React.ComponentProps<
  typeof ManageVoucherOrOrder
>;

jest.mock(
  '../PurchaseOrderDetails',
  () => (props: PurchaseOrderDetailsProps) => {
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

jest.mock(
  '../actions/CancelPurchaseOrder',
  () => (props: CancelPurchaseOrderProps) => {
    return <div data-testid="mock-cancel">{JSON.stringify(props)}</div>;
  }
);

jest.mock('../actions/NotifyApprovers', () => (props: NotifyApproversProps) => {
  return <div data-testid="mock-notify">{JSON.stringify(props)}</div>;
});

jest.mock(
  '../../@ui/DisbursementList',
  () => (props: DisbursementListProps) => {
    return (
      <div data-testid="mock-disbursements">
        {JSON.stringify(props.disbursements)}
      </div>
    );
  }
);

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
            requestedDate: 'mocked-order-date',
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
      ></div>
    );
  }
);

describe('PurchaseOrderView', () => {
  const base = 'http://localhost';

  async function renderTarget(opts?: {
    isAdmin?: boolean;
    status?: RequestStatus;
    disbursements?: DisbursementAttr[];
  }) {
    const type: ProfileType = opts?.isAdmin ? 'admin' : 'unit owner';
    const status: RequestStatus = opts?.status ?? 'pending';
    const purchaseOrderId = faker.datatype.number();
    const mockedProfile = generateFakeProfile(type);
    const mockedPurchaseOrder: PurchaseOrderAttr = {
      ...generateFakePurchaseOrder(),
      id: purchaseOrderId,
      status,
      disbursements: opts?.disbursements,
    };

    nock(base)
      .get(`/api/purchase-order/getPurchaseOrder/${purchaseOrderId}`)
      .reply(200, mockedPurchaseOrder);

    const target = renderWithProviderAndRouterAndRestful(
      <Route
        path={routes.PURCHASE_REQUEST(':id')}
        component={PurchaseOrderView}
      />,
      base,
      store => {
        store.dispatch(profileActions.signIn({me: mockedProfile}));
      },
      history => {
        history.push(routes.PURCHASE_REQUEST(purchaseOrderId));
      }
    );

    await waitFor(() => {
      expect(target.history.location.pathname).toEqual(
        routes.PURCHASE_REQUEST(purchaseOrderId)
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
      expect(target.getByTitle(/print purchase order/i)).toBeInTheDocument();
    });

    return {
      ...target,
      mockedPurchaseOrder,
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
    await waitFor(() =>
      expect(getByTestId('mock-modify-pr')).toBeInTheDocument()
    );
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
    await waitFor(() =>
      expect(queryByTestId('mock-modify-pr')).not.toBeInTheDocument()
    );
  });

  it('should add disbursements', async () => {
    const {
      mockedPurchaseOrder,
      getByText,
      getByPlaceholderText,
      getAllByTestId,
      getByRole,
      queryByRole,
      queryByText,
      queryByTestId,
    } = await renderTarget({
      status: 'approved',
      isAdmin: true,
      disbursements: [],
    });

    const expectedDisbursement: DisbursementAttr = {
      ...generateFakeDisbursement(),
      paymentType: 'cash',
      amount: mockedPurchaseOrder.totalCost,
    };

    nock(base)
      .post(
        `/api/purchase-order/postPurchaseOrderDisbursement/${mockedPurchaseOrder.id}`
      )
      .reply(200);

    nock(base)
      .get(`/api/purchase-order/getPurchaseOrder/${mockedPurchaseOrder.id}`)
      .reply(200, {
        ...mockedPurchaseOrder,
        disbursements: [expectedDisbursement],
      });

    userEvent.click(getByText(/add disbursement/i));

    await waitFor(() =>
      expect(getByText(/^add disbursements$/i)).toBeInTheDocument()
    );
    await waitFor(() => {
      expect(queryByTestId('mock-cancel')).toBeInTheDocument();
    });

    const detailsInput = getByPlaceholderText(/details/i) as HTMLInputElement;
    const paymentTypeInput = getByPlaceholderText(
      /payment type/i
    ) as HTMLSelectElement;
    const amountInput = getByPlaceholderText(
      /amount to release/i
    ) as HTMLInputElement;

    userEvent.type(detailsInput, expectedDisbursement.details);
    userEvent.clear(amountInput);
    userEvent.type(amountInput, expectedDisbursement.amount.toString());
    userEvent.selectOptions(paymentTypeInput, expectedDisbursement.paymentType);

    userEvent.click(getByText(/^disburse$/i));

    await waitFor(() =>
      expect(queryByText(/^disburse$/i)).not.toBeInTheDocument()
    );

    await waitFor(() => expect(getByRole('progressbar')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );

    await waitFor(() => {
      expect(getAllByTestId('mock-disbursements')).toHaveLength(1);
    });
    await waitFor(() => {
      expect(queryByTestId('mock-cancel')).not.toBeInTheDocument();
    });
  });

  it('should modify purchase order', async () => {
    const {mockedPurchaseOrder, getByTestId, queryByRole} = await renderTarget({
      status: 'pending',
      isAdmin: true,
    });

    nock(base)
      .patch(
        `/api/purchase-order/updatePurchaseOrder/${mockedPurchaseOrder.id}`,
        body => {
          expect(body).toEqual({
            chargeId: 1,
            description: 'mocked-description',
            requestedBy: 1,
            requestedDate: 'mocked-order-date',
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
