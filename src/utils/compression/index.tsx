import { gunzipSync } from 'zlib';

export async function ungzipBlob(gzippedBlob: Blob): Promise<Blob> {
  const gzippedBlobBuffer = Buffer.from(await gzippedBlob.arrayBuffer());
  const unzippedBuffer = gunzipSync(gzippedBlobBuffer);
  const unzippedBlob = new Blob([unzippedBuffer]);
  return unzippedBlob;
}

export default {};
