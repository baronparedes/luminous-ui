import nock from 'nock';

import {fireEvent, waitFor} from '@testing-library/react';

import {generateFakeProperty} from '../../../../@utils/fake-models';
import {renderWithRestful} from '../../../../@utils/test-renderers';
import PropertyCreateButton from '../PropertyCreateButton';
import {getPropertyFormElements} from './PropertyForm.spec';

describe('PropertyCreateButton', () => {
  const base = 'http://localhost';
  const updatedMockedProperty = generateFakeProperty();
  const onCreateMock = jest.fn();

  async function renderAndOpenModal() {
    const target = renderWithRestful(
      <PropertyCreateButton onCreate={onCreateMock} />,
      base
    );
    const updateButton = target.getByText(/create$/i, {
      selector: 'button',
    });
    expect(updateButton).toBeInTheDocument();
    expect(target.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(updateButton);
    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    const formElements = getPropertyFormElements(target, /create/i);

    return {
      ...target,
      ...formElements,
    };
  }

  afterEach(() => jest.clearAllMocks());

  it('should create new property', async () => {
    const {
      codeInput,
      addressInput,
      floorAreaInput,
      statusInput,
      formContainer,
      submit,
      getByRole,
      queryByRole,
    } = await renderAndOpenModal();

    const body = {
      code: updatedMockedProperty.code,
      address: updatedMockedProperty.address,
      floorArea: updatedMockedProperty.floorArea.toString(),
      status: updatedMockedProperty.status,
    };

    nock(base).post('/api/property/create', body).reply(204);

    await waitFor(() => expect(formContainer).toBeInTheDocument());
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
    fireEvent.click(submit);
    await waitFor(() => expect(getByRole('progressbar')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByRole('progressbar')).not.toBeInTheDocument()
    );
    expect(onCreateMock).toBeCalledTimes(1);
  });
});
