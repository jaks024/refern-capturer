import { ipcMain, desktopCapturer, IpcMainInvokeEvent, globalShortcut } from 'electron';
import { uInt8ArrayToBase64 } from './helper';
import { v4 as uuidv4 } from 'uuid';

import Store from 'electron-store';

interface CacheData {
  id: string;
  name: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  tags: string[];
  base64: string;
}

interface MetaStoreType {
  capture: {
    keybind: string;
  };
  imageMetas: Record<string, CacheData>;
  recentCaptureIds: string[];
}

interface RawStoreType {
  imageRaws: Record<string, string>;
}

const metaStore = new Store<MetaStoreType>({
  defaults: {
    capture: {
      keybind: 'PrintScreen',
    },
    imageMetas: {},
    recentCaptureIds: [],
  },
  name: 'metas',
});

const rawsStore = new Store<RawStoreType>({
  defaults: {
    imageRaws: {},
  },
  name: 'raws',
});

// save raws as a separate file and support update image metas

const STORE_KEYBIND = 'capture.keybind';
const STORE_IMAGE_META = 'imageMetas';
const STORE_IMAGE_RAWS = 'imageRaws';
const STORE_RECENT_CAPTURE_IDS = 'recentCaptureIds';

let currentSource: string = '';
let captureKeybind: string = metaStore.get(STORE_KEYBIND) as string;

const capture = async (sourceId: string) => {
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
    thumbnailSize: {
      height: 1080,
      width: 1920,
    },
  });
  const source = sources.find((x) => x.id === sourceId);
  return {
    buffer: source?.thumbnail.toPNG(),
    name: source?.name,
  };
};

const addToCache = (
  buffer: Buffer | undefined,
  sourceName: string | undefined,
): CacheData | undefined => {
  if (buffer) {
    const id = uuidv4();
    const base64 = uInt8ArrayToBase64(buffer);

    const data: CacheData = {
      id: id,
      name: '',
      description: '',
      sourceName: sourceName ? sourceName : '',
      sourceUrl: '',
      tags: [],
      base64: '',
    };

    rawsStore.set(`${STORE_IMAGE_RAWS}.${id}`, uInt8ArrayToBase64(buffer));
    metaStore.set(`${STORE_IMAGE_META}.${id}`, data);

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
  return addToCache(content.buffer, content.name);
};

const onEventCaptureShortcut = async () => {
  const data = await onEventCapture();
  const ids = metaStore.get(STORE_RECENT_CAPTURE_IDS);
  metaStore.set(STORE_RECENT_CAPTURE_IDS, [...ids, data?.id]);
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
    const metas = metaStore.get(STORE_IMAGE_META);
    const raws = rawsStore.get(STORE_IMAGE_RAWS);
    return Object.entries(metas).map((meta): CacheData => {
      return {
        ...meta[1],
        base64: raws[meta[0]],
      };
    });
  });

  ipcMain.handle('get-all-shortcut-captures', () => {
    console.log('load all capture');
    const recentIds = metaStore.get(STORE_RECENT_CAPTURE_IDS);
    const metas = metaStore.get(STORE_IMAGE_META);
    const raws = rawsStore.get(STORE_IMAGE_RAWS);

    metaStore.set(STORE_RECENT_CAPTURE_IDS, []);

    return recentIds.map((id): CacheData => {
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
    return metaStore.get(STORE_RECENT_CAPTURE_IDS).length > 0;
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
      metaStore.set(STORE_KEYBIND, args.keybind);
      console.log('set capture keybind', ret);
    }
    return ret;
  });

  ipcMain.handle('get-capture-keybind', () => {
    return captureKeybind;
  });

  ipcMain.handle('delete-captures', (_: IpcMainInvokeEvent, args: { imageIds: string[] }) => {
    const metas = metaStore.get(STORE_IMAGE_META);
    const raws = rawsStore.get(STORE_IMAGE_RAWS);
    args.imageIds.forEach((id) => {
      delete metas[id];
      delete raws[id];
    });
    metaStore.set(STORE_IMAGE_META, metas);
    rawsStore.set(STORE_IMAGE_RAWS, raws);
  });

  ipcMain.handle('update-cache-raw', (_: IpcMainInvokeEvent, args: { id: string; raw: string }) => {
    const raws = rawsStore.get(STORE_IMAGE_RAWS);
    raws[args.id] = args.raw;
    rawsStore.set(STORE_IMAGE_RAWS, raws);
  });

  ipcMain.handle('update-cache-meta', (_: IpcMainInvokeEvent, args: { data: CacheData }) => {
    const metas = metaStore.get(STORE_IMAGE_META);
    metas[args.data.id] = args.data;
    metaStore.set(STORE_IMAGE_META, metas);
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
