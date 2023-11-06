import { ipcRenderer, contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  getSources: () => ipcRenderer.invoke('get-sources'),
  captureSource: () => ipcRenderer.invoke('capture-source'),
  getAllCaptureBuffer: () => ipcRenderer.invoke('get-all-capture-buffer'),
  setCaptureSource: (newSource: string) => ipcRenderer.invoke('set-capture-source', { newSource }),
  hasNewCapture: () => ipcRenderer.invoke('has-new-capture'),
  setCaptureKeybind: (keybind: string) => ipcRenderer.invoke('set-capture-keybind', { keybind }),
  getCaptureKeybind: () => ipcRenderer.invoke('get-capture-keybind'),
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
