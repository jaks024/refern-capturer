import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface API {
    getSources: () => Promise<Electron.DesktopCapturerSource[]>

    hasNewCapture: () => boolean
    getAllCaptureBuffer: () => Buffer[]
    deleteCaptures: (imageIds: string[]) => void

    setCaptureKeybind: (keybind: string) => void
    captureSource: (sourceId: string) => void
    updateSource: () => void
  }
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
