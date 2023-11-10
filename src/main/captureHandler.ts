import { ipcMain, desktopCapturer, IpcMainInvokeEvent, globalShortcut } from 'electron';
import { uInt8ArrayToBase64 } from './helper';
import { v4 as uuidv4 } from 'uuid';

import Store from 'electron-store';

interface ImageData {
  id: string;
  name: string;
  description: string;
  source: string;
  sourceUrl: string;
  tags: string[];
  base64: string;
}

interface StoreType {
  capture: {
    keybind: string;
  };
  imageMetas: Record<string, ImageData>;
  imageRaws: Record<string, string>;
  recentCaptureIds: string[];
}

const store = new Store<StoreType>({
  defaults: {
    capture: {
      keybind: 'PrintScreen',
    },
    imageMetas: {},
    imageRaws: {},
    recentCaptureIds: [],
  },
});

const STORE_KEYBIND = 'capture.keybind';
const STORE_IMAGE_META = 'imageMetas';
const STORE_IMAGE_RAWS = 'imageRaws';
const STORE_RECENT_CAPTURE_IDS = 'recentCaptureIds';

let currentSource: string = '';
let captureKeybind: string = store.get(STORE_KEYBIND) as string;

/*
  on manual capture -> save to file and return all image data and cache -> client add to its cache
  on shortcut capture -> save to file and save id to file
  on shortcut capture refresh -> get all shortcut capture ids from file and load all data from file -> client add to its cache
  on client load -> get all images from file -> client add all to its cache
*/

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

const addToCache = (buffer: Buffer | undefined): ImageData | undefined => {
  if (buffer) {
    const id = uuidv4();
    const base64 = uInt8ArrayToBase64(buffer);

    const data: ImageData = {
      id: id,
      name: '',
      description: '',
      source: '',
      sourceUrl: '',
      tags: [],
      base64: '',
    };

    store.set(`${STORE_IMAGE_RAWS}.${id}`, uInt8ArrayToBase64(buffer));
    store.set(`${STORE_IMAGE_META}.${id}`, data);

    return {
      ...data,
      base64,
    };
  } else {
    console.log('ERROR: capture data null');
    return undefined;
  }
};

const onEventCapture = async () => {
  const content = await capture(currentSource);
  return addToCache(content);
};

const onEventCaptureShortcut = async () => {
  const data = await onEventCapture();
  const ids = store.get(STORE_RECENT_CAPTURE_IDS);
  store.set(STORE_RECENT_CAPTURE_IDS, [...ids, data?.id]);
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

  ipcMain.handle('get-all-saved-captures', () => {
    console.log('load all capture');
    const metas = store.get(STORE_IMAGE_META);
    const raws = store.get(STORE_IMAGE_RAWS);
    return Object.entries(metas).map((meta): ImageData => {
      return {
        ...meta[1],
        base64: raws[meta[0]],
      };
    });
  });

  ipcMain.handle('get-all-shortcut-captures', () => {
    console.log('load all capture');
    const recentIds = store.get(STORE_RECENT_CAPTURE_IDS);
    const metas = store.get(STORE_IMAGE_META);
    const raws = store.get(STORE_IMAGE_RAWS);

    store.set(STORE_RECENT_CAPTURE_IDS, []);

    return recentIds.map((id): ImageData => {
      const currentMeta = metas[id];
      const currentRaws = raws[id];
      delete metas[id];
      delete raws[id];
      return {
        ...currentMeta,
        base64: currentRaws,
      };
    });
  });

  ipcMain.handle('has-new-capture', () => {
    return store.get(STORE_RECENT_CAPTURE_IDS).length > 0;
  });

  ipcMain.handle('set-capture-keybind', (_: IpcMainInvokeEvent, args: { keybind: string }) => {
    if (args.keybind == captureKeybind) {
      return true;
    }
    console.log('called', args.keybind);
    const ret = globalShortcut.register(args.keybind, onEventCaptureShortcut);
    if (ret) {
      globalShortcut.unregister(captureKeybind);
      captureKeybind = args.keybind;
      store.set(STORE_KEYBIND, args.keybind);
      console.log('set capture keybind', ret);
    }
    return ret;
  });

  ipcMain.handle('get-capture-keybind', () => {
    return captureKeybind;
  });

  ipcMain.handle('delete-captures', (_: IpcMainInvokeEvent, args: { imageIds: string[] }) => {
    const metas = store.get(STORE_IMAGE_META);
    const raws = store.get(STORE_IMAGE_RAWS);
    args.imageIds.forEach((id) => {
      delete metas[id];
      delete raws[id];
    });
    store.set(STORE_IMAGE_META, metas);
    store.set(STORE_IMAGE_RAWS, raws);
  });
};

const RegisterKeybind = () => {
  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register(captureKeybind, onEventCaptureShortcut);

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
