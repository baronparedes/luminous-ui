import nock from 'nock';

import {fireEvent, waitFor} from '@testing-library/react';

import {generateFakeProperty} from '../../../../@utils/fake-models';
import {renderWithRestful} from '../../../../@utils/test-renderers';
import PropertyUpdateButton from '../PropertyUpdateButton';
import {getPropertyFormElements} from './PropertyForm.spec';

describe('PropertyUpdateButton', () => {
  const base = 'http://localhost';
  const mockedProperty = generateFakeProperty();
  const updatedMockedProperty = generateFakeProperty();
  const onUpdateMock = jest.fn();

  async function renderAndOpenModal() {
    const target = renderWithRestful(
      <PropertyUpdateButton value={mockedProperty} onUpdate={onUpdateMock} />,
      base
    );
    const updateButton = target.getByLabelText(/update$/i, {
      selector: 'button',
    });
    expect(updateButton).toBeInTheDocument();
    expect(target.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(updateButton);
    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    const formElements = getPropertyFormElements(target);

    return {
      ...target,
      ...formElements,
    };
  }

  afterEach(() => jest.clearAllMocks());

  it('should update property', async () => {
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
      id: mockedProperty.id,
    };

    nock(base)
      .patch(`/api/property/updateProperty/${mockedProperty.id}`, body)
      .reply(200, updatedMockedProperty);

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
    expect(onUpdateMock).toBeCalledTimes(1);
  });
});
