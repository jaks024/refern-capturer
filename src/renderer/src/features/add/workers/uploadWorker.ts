import { ImageBatch, UploadResponse } from '../types';

export default () => {
  console.log('worker started');
  onmessage = async (e) => {
    const API_ROOT = e.data[0];
    const batch: ImageBatch = e.data[1];
    const AUTH_HEADER = e.data[2];
    console.log('STARTED UPLOAD', batch);
    if (batch) {
      for (const image of batch.images) {
        const response = await fetch(
          `${API_ROOT}/capturer/image/${image.data.parentCollectionId}`,
          {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              Authorization: AUTH_HEADER,
              'Content-Type': 'application/json',
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(image.data),
          },
        );
        const res: UploadResponse = {
          batchId: batch.id,
          queuedImageId: image.id,
          success: response.ok,
        };
        postMessage(res);
      }
    }
  };
};
