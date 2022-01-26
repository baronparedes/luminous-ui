import fs from 'fs';
import nock from 'nock';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeCharge,
  generateFakeProperty,
} from '../../../../@utils/fake-models';
import {renderWithRestfulAndRouter} from '../../../../@utils/test-renderers';
import {DEFAULTS} from '../../../../constants';
import WaterReadingView from '../WaterReadingView';

describe('WaterReadingView', () => {
  const base = 'http://localhost';
  const fileName = `${__dirname}/@data/water_reading.xlsx`;
  const stream = fs.readFileSync(fileName);
  const file = new File([stream], 'water_reading.xlsx');

  const charges = [
    generateFakeCharge(),
    {
      ...generateFakeCharge(),
      id: DEFAULTS.WATER_CHARGE_ID,
    },
  ];

  //   const period = getCurrentMonthYear();

  const properties = [
    {...generateFakeProperty(), code: 'G-101'},
    {...generateFakeProperty(), code: 'G-102'},
    {...generateFakeProperty(), code: 'G-103'},
    {...generateFakeProperty(), code: 'G-999'},
  ];

  it('should render correctly when no charge is found', async () => {
    nock(base)
      .get('/api/charge/getAllCharges')
      .reply(200, [generateFakeCharge()]);

    nock(base).get('/api/property/getAll').reply(200, []);

    const {getByText} = renderWithRestfulAndRouter(<WaterReadingView />, base);
    expect(getByText(/select file/)).toBeDisabled();
    await waitFor(() =>
      expect(
        getByText(/unable to locate charge for water utility/i)
      ).toBeInTheDocument()
    );
  });

  it('should render and process file', async () => {
    nock(base)
      .get('/api/charge/getAllCharges')
      .reply(200, [...charges]);

    nock(base)
      .get('/api/property/getAll')
      .reply(200, [...properties]);

    nock(base)
      .post('/api/transaction/postTransactions', body => {
        return body.length === 3;
      })
      .reply(200);

    window.confirm = jest.fn().mockImplementation(() => true);
    window.alert = jest.fn().mockImplementation();

    const {
      getByText,
      getByRole,
      getByLabelText,
      getByPlaceholderText,
      queryByRole,
      queryByText,
    } = renderWithRestfulAndRouter(<WaterReadingView />, base);

    await waitFor(() => expect(getByText(/select file/)).toBeEnabled());

    userEvent.click(getByText(/select file/));
    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());

    const sheetNameSelect = getByPlaceholderText(
      /sheet name/i
    ) as HTMLSelectElement;
    const uploadInput = getByLabelText(
      /select file to upload/i
    ) as HTMLInputElement;

    userEvent.upload(uploadInput, file);

    await waitFor(() => {
      expect(uploadInput.files).toHaveLength(1);
      expect(uploadInput.files).not.toBeNull();
      if (uploadInput.files) {
        expect(uploadInput.files[0]).toStrictEqual(file);
        expect(uploadInput.files.item(0)).toStrictEqual(file);
      }
    });

    await waitFor(() =>
      expect(within(sheetNameSelect).getByText('Sheet1')).toBeInTheDocument()
    );

    userEvent.selectOptions(sheetNameSelect, 'Sheet1');
    userEvent.click(getByText(/process/i));
    await waitFor(() => expect(window.confirm).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());

    await waitFor(() => {
      expect(
        getByText(/No reading found for the following properties/i)
      ).toBeInTheDocument();
      expect(
        getByText(/No reading found for the following properties/i)
      ).toBeInTheDocument();
      expect(getByText(/Review Transactions to Upload/i)).toBeInTheDocument();
      expect(getByText(/Save Transactions/i)).toBeInTheDocument();
    });

    userEvent.click(getByText(/Save Transactions/i));
    await waitFor(() => expect(window.confirm).toHaveBeenCalledTimes(2));

    await waitFor(() => {
      expect(
        queryByText(/No reading found for the following properties/i)
      ).not.toBeInTheDocument();
      expect(
        queryByText(/No reading found for the following properties/i)
      ).not.toBeInTheDocument();
      expect(
        queryByText(/Review Transactions to Upload/i)
      ).not.toBeInTheDocument();
      expect(queryByText(/Save Transactions/i)).not.toBeInTheDocument();
    });

    await waitFor(() => expect(window.alert).toHaveBeenCalledTimes(1));
  });
});
