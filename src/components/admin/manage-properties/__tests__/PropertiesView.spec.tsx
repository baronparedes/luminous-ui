import faker from 'faker';
import nock from 'nock';

import {fireEvent, waitFor, within} from '@testing-library/react';

import {generateFakeProperty} from '../../../../@utils/fake-models';
import {renderWithProviderAndRouterAndRestful} from '../../../../@utils/test-renderers';
import PropertiesView from '../PropertiesView';

describe('PropertiesView', () => {
  it('should render and search properties', async () => {
    const base = 'http://localhost';
    const searchCriteria = faker.internet.userName();
    const mockedProperties = [generateFakeProperty(), generateFakeProperty()];
    nock(base).get('/api/property/getAll').reply(200, mockedProperties);
    nock(base)
      .get(`/api/property/getAll?search=${searchCriteria}`)
      .reply(200, mockedProperties);

    const expectedHeaders = [
      'id',
      'code',
      'address',
      'floor area',
      'status',
      'action',
    ];

    const {
      getByRole,
      getByPlaceholderText,
      getByLabelText,
      getByText,
      queryByRole,
    } = renderWithProviderAndRouterAndRestful(<PropertiesView />, base);

    expect(getByRole('heading').textContent).toMatch(/properties/i);
    expect(getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(getByLabelText(/search/i, {selector: 'button'})).toBeInTheDocument();
    expect(getByText(/create/i, {selector: 'button'})).toBeInTheDocument();

    expect(getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => {
      expect(queryByRole('progressbar')).not.toBeInTheDocument();
    });

    fireEvent.change(getByPlaceholderText(/^search/i), {
      target: {value: searchCriteria},
    });
    await waitFor(() => {
      expect(getByRole('progressbar')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(queryByRole('progressbar')).not.toBeInTheDocument();
      for (const expectedHeader of expectedHeaders) {
        expect(getByText(expectedHeader, {selector: 'th'})).toBeInTheDocument();
      }
      for (const property of mockedProperties) {
        const container = getByText(Number(property.id))
          .parentElement as HTMLElement;
        expect(within(container).getByText(property.code)).toBeInTheDocument();
        expect(
          within(container).getByText(property.address)
        ).toBeInTheDocument();
        expect(
          within(container).getByText(property.floorArea)
        ).toBeInTheDocument();
        expect(
          within(container).getByText(property.status)
        ).toBeInTheDocument();
      }
    });
  });
});
