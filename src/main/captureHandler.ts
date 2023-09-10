import { ipcMain, desktopCapturer, IpcMainInvokeEvent, globalShortcut } from 'electron'

const capture = async (sourceId: string) => {
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
    thumbnailSize: {
      height: 1080,
      width: 1920
    }
  })
  const source = sources.find((x) => x.id === sourceId)
  return source?.thumbnail.toPNG()
}

const captureCache: Buffer[] = []

const AddHandles = () => {
  ipcMain.handle('get-sources', async () => {
    const result = await desktopCapturer.getSources({ types: ['window', 'screen'] })
    return result
  })

  ipcMain.handle(
    'capture-source',
    async (event: IpcMainInvokeEvent, args: { sourceId: string }) => {
      const data = await capture(args.sourceId)
      if (data) {
        captureCache.push(data)
      } else {
        console.log('ERROR: capture data null')
      }
    }
  )

  ipcMain.handle('get-all-capture-buffer', () => {
    return captureCache
  })
}

const RegisterKeybind = () => {
  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+Shift+S', async () => {
    console.log('CommandOrControl+Shift+S is pressed')
    const content = await capture('screen:0:0')
    if (content) {
      captureCache.push(content)
      console.log('pushed', captureCache.length)
    }
  })

  if (!ret) {
    console.log('registration failed')
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('CommandOrControl+Shift+S'))
}

export const captureHandler = {
  addHandles: AddHandles,
  registerKey: RegisterKeybind
}
