import { ElectronAPI } from '@electron-toolkit/preload';

interface ImageCache {
  id: string;
  base64: string;
}
interface Source {
  id: string;
  name: string;
}

declare global {
  interface API {
    getSources: () => Promise<Source[]>;

    hasNewCapture: () => Promise<boolean>;
    getAllCaptureBuffer: () => Promise<ImageCache[]>;
    deleteCaptures: (imageIds: string[]) => void;

    setCaptureKeybind: (keybind: string) => Promise<boolean>;
    getCaptureKeybind: () => Promise<string>;
    captureSource: () => Promise<true>;
    setCaptureSource: (newSource: string) => void;
  }
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}
