import faker from 'faker';
import nock from 'nock';

import {waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeProfile,
  generateFakeVoucher,
} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import {profileActions} from '../../../../store/reducers/profile.reducer';
import RejectVoucher from '../../actions/RejectVoucher';

describe('RejectVoucher', () => {
  const base = 'http://localhost';
  const voucher = generateFakeVoucher();

  it('should render and toggle modal', async () => {
    const {getByText, getByRole, getByPlaceholderText} =
      renderWithProviderAndRestful(
        <RejectVoucher voucher={voucher} buttonLabel={'toggle'} />,
        base
      );

    userEvent.click(getByText(/toggle/i));
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

    expect(
      getByText(`Reject V-${voucher.series ?? voucher.id}`)
    ).toBeInTheDocument();
    expect(getByPlaceholderText(/comments/i)).toBeInTheDocument();
    expect(getByText(/reject$/i, {selector: 'button'})).toBeInTheDocument();
  });

  it('should reject voucher', async () => {
    const mockedProfile = generateFakeProfile();
    const expectedComments = faker.random.words(10);

    window.confirm = jest.fn().mockImplementation(() => true);

    nock(base)
      .post('/api/voucher/rejectVoucher', {
        comments: expectedComments,
        id: Number(voucher.id),
        rejectedBy: Number(mockedProfile?.id),
      })
      .reply(200);

    const {getByText, getByRole, getByPlaceholderText, queryByRole} =
      renderWithProviderAndRestful(
        <RejectVoucher voucher={voucher} buttonLabel={'toggle'} />,
        base,
        store => {
          store.dispatch(profileActions.signIn({me: mockedProfile}));
        }
      );

    userEvent.click(getByText(/toggle/i));
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

    userEvent.type(getByPlaceholderText(/comments/i), expectedComments);
    userEvent.click(getByText(/reject$/i, {selector: 'button'}));

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
          <RejectVoucher voucher={voucher} buttonLabel={'toggle'} />,
          base
        );

      userEvent.click(getByText(/toggle/i));
      await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

      userEvent.type(getByPlaceholderText(/comments/i), invalidValue);
      userEvent.click(getByText(/reject$/i, {selector: 'button'}));
      await waitFor(() =>
        expect(getByText(expectedErrorLabel)).toBeInTheDocument()
      );
      expect(window.confirm).not.toHaveBeenCalled();
    }
  );
});
