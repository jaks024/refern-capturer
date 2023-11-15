import { useEffect, useState } from 'react';
import { SourceItem } from './SourceItem';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { CaptureKeybinder } from './CaptureKeybinder';
import { useGetSources } from '../hooks/useGetSources';
import { useGetCaptureKeybind } from '../hooks/useGetCaptureKeybind';
import { useSetCaptureKeybind } from '../hooks/useSetCaptureKeybind';
import { useGetSnipKeybind } from '../hooks/useGetSnipKeybind';
import { useSetSnipKeybind } from '../hooks/useSetSnipKeybind';

export interface CaptureControlProps {
  selectedSource: Source | undefined;
  onSelectSource: (source: Source) => void;
  onCaptureClicked: (sourceId: string) => void;
}

export interface Source {
  id: string;
  name: string;
}

export const CaptureControl = ({
  selectedSource,
  onSelectSource,
  onCaptureClicked,
}: CaptureControlProps) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [captureKeybind, setCaptureKeybind] = useState('PrintScreen');
  const [snipKeybind, setSnipKeybind] = useState('Ctrl+Shift+S');
  console.log('RERENDER CAPTURE');
  const { data: sourceData, refetch: refetchSource } = useGetSources({
    config: {
      refetchOnWindowFocus: true,
    },
  });

  const { data: captureKeybindData, refetch: refetchCaptureKeybind } = useGetCaptureKeybind({});
  const { mutate: mutateCaptureKeybind } = useSetCaptureKeybind({
    config: {
      onSuccess() {
        refetchCaptureKeybind();
      },
    },
  });

  const { data: snipKeybindData, refetch: refetchSnipKeybind } = useGetSnipKeybind({});
  const { mutate: mutateSnipKeybind } = useSetSnipKeybind({
    config: {
      onSuccess() {
        refetchSnipKeybind();
      },
    },
  });

  useEffect(() => {
    if (captureKeybindData) {
      setCaptureKeybind(captureKeybindData);
    }
  }, [captureKeybindData]);

  useEffect(() => {
    if (snipKeybindData) {
      setSnipKeybind(snipKeybindData);
    }
  }, [snipKeybindData]);

  useEffect(() => {
    if (sourceData) {
      setSources(sourceData);
      console.log(selectedSource);
      if (!selectedSource) {
        console.log('SET DEFAULT SOURCE');
        onSelectSource(sourceData[0]);
      }
    }
  }, [sourceData]);

  const isSameKeybind = (a: string, b: string) => {
    if (a.length !== b.length) {
      return false;
    }
    const a_dict: Record<string, number> = {};
    const b_dict: Record<string, number> = {};
    for (let i = 0; i < a.length; i++) {
      a_dict[a[i]] = a_dict[a[i]] ? a_dict[a[i]] + 1 : 1;
    }
    for (let i = 0; i < b.length; i++) {
      b_dict[b[i]] = b_dict[b[i]] ? b_dict[b[i]] + 1 : 1;
    }
    let equal = true;
    Object.entries(a_dict).forEach((item) => {
      if (!b_dict[item[0]] || b_dict[item[0]] !== item[1]) {
        equal = false;
      }
    });
    return equal;
  };

  const SourceList = () => {
    return sources.map((source) => {
      return (
        <SourceItem
          key={`source-${source.id}`}
          source={source}
          onSelectSource={onSelectSource}
          isSelected={source.id === selectedSource?.id}
        />
      );
    });
  };

  return (
    <div className="w-[16rem] p-2 gap-4 h-full flex flex-col pr-0 ">
      <div className="mr-2 flex flex-col gap-1">
        <button
          type="button"
          className="bg-neutral-800 w-full min-h-[6rem] hover:bg-indigo-600 border border-neutral-700 hover:border-indigo-500  transition-colors rounded-md font-bold"
          onClick={() => (selectedSource ? onCaptureClicked(selectedSource?.id) : () => {})}
        >
          Capture Source
          <div className="text-xs text-neutral-500 font-semibold">
            or press <span className="font-black">{captureKeybind}</span>
          </div>
        </button>
        <CaptureKeybinder
          label="Capture source keybind"
          sequence={captureKeybind}
          onBind={(keybind: string) => {
            if (!isSameKeybind(keybind, snipKeybind)) {
              mutateCaptureKeybind({ keybind });
            }
          }}
        />
        <CaptureKeybinder
          label="Snip screen keybind"
          sequence={snipKeybind}
          onBind={(keybind: string) => {
            if (!isSameKeybind(keybind, captureKeybind)) {
              mutateSnipKeybind({ keybind });
            }
          }}
        />
        <div className="text-xs text-neutral-500">
          snips the screen that the cursor is currently in
        </div>
      </div>
      <div className="flex flex-col gap-1 grow overflow-hidden h-[100% - 96px]">
        <div className="font-black text-xs text-neutral-400 flex justify-between pr-2">
          <span className="leading-loose">Available source</span>
          <button
            type="button"
            onClick={() => {
              refetchSource();
            }}
            className="flex text-xs border border-neutral-800 hover:border-neutral-600 text-neutral-600 p-1 rounded-md hover:bg-neutral-700 hover:text-neutral-50 transition-colors"
          >
            <div className="flex flex-col h-full justify-center">
              <div className="flex flex-row gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <span className="mr-1 font-bold text-xs">Refresh</span>
              </div>
            </div>
          </button>
        </div>
        <div className="grow overflow-hidden">
          <SimpleBar className="h-full pr-2 max-h-[20rem]">
            <div className="flex flex-col gap-1">{SourceList()}</div>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
};
