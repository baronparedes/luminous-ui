import faker from 'faker';
import nock from 'nock';

import {fireEvent, waitFor} from '@testing-library/react';

import {renderWithRestful} from '../../../@utils/test-renderers';
import ChangePasswordForm from '../ChangePasswordForm';

describe('ChangePasswordForm', () => {
  const base = 'http://localhost';
  const expectedId = faker.datatype.number();
  const onUpdateMock = jest.fn();

  function renderTarget() {
    const target = renderWithRestful(
      <ChangePasswordForm id={expectedId} onUpdate={onUpdateMock} />,
      base
    );
    return {...target};
  }

  function renderTargetAndFillUpForm() {
    const currentPassword = faker.internet.password();
    const newPassword = faker.internet.password();
    const confirmNewPassword = newPassword;

    const target = renderTarget();

    const currentPasswordInput = target.getByPlaceholderText(
      /current password/i
    ) as HTMLInputElement;
    const newPasswordInput = target.getByPlaceholderText(
      /^new password/i
    ) as HTMLInputElement;
    const confirmNewPasswordInput = target.getByPlaceholderText(
      /^confirm new password/i
    ) as HTMLInputElement;
    const submit = target.getByText(/change password/i, {selector: 'button'});

    fireEvent.change(currentPasswordInput, {target: {value: currentPassword}});
    fireEvent.change(newPasswordInput, {target: {value: newPassword}});
    fireEvent.change(confirmNewPasswordInput, {
      target: {value: confirmNewPassword},
    });

    return {
      currentPassword,
      newPassword,
      confirmNewPassword,
      currentPasswordInput,
      newPasswordInput,
      confirmNewPasswordInput,
      submit,
      ...target,
    };
  }

  afterEach(() => jest.clearAllMocks());

  it('should render', () => {
    const {
      currentPasswordInput,
      newPasswordInput,
      confirmNewPasswordInput,
      submit,
    } = renderTargetAndFillUpForm();
    expect(currentPasswordInput).toBeInTheDocument();
    expect(newPasswordInput).toBeInTheDocument();
    expect(confirmNewPasswordInput).toBeInTheDocument();
    expect(submit).toBeInTheDocument();
  });

  it('should submit form without errors', async () => {
    const {currentPassword, newPassword, submit} = renderTargetAndFillUpForm();
    const body = {
      currentPassword,
      newPassword,
    };
    nock(base)
      .patch(`/api/profile/changePassword/${expectedId}`, body)
      .reply(204);

    fireEvent.click(submit);
    await waitFor(() => {
      expect(onUpdateMock).toBeCalledTimes(1);
    });
  });

  it('should fail submitting form and show error', async () => {
    const {currentPassword, newPassword, submit, getByRole} =
      renderTargetAndFillUpForm();
    const body = {
      currentPassword,
      newPassword,
    };
    nock(base)
      .patch(`/api/profile/changePassword/${expectedId}`, body)
      .reply(500);

    fireEvent.click(submit);
    await waitFor(() => {
      expect(getByRole('error').textContent).toMatch(
        /unable to change password*/
      );
    });
  });

  describe('when validating form', () => {
    it('should match new password and confirm new password input', async () => {
      const {submit, getByText, getByPlaceholderText} =
        renderTargetAndFillUpForm();
      fireEvent.change(getByPlaceholderText('confirm new password'), {
        target: {value: faker.internet.password()},
      });
      fireEvent.click(submit);
      await waitFor(() =>
        expect(getByText(/password does not match/i)).toBeInTheDocument()
      );
    });

    it.each`
      field
      ${'current password'}
      ${'new password'}
      ${'confirm new password'}
    `('should require $field input', async ({field}) => {
      const {submit, getByPlaceholderText, getByRole} =
        renderTargetAndFillUpForm();
      fireEvent.change(getByPlaceholderText(field), {
        target: {value: ''},
      });
      fireEvent.click(submit);
      await waitFor(() =>
        expect((getByRole('form') as HTMLFormElement).checkValidity()).toBe(
          false
        )
      );
    });
  });
});
