import fs from 'fs';

import {renderHook} from '@testing-library/react-hooks';

import {useWaterReadingFile} from '../useWaterReadingFile';

describe('useWaterReadingFile', () => {
  const fileName = `${__dirname}/@data/water_reading.xlsx`;

  it('should render', () => {
    const target = renderHook(() => useWaterReadingFile());
    expect(target.result.current.data).toEqual([]);
    expect(target.result.current.sheets).toEqual([]);
  });

  it('should render sheets', async () => {
    const stream = fs.readFileSync(fileName);
    const file = new File([stream], 'water_reading.xlsx');
    const target = renderHook(() => useWaterReadingFile(file));

    await target.waitForNextUpdate();

    expect(target.result.current.data).toEqual([]);
    expect(target.result.current.sheets).toEqual(['Sheet1']);
  });

  it('should render data from a selected sheet', async () => {
    const stream = fs.readFileSync(fileName);
    const file = new File([stream], 'water_reading.xlsx');
    const target = renderHook(() => useWaterReadingFile(file, 'Sheet1'));
    await target.waitForNextUpdate();
    expect(target.result.current).toMatchSnapshot();
  });
});
