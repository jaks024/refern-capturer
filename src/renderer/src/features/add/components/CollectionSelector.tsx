import { CollectionIcon, UpIcon, DownIcon } from '@renderer/assets/Icons';
import { DropdownMenu } from '@renderer/features/form/DropdownMenu';
import { useClickOutside } from '@renderer/hooks/useClickOutside';
import { useState, useRef, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import { useAllUserCollection, CollectionSimple } from '../apis/allUserCollection';

export interface CollectionSelectorProps {
  userId: string;
  selectedCollectionId: string;
  selectedCollectionName: string | undefined;
  onSelect: (collectionId: string, collectionName: string) => void;
  openUp?: boolean;
}

export const CollectionSelector = ({
  userId,
  selectedCollectionId,
  selectedCollectionName,
  onSelect,
  openUp,
}: CollectionSelectorProps) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setIsSelectorOpen(false));

  const { data, isFetched, isFetching, isError, refetch } = useAllUserCollection({
    userId: userId,
    config: {
      staleTime: 0,
      refetchOnMount: true,
    },
  });

  useEffect(() => {
    if (isSelectorOpen) {
      refetch();
    }
  }, [isSelectorOpen]);

  const FolderGroup = ({ items }: { items: CollectionSimple[] }) => {
    return items.map((x, idx) => {
      return (
        <button
          key={`dropdown-item-${idx}`}
          className={`flex justify-between overflow-hidden w-full gap-1 hover:text-neutral-50 transition-colors hover:bg-neutral-500 text-left p-1 pr-2.5 rounded-md ${
            selectedCollectionId === x._id ? 'bg-neutral-500 text-neutral-300' : 'text-neutral-400'
          }`}
          onClick={() => {
            onSelect(x._id, x.name);
            setIsSelectorOpen(false);
          }}
        >
          <div className="flex flex-row gap-1 flex-1 overflow-hidden">
            <div>
              <CollectionIcon />
            </div>
            <span className="text-xs font-semibold truncate ">{x.name}</span>
          </div>
          <span className="text-right font-semibold text-xs">{x.imageCount} images</span>
        </button>
      );
    });
  };

  const DropdownItems = () => {
    if (isError) {
      return (
        <div className="text-center p-5 text-neutral-400 text-xs font-bold">
          failed to load collections :C
        </div>
      );
    }
    if (isFetching) {
      return (
        <div className="text-center p-5 text-neutral-400 text-xs font-bold animate-pulse">
          loading...
        </div>
      );
    }
    if (isFetched && data) {
      const groupedData: Record<string, CollectionSimple[]> = {};
      const folderNames = new Set<string>();
      data.forEach((x) => {
        folderNames.add(x.folderName);
        if (groupedData[x.folderName]) {
          groupedData[x.folderName].push(x);
        } else {
          groupedData[x.folderName] = [x];
        }
      });
      return (
        <SimpleBar className="h-full">
          {[...folderNames].map((folderName: string, idx) => (
            <div
              key={`dropdown-folder-${idx}`}
              className="relative flex flex-col text-neutral-400 w-full transition-colors hover:bg-neutral-600 p-1 rounded-md group/folder"
            >
              <span className="w-full text-xs font-bold text-neutral-500 group-hover/folder:text-neutral-300 pb-1 transition-colors">
                {folderName}
              </span>
              {FolderGroup({ items: groupedData[folderName] })}
            </div>
          ))}
        </SimpleBar>
      );
    }
    return <></>;
  };

  return (
    <div
      ref={ref}
      className={`relative animate-fadeIn flex w-full pl-2 text-sm border hover:border-neutral-600 hover:text-neutral-50 transition-colors hover:bg-neutral-700 rounded-md group ${
        isSelectorOpen
          ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
          : 'bg-none text-neutral-400 border-neutral-800'
      }`}
    >
      <button
        type="button"
        className="flex w-full"
        onClick={() => setIsSelectorOpen(!isSelectorOpen)}
      >
        <div className="flex py-1 gap-1 overflow-hidden flex-1">
          <div className="my-auto">
            <CollectionIcon />
          </div>
          <span className="font-semibold truncate">
            {selectedCollectionName ? selectedCollectionName : 'Select a collection'}
          </span>
        </div>
        <div className="my-auto w-7">{isSelectorOpen ? <UpIcon /> : <DownIcon />}</div>
      </button>

      <DropdownMenu isOpen={isSelectorOpen} openUp={openUp}>
        <div className="w-[30rem] min-w-[20rem] max-h-64 h-64 ">{DropdownItems()}</div>
      </DropdownMenu>
    </div>
  );
};
