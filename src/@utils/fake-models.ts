import faker from 'faker';

import {AuthProfile, AuthResult, ProfileType} from '../Api';

export function generateFakeProfile(type?: ProfileType): AuthProfile {
  return {
    name: faker.name.findName(),
    username: faker.random.words(1),
    id: faker.datatype.number(),
    email: faker.internet.email(),
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
