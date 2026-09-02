import { describe, it, expect } from 'vitest';
import { generateIndividualizedSummary, generateUniformSummary, PlayerRosterRow } from '@/lib/pdf/roster-compiler';

describe('Roster Size Summary Compiler (OMTEX Bahrain Cricket Spec)', () => {
  it('correctly compiles individualized roster with player counts and blanks matching the sample sheet', () => {
    const sampleRoster: PlayerRosterRow[] = [
      // M players (3 players x 2 qty = 6)
      { player_name: 'Vedanta', number: '21', size: 'M', qty: 2 },
      { player_name: 'Sujay', number: '02', size: 'M', qty: 2 },
      { player_name: 'Suyash', number: '67', size: 'M', qty: 2 },

      // L players (5 players x 2 qty = 10)
      { player_name: 'Afzal', number: '804', size: 'L', qty: 2 },
      { player_name: 'Taj', number: '45', size: 'L', qty: 2 },
      { player_name: 'Maddy', number: '10', size: 'L', qty: 2 },
      { player_name: 'Mukhia', number: '18', size: 'L', qty: 2 },
      { player_name: 'Sunish', number: '55', size: 'L', qty: 2 },

      // XL players (8 players x 2 qty = 16)
      { player_name: 'Gautham', number: '23', size: 'XL', qty: 2 },
      { player_name: 'Abhi', number: '09', size: 'XL', qty: 2 },
      { player_name: 'Sid', number: '07', size: 'XL', qty: 2 },
      { player_name: 'Sabeer', number: '11', size: 'XL', qty: 2 },
      { player_name: 'Akram', number: '03', size: 'XL', qty: 2 },
      { player_name: 'Neeraj', number: '02', size: 'XL', qty: 2 },
      { player_name: 'Bharat', number: '12', size: 'XL', qty: 2 },
      { player_name: 'Hembo', number: '', size: 'XL', qty: 2, role_note: 'Technical Manager' },

      // 2XL players (3 players x 2 qty = 6)
      { player_name: 'Ahmed', number: '888', size: '2XL', qty: 2 },
      { player_name: 'Sukesh', number: '19', size: '2XL', qty: 2 },
      { player_name: 'Vishal', number: '33', size: '2XL', qty: 2 },
    ];

    const sampleBlanks = {
      S: 3,
      M: 3,
      L: 3,
      XL: 3,
    };

    const result = generateIndividualizedSummary(
      sampleRoster,
      sampleBlanks,
      'HALF SLEEVE T-SHRTS SIZES (EACH PLAYER 2 QTY)'
    );

    expect(result.lines).toContain('S - 3 (3 BLANK)');
    expect(result.lines).toContain('M - 9 (VEDANTA-21, SUJAY-02, SUYASH-67, 3 BLANK)');
    expect(result.lines).toContain('L - 13 (AFZAL-804, TAJ-45, MADDY-10, MUKHIA-18, SUNISH-55, 3 BLANK)');
    expect(result.lines).toContain(
      'XL - 19 (GAUTHAM-23, ABHI-09, SID-07, SABEER-11, AKRAM-03, NEERAJ-02, BHARAT-12, HEMBO-TECHNICAL MANAGER, 3 BLANK)'
    );
    expect(result.lines).toContain('2XL - 6 (AHMED-888, SUKESH-19, VISHAL-33)');
    expect(result.totalQty).toBe(50);
  });

  it('correctly compiles uniform order quantities matching Page 2 (Trousers)', () => {
    const trouserQty = {
      M: 4,
      L: 7,
      XL: 11,
      '2XL': 3,
    };

    const result = generateUniformSummary(trouserQty, "TROUSER SIZES (MEN'S)");

    expect(result.lines).toEqual([
      'M - 4 QTY',
      'L - 7 QTY',
      'XL - 11 QTY',
      '2XL - 3 QTY',
    ]);
    expect(result.totalQty).toBe(25);
  });
});
