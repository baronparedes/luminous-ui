import faker from 'faker';
import nock from 'nock';

import {fireEvent, waitFor} from '@testing-library/react';

import {generateFakeProfile} from '../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../@utils/test-renderers';
import {profileActions} from '../../../store/reducers/profile.reducer';
import UpdateBasicDetailsForm from '../UpdateBasicDetailsForm';

describe('UpdateBasicDetailsForm', () => {
  const base = 'http://localhost';
  const expectedProfile = generateFakeProfile();
  const onUpdateMock = jest.fn();

  function renderTarget() {
    const target = renderWithProviderAndRestful(
      <UpdateBasicDetailsForm
        profile={expectedProfile}
        onUpdate={onUpdateMock}
      />,
      base
    );

    target.store.dispatch(
      profileActions.signIn({
        me: expectedProfile,
        token: faker.datatype.string(),
      })
    );

    return {...target};
  }

  function renderTargetAndFillUpForm() {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const mobileNumber = faker.phone.phoneNumber();

    const target = renderTarget();

    const nameInput = target.getByPlaceholderText(
      /fullname/i
    ) as HTMLInputElement;
    const emailInput = target.getByPlaceholderText(
      /email/i
    ) as HTMLInputElement;
    const mobileNumberInput = target.getByPlaceholderText(
      /mobile number/i
    ) as HTMLInputElement;
    const submit = target.getByText(/update/i, {selector: 'button'});

    fireEvent.change(nameInput, {target: {value: name}});
    fireEvent.change(emailInput, {target: {value: email}});
    fireEvent.change(mobileNumberInput, {target: {value: mobileNumber}});

    return {
      name,
      email,
      mobileNumber,
      nameInput,
      emailInput,
      mobileNumberInput,
      submit,
      ...target,
    };
  }

  afterEach(() => jest.clearAllMocks());

  it('should render', () => {
    const {nameInput, emailInput, mobileNumberInput, submit} =
      renderTargetAndFillUpForm();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(mobileNumberInput).toBeInTheDocument();
    expect(submit).toBeInTheDocument();
  });

  it('should submit form without errors', async () => {
    const {name, email, mobileNumber, submit, store} =
      renderTargetAndFillUpForm();
    const body = {
      type: expectedProfile.type,
      status: expectedProfile.status,
      name,
      email,
      mobileNumber,
    };
    nock(base)
      .patch(`/api/profile/updateProfile/${expectedProfile.id}`, body)
      .reply(200, {...expectedProfile, name, email, mobileNumber});

    fireEvent.click(submit);
    await waitFor(() => {
      expect(onUpdateMock).toBeCalledTimes(1);
    });

    const actualProfileInStore = store.getState().profile.me;
    expect(actualProfileInStore).toBeDefined();
    expect(actualProfileInStore?.email).toEqual(email);
    expect(actualProfileInStore?.name).toEqual(name);
    expect(actualProfileInStore?.mobileNumber).toEqual(mobileNumber);
  });

  it('should fail submitting form and show error', async () => {
    const {name, email, mobileNumber, submit, getByRole} =
      renderTargetAndFillUpForm();
    const body = {
      type: expectedProfile.type,
      status: expectedProfile.status,
      name,
      email,
      mobileNumber,
    };
    nock(base)
      .patch(`/api/profile/updateProfile/${expectedProfile.id}`, body)
      .reply(500);

    fireEvent.click(submit);
    await waitFor(() => {
      expect(getByRole('error').textContent).toMatch(/unable to update*/);
    });
  });

  describe('when validating form', () => {
    it.each`
      field
      ${'fullname'}
      ${'email'}
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
