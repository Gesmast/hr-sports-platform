// @ts-ignore
import GIFEncoder from 'gif-encoder-2';

// 5x7 Bitmap representation for digits 0-9 and special characters
const FONT_5X7: Record<string, number[]> = {
  '0': [0x1F, 0x11, 0x11, 0x11, 0x1F],
  '1': [0x00, 0x02, 0x1F, 0x00, 0x00],
  '2': [0x17, 0x15, 0x15, 0x15, 0x1D],
  '3': [0x11, 0x15, 0x15, 0x15, 0x1F],
  '4': [0x07, 0x04, 0x04, 0x1F, 0x04],
  '5': [0x1D, 0x15, 0x15, 0x15, 0x17],
  '6': [0x1F, 0x15, 0x15, 0x15, 0x17],
  '7': [0x01, 0x01, 0x1D, 0x03, 0x01],
  '8': [0x1F, 0x15, 0x15, 0x15, 0x1F],
  '9': [0x1D, 0x15, 0x15, 0x15, 0x1F],
  ':': [0x00, 0x0A, 0x00, 0x00, 0x00],
  ' ': [0x00, 0x00, 0x00, 0x00, 0x00],
  'E': [0x1F, 0x15, 0x15, 0x11, 0x11],
  'X': [0x1B, 0x04, 0x04, 0x1B, 0x00],
  'P': [0x1F, 0x05, 0x05, 0x05, 0x02],
  'I': [0x11, 0x1F, 0x11, 0x00, 0x00],
  'R': [0x1F, 0x05, 0x0D, 0x17, 0x00],
  'D': [0x1F, 0x11, 0x11, 0x0E, 0x00],
  'H': [0x1F, 0x04, 0x04, 0x04, 0x1F],
  'M': [0x1F, 0x02, 0x04, 0x02, 0x1F],
  'S': [0x12, 0x15, 0x15, 0x15, 0x09],
};

function drawChar(
  pixels: Uint8Array,
  width: number,
  height: number,
  char: string,
  startX: number,
  startY: number,
  scale: number,
  r: number,
  g: number,
  b: number
) {
  const glyph = FONT_5X7[char.toUpperCase()] || FONT_5X7[' '];
  for (let col = 0; col < glyph.length; col++) {
    const colVal = glyph[col];
    for (let row = 0; row < 7; row++) {
      if ((colVal >> (6 - row)) & 1) {
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const px = startX + col * scale + dx;
            const py = startY + row * scale + dy;
            if (px >= 0 && px < width && py >= 0 && py < height) {
              const idx = (py * width + px) * 4;
              pixels[idx] = r;
              pixels[idx + 1] = g;
              pixels[idx + 2] = b;
              pixels[idx + 3] = 255;
            }
          }
        }
      }
    }
  }
}

function drawString(
  pixels: Uint8Array,
  width: number,
  height: number,
  text: string,
  startX: number,
  startY: number,
  scale: number,
  r: number,
  g: number,
  b: number
) {
  let curX = startX;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    drawChar(pixels, width, height, char, curX, startY, scale, r, g, b);
    curX += (5 * scale) + (char === ':' ? 2 : scale);
  }
}

/**
 * Generate an animated GIF countdown timer for emails.
 * Renders 10 frames (1 frame per second).
 */
export function generateCountdownGif(expiryDate: Date): Buffer {
  const width = 360;
  const height = 64;

  const encoder = new GIFEncoder(width, height);
  encoder.start();
  encoder.setRepeat(0); // loop forever
  encoder.setDelay(1000); // 1 second per frame
  encoder.setQuality(10);

  const numFrames = 10;
  const targetMs = expiryDate.getTime();

  for (let f = 0; f < numFrames; f++) {
    const nowMs = Date.now() + (f * 1000);
    const diffSeconds = Math.max(0, Math.floor((targetMs - nowMs) / 1000));

    const hours = Math.floor(diffSeconds / 3600);
    const mins = Math.floor((diffSeconds % 3600) / 60);
    const secs = diffSeconds % 60;

    const frame = new Uint8Array(width * height * 4);

    // Background fill: Sleek Dark Slate #18181B
    for (let i = 0; i < frame.length; i += 4) {
      frame[i] = 24;
      frame[i + 1] = 24;
      frame[i + 2] = 27;
      frame[i + 3] = 255;
    }

    // Border line: #27272A
    for (let x = 0; x < width; x++) {
      const topIdx = x * 4;
      const botIdx = ((height - 1) * width + x) * 4;
      frame[topIdx] = 39; frame[topIdx + 1] = 39; frame[topIdx + 2] = 42;
      frame[botIdx] = 39; frame[botIdx + 1] = 39; frame[botIdx + 2] = 42;
    }
    for (let y = 0; y < height; y++) {
      const leftIdx = (y * width) * 4;
      const rightIdx = (y * width + (width - 1)) * 4;
      frame[leftIdx] = 39; frame[leftIdx + 1] = 39; frame[leftIdx + 2] = 42;
      frame[rightIdx] = 39; frame[rightIdx + 1] = 39; frame[rightIdx + 2] = 42;
    }

    if (diffSeconds <= 0) {
      // EXPIRED STATE
      drawString(frame, width, height, 'PRICE LOCK EXPIRED', 54, 22, 3, 239, 68, 68);
    } else {
      // Active Countdown
      // Subtitle: "OFFICIAL 24-HOUR PRICE LOCK"
      drawString(frame, width, height, 'PRICE LOCK EXPIRES IN', 86, 10, 1, 161, 161, 170);

      // Digits: HH : MM : SS
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(mins).padStart(2, '0');
      const sStr = String(secs).padStart(2, '0');

      const timeStr = `${hStr} : ${mStr} : ${sStr}`;
      drawString(frame, width, height, timeStr, 76, 28, 3, 16, 185, 129); // Emerald #10B981

      // Unit indicators
      drawString(frame, width, height, 'HRS', 88, 52, 1, 113, 113, 122);
      drawString(frame, width, height, 'MIN', 166, 52, 1, 113, 113, 122);
      drawString(frame, width, height, 'SEC', 244, 52, 1, 113, 113, 122);
    }

    encoder.addFrame(frame);
  }

  encoder.finish();
  return encoder.out.getData();
}
