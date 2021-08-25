import faker from 'faker';

import {AuthResult, Profile} from '../Api';

export function generateFakeProfile(): Profile {
  return {
    name: faker.name.findName(),
    username: faker.random.words(1),
    id: faker.datatype.number(),
  };
}

export function generateFakeAuthResult(): AuthResult {
  return {
    profile: generateFakeProfile(),
    token: faker.random.alphaNumeric(100),
  };
}
