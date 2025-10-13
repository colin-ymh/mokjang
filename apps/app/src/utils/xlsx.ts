import * as XLSX from 'xlsx';

/**
 * XLSX 파일을 object[] 배열로 변환
 * - 첫 번째 행은 버리고
 * - 두 번째 행을 컬럼명(header)으로 사용
 * - 모든 값은 문자열(string)로 변환
 * - 날짜는 엑셀 셀에 보이는 문자열 그대로 유지
 * - ⚡ '음력', '윤달' 컬럼은 값이 각각 '음력', '윤달'이면 true, 아니면 false
 * - ⚡ '음력', '윤달'이 비어 있더라도 false로 명시
 * - ⚡ 완전히 비어 있는 행은 제외
 */
export async function getMembersFromXlsx(
  xlsxFile: File
): Promise<Record<string, string | boolean>[]> {
  const buf = await xlsxFile.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });

  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error('엑셀에 시트가 없습니다.');

  const ws = wb.Sheets[sheetName];

  const rows: any[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: null,
    raw: false,
  });

  if (rows.length < 2) {
    throw new Error('두 번째 행이 존재하지 않아 컬럼명을 추출할 수 없습니다.');
  }

  // 첫 행 제거
  const rowsWithoutFirst = rows.slice(1);

  // 두 번째 행을 헤더로 사용
  const headers = rowsWithoutFirst[0].map((h: any) =>
    h !== undefined && h !== null ? String(h).trim() : ''
  );

  const dataRows = rowsWithoutFirst.slice(1);

  // ⚡ 변환 로직
  const objects: Record<string, string | boolean>[] = dataRows
    .map((row) => {
      const obj: Record<string, string | boolean> = {};
      headers.forEach((header, idx) => {
        const cell = row[idx];
        const value = cell == null ? '' : String(cell).trim();

        if (header === '음력') {
          obj[header] = value === '음력'; // 값이 없으면 false
        } else if (header === '윤달') {
          obj[header] = value === '윤달'; // 값이 없으면 false
        } else if (value !== '') {
          obj[header] = value;
        }
      });

      // ⚡ 완전히 비어 있는 행(음력/윤달만 false인 경우도 포함)은 제외
      const meaningfulKeys = Object.entries(obj).filter(([key, val]) => {
        // 음력/윤달 false만 있는 경우 제외
        if ((key === '음력' || key === '윤달') && val === false) return false;
        return true;
      });

      return meaningfulKeys.length > 0 ? obj : null;
    })
    .filter((obj): obj is Record<string, string | boolean> => obj !== null);

  return objects;
}
