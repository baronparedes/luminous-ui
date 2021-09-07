import nock from 'nock';

import {fireEvent, waitFor, within} from '@testing-library/react';

import {generateFakeProfile} from '../../../../@utils/fake-models';
import {renderWithRestful} from '../../../../@utils/test-renderers';
import ProfileUpdateButton from '../ProfileUpdateButton';

describe('ProfilesTableRow', () => {
  const base = 'http://localhost';
  const mockedProfile = generateFakeProfile();
  const updatedMockedProfile = generateFakeProfile();

  async function renderAndOpenModal() {
    const target = renderWithRestful(
      <ProfileUpdateButton profile={mockedProfile} />,
      base
    );
    const updateButton = target.getByLabelText(/update$/i, {
      selector: 'button',
    });
    expect(updateButton).toBeInTheDocument();
    expect(target.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(updateButton);
    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    const nameInput = target.getByLabelText(/name/i);
    const emailInput = target.getByLabelText(/email/i);
    const typeInput = target.getByLabelText(/type/i);
    const statusInput = target.getByLabelText(/status/i);
    const mobileNumberInput = target.getByLabelText(/mobile/i);
    const formContainer = target.getByRole('form');
    const updateFormButton = within(formContainer).getByText(/update/i);
    const resetFormButton = within(formContainer).getByText(/reset/i);

    return {
      ...target,
      nameInput,
      emailInput,
      mobileNumberInput,
      typeInput,
      statusInput,
      formContainer,
      updateFormButton,
      resetFormButton,
    };
  }

  afterEach(() => jest.clearAllMocks());

  it('should update profile', async () => {
    const {
      nameInput,
      emailInput,
      mobileNumberInput,
      typeInput,
      statusInput,
      formContainer,
      updateFormButton,
      getByRole,
      queryByRole,
    } = await renderAndOpenModal();

    const body = {
      name: updatedMockedProfile.name,
      email: updatedMockedProfile.email,
      mobileNumber: updatedMockedProfile.mobileNumber,
      type: updatedMockedProfile.type,
      status: updatedMockedProfile.status,
    };

    nock(base)
      .patch(`/api/profile/updateProfile/${mockedProfile.id}`, body)
      .reply(200, updatedMockedProfile);

    await waitFor(() => expect(formContainer).toBeInTheDocument());
    fireEvent.change(nameInput, {target: {value: updatedMockedProfile.name}});
    fireEvent.change(emailInput, {target: {value: updatedMockedProfile.email}});
    fireEvent.change(mobileNumberInput, {
      target: {value: updatedMockedProfile.mobileNumber},
    });
    fireEvent.change(typeInput, {target: {value: updatedMockedProfile.type}});
    fireEvent.change(statusInput, {
      target: {value: updatedMockedProfile.status},
    });
    fireEvent.click(updateFormButton);
    await waitFor(() => expect(getByRole('progressbar')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );
  });

  it('should update and reset the form', async () => {
    const {
      nameInput,
      emailInput,
      mobileNumberInput,
      typeInput,
      statusInput,
      formContainer,
      resetFormButton,
    } = await renderAndOpenModal();

    await waitFor(() => expect(formContainer).toBeInTheDocument());
    fireEvent.change(nameInput, {target: {value: updatedMockedProfile.name}});
    fireEvent.change(emailInput, {target: {value: updatedMockedProfile.email}});
    fireEvent.change(mobileNumberInput, {
      target: {value: updatedMockedProfile.mobileNumber},
    });
    fireEvent.change(typeInput, {target: {value: updatedMockedProfile.type}});
    fireEvent.change(statusInput, {
      target: {value: updatedMockedProfile.status},
    });

    await waitFor(() => {
      expect((nameInput as HTMLInputElement).value).toBe(
        updatedMockedProfile.name
      );
      expect((emailInput as HTMLInputElement).value).toBe(
        updatedMockedProfile.email
      );
      expect((typeInput as HTMLSelectElement).value).toBe(
        updatedMockedProfile.type
      );
      expect((statusInput as HTMLSelectElement).value).toBe(
        updatedMockedProfile.status
      );
      expect((mobileNumberInput as HTMLSelectElement).value).toBe(
        updatedMockedProfile.mobileNumber
      );
    });

    fireEvent.click(resetFormButton);
    await waitFor(() => {
      expect((nameInput as HTMLInputElement).value).toBe(mockedProfile.name);
      expect((emailInput as HTMLInputElement).value).toBe(mockedProfile.email);
      expect((typeInput as HTMLSelectElement).value).toBe(mockedProfile.type);
      expect((statusInput as HTMLSelectElement).value).toBe(
        mockedProfile.status
      );
      expect((mobileNumberInput as HTMLSelectElement).value).toBe(
        mockedProfile.mobileNumber
      );
    });
  });

  it('should render', async () => {
    const {
      nameInput,
      emailInput,
      typeInput,
      statusInput,
      updateFormButton,
      resetFormButton,
    } = await renderAndOpenModal();

    await waitFor(() => {
      expect((nameInput as HTMLInputElement).value).toBe(mockedProfile.name);
      expect((emailInput as HTMLInputElement).value).toBe(mockedProfile.email);
      expect((typeInput as HTMLSelectElement).value).toBe(mockedProfile.type);
      expect((statusInput as HTMLSelectElement).value).toBe(
        mockedProfile.status
      );
      expect(updateFormButton).toBeInTheDocument();
      expect(resetFormButton).toBeInTheDocument();
    });
  });
});
