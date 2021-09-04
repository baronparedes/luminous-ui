import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from '@testing-library/react';

import {generateFakeProperty} from '../../../../@utils/fake-models';
import PropertyForm from '../PropertyForm';

export function getPropertyFormElements(
  target: RenderResult,
  submitTextMatch = /update/i
) {
  const codeInput = target.getByLabelText(/code/i);
  const addressInput = target.getByLabelText(/address/i);
  const floorAreaInput = target.getByLabelText(/floor area/i);
  const statusInput = target.getByLabelText(/status/i);
  const formContainer = target.getByRole('form');
  const submit = within(formContainer).getByText(submitTextMatch);
  const reset = within(formContainer).getByText(/reset/i);

  return {
    ...target,
    codeInput,
    addressInput,
    floorAreaInput,
    statusInput,
    formContainer,
    submit,
    reset,
  };
}

describe('PropertyForm', () => {
  const mockedProperty = generateFakeProperty();
  const updatedMockedProperty = generateFakeProperty();

  it('should render with default values and clear form', async () => {
    const {
      codeInput,
      addressInput,
      floorAreaInput,
      statusInput,
      formContainer,
      submit,
      reset,
    } = getPropertyFormElements(
      render(<PropertyForm onSubmit={jest.fn()} />),
      /create/i
    );

    expect(formContainer).toBeInTheDocument();
    expect(submit.textContent).toMatch(/create/i);

    fireEvent.change(codeInput, {target: {value: updatedMockedProperty.code}});
    fireEvent.change(addressInput, {
      target: {value: updatedMockedProperty.address},
    });
    fireEvent.change(floorAreaInput, {
      target: {value: updatedMockedProperty.floorArea},
    });
    fireEvent.change(statusInput, {
      target: {value: updatedMockedProperty.status},
    });

    await waitFor(() => {
      expect((codeInput as HTMLInputElement).value).toBe(
        updatedMockedProperty.code
      );
      expect((addressInput as HTMLInputElement).value).toBe(
        updatedMockedProperty.address
      );
      expect((floorAreaInput as HTMLSelectElement).value).toBe(
        updatedMockedProperty.floorArea.toString()
      );
      expect((statusInput as HTMLSelectElement).value).toBe(
        updatedMockedProperty.status
      );
    });

    fireEvent.click(reset);
    await waitFor(() => {
      expect((codeInput as HTMLInputElement).value).toBe('');
      expect((addressInput as HTMLInputElement).value).toBe('');
      expect((floorAreaInput as HTMLSelectElement).value).toBe('0');
      expect((statusInput as HTMLSelectElement).value).toBe('active');
    });
  });

  it('should update and reset the form', async () => {
    const {
      codeInput,
      addressInput,
      floorAreaInput,
      statusInput,
      formContainer,
      submit,
      reset,
    } = getPropertyFormElements(
      render(<PropertyForm value={mockedProperty} onSubmit={jest.fn()} />)
    );

    expect(formContainer).toBeInTheDocument();
    expect(submit.textContent).toMatch(/update/i);

    fireEvent.change(codeInput, {target: {value: updatedMockedProperty.code}});
    fireEvent.change(addressInput, {
      target: {value: updatedMockedProperty.address},
    });
    fireEvent.change(floorAreaInput, {
      target: {value: updatedMockedProperty.floorArea},
    });
    fireEvent.change(statusInput, {
      target: {value: updatedMockedProperty.status},
    });

    await waitFor(() => {
      expect((codeInput as HTMLInputElement).value).toBe(
        updatedMockedProperty.code
      );
      expect((addressInput as HTMLInputElement).value).toBe(
        updatedMockedProperty.address
      );
      expect((floorAreaInput as HTMLSelectElement).value).toBe(
        updatedMockedProperty.floorArea.toString()
      );
      expect((statusInput as HTMLSelectElement).value).toBe(
        updatedMockedProperty.status
      );
    });

    fireEvent.click(reset);
    await waitFor(() => {
      expect((codeInput as HTMLInputElement).value).toBe(mockedProperty.code);
      expect((addressInput as HTMLInputElement).value).toBe(
        mockedProperty.address
      );
      expect((floorAreaInput as HTMLSelectElement).value).toBe(
        mockedProperty.floorArea.toString()
      );
      expect((statusInput as HTMLSelectElement).value).toBe(
        mockedProperty.status
      );
    });
  });
});
