import faker from 'faker';
import nock from 'nock';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeProfile,
  generateFakePurchaseRequest,
} from '../../../../@utils/fake-models';
import {renderWithProviderAndRouterAndRestful} from '../../../../@utils/test-renderers';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import ApprovePurchaseRequest from '../../actions/ApprovePurchaseRequest';

describe('ApprovePurchaseRequest', () => {
  const base = 'http://localhost';
  const purchaseRequest = generateFakePurchaseRequest();
  const mockedProfile = generateFakeProfile();

  async function renderTarget() {
    const target = renderWithProviderAndRouterAndRestful(
      <ApprovePurchaseRequest
        purchaseRequest={purchaseRequest}
        buttonLabel={'toggle'}
      />,
      base,
      store => store.dispatch(profileActions.signIn({me: mockedProfile}))
    );

    userEvent.click(target.getByText(/toggle/i));
    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    expect(
      target.getByText(
        `Approve PR-${purchaseRequest.series ?? purchaseRequest.id}`
      )
    ).toBeInTheDocument();

    expect(target.getByText(/^approval codes$/i)).toBeInTheDocument();
    expect(target.getByPlaceholderText(/code/i)).toBeInTheDocument();
    expect(target.getByTitle(/add code/i)).toBeInTheDocument();

    expect(target.getByText(/approve$/i, {selector: 'button'})).toBeDisabled();

    const addApprovalCode = async (approvalCode: string) => {
      userEvent.type(target.getByPlaceholderText(/code/i), approvalCode);
      userEvent.click(target.getByTitle(/add code/i));
      await waitFor(() =>
        expect(target.getByText(approvalCode)).toBeInTheDocument()
      );
    };

    const removeApprovalCode = async (approvalCode: string) => {
      const container = target.getByText(approvalCode)
        .parentElement as HTMLElement;
      userEvent.click(within(container).getByTitle(/remove code/i));
      await waitFor(() =>
        expect(target.queryByText(approvalCode)).not.toBeInTheDocument()
      );
    };

    return {
      ...target,
      addApprovalCode,
      removeApprovalCode,
    };
  }

  it('should render and toggle modal', async () => {
    await renderTarget();
  });

  it('should be able to add and remove approval codes', async () => {
    const expectedApprovalCode = faker.random.alphaNumeric(6);
    const {addApprovalCode, removeApprovalCode} = await renderTarget();

    await addApprovalCode(expectedApprovalCode);
    await removeApprovalCode(expectedApprovalCode);
  });

  it('should disable approve button when approval codes minimum are not met', async () => {
    const [code1, code2] = [
      faker.random.alphaNumeric(6),
      faker.random.alphaNumeric(6),
    ];
    const {addApprovalCode, getByText} = await renderTarget();

    await addApprovalCode(code1);
    await addApprovalCode(code2);
    await waitFor(() => expect(getByText(/^approve$/i)).toBeDisabled());
  });

  it('should approve voucher when approval codes are completed', async () => {
    const [code1, code2, code3] = [
      faker.random.alphaNumeric(6),
      faker.random.alphaNumeric(6),
      faker.random.alphaNumeric(6),
    ];

    window.confirm = jest.fn().mockImplementation(() => true);

    const expectedRequest = {
      codes: [code1, code2, code3],
      purchaseRequestId: purchaseRequest.id,
    };

    nock(base)
      .post('/api/purchase-request/approvePurchaseRequest', actualRequest => {
        expect(actualRequest).toEqual(expectedRequest);
        return true;
      })
      .reply(200);

    const {addApprovalCode, getByText} = await renderTarget();

    await addApprovalCode(code1);
    await addApprovalCode(code2);
    await addApprovalCode(code3);
    await waitFor(() => expect(getByText(/^approve$/i)).toBeEnabled());

    userEvent.click(getByText(/^approve$/i));
    await waitFor(() => expect(window.confirm).toHaveBeenCalled());
  });
});
