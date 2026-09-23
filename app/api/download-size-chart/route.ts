import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REGION_FILENAMES: Record<string, { file: string; downloadName: string }> = {
  asian: { file: 'asian_chart.jpeg', downloadName: 'Asian_Size_Chart.jpeg' },
  uk: { file: 'uk_chart.jpeg', downloadName: 'UK_Size_Chart.jpeg' },
  us: { file: 'us_chart.jpeg', downloadName: 'US_Size_Chart.jpeg' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = (searchParams.get('region') || 'asian').toLowerCase();

  const config = REGION_FILENAMES[region] || REGION_FILENAMES.asian;
  const filePath = path.join(process.cwd(), 'public', 'size-charts', config.file);

  try {
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="${config.downloadName}"`,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    const r2Url = `https://pub-6a38698c8f7d411694afe9e4dd678660.r2.dev/Size%20Charts/${region === 'asian' ? 'Asian' : region.toUpperCase()}%20Size%20Chart.jpeg`;
    const res = await fetch(r2Url);
    if (!res.ok) {
      return new NextResponse('Size chart not found', { status: 404 });
    }
    const blob = await res.arrayBuffer();
    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${config.downloadName}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error serving size chart download:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
