import faker from 'faker';
import nock from 'nock';
import {Route} from 'react-router-dom';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeProfile,
  generateFakeVoucher,
} from '../../../@utils/fake-models';
import routes from '../../../@utils/routes';
import {renderWithProviderAndRouterAndRestful} from '../../../@utils/test-renderers';
import {ProfileType, RequestStatus, VoucherAttr} from '../../../Api';
import {profileActions} from '../../../store/reducers/profile.reducer';
import DisbursementList from '../../@ui/DisbursementList';
import ExpenseTable from '../../@ui/ExpenseTable';
import ManageVoucherOrOrder from '../../@ui/ManageVoucherOrOrder';
import ApproveVoucher from '../actions/ApproveVoucher';
import NotifyApprovers from '../actions/NotifyApprovers';
import RejectVoucher from '../actions/RejectVoucher';
import VoucherDetails from '../VoucherDetails';
import VoucherView from '../VoucherView';

type VoucherDetailsProps = React.ComponentProps<typeof VoucherDetails>;

type ExpenseTableProps = React.ComponentProps<typeof ExpenseTable>;

type DisbursementListProps = React.ComponentProps<typeof DisbursementList>;

type ApproveVoucherProps = React.ComponentProps<typeof ApproveVoucher>;

type RejectVoucherProps = React.ComponentProps<typeof RejectVoucher>;

type NotifyApproversProps = React.ComponentProps<typeof NotifyApprovers>;

type ManageVoucherOrOrderProps = React.ComponentProps<
  typeof ManageVoucherOrOrder
>;

jest.mock('../VoucherDetails', () => (props: VoucherDetailsProps) => {
  return <div data-testid="mock-voucher-details">{JSON.stringify(props)}</div>;
});

jest.mock('../../@ui/ExpenseTable', () => (props: ExpenseTableProps) => {
  return (
    <div data-testid="mock-voucher-expenses">
      {JSON.stringify(props.expenses)}
      <div>{props.appendHeaderContent}</div>
    </div>
  );
});

jest.mock(
  '../../@ui/DisbursementList',
  () => (props: DisbursementListProps) => {
    return (
      <div data-testid="mock-voucher-disbursements">
        {JSON.stringify(props.disbursements)}
      </div>
    );
  }
);

jest.mock('../actions/ApproveVoucher', () => (props: ApproveVoucherProps) => {
  return <div data-testid="mock-approve">{JSON.stringify(props)}</div>;
});

jest.mock('../actions/RejectVoucher', () => (props: RejectVoucherProps) => {
  return <div data-testid="mock-reject">{JSON.stringify(props)}</div>;
});

jest.mock('../actions/NotifyApprovers', () => (props: NotifyApproversProps) => {
  return <div data-testid="mock-notify">{JSON.stringify(props)}</div>;
});

jest.mock(
  '../../@ui/ManageVoucherOrOrder',
  () => (props: ManageVoucherOrOrderProps) => {
    return (
      <div
        data-testid="mock-modify-v"
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
      ></div>
    );
  }
);

describe('VoucherView', () => {
  const base = 'http://localhost';

  async function renderTarget(opts?: {
    isAdmin?: boolean;
    status?: RequestStatus;
  }) {
    const type: ProfileType = opts?.isAdmin ? 'admin' : 'unit owner';
    const status: RequestStatus = opts?.status ?? 'pending';
    const voucherId = faker.datatype.number();
    const mockedProfile = generateFakeProfile(type);
    const mockedVoucher: VoucherAttr = {
      ...generateFakeVoucher(),
      id: voucherId,
      status,
    };

    nock(base)
      .get(`/api/voucher/getVoucher/${voucherId}`)
      .reply(200, mockedVoucher);

    const target = renderWithProviderAndRouterAndRestful(
      <Route path={routes.VOUCHER(':id')} component={VoucherView} />,
      base,
      store => {
        store.dispatch(profileActions.signIn({me: mockedProfile}));
      },
      history => {
        history.push(routes.VOUCHER(voucherId));
      }
    );

    await waitFor(() => {
      expect(target.history.location.pathname).toEqual(
        routes.VOUCHER(voucherId)
      );
    });

    await waitFor(() => {
      expect(target.queryByRole('loading')).not.toBeInTheDocument();
    });

    await waitFor(() =>
      expect(target.getByTestId('mock-voucher-details')).toBeInTheDocument()
    );

    await waitFor(() => {
      expect(target.getByTestId('mock-voucher-expenses')).toBeInTheDocument();
      expect(target.getByTitle(/print voucher/i)).toBeInTheDocument();
    });

    await waitFor(() =>
      expect(
        target.getByTestId('mock-voucher-disbursements')
      ).toBeInTheDocument()
    );

    return {
      ...target,
      mockedVoucher,
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
      expect(getByTestId('mock-modify-v')).toBeInTheDocument()
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
      expect(queryByTestId('mock-modify-v')).not.toBeInTheDocument()
    );
  });

  it('should modify voucher', async () => {
    const {mockedVoucher, getByTestId, queryByRole} = await renderTarget({
      status: 'pending',
      isAdmin: true,
    });

    nock(base)
      .patch(`/api/voucher/updateVoucher/${mockedVoucher.id}`, body => {
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
      })
      .reply(200);

    await waitFor(() =>
      expect(getByTestId('mock-modify-v')).toBeInTheDocument()
    );

    userEvent.click(getByTestId('mock-modify-v'));
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );
  });
});
