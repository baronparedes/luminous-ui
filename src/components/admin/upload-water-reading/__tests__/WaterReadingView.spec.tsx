import fs from 'fs';
import nock from 'nock';
import faker from 'faker';

import {waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  generateFakeCharge,
  generateFakeProperty,
} from '../../../../@utils/fake-models';
import {
  renderWithProviderAndRouterAndRestful,
  renderWithRestfulAndRouter,
} from '../../../../@utils/test-renderers';
import WaterReadingView from '../WaterReadingView';
import {set} from 'react-hook-form';
import {settingActions} from '../../../../store/reducers/setting.reducer';
import {SETTING_KEYS} from '../../../../constants';

describe('WaterReadingView', () => {
  const base = 'http://localhost';
  const fileName = `${__dirname}/@data/water_reading.xlsx`;
  const stream = fs.readFileSync(fileName);
  const file = new File([stream], 'water_reading.xlsx');
  const waterChargeId = faker.datatype.number({min: 1, max: 10});

  const charges = [
    generateFakeCharge(),
    {
      ...generateFakeCharge(),
      id: waterChargeId,
    },
  ];

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

    const {getByText} = renderWithProviderAndRouterAndRestful(
      <WaterReadingView />,
      base
    );
    expect(getByText(/select file/)).toBeDisabled();
    await waitFor(() =>
      expect(getByText(/Water charge ID not configured!/i)).toBeInTheDocument()
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
    } = renderWithProviderAndRouterAndRestful(
      <WaterReadingView />,
      base,
      store => {
        store.dispatch(
          settingActions.init([
            {
              key: SETTING_KEYS.WATER_CHARGE_ID,
              value: waterChargeId.toString(),
            },
          ])
        );
      }
    );

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
