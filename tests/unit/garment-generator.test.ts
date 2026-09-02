import { describe, it, expect } from 'vitest';
import {
  formatColorDescription,
  buildGarmentPrompts,
  generateDualMockupUrls,
} from '@/lib/ai/garment-generator';

describe('AI Garment Synthesis & Prompt Engine', () => {
  it('formats hex colors into descriptive apparel shades', () => {
    expect(formatColorDescription('#111111')).toBe('matte jet black');
    expect(formatColorDescription('#DC2626')).toBe('crimson athletic red');
    expect(formatColorDescription('#F5F5F0')).toBe('optical white');
    expect(formatColorDescription('#84CC16')).toBe('fluorescent neon lime');
  });

  it('builds front and back prompts with correct camera perspective directives', () => {
    const { promptFront, promptBack } = buildGarmentPrompts({
      garmentType: 'Heavyweight Pullover Hoodie',
      materialVariant: '400 GSM French Terry Fleece',
      primaryColor: '#111111',
      accentColor: '#F5F5F0',
      designNotes: 'Neon green piping along sleeves and double-layer hood',
      logoPlacement: 'Left Chest',
      hasUploadedLogo: true,
    });

    expect(promptFront).toContain('FRONT VIEW');
    expect(promptFront).toContain('Heavyweight Pullover Hoodie');
    expect(promptFront).toContain('matte jet black');
    expect(promptFront).toContain('Left Chest');

    expect(promptBack).toContain('BACK REAR VIEW');
    expect(promptBack).toContain('Heavyweight Pullover Hoodie');
  });

  it('generates valid dual mockup URLs for front and back images', () => {
    const result = generateDualMockupUrls(
      {
        garmentType: 'Pro Performance Jersey',
        materialVariant: 'AeroVent™ Micro-Mesh',
        primaryColor: '#2563EB',
        accentColor: '#F5F5F0',
        designNotes: 'Sublimated chevron pattern',
      },
      12345
    );

    expect(result.frontUrl).toContain('/api/ai/preview?prompt=');
    expect(result.frontUrl).toContain('seed=12345');
    expect(result.backUrl).toContain('/api/ai/preview?prompt=');
    expect(result.backUrl).toContain('seed=12346');
    expect(result.timestamp).toBeTypeOf('number');
  });
});
