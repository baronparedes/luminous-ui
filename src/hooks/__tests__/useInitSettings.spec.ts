import nock from 'nock';

import {waitFor} from '@testing-library/react';

import {
  generateFakeCategory,
  generateFakeSetting,
} from '../../@utils/fake-models';
import {renderHookWithProviderAndRestful} from '../../@utils/test-renderers';
import {useInitSettings} from '../useInitSettings';

describe('useInitSettings', () => {
  const base = 'http://localhost';

  it('should initialize settings to store', async () => {
    const settings = [generateFakeSetting(), generateFakeSetting()];
    const categories = [generateFakeCategory(), generateFakeCategory()];

    nock(base).get('/api/setting/getAll').reply(200, settings);
    nock(base).get('/api/setting/getAllCategories').reply(200, categories);

    const {store} = renderHookWithProviderAndRestful(
      () => useInitSettings(),
      base
    );

    await waitFor(() => {
      expect(store.getState().setting.values).toEqual(settings);
      expect(store.getState().setting.categories).toEqual(categories);
    });
  });
});
