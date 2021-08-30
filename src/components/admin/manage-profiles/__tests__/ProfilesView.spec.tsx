import faker from 'faker';
import nock from 'nock';

import {fireEvent, waitFor, within} from '@testing-library/react';

import {generateFakeProfile} from '../../../../@utils/fake-models';
import {renderWithProviderAndRestful} from '../../../../@utils/test-renderers';
import ProfilesView from '../ProfilesView';

describe('ProfilesView', () => {
  it('should render and search profiles', async () => {
    const base = 'http://localhost';
    const searchCriteria = faker.internet.userName();
    const mockedProfiles = [generateFakeProfile(), generateFakeProfile()];
    nock(base).get('/api/profile/getAll').reply(200, mockedProfiles);
    nock(base)
      .get(`/api/profile/getAll?search=${searchCriteria}`)
      .reply(200, mockedProfiles);

    const expectedHeaders = [
      'id',
      'name',
      'username',
      'email',
      'type',
      'status',
      'action',
    ];

    const {
      getByRole,
      getByPlaceholderText,
      getByLabelText,
      getByText,
      queryByRole,
    } = renderWithProviderAndRestful(<ProfilesView />, base);

    expect(getByRole('heading').textContent).toMatch(/profiles/i);
    expect(getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(
      getByLabelText(/search user/i, {selector: 'button'})
    ).toBeInTheDocument();

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
      for (const mockedProfile of mockedProfiles) {
        const container = getByText(mockedProfile.username)
          .parentElement as HTMLElement;
        expect(
          within(container).getByText(mockedProfile.id)
        ).toBeInTheDocument();
        expect(
          within(container).getByText(mockedProfile.username)
        ).toBeInTheDocument();
        expect(
          within(container).getByText(mockedProfile.name)
        ).toBeInTheDocument();
        expect(
          within(container).getByText(mockedProfile.email)
        ).toBeInTheDocument();
        expect(
          within(container).getByText(mockedProfile.type)
        ).toBeInTheDocument();
      }
    });
  });
});
