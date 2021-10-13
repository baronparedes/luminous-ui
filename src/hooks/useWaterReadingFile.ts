import {useEffect, useState} from 'react';
import readXlsxFile from 'read-excel-file';

import {ApprovedAny} from '../@types';

type SheetData = {
  name: string;
};

export type WaterReadingData = {
  unitNumber: string | null;
  previousReading: number | null;
  presentReading: number | null;
  rate: number | null;
};

export function useWaterReadingFile(file?: File, selectedSheet?: string) {
  const [sheets, setSheets] = useState<string[]>([]);
  const [data, setData] = useState<WaterReadingData[]>([]);

  const getRowData = (offset: number, row: ApprovedAny) => {
    const unitNumberCol = 1 + offset;
    const prevReadingCol = 2 + offset;
    const presReadingCol = 3 + offset;
    const rateCol = 6 + offset;

    const unitData: WaterReadingData = {
      unitNumber: row[unitNumberCol] as string | null,
      previousReading: Number(row[prevReadingCol]),
      presentReading: Number(row[presReadingCol]),
      rate: parseFloat(row[rateCol]),
    };
    return unitData;
  };

  const isValidData = (rowData: WaterReadingData) => {
    return (
      rowData.unitNumber !== null &&
      rowData.unitNumber !== '' &&
      rowData.unitNumber.toLowerCase() !== 'total' &&
      rowData.unitNumber.toLowerCase() !== 'unit_no'
    );
  };

  useEffect(() => {
    if (file) {
      const opts: ApprovedAny = {
        getSheets: true,
      };
      readXlsxFile(file, opts)
        .then(sheets => {
          // typings from the library are missing
          const result = sheets as ApprovedAny as SheetData[];
          setSheets(result.map(r => r.name));
        })
        .catch(() => {
          setSheets([]);
        });
    } else {
      setSheets([]);
    }
  }, [file]);

  useEffect(() => {
    if (file && selectedSheet) {
      readXlsxFile(file, {
        sheet: selectedSheet,
      })
        .then(data => {
          const result: WaterReadingData[] = [];
          for (const row of data) {
            const unitData1 = getRowData(0, row);
            const unitData2 = getRowData(8, row);
            if (isValidData(unitData1)) {
              result.push(unitData1);
            }
            if (isValidData(unitData2)) {
              result.push(unitData2);
            }
          }
          setData(result);
        })
        .catch(() => {
          setData([]);
        });
    } else {
      setData([]);
    }
  }, [file, selectedSheet]);

  return {
    sheets,
    data,
  };
}
