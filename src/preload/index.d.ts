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
  interface CacheData {
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
    getAllSavedCaptures: () => Promise<CacheData[]>;
    getAllShortcutCaptures: () => Promise<CacheData[]>;
    deleteCaptures: (imageIds: string[]) => Promise<void>;
    captureSource: () => Promise<CacheData>;
    setCaptureSource: (newSource: string) => Promise<void>;
    updateCacheRaw: (id: string, raw: string) => Promise<void>;
    updateCacheMeta: (data: CacheData) => Promise<void>;

    setCaptureKeybind: (keybind: string) => Promise<boolean>;
    getCaptureKeybind: () => Promise<string>;
    setSnipKeybind: (keybind: string) => Promise<boolean>;
    getSnipKeybind: () => Promise<string>;
  }
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}
