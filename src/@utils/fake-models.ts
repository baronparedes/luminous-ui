import faker from 'faker';

import {
  AuthProfile,
  AuthResult,
  ProfileType,
  PropertyAttr,
  RecordStatus,
} from '../Api';

export function generateFakeProfile(type?: ProfileType): AuthProfile {
  return {
    name: faker.name.findName(),
    username: faker.random.words(1),
    id: faker.datatype.number(),
    email: faker.internet.email(),
    status: faker.random.arrayElement<RecordStatus>(['active', 'inactive']),
    type:
      type ??
      faker.random.arrayElement<ProfileType>(['user', 'stakeholder', 'admin']),
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
