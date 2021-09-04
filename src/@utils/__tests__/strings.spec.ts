import {getInitials} from '../strings';

describe('strings', () => {
  it.each`
    name                     | expected
    ${'George W Bush'}       | ${'GB'}
    ${'George Wash A. Bush'} | ${'GB'}
    ${'George'}              | ${'G'}
  `('should return correct initials', ({name, expected}) => {
    const actual = getInitials(name);
    expect(actual).toEqual(expected);
  });
});
