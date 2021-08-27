import faker from 'faker';

import {AuthProfile, AuthResult, ProfileType} from '../Api';

export function generateFakeProfile(type: ProfileType = 'user'): AuthProfile {
  return {
    name: faker.name.findName(),
    username: faker.random.words(1),
    id: faker.datatype.number(),
    type,
  };
}

export function generateFakeAuthResult(): AuthResult {
  return {
    profile: generateFakeProfile(),
    token: faker.random.alphaNumeric(100),
  };
}
