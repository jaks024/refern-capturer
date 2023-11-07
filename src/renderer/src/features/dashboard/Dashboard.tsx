import { useEffect, useState } from 'react';
import { CaptureControl, Source } from '../capture/CaptureControl';
import { ImageCache, useRefresh } from './useRefresh';
import { PreviewImage } from './PreviewImage';
import SimpleBar from 'simplebar-react';
import { useHasNewCapture } from './useHasNewCapture';

export const Dashboard = () => {
  const [cache, setCache] = useState<ImageCache[]>();
  const [selectedSource, setSelectedSource] = useState<Source | undefined>();
  const [isRefetched, setIsRefetched] = useState(false);
  const [hasNewCapture, setHasNewCapture] = useState(false);
  const { data: refreshData, refetch } = useRefresh({
    config: {
      refetchInterval: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      enabled: false,
    },
  });

  const { data: newCapture } = useHasNewCapture({
    config: {
      refetchInterval: 1 * 1000,
    },
  });
  console.log(hasNewCapture, isRefetched);

  useEffect(() => {
    if (refreshData) {
      console.log('refreshed');
      setCache(refreshData);
      setIsRefetched(false);
    }
  }, [refreshData]);

  useEffect(() => {
    if (!isRefetched && newCapture !== undefined) {
      setHasNewCapture(newCapture);
    }
  }, [newCapture]);

  const handleOnCaptureClicked = () => {
    console.log('on click capture');
    setIsRefetched(true);
    window.api.captureSource().then(() => {
      refetch();
      console.log('REFETCHED');
    });
  };

  const handleOnRefreshClicked = async () => {
    refetch();
  };

  const handleOnSelectSourceClicked = (newSource: Source) => {
    if (!newSource) {
      return;
    }
    setSelectedSource(newSource);
    window.api.setCaptureSource(newSource.id);
  };

  const CacheImages = () => {
    if (!cache || cache.length == 0) {
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500 font-bold text-sm m-auto">
          No captures!
        </div>
      );
    }
    return cache?.map((x) => {
      return (
        <PreviewImage
          key={x.id}
          img={{
            id: x.id,
            base64: x.base64,
            data: {
              name: '',
              description: '',
              sourceName: '',
              sourceUrl: '',
              tags: [],
            },
          }}
          onClickRemove={() => {}}
          onChange={() => {}}
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

          {hasNewCapture && !isRefetched ? (
            <div className="absolute z-10 top-0 left-0 w-full h-full animate-fadeIn">
              <div className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="p-2 font-bold text-xs">new images captured through shortcut</div>
                <button
                  type="button"
                  className="flex gap-1 p-2 justify-center bg-neutral-800 w-full hover:bg-indigo-600 border border-neutral-700 hover:border-indigo-500  transition-colors rounded-md font-bold"
                  onClick={handleOnRefreshClicked}
                >
                  <span className=" leading-snug text-sm">refresh to see!</span>
                </button>
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
