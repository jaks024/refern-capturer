export interface CreateImageDto {
  name: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  uploaderUserId: string;
  parentCollectionId: string;
  tags: string[];

  metadata: {
    fileName: string;
    type: string;
    size: number;
  };

  transform: {
    angle: number;
    flipX: boolean;
    flipY: boolean;
    scaleX: number;
    scaleY: number;
    brightness: number;
    saturation: number;
    contrast: number;
  };

  // actual image data
  arrayBufferBase64: string;
  thumbnailArrayBufferBase64: string;
}

export interface ImageData {
  id: string;
  data: CreateImageDto;
}

export interface ImageBatch {
  id: string;
  images: ImageData[];
  collectionId: string;
  collectionName: string;
}

export interface UploadResponse {
  batchId: string;
  success: boolean;
  queuedImageId: string;
}
