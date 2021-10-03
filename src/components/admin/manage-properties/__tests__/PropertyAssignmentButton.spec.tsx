import faker from 'faker';
import nock from 'nock';

import {fireEvent, waitFor, within} from '@testing-library/react';

import {generateFakePropertyAssignment} from '../../../../@utils/fake-models';
import {renderWithRestful} from '../../../../@utils/test-renderers';
import ProfileSelect, {ProfileSelectItem} from '../../../profile/ProfileSelect';
import PropertyAssignmentButton from '../PropertyAssignmentButton';

const mockedProfileSelectId = faker.datatype.number();
const mockedProfileSelect: ProfileSelectItem = {
  id: mockedProfileSelectId,
  label: faker.datatype.string(),
  email: faker.internet.email(),
  name: faker.datatype.string(),
  username: faker.datatype.string(),
};
type ProfileSelectProps = React.ComponentProps<typeof ProfileSelect>;
jest.mock(
  '../../../profile/ProfileSelect',
  () => (props: ProfileSelectProps) => {
    const handleOnClick = () => {
      props.onSelectProfiles && props.onSelectProfiles([mockedProfileSelect]);
    };
    return (
      <div>
        <button onClick={handleOnClick}>mock-select-profile</button>
      </div>
    );
  }
);

describe('PropertyAssignmentButton', () => {
  const base = 'http://localhost';
  const mockedAssignments = [
    generateFakePropertyAssignment(),
    generateFakePropertyAssignment(),
  ];
  const propertyId = faker.datatype.number();
  const code = faker.datatype.string();

  async function renderTarget() {
    const target = renderWithRestful(
      <PropertyAssignmentButton propertyId={propertyId} code={code} />,
      base
    );

    nock(base)
      .get(`/api/property/getPropertyAssignments/${propertyId}`)
      .reply(200, mockedAssignments);

    const addAssignmentButton = target.getByLabelText(/add assignment/i);
    expect(addAssignmentButton).toBeInTheDocument();

    fireEvent.click(addAssignmentButton);
    await waitFor(() => expect(target.getByRole('dialog')).toBeInTheDocument());

    return {
      ...target,
    };
  }

  it('should render when modal is opened', async () => {
    const {getByText, getByTestId} = await renderTarget();
    expect(getByText(/manage assignment for/i)).toBeInTheDocument();
    expect(
      getByText(/profiles assigned to this property/i)
    ).toBeInTheDocument();
    expect(getByText(/update/i, {selector: 'button'})).toBeInTheDocument();
    for (const item of mockedAssignments) {
      expect(
        getByTestId(`property-assignment-${item.profileId}`)
      ).toBeInTheDocument();
    }
  });

  it('should remove and update assigned profiles', async () => {
    const {queryByTestId, getByText, queryByRole, getByTestId} =
      await renderTarget();

    const toBeRetained = mockedAssignments[0];
    const body = [toBeRetained.profileId, mockedProfileSelectId];
    nock(base)
      .patch(`/api/property/updatePropertyAssignments/${propertyId}`, body)
      .reply(204);

    const toBeRemoved = mockedAssignments[1];
    const profileToBeRemovedContainer = queryByTestId(
      `property-assignment-${toBeRemoved.profileId}`
    );

    fireEvent.click(
      within(profileToBeRemovedContainer as HTMLElement).getByLabelText(
        /remove/i
      )
    );
    await waitFor(() =>
      expect(profileToBeRemovedContainer).not.toBeInTheDocument()
    );

    fireEvent.click(getByText('mock-select-profile'));
    await waitFor(() =>
      expect(
        getByTestId(`property-assignment-${mockedProfileSelectId}`)
      ).toBeInTheDocument()
    );

    fireEvent.click(getByText(/update/i));
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
  });
});
