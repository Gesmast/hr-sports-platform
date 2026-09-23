export type SizeChartStandard = 'mens_export' | 'womens_export' | 'youth' | 'unisex';

export interface SizeChartEntry {
  size: string;
  topValue: string | number;
  bottomValue: string | number;
}

export const SIZE_CHART_PRESETS: Record<SizeChartStandard, { label: string; sizes: SizeChartEntry[] }> = {
  mens_export: {
    label: "MEN'S EXPORT",
    sizes: [
      { size: 'XS', topValue: 36, bottomValue: 28 },
      { size: 'S', topValue: 38, bottomValue: 30 },
      { size: 'M', topValue: 40, bottomValue: 32 },
      { size: 'L', topValue: 42, bottomValue: 34 },
      { size: 'XL', topValue: 44, bottomValue: 36 },
      { size: '2XL', topValue: 46, bottomValue: 38 },
      { size: '3XL', topValue: 48, bottomValue: 40 },
      { size: '4XL', topValue: 50, bottomValue: 42 },
    ],
  },
  womens_export: {
    label: "WOMEN'S EXPORT",
    sizes: [
      { size: 'XS', topValue: 32, bottomValue: 26 },
      { size: 'S', topValue: 34, bottomValue: 28 },
      { size: 'M', topValue: 36, bottomValue: 30 },
      { size: 'L', topValue: 38, bottomValue: 32 },
      { size: 'XL', topValue: 40, bottomValue: 34 },
      { size: '2XL', topValue: 42, bottomValue: 36 },
      { size: '3XL', topValue: 44, bottomValue: 38 },
      { size: '4XL', topValue: 46, bottomValue: 40 },
    ],
  },
  youth: {
    label: "YOUTH / KIDS",
    sizes: [
      { size: 'YS', topValue: 26, bottomValue: 22 },
      { size: 'YM', topValue: 28, bottomValue: 24 },
      { size: 'YL', topValue: 30, bottomValue: 26 },
      { size: 'YXL', topValue: 32, bottomValue: 28 },
    ],
  },
  unisex: {
    label: "UNISEX STANDARD",
    sizes: [
      { size: 'XS', topValue: 36, bottomValue: 28 },
      { size: 'S', topValue: 38, bottomValue: 30 },
      { size: 'M', topValue: 40, bottomValue: 32 },
      { size: 'L', topValue: 42, bottomValue: 34 },
      { size: 'XL', topValue: 44, bottomValue: 36 },
      { size: '2XL', topValue: 46, bottomValue: 38 },
      { size: '3XL', topValue: 48, bottomValue: 40 },
      { size: '4XL', topValue: 50, bottomValue: 42 },
    ],
  },
};

export const DEFAULT_SIZES_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
