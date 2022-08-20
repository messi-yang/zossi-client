import { gzipSync, gunzipSync } from 'zlib';

export async function ungzipBlob(gzippedBlob: Blob): Promise<Blob> {
  const gzippedBlobBuffer = Buffer.from(await gzippedBlob.arrayBuffer());
  const ungzippedBuffer = gunzipSync(gzippedBlobBuffer);
  const ungzippedBlob = new Blob([ungzippedBuffer]);
  return ungzippedBlob;
}

export async function gzipBlob(ungzippedBlob: Blob): Promise<Blob> {
  const ungzippedBlobBuffer = Buffer.from(await ungzippedBlob.arrayBuffer());
  const gzippedBuffer = gzipSync(ungzippedBlobBuffer);
  const gzippedBlob = new Blob([gzippedBuffer]);
  return gzippedBlob;
}

export default {};
