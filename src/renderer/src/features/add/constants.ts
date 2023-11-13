import { CreateImageDto } from './types';

export const defaultCreateImageDto: CreateImageDto = {
  name: '',
  description: '',
  sourceName: '',
  sourceUrl: '',
  uploaderUserId: '',
  parentCollectionId: '',
  tags: [],
  metadata: {
    fileName: '',
    type: '',
    size: 0,
  },
  transform: {
    angle: 0,
    flipX: false,
    flipY: false,
    scaleX: 0.5,
    scaleY: 0.5,
    brightness: 0,
    saturation: 0,
    contrast: 0,
  },
  arrayBufferBase64: '',
  thumbnailArrayBufferBase64: '',
};
