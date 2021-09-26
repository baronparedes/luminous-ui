import nock from 'nock';

import {generateFakeSetting} from '../../@utils/fake-models';
import {renderHookWithProviderAndRestful} from '../../@utils/test-renderers';
import {useInitSettings} from '../useInitSettings';

describe('useInitSettings', () => {
  const base = 'http://localhost';

  it('should initialize settings to store', async () => {
    const settings = [generateFakeSetting(), generateFakeSetting()];

    nock(base).get('/api/setting/getAll').reply(200, settings);

    const {waitForNextUpdate, store} = renderHookWithProviderAndRestful(
      () => useInitSettings(),
      base
    );

    expect(store.getState().setting.values.length).toEqual(0);
    await waitForNextUpdate();
    expect(store.getState().setting.values).toEqual(settings);
  });
});
