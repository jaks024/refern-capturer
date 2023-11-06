import { ipcMain, desktopCapturer, IpcMainInvokeEvent, globalShortcut } from 'electron';
import { uInt8ArrayToBase64 } from './helper';
import { v4 as uuidv4 } from 'uuid';

export interface ImageCache {
  id: string;
  base64: string;
}

const captureCache: ImageCache[] = [];
let currentSource: string = '';
let newCapture: boolean = false;
let captureKeybind: string = 'PrintScreen';

const capture = async (sourceId: string) => {
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
    thumbnailSize: {
      height: 1080,
      width: 1920,
    },
  });
  const source = sources.find((x) => x.id === sourceId);
  return source?.thumbnail.toPNG();
};

const addToCache = (buffer: Buffer | undefined) => {
  if (buffer) {
    captureCache.push({ id: uuidv4(), base64: uInt8ArrayToBase64(buffer) });
    newCapture = true;
    return true;
  } else {
    console.log('ERROR: capture data null');
    return false;
  }
};

const onEventCapture = async () => {
  const content = await capture(currentSource);
  return addToCache(content);
};

const AddHandles = () => {
  ipcMain.handle('get-sources', async () => {
    const result = await desktopCapturer.getSources({ types: ['window', 'screen'] });
    const data = result
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((x) => {
        return { id: x.id, name: x.name };
      });
    currentSource = data[0].id;
    console.log(data);
    return data;
  });

  ipcMain.handle('set-capture-source', (_: IpcMainInvokeEvent, args: { newSource: string }) => {
    console.log(args);
    currentSource = args.newSource;
    console.log('updated source', currentSource);
  });

  ipcMain.handle('capture-source', async (_: IpcMainInvokeEvent) => {
    return await onEventCapture();
  });

  ipcMain.handle('get-all-capture-buffer', () => {
    newCapture = false;
    console.log('got new capture');
    return captureCache;
  });

  ipcMain.handle('has-new-capture', () => {
    return newCapture;
  });

  ipcMain.handle('set-capture-keybind', (_: IpcMainInvokeEvent, args: { keybind: string }) => {
    if (args.keybind == captureKeybind) {
      return true;
    }
    console.log('called', args.keybind);
    const ret = globalShortcut.register(args.keybind, onEventCapture);
    if (ret) {
      globalShortcut.unregister(captureKeybind);
      captureKeybind = args.keybind;
      console.log('set capture keybind', ret);
    }
    return ret;
  });

  ipcMain.handle('get-capture-keybind', () => {
    return captureKeybind;
  });
};

const RegisterKeybind = () => {
  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register(captureKeybind, onEventCapture);

  if (!ret) {
    console.log('registration failed');
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered(captureKeybind));
};

export const captureHandler = {
  addHandles: AddHandles,
  registerKey: RegisterKeybind,
};
