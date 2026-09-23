import * as XLSX from 'xlsx';

export interface ParsedRosterPlayer {
  id?: string;
  serial_number?: string;
  player_name: string;
  number: string;
  size: string;
  top_size?: string;
  bottom_size?: string;
  qty: number;
  role_note?: string;
}

const normalizeSize = (rawSize: any): string => {
  if (!rawSize) return 'M';
  const s = String(rawSize).trim().toUpperCase();
  if (s === 'EXTRA SMALL' || s === 'X-SMALL' || s === 'XSMALL') return 'XS';
  if (s === 'SMALL') return 'S';
  if (s === 'MEDIUM' || s === 'MED') return 'M';
  if (s === 'LARGE') return 'L';
  if (s === 'EXTRA LARGE' || s === 'X-LARGE' || s === 'XLARGE') return 'XL';
  if (s === 'DOUBLE XL' || s === '2X-LARGE' || s === '2XLARGE' || s === 'XXL') return '2XL';
  if (s === '3XL' || s === 'XXXL' || s === '3X-LARGE') return '3XL';
  return s;
};

export function parseRosterExcel(
  fileInput: ArrayBuffer | Uint8Array | Buffer | string
): ParsedRosterPlayer[] {
  try {
    let workbook: XLSX.WorkBook;

    if (typeof fileInput === 'string') {
      const base64Data = fileInput.includes(',') ? fileInput.split(',')[1] : fileInput;
      workbook = XLSX.read(base64Data, { type: 'base64' });
    } else {
      workbook = XLSX.read(fileInput, { type: 'array' });
    }

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return [];
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    if (!worksheet) return [];

    const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
    if (!rawRows || rawRows.length === 0) return [];

    let headerRowIndex = -1;
    let nameCol = -1;
    let numCol = -1;
    let topSizeCol = -1;
    let bottomSizeCol = -1;
    let serialCol = -1;

    for (let r = 0; r < Math.min(rawRows.length, 10); r++) {
      const row = rawRows[r];
      if (!Array.isArray(row)) continue;

      for (let c = 0; c < row.length; c++) {
        const cell = String(row[c] || '').toLowerCase().trim();
        if (cell.includes('serial') || cell === 'sr' || cell === 'sr#' || cell === 'sr.') {
          serialCol = c;
        }
        if (cell.includes('name') || cell.includes('player')) {
          nameCol = c;
        }
        if (cell.includes('number') || cell === 'no' || cell === 'no.' || cell === '#' || cell === 'num') {
          numCol = c;
        }
        if (cell.includes('top size') || cell === 'top' || (cell.includes('shirt') && cell.includes('size')) || cell === 'size') {
          topSizeCol = c;
        }
        if (cell.includes('bottom size') || cell === 'bottom' || (cell.includes('trouser') && cell.includes('size')) || (cell.includes('short') && cell.includes('size'))) {
          bottomSizeCol = c;
        }
      }

      if (nameCol !== -1 && (numCol !== -1 || topSizeCol !== -1)) {
        headerRowIndex = r;
        break;
      }
    }

    if (headerRowIndex === -1) {
      headerRowIndex = 0;
      serialCol = 0;
      nameCol = 1;
      numCol = 2;
      topSizeCol = 3;
      bottomSizeCol = 4;
    }

    const players: ParsedRosterPlayer[] = [];

    for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!Array.isArray(row) || row.length === 0) continue;

      const rawSerial = serialCol >= 0 ? String(row[serialCol] || '').trim() : '';
      const rawName = nameCol >= 0 ? String(row[nameCol] || '').trim() : '';
      const rawNum = numCol >= 0 ? String(row[numCol] || '').trim() : '';
      const rawTopSize = topSizeCol >= 0 ? String(row[topSizeCol] || '').trim() : '';
      const rawBottomSize = bottomSizeCol >= 0 ? String(row[bottomSizeCol] || '').trim() : '';

      if (!rawName && !rawNum) continue;
      if (
        rawSerial.toLowerCase().includes('example') ||
        rawName.toLowerCase().includes('example') ||
        (rawName.toLowerCase() === 'john' && rawNum === '9')
      ) {
        continue;
      }

      const topSize = normalizeSize(rawTopSize);
      const bottomSize = normalizeSize(rawBottomSize);

      players.push({
        id: `player-${r}`,
        serial_number: rawSerial || String(players.length + 1),
        player_name: rawName || `PLAYER ${players.length + 1}`,
        number: rawNum,
        size: topSize || bottomSize || 'M',
        top_size: topSize,
        bottom_size: bottomSize,
        qty: 1,
      });
    }

    return players;
  } catch (err) {
    console.error('Error parsing roster excel:', err);
    return [];
  }
}
