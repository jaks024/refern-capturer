import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getSources: () => Promise<Electron.DesktopCapturerSource[]>
    }
  }
}
