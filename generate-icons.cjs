// Script to generate proper PNG icons for PWA
const fs = require('fs');

function createPNG(width, height, r, g, b) {
  // Create a minimal valid PNG file
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  function crc32(buf) {
    let c = 0xFFFFFFFF;
    const table = [];
    for (let n = 0; n < 256; n++) {
      let cn = n;
      for (let k = 0; k < 8; k++) {
        cn = cn & 1 ? 0xEDB88320 ^ (cn >>> 1) : cn >>> 1;
      }
      table[n] = cn;
    }
    for (let i = 0; i < buf.length; i++) {
      c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeB = Buffer.from(type);
    const crcData = Buffer.concat([typeB, data]);
    const crcVal = Buffer.alloc(4);
    crcVal.writeUInt32BE(crc32(crcData), 0);
    return Buffer.concat([len, typeB, data, crcVal]);
  }
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  
  // IDAT chunk - raw image data
  // Each row: filter byte (0) + RGB pixels
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const px = rowOffset + 1 + x * 3;
      // Create a gradient effect for a nicer look
      const cx = (x / width - 0.5) * 2;
      const cy = (y / height - 0.5) * 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
      
      if (dist < 0.6) {
        // Inner circle - gradient from purple to blue
        const factor = dist / 0.6;
        rawData[px] = Math.floor(100 + factor * 30);     // R
        rawData[px + 1] = Math.floor(50 + factor * 50);  // G  
        rawData[px + 2] = Math.floor(200 + factor * 55); // B
      } else if (dist < 0.65) {
        // Border ring - white
        rawData[px] = 255;
        rawData[px + 1] = 255;
        rawData[px + 2] = 255;
      } else {
        // Background - dark
        rawData[px] = Math.floor(20 + (1 - dist) * 20);
        rawData[px + 1] = Math.floor(10 + (1 - dist) * 15);
        rawData[px + 2] = Math.floor(40 + (1 - dist) * 30);
      }
    }
  }
  
  // Compress with zlib (deflate)
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(rawData);
  
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate 192x192 icon
const png192 = createPNG(192, 192, 100, 50, 200);
fs.writeFileSync('public/pwa-192x192.png', png192);
console.log('Created pwa-192x192.png (' + png192.length + ' bytes)');

// Generate 512x512 icon
const png512 = createPNG(512, 512, 100, 50, 200);
fs.writeFileSync('public/pwa-512x512.png', png512);
console.log('Created pwa-512x512.png (' + png512.length + ' bytes)');

// Generate a screenshot (1280x720 for PWABuilder)
const screenshot = createPNG(1280, 720, 30, 20, 60);
fs.writeFileSync('public/screenshot-wide.png', screenshot);
console.log('Created screenshot-wide.png (' + screenshot.length + ' bytes)');

console.log('Done! All PNG icons generated successfully.');
