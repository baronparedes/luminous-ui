import faker from 'faker';
import nock from 'nock';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {generateFakeProfile} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import CancelPurchaseOrder from '../../actions/CancelPurchaseOrder';

describe('CancelPurchaseOrder', () => {
  const base = 'http://localhost';
  const purchaseOrderId = faker.datatype.number();

  it('should render and toggle modal', async () => {
    const {getByText, getByRole, getByPlaceholderText} =
      renderWithProviderAndRestful(
        <CancelPurchaseOrder
          purchaseOrderId={purchaseOrderId}
          buttonLabel={'toggle'}
        />,
        base
      );

    userEvent.click(getByText(/toggle/i));
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

    expect(getByText(`Cancel PO-${purchaseOrderId}`)).toBeInTheDocument();
    expect(getByPlaceholderText(/comments/i)).toBeInTheDocument();
    expect(getByText(/cancel$/i, {selector: 'button'})).toBeInTheDocument();
  });

  it('should cancel purchase order', async () => {
    const mockedProfile = generateFakeProfile();
    const expectedComments = faker.random.words(10);

    window.confirm = jest.fn().mockImplementation(() => true);

    nock(base)
      .post('/api/purchase-order/cancelPurchaseOrder', {
        comments: expectedComments,
        id: purchaseOrderId,
        cancelledBy: Number(mockedProfile?.id),
      })
      .reply(200);

    const {getByText, getByRole, getByPlaceholderText, queryByRole} =
      renderWithProviderAndRestful(
        <CancelPurchaseOrder
          purchaseOrderId={purchaseOrderId}
          buttonLabel={'toggle'}
        />,
        base,
        store => {
          store.dispatch(profileActions.signIn({me: mockedProfile}));
        }
      );

    userEvent.click(getByText(/toggle/i));
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

    userEvent.type(getByPlaceholderText(/comments/i), expectedComments);
    userEvent.click(getByText(/cancel$/i, {selector: 'button'}));

    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    expect(window.confirm).toHaveBeenCalled();
  });

  it.each`
    description       | expectedErrorLabel        | invalidValue
    ${'empty string'} | ${/should not be empty/i} | ${' '}
  `(
    'should not accept invalid values [$description]',
    async ({invalidValue, expectedErrorLabel}) => {
      window.confirm = jest.fn();

      const {getByRole, getByText, getByPlaceholderText} =
        renderWithProviderAndRestful(
          <CancelPurchaseOrder
            purchaseOrderId={purchaseOrderId}
            buttonLabel={'toggle'}
          />,
          base
        );

      userEvent.click(getByText(/toggle/i));
      await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

      userEvent.type(getByPlaceholderText(/comments/i), invalidValue);
      userEvent.click(getByText(/cancel$/i, {selector: 'button'}));
      await waitFor(() =>
        expect(getByText(expectedErrorLabel)).toBeInTheDocument()
      );
      expect(window.confirm).not.toHaveBeenCalled();
    }
  );
});
