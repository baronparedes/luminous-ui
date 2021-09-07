import {fireEvent} from '@testing-library/react';

import {generateFakeProperty} from '../../../@utils/fake-models';
import routes from '../../../@utils/routes';
import {renderWithRouter} from '../../../@utils/test-renderers';
import MyPropertyCard from '../MyPropertyCard';

describe('MyPropertyCard', () => {
  it('should render', () => {
    const mockedProperty = generateFakeProperty();
    const {getByText, history} = renderWithRouter(
      <MyPropertyCard property={mockedProperty} />
    );
    expect(getByText(mockedProperty.code)).toBeInTheDocument();
    expect(getByText(mockedProperty.address)).toBeInTheDocument();
    expect(getByText(`${mockedProperty.floorArea} m2`)).toBeInTheDocument();

    fireEvent.click(getByText(mockedProperty.code));
    expect(history.location.pathname).toEqual(
      routes.PROPERTY(mockedProperty.id)
    );
  });
});
