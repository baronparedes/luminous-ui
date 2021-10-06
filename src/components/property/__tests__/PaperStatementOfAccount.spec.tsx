import {toTransactionPeriod} from '../../../@utils/dates';
import {renderWithProvider} from '../../../@utils/test-renderers';
import {PropertyAccount, SettingAttr} from '../../../Api';
import {SETTING_KEYS} from '../../../constants';
import {settingActions} from '../../../store/reducers/setting.reducer';
import PaperStatementOfAccount from '../PaperStatementOfAccount';

describe('PaperStatementOfAccount', () => {
  const propertyAccount: PropertyAccount = {
    balance: 2000,
    propertyId: 1,
    property: {
      id: 1,
      code: 'G-111',
      address: 'Pasig City Philippines',
      floorArea: 33.1,
      status: 'active',
    },
    transactions: [
      {
        amount: 1000,
        chargeId: 1,
        propertyId: 1,
        transactionPeriod: toTransactionPeriod(2021, 'SEP').toString(),
        transactionType: 'charged',
        charge: {
          code: 'DUES',
          rate: 50,
          communityId: 1,
          chargeType: 'unit',
          postingType: 'monthly',
        },
      },
      {
        amount: 500,
        chargeId: 1,
        propertyId: 1,
        transactionPeriod: toTransactionPeriod(2021, 'SEP').toString(),
        transactionType: 'collected',
        paymentDetailId: 1,
        charge: {
          code: 'DUES',
          rate: 50,
          communityId: 1,
          chargeType: 'unit',
          postingType: 'monthly',
        },
      },
      {
        amount: 300,
        chargeId: 1,
        propertyId: 1,
        transactionPeriod: toTransactionPeriod(2021, 'SEP').toString(),
        transactionType: 'collected',
        paymentDetailId: 2,
        charge: {
          code: 'DUES',
          rate: 50,
          communityId: 1,
          chargeType: 'unit',
          postingType: 'monthly',
        },
      },
    ],
    paymentDetails: [
      {
        id: 1,
        collectedBy: 1,
        orNumber: '1234-1234',
        paymentType: 'cash',
      },
      {
        id: 2,
        collectedBy: 1,
        orNumber: '1234-1234',
        paymentType: 'check',
        checkIssuingBank: 'BDO',
        checkNumber: '111-111-000',
        checkPostingDate: '2021-09-09',
      },
    ],
    assignedProfiles: [
      {
        email: 'JohnDoe@email.com',
        password: '',
        status: 'active',
        type: 'unit owner',
        username: 'johndoe',
        name: 'John Doe',
      },
    ],
  };

  const settings: SettingAttr[] = [
    {
      key: SETTING_KEYS.SOA_NOTES,
      value: '<h1>SOA Notes</h1>',
    },
  ];

  it('should render', () => {
    const {asFragment} = renderWithProvider(
      <PaperStatementOfAccount
        year={2021}
        month={'SEP'}
        propertyAccount={propertyAccount}
      />,
      store => store.dispatch(settingActions.init(settings))
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
