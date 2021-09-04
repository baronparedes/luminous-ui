import nock from 'nock';

import {fireEvent, waitFor, within} from '@testing-library/react';

import {generateFakeProperty} from '../../../../@utils/fake-models';
import {renderWithRestful} from '../../../../@utils/test-renderers';
import {PropertyAttr} from '../../../../Api';
import PropertyTableRow from '../PropertyTableRow';

describe('PropertyTableRow', () => {
  const base = 'http://localhost';
  const mockedProperty = generateFakeProperty();

  afterEach(() => jest.clearAllMocks());

  function renderTarget(property: PropertyAttr) {
    return renderWithRestful(
      <table>
        <tbody>
          <PropertyTableRow row={property} />
        </tbody>
      </table>,
      base
    );
  }

  it.each`
    status        | to
    ${'active'}   | ${'inactive'}
    ${'inactive'} | ${'active'}
  `('should update profile status to $to', async ({status, to}) => {
    const expected: PropertyAttr = {...mockedProperty, status};
    const {getByText} = renderTarget(expected);
    const container = getByText(expected.code).parentElement as HTMLElement;
    const updateStatusButton = within(container).getByLabelText(
      /update status/i,
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
    const {getByText} = renderTarget(mockedProperty);
    const container = getByText(mockedProperty.code)
      .parentElement as HTMLElement;
    expect(
      within(container).getByText(Number(mockedProperty.id))
    ).toBeInTheDocument();
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
      within(container).getByLabelText(/update$/i, {selector: 'button'})
    ).toBeInTheDocument();
    expect(
      within(container).getByLabelText(/update status/i, {
        selector: 'button',
      })
    ).toBeInTheDocument();
  });
});
