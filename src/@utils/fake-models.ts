import faker from 'faker';

import {
  AuthProfile,
  AuthResult,
  ChargeAttr,
  ChargeType,
  PostingType,
  ProfileAttr,
  ProfileType,
  PropertyAccount,
  PropertyAssignmentAttr,
  PropertyAttr,
  RecordStatus,
  SettingAttr,
  TransactionAttr,
  TransactionType,
} from '../Api';
import {generateNumberedSeries} from './helpers';

export function generateFakeProfileAttr(type?: ProfileType): ProfileAttr {
  return {
    name: faker.name.findName(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    id: faker.datatype.number(),
    email: faker.internet.email(),
    mobileNumber: faker.phone.phoneNumber(),
    status: faker.random.arrayElement<RecordStatus>(['active', 'inactive']),
    type:
      type ??
      faker.random.arrayElement<ProfileType>([
        'unit owner',
        'stakeholder',
        'admin',
      ]),
  };
}

export function generateFakeProfile(type?: ProfileType): AuthProfile {
  return {
    name: faker.name.findName(),
    username: faker.random.words(1),
    id: faker.datatype.number(),
    email: faker.internet.email(),
    mobileNumber: faker.phone.phoneNumber(),
    status: faker.random.arrayElement<RecordStatus>(['active', 'inactive']),
    remarks: faker.random.words(),
    type:
      type ??
      faker.random.arrayElement<ProfileType>([
        'unit owner',
        'stakeholder',
        'admin',
      ]),
  };
}

export function generateFakeAuthResult(): AuthResult {
  return {
    profile: generateFakeProfile(),
    token: faker.random.alphaNumeric(100),
  };
}

export function generateFakeProperty(): PropertyAttr {
  return {
    id: faker.datatype.number(),
    code: faker.datatype.string(),
    floorArea: faker.datatype.number({precision: 2}),
    address: `${faker.address.cityName()} ${faker.address.country()}`,
    status: faker.random.arrayElement<RecordStatus>(['active', 'inactive']),
  };
}

export function generateFakePropertyAssignment(): PropertyAssignmentAttr {
  return {
    profileId: faker.datatype.number(),
    propertyId: faker.datatype.number(),
    profile: generateFakeProfileAttr(),
  };
}

export function generateFakeCharge(): ChargeAttr {
  return {
    chargeType: faker.random.arrayElement<ChargeType>([
      'amount',
      'percentage',
      'unit',
    ]),
    code: faker.random.words(),
    communityId: faker.datatype.number(),
    postingType: faker.random.arrayElement<PostingType>([
      'accrued',
      'manual',
      'monthly',
    ]),
    rate: faker.datatype.number(),
  };
}

export function generateFakeTransaction(): TransactionAttr {
  const charge = generateFakeCharge();
  return {
    amount: faker.datatype.number(),
    chargeId: faker.datatype.number(),
    propertyId: faker.datatype.number(),
    transactionPeriod: faker.date.recent().toDateString(),
    transactionType: faker.random.arrayElement<TransactionType>([
      'charged',
      'collected',
    ]),
    id: faker.datatype.number(),
    charge,
  };
}

export function generateFakePropertyAccount(
  transactionCount = 2
): PropertyAccount {
  const property = generateFakeProperty();
  const transactions = generateNumberedSeries(transactionCount).map(() =>
    generateFakeTransaction()
  );
  return {
    propertyId: Number(property.id),
    property,
    balance: faker.datatype.number(),
    transactions,
  };
}

export const generateFakeSetting = (): SettingAttr => {
  return {
    key: faker.random.word(),
    value: faker.random.words(),
  };
};
