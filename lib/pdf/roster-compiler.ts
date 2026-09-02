import { DEFAULT_SIZES_ORDER } from './size-charts';

export interface PlayerRosterRow {
  id?: string;
  player_name: string;
  number: string;
  size: string;
  qty: number;
  role_note?: string | null;
}

export interface SizeSummaryResult {
  title: string;
  lines: string[];
  totalQty: number;
}

/**
 * Generates the individualized roster size summary lines matching OMTEX spec sheet conventions.
 * Example output:
 * "L - 13 (AFZAL-804, TAJ-45, MADDY-10, MUKHIA-18, SUNISH-55, 3 BLANK)"
 */
export function generateIndividualizedSummary(
  roster: PlayerRosterRow[],
  blanksBySize: Record<string, number> = {},
  garmentTitle: string = 'HALF SLEEVE T-SHRTS SIZES (EACH PLAYER 2 QTY)',
  customSizesOrder: string[] = DEFAULT_SIZES_ORDER
): SizeSummaryResult {
  const grouped: Record<string, { items: string[]; qty: number }> = {};

  customSizesOrder.forEach((sz) => {
    grouped[sz.toUpperCase()] = { items: [], qty: 0 };
  });

  // Group roster players
  roster.forEach((player) => {
    const sz = (player.size || '').trim().toUpperCase();
    if (!grouped[sz]) {
      grouped[sz] = { items: [], qty: 0 };
    }

    const playerName = (player.player_name || '').trim().toUpperCase();
    const number = (player.number || '').trim().toUpperCase();
    const role = player.role_note ? player.role_note.trim().toUpperCase() : null;

    let label = '';
    if (role) {
      label = `${playerName}-${role}`;
    } else if (number) {
      label = `${playerName}-${number}`;
    } else {
      label = playerName || 'PLAYER';
    }

    const qty = Number(player.qty) > 0 ? Number(player.qty) : 2;
    grouped[sz].items.push(label);
    grouped[sz].qty += qty;
  });

  // Add blank units
  Object.entries(blanksBySize).forEach(([sz, count]) => {
    const sizeKey = sz.trim().toUpperCase();
    const blankCount = Number(count) || 0;
    if (blankCount > 0) {
      if (!grouped[sizeKey]) {
        grouped[sizeKey] = { items: [], qty: 0 };
      }
      grouped[sizeKey].items.push(`${blankCount} BLANK`);
      grouped[sizeKey].qty += blankCount;
    }
  });

  let totalQty = 0;
  const lines: string[] = [];

  // Iterate in standard size order
  const presentSizes = new Set([
    ...customSizesOrder.map((s) => s.toUpperCase()),
    ...Object.keys(grouped),
  ]);

  presentSizes.forEach((sz) => {
    const data = grouped[sz];
    if (data && data.qty > 0) {
      totalQty += data.qty;
      const details = data.items.length > 0 ? ` (${data.items.join(', ')})` : '';
      lines.push(`${sz} - ${data.qty}${details}`);
    }
  });

  return {
    title: garmentTitle,
    lines,
    totalQty,
  };
}

/**
 * Generates the uniform size summary lines matching OMTEX spec sheet conventions.
 * Example output:
 * "M - 4 QTY"
 * "L - 7 QTY"
 */
export function generateUniformSummary(
  qtyBySize: Record<string, number> = {},
  garmentTitle: string = "TROUSER SIZES (MEN'S)",
  customSizesOrder: string[] = DEFAULT_SIZES_ORDER
): SizeSummaryResult {
  let totalQty = 0;
  const lines: string[] = [];

  const presentSizes = new Set([
    ...customSizesOrder.map((s) => s.toUpperCase()),
    ...Object.keys(qtyBySize).map((s) => s.toUpperCase()),
  ]);

  presentSizes.forEach((sz) => {
    const matchedKey = Object.keys(qtyBySize).find((k) => k.toUpperCase() === sz);
    const count = matchedKey ? Number(qtyBySize[matchedKey]) || 0 : 0;
    if (count > 0) {
      totalQty += count;
      lines.push(`${sz} - ${count} QTY`);
    }
  });

  return {
    title: garmentTitle,
    lines,
    totalQty,
  };
}
