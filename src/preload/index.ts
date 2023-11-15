import { ipcRenderer, contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  getSources: () => ipcRenderer.invoke('get-sources'),
  setCaptureSource: (newSource: string) => ipcRenderer.invoke('set-capture-source', { newSource }),

  getAllSavedCaptures: () => ipcRenderer.invoke('get-all-saved-captures'),
  getAllShortcutCaptures: () => ipcRenderer.invoke('get-all-shortcut-captures'),
  deleteCaptures: (imageIds: string[]) => ipcRenderer.invoke('delete-captures', { imageIds }),
  captureSource: () => ipcRenderer.invoke('capture-source'),
  hasNewCapture: () => ipcRenderer.invoke('has-new-capture'),
  updateCacheRaw: (id: string, raw: string) => ipcRenderer.invoke('update-cache-raw', { id, raw }),
  updateCacheMeta: (data: {
    id: string;
    name: string;
    description: string;
    sourceName: string;
    sourceUrl: string;
    tags: string[];
    base64: string;
  }) => ipcRenderer.invoke('update-cache-meta', { data }),

  setCaptureKeybind: (keybind: string) => ipcRenderer.invoke('set-capture-keybind', { keybind }),
  getCaptureKeybind: () => ipcRenderer.invoke('get-capture-keybind'),
  setSnipKeybind: (keybind: string) => ipcRenderer.invoke('set-snip-keybind', { keybind }),
  getSnipKeybind: () => ipcRenderer.invoke('get-snip-keybind'),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
