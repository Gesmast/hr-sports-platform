import * as THREE from 'three';

export interface UVPlacementConfig {
  x: number;      // 0.0 to 1.0 (normalized UV X)
  y: number;      // 0.0 to 1.0 (normalized UV Y)
  width: number;  // normalized width
  height: number; // normalized height
  rotation?: number; // radians
}

export const UV_ZONE_PRESETS: Record<string, UVPlacementConfig> = {
  'Chest Center': { x: 0.5, y: 0.62, width: 0.28, height: 0.28 },
  'Left Chest (Embroidered)': { x: 0.36, y: 0.68, width: 0.16, height: 0.16 },
  'Full Back Print': { x: 0.5, y: 0.62, width: 0.36, height: 0.36 },
  'Left Sleeve Badge': { x: 0.18, y: 0.50, width: 0.14, height: 0.14 },
  'Right Sleeve Badge': { x: 0.82, y: 0.50, width: 0.14, height: 0.14 },
  'Collar Nape (Rear)': { x: 0.5, y: 0.88, width: 0.12, height: 0.12 },
};

/**
 * Composites base fabric colors, textile weave normal bumps, and user logo artwork
 * into a single unified 2048x2048 PBR UV texture map in real time.
 */
export async function compositeGarmentUVTexture(
  primaryColor: string,
  accentColor: string,
  silhouette: string,
  logoImage?: HTMLImageElement | null,
  placementZone: string = 'Chest Center'
): Promise<THREE.CanvasTexture> {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // 1. Base Primary Fabric Fill
  ctx.fillStyle = primaryColor || '#111111';
  ctx.fillRect(0, 0, size, size);

  // 2. Micro-Weave Textile PBR Grain Simulation
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  const step = 8;
  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      if ((x + y) % (step * 2) === 0) {
        ctx.fillRect(x, y, step / 2, step / 2);
      }
    }
  }

  // 3. Silhouette Seam & Accent Texture Zones (Style3D / Marvelous Designer UV Topology)
  ctx.fillStyle = accentColor || '#F5F5F0';

  // Bottom Hem Band
  ctx.fillRect(0, size - 140, size, 140);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, size - 140, size, 4); // Twin-needle seam shadow

  // Sleeve Cuff Accent Zones (Left & Right UV islands)
  ctx.fillStyle = accentColor || '#F5F5F0';
  ctx.fillRect(0, 0, 240, 90);
  ctx.fillRect(size - 240, 0, 240, 90);

  // Collar Piping Zone
  ctx.fillRect(size / 2 - 320, 0, 640, 80);

  // Silhouette Specific Details
  if (silhouette.toLowerCase().includes('hood')) {
    // Kangaroo Pocket UV Zone
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(size * 0.28, size * 0.58, size * 0.44, size * 0.26);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(size * 0.28, size * 0.58, size * 0.44, size * 0.26);
  } else if (silhouette.toLowerCase().includes('jersey')) {
    // Side Aerovent Mesh Panels
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, size * 0.2, 120, size * 0.6);
    ctx.fillRect(size - 120, size * 0.2, 120, size * 0.6);
  } else if (silhouette.toLowerCase().includes('jacket')) {
    // Front Zipper Placket UV Strip
    ctx.fillStyle = accentColor;
    ctx.fillRect(size / 2 - 16, 80, 32, size - 220);
  }

  // 4. Dynamic Logo Projection Mapping on UV Slots
  if (logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
    const config = UV_ZONE_PRESETS[placementZone] || UV_ZONE_PRESETS['Chest Center'];
    const targetW = size * config.width;
    const targetH = targetW * (logoImage.naturalHeight / logoImage.naturalWidth);
    const targetX = size * config.x - targetW / 2;
    const targetY = size * (1 - config.y) - targetH / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(logoImage, targetX, targetY, targetW, targetH);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.needsUpdate = true;

  return texture;
}
