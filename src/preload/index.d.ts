import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface ImageCache {
    id: string;
    base64: string;
  }
  interface Source {
    id: string;
    name: string;
  }
  interface ImageData {
    id: string;
    name: string;
    description: string;
    sourceName: string;
    sourceUrl: string;
    tags: string[];
    base64: string;
  }

  interface API {
    getSources: () => Promise<Source[]>;

    hasNewCapture: () => Promise<boolean>;
    getAllSavedCaptures: () => Promise<ImageData[]>;
    getAllShortcutCaptures: () => Promise<ImageData[]>;
    deleteCaptures: (imageIds: string[]) => Promise<void>;
    captureSource: () => Promise<ImageData>;
    setCaptureSource: (newSource: string) => Promise<void>;

    setCaptureKeybind: (keybind: string) => Promise<boolean>;
    getCaptureKeybind: () => Promise<string>;
  }
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}
