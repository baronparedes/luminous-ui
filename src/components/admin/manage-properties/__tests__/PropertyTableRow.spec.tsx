import nock from 'nock';

import {fireEvent, waitFor, within} from '@testing-library/react';

import {generateFakeProperty} from '../../../../@utils/fake-models';
import routes from '../../../../@utils/routes';
import {renderWithProviderAndRouterAndRestful} from '../../../../@utils/test-renderers';
import {PropertyAttr, RecordStatus} from '../../../../Api';
import PropertyTableRow from '../PropertyTableRow';

describe('PropertyTableRow', () => {
  const base = 'http://localhost';
  const mockedProperty = generateFakeProperty();

  afterEach(() => jest.clearAllMocks());

  function renderTarget(property: PropertyAttr) {
    return renderWithProviderAndRouterAndRestful(
      <table>
        <tbody>
          <PropertyTableRow row={property} />
        </tbody>
      </table>,
      base
    );
  }

  function getUpdateStatusLabel(status: RecordStatus) {
    if (status === 'active') return /mark as inactive/i;
    return /mark as active/i;
  }

  it.each`
    status        | to
    ${'active'}   | ${'inactive'}
    ${'inactive'} | ${'active'}
  `('should update profile status to $to', async ({status, to}) => {
    const expected: PropertyAttr = {...mockedProperty, status};
    const {getByText} = renderTarget(expected);
    const container = getByText(Number(expected.id))
      .parentElement as HTMLElement;
    const updateStatusButton = within(container).getByLabelText(
      getUpdateStatusLabel(status),
      {
        selector: 'button',
      }
    );

    nock(base)
      .patch(`/api/property/updatePropertyStatus/${expected.id}?status=${to}`)
      .reply(204);

    fireEvent.click(updateStatusButton);
    await waitFor(() =>
      expect(within(container).getByText(to)).toBeInTheDocument()
    );
  });

  it('should render', async () => {
    const {getByText, history} = renderTarget(mockedProperty);
    const container = getByText(Number(mockedProperty.id))
      .parentElement as HTMLElement;
    expect(
      within(container).getByText(mockedProperty.code)
    ).toBeInTheDocument();
    expect(
      within(container).getByText(mockedProperty.address)
    ).toBeInTheDocument();
    expect(
      within(container).getByText(mockedProperty.floorArea)
    ).toBeInTheDocument();
    expect(
      within(container).getByText(mockedProperty.status)
    ).toBeInTheDocument();
    expect(
      within(container).getByLabelText(/add assignment$/i, {selector: 'button'})
    ).toBeInTheDocument();
    expect(
      within(container).getByLabelText(/update$/i, {selector: 'button'})
    ).toBeInTheDocument();
    expect(
      within(container).getByLabelText(
        getUpdateStatusLabel(mockedProperty.status),
        {
          selector: 'button',
        }
      )
    ).toBeInTheDocument();

    fireEvent.click(within(container).getByText(mockedProperty.code));
    expect(history.location.pathname).toEqual(
      routes.PROPERTY(mockedProperty.id)
    );
  });
});
