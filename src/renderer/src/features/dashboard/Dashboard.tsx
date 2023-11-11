import { useEffect, useState } from 'react';
import { CaptureControl, Source } from '../capture/CaptureControl';
import { PreviewImage } from './PreviewImage';
import SimpleBar from 'simplebar-react';
import { useHasNewCapture } from '../hooks/useHasNewCapture';
import { useGetAllSavedCaptures } from '../hooks/useGetAllSavedCaptures';
import { ImageData } from '../types';
import { useGetAllShortcutCaptures } from '../hooks/useGetAllShortcutCaptures';
import { useCaptureSource } from '../hooks/useCaptureSource';
import { useSetCaptureSource } from '../hooks/useSetCaptureSource';
import { useDeleteCaptures } from '../hooks/useDeleteCaptures';

export const Dashboard = () => {
  const [cache, setCache] = useState<Record<string, ImageData>>({});
  const [selectedSource, setSelectedSource] = useState<Source | undefined>();
  const [hasNewCapture, setHasNewCapture] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedCache, setSelectedCache] = useState<Set<string>>(new Set());

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
          onClickRemove={() => {
            deleteCaptures({ ids: [id] });
            setCache((prev) => {
              delete prev[id];
              return { ...prev };
            });
          }}
        />
      );
    });
  };

  return (
    <div className="flex flex-row h-screen w-full overflow-hidden">
      <CaptureControl
        key={'capture-control'}
        selectedSource={selectedSource}
        onSelectSource={handleOnSelectSourceClicked}
        onCaptureClicked={handleOnCaptureClicked}
      />
      <div className="p-2 flex-1 overflow-hidden">
        <div className="h-full overflow-hidden rounded-md border-neutral-800 border relative">
          <SimpleBar className="h-full">
            <div
              className="w-full grid "
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 13rem), 1fr))',
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
    </div>
  );
};
