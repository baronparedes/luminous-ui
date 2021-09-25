import {currencyFormat, roundOff} from '../../../@utils/currencies';
import {generateFakePropertyAccount} from '../../../@utils/fake-models';
import {renderWithRouter} from '../../../@utils/test-renderers';
import PropertyDetails from '../PropertyDetails';

describe('PropertyCard', () => {
  it('should render', () => {
    const mockedProperty = generateFakePropertyAccount();
    const {getByText} = renderWithRouter(
      <PropertyDetails propertyAccount={mockedProperty} />
    );
    expect(getByText(/amount due/i)).toBeInTheDocument();
    expect(
      getByText(currencyFormat(roundOff(mockedProperty.balance)))
    ).toBeInTheDocument();
  });
});
