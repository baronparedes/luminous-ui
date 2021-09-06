import nock from 'nock';

import {fireEvent, waitFor} from '@testing-library/react';

import {generateFakeProfile} from '../../../@utils/fake-models';
import {renderWithRestful} from '../../../@utils/test-renderers';
import ProfileSelect, {toProfileSelectItems} from '../ProfileSelect';

describe('ProfileSelect', () => {
  const base = 'http://localhost';
  const mockedProfiles = [
    {...generateFakeProfile(), name: 'George'},
    {...generateFakeProfile(), name: 'George W Bush'},
  ];
  it('should render', async () => {
    renderWithRestful(<ProfileSelect onSelectProfiles={jest.fn()} />, base);
  });

  it('should render profiles', async () => {
    const onSelectProfilesMock = jest.fn();
    const {getByPlaceholderText, getByText, getByLabelText} = renderWithRestful(
      <ProfileSelect onSelectProfiles={onSelectProfilesMock} />,
      base
    );
    const searchCriteria = 'geo';
    nock(base)
      .get(`/api/profile/getAll?search=${searchCriteria}`)
      .reply(200, mockedProfiles);

    const inputEl = getByPlaceholderText(/search for a profile/i);

    fireEvent.click(inputEl);
    await waitFor(() => {
      expect(getByLabelText('menu-options')).toBeInTheDocument();
      expect(getByText(/no matches found/i)).toBeInTheDocument();
    });

    fireEvent.change(inputEl, {target: {value: searchCriteria}});
    await waitFor(() =>
      expect((inputEl as HTMLInputElement).value).toEqual(searchCriteria)
    );

    for (const item of mockedProfiles) {
      await waitFor(() => {
        const optionEl = getByLabelText(`${item.name} (${item.username})`);
        expect(optionEl).toBeInTheDocument();
        fireEvent.click(optionEl);
        fireEvent.click(inputEl);
      });
    }

    fireEvent.click(getByLabelText(/select profile/i));
    await waitFor(() =>
      expect(onSelectProfilesMock).toBeCalledWith(
        toProfileSelectItems(mockedProfiles)
      )
    );
  });
});
