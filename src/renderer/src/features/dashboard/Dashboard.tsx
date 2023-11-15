import { useEffect, useRef, useState } from 'react';
import { CaptureControl, Source } from '../capture/CaptureControl';
import { PreviewImage } from './PreviewImage';
import SimpleBar from 'simplebar-react';
import { useHasNewCapture } from '../hooks/useHasNewCapture';
import { useGetAllSavedCaptures } from '../hooks/useGetAllSavedCaptures';
import { CacheData } from '../types';
import { useGetAllShortcutCaptures } from '../hooks/useGetAllShortcutCaptures';
import { useCaptureSource } from '../hooks/useCaptureSource';
import { useSetCaptureSource } from '../hooks/useSetCaptureSource';
import { useDeleteCaptures } from '../hooks/useDeleteCaptures';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { FormButton } from '../form/FormButton';
import { useUpdateCacheRaw } from '../hooks/useUpdateCacheRaw';
import 'cropperjs/dist/cropper.css';
import { TagEditor } from '../form/tag/TagEditor';
import { useUpdateCacheMeta } from '../hooks/useUpdateCacheMeta';
import { UploadQueue } from '../add/components/UploadQueue';
import { CreateImageDto, ImageBatch, ImageData } from '../add/types';
import { createThumbnailBase64 } from '../add/helpers';
import { v4 as uuidv4 } from 'uuid';
import { CollectionSelector } from '../add/components/CollectionSelector';

export const Dashboard = () => {
  const [cache, setCache] = useState<Record<string, CacheData>>({});
  const [selectedSource, setSelectedSource] = useState<Source | undefined>();
  const [hasNewCapture, setHasNewCapture] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedCache, setSelectedCache] = useState<Set<string>>(new Set());
  const [croppingId, setCroppingId] = useState('');

  const [onUploadTags, setOnUploadTags] = useState<string[]>([]);
  const [uploadQueue, setUploadQueue] = useState<ImageBatch[]>([]);
  const [isPrepUpload, setIsPrepUpload] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [selectedCollectionName, setSelectedCollectionName] = useState('');

  const cropperRef = useRef<ReactCropperElement>(null);

  const {
    data: allSavedCaptures,
    isFetched: isFetchedAllSavedCaptures,
    refetch: fetchAllSavedCaptures,
  } = useGetAllSavedCaptures({
    enabled: false,
  });
  const {
    data: allShortcutCaptures,
    isFetching: isFetchingAllShortcutCapture,
    refetch: fetchAllShortcutCapture,
  } = useGetAllShortcutCaptures({
    enabled: false,
  });
  const { mutate: captureSource } = useCaptureSource({
    onSuccess(data, _, __) {
      setCache((prev) => {
        return { ...prev, [data.id]: data };
      });
      console.log('CAPTURE SUCCESS');
    },
  });
  const { data: newCapture } = useHasNewCapture({
    config: {
      refetchInterval: 1 * 1000,
    },
  });
  const { mutate: setCaptureSource } = useSetCaptureSource();
  const { mutate: deleteCaptures } = useDeleteCaptures();
  const { mutate: updateCacheRaw } = useUpdateCacheRaw();
  const { mutate: updateCacheMeta } = useUpdateCacheMeta();

  useEffect(() => {
    if (!isInitialLoad) {
      return;
    }
    if (isFetchedAllSavedCaptures && allSavedCaptures) {
      setCache(
        allSavedCaptures.reduce((acc, x) => {
          return {
            ...acc,
            [x.id]: x,
          };
        }, {}),
      );
      setIsInitialLoad(false);
      console.log('SET CACHE FROM SAVED CAPTURES');
    } else {
      console.log('FETCHED ALL SAVED CAPTURES');
      fetchAllSavedCaptures();
    }
  }, [isInitialLoad, isFetchedAllSavedCaptures, allSavedCaptures]);

  useEffect(() => {
    if (allShortcutCaptures) {
      console.log('refreshed');
      setCache((prev) => {
        return {
          ...prev,
          ...allShortcutCaptures.reduce((acc, x) => {
            return {
              ...acc,
              [x.id]: x,
            };
          }, {}),
        };
      });
    }
  }, [allShortcutCaptures]);

  useEffect(() => {
    if (newCapture !== undefined) {
      setHasNewCapture(newCapture);
    }
  }, [newCapture]);

  const handleOnCaptureClicked = () => {
    console.log('on click capture');
    captureSource({});
  };

  const handleOnRefreshClicked = async () => {
    setHasNewCapture(false);
    fetchAllShortcutCapture();
  };

  const handleOnSelectSourceClicked = (newSource: Source) => {
    if (!newSource) {
      return;
    }
    setSelectedSource(newSource);
    setCaptureSource({ newSourceId: newSource.id });
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      const url = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
      const base64 = url.substring(url.indexOf(',') + 1).trim();

      setCache((prev) => {
        prev[croppingId].base64 = base64;
        return { ...prev };
      });
      updateCacheRaw({ id: croppingId, raw: base64 });
      setCroppingId('');
    }
  };

  const onUpload = async () => {
    setIsPrepUpload(true);
    const images: ImageData[] = [];
    const ids = Array.from(selectedCache);
    for (const id of ids) {
      const data = cache[id];
      const image: ImageData = {
        id: id,
        data: {
          name: data.name,
          description: data.description,
          sourceName: data.sourceName,
          sourceUrl: data.sourceUrl,
          uploaderUserId: 'user_2Stbq5HQqi9p9YkB8CbJqWGqgUO',
          parentCollectionId: selectedCollectionId,
          tags: [...data.tags, ...onUploadTags],
          metadata: {
            fileName: `capture-${id}`,
            type: 'image/png',
            size: data.base64.length * (3 / 4),
          },
          transform: {
            angle: 0,
            flipX: false,
            flipY: false,
            scaleX: 1,
            scaleY: 1,
            brightness: 0,
            saturation: 0,
            contrast: 0,
          },
          arrayBufferBase64: data.base64,
          thumbnailArrayBufferBase64: await createThumbnailBase64(data.base64),
        },
      };
      images.push(image);
    }
    const batch: ImageBatch = {
      id: uuidv4(),
      images: images,
      collectionId: '654c4e4ac90323fb86b50895',
      collectionName: 'new stuff',
    };
    console.log(batch, images, selectedCache);
    setUploadQueue((prev) => [...prev, batch]);
    setSelectedCache(new Set());
    setIsPrepUpload(false);
  };

  const CacheImages = () => {
    if (!cache || Object.keys(cache).length == 0) {
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500 font-bold text-sm m-auto">
          No captures!
        </div>
      );
    }
    return Object.entries(cache)?.map(([id, x]) => {
      return (
        <PreviewImage
          key={id}
          img={{
            id: x.id,
            base64: x.base64,
            data: {
              name: x.name,
              description: x.description,
              sourceName: x.sourceName,
              sourceUrl: x.sourceUrl,
              tags: x.tags,
            },
          }}
          isSelected={selectedCache.has(id)}
          onSelect={() => {
            if (selectedCache.has(id)) {
              setSelectedCache((prev) => {
                prev.delete(id);
                return new Set(prev);
              });
            } else {
              setSelectedCache((prev) => {
                prev.add(id);
                return new Set(prev);
              });
            }
          }}
          onCrop={() => {
            setCroppingId(id);
          }}
          onSave={(dto) => {
            updateCacheMeta(dto);
            setCache((prev) => {
              const base64 = prev[dto.id].base64;
              prev[dto.id] = {
                ...dto,
                base64,
              };
              return { ...prev };
            });
          }}
        />
      );
    });
  };

  return (
    <div className="flex flex-row h-screen w-full overflow-hidden">
      <div className=" border-r border-neutral-800 flex flex-row h-screen">
        <div
          className={` overflow-hidden transition-opacity flex flex-col min-h-[20rem] ${
            selectedCache.size !== 0 ? 'w-0 opacity-0' : 'w-[16rem] opacity-100'
          }`}
        >
          <SimpleBar className="h-full">
            <CaptureControl
              key={'capture-control'}
              selectedSource={selectedSource}
              onSelectSource={handleOnSelectSourceClicked}
              onCaptureClicked={handleOnCaptureClicked}
            />
            <UploadQueue
              queue={uploadQueue}
              popQueue={() => {
                if (uploadQueue.length >= 1) {
                  const upload = uploadQueue[uploadQueue.length - 1];
                  setUploadQueue((prev) => {
                    prev.pop();
                    return [...prev];
                  });
                  return upload;
                }
                return undefined;
              }}
            />
          </SimpleBar>
        </div>
        <div
          className={`flex flex-col gap-1 transition-opacity border-neutral-800 ${
            selectedCache.size === 0 ? 'w-0 opacity-0 overflow-hidden' : 'w-[16rem] opacity-100'
          }`}
        >
          <div
            className={`flex flex-col gap-1 transition-all w-60 ml-2 ${
              selectedCache.size === 0 ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="text-3xl font-bold p-4">
              {selectedCache.size}
              <span className="text-neutral-500 text-sm pl-2">Images Selected</span>
            </span>
            <span className="font-bold text-xs text-neutral-500">Selection controls</span>
            <FormButton
              text="Deselect All"
              onClick={() => {
                setSelectedCache(new Set());
              }}
            />
            <FormButton
              text="Select All"
              onClick={() => {
                setSelectedCache(new Set(Object.keys(cache)));
              }}
            />
            <span className="font-bold text-xs text-neutral-500 mt-2">Danger!</span>
            <FormButton
              text="Delete Selected"
              onClick={() => {
                deleteCaptures({ ids: [...selectedCache.values()] });
                setCache((prev) => {
                  selectedCache.forEach((id) => {
                    delete prev[id];
                  });
                  return { ...prev };
                });
                setSelectedCache(new Set());
              }}
            />
            <div className="my-4 border-t border-neutral-800" />

            <span className="font-bold text-xs text-neutral-500">
              Tags to add to images on upload
            </span>
            <TagEditor tags={onUploadTags} onTagChange={setOnUploadTags} />

            <span className="font-bold text-xs text-neutral-500 mt-2">Upload to collection</span>
            <CollectionSelector
              userId={'user_2Stbq5HQqi9p9YkB8CbJqWGqgUO'}
              selectedCollectionId={selectedCollectionId}
              selectedCollectionName={selectedCollectionName}
              onSelect={(collectionId: string, collectionName: string) => {
                setSelectedCollectionId(collectionId);
                setSelectedCollectionName(collectionName);
              }}
              openUp
            />
            <br />
            <FormButton
              text={
                selectedCollectionName.length > 0
                  ? `Upload ${selectedCache.size} image to ${selectedCollectionName}`
                  : 'Upload'
              }
              disabled={selectedCollectionId.length === 0}
              onClick={onUpload}
            />
          </div>
        </div>
      </div>
      <div className="p-2 flex-1 overflow-hidden flex flex-row">
        <div className="h-full grow overflow-hidden rounded-md border-neutral-800 border relative">
          <SimpleBar className="h-full">
            <div
              className="w-full grid "
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 17rem), 1fr))',
              }}
            >
              {CacheImages()}
            </div>
          </SimpleBar>

          {hasNewCapture || isFetchingAllShortcutCapture ? (
            <div className="absolute z-10 top-0 left-0 w-full h-full animate-fadeIn">
              <div className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {isFetchingAllShortcutCapture ? (
                  <div className="p-2 font-bold text-xs">fetching...</div>
                ) : (
                  <>
                    <div className="p-2 font-bold text-xs">
                      new images captured through shortcut
                    </div>
                    <button
                      type="button"
                      className="flex gap-1 p-2 justify-center bg-neutral-800 w-full hover:bg-indigo-600 border border-neutral-700 hover:border-indigo-500  transition-colors rounded-md font-bold"
                      onClick={handleOnRefreshClicked}
                    >
                      <span className=" leading-snug text-sm">refresh to see!</span>
                    </button>
                  </>
                )}
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-neutral-900 opacity-80" />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {isPrepUpload ? (
        <div className="absolute top-0 left-0 h-full w-full bg-neutral-900 opacity-80 flex justify-center">
          <div className=" flex justify-center m-auto font-bold text-sm animate-pulse">
            prepping for upload...
          </div>
        </div>
      ) : (
        <></>
      )}

      {croppingId.length > 0 ? (
        <div className="absolute top-0 left-0 w-full h-full z-20">
          <div className="absolute top-0 left-0 w-full h-full bg-neutral-950 opacity-80" />

          <div className="w-full h-full p-10 pb-20 z-20 ">
            <Cropper
              className="w-full h-full bg-neutral-600 border-outline-400 outline outline-1 rounded-md"
              ref={cropperRef}
              src={`data:image/png;base64, ${cache[croppingId].base64}`}
              viewMode={1}
              initialAspectRatio={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={0.5}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              guides={true}
              movable={false}
              rotatable={false}
              zoomable={false}
            />
          </div>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-5">
            <FormButton onClick={() => setCroppingId('')} text="Cancel" />
            <FormButton onClick={getCropData} text="Crop Image" />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
