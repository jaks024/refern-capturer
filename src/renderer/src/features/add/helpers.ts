import imageCompression from 'browser-image-compression';

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const createThumbnailBase64 = async (base64: string) => {
  const url = `data:image/png;base64, ${base64}`;
  const file = await imageCompression.getFilefromDataUrl(url, 'capture-thumbnail');

  const compressed = await imageCompression(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 700,
  });
  const thumbnailBuffer = await compressed.arrayBuffer();
  return arrayBufferToBase64(thumbnailBuffer);
};
