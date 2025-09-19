import * as XLSX from 'xlsx';

/**
 * XLSX 파일을 object[] 배열로 변환
 * - 첫 번째 행은 버리고
 * - 두 번째 행을 컬럼명(header)으로 사용
 * - 모든 값은 문자열(string)로 변환
 * - 날짜는 엑셀 셀에 보이는 문자열 그대로 유지
 */
export async function getMembersFromXlsx(
  xlsxFile: File
): Promise<Record<string, string>[]> {
  const buf = await xlsxFile.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });

  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error('엑셀에 시트가 없습니다.');

  const ws = wb.Sheets[sheetName];

  // ✅ header:1 → 2차원 배열로 가져오되 raw:false로 표시값 유지
  const rows: any[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: null,
    raw: false, // ✨ 셀 서식 그대로 문자열 반환 (날짜 포함)
  });

  if (rows.length < 2) {
    throw new Error('두 번째 행이 존재하지 않아 컬럼명을 추출할 수 없습니다.');
  }

  // 첫 행 제거
  const rowsWithoutFirst = rows.slice(1);

  // 두 번째 행을 컬럼명으로 사용
  const headers = rowsWithoutFirst[0].map((h: any) =>
    h !== undefined && h !== null ? String(h) : ''
  );

  // 데이터 행 -> object[]
  const dataRows = rowsWithoutFirst.slice(1);
  const objects: Record<string, string>[] = dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      const cell = row[idx];
      obj[header] = cell == null ? '' : String(cell);
    });
    return obj;
  });

  return objects;
}
