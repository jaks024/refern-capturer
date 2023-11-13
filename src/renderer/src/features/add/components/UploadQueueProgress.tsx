export interface UploadQueueProgressProps {
  collectionName: string;
  uploaded: number;
  total: number;
}

export const UploadQueueProgress = ({
  collectionName,
  uploaded,
  total,
}: UploadQueueProgressProps) => {
  return (
    <div className="relative animate-fadeIn flex w-full pl-2 text-sm border text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-neutral-50 transition-colors hover:bg-neutral-700 rounded-md">
      <div className="flex py-1 gap-1 overflow-hidden flex-1">
        <div className="my-auto mr-0.5 animate-pulse">
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
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        </div>
        <span className="font-semibold truncate">{collectionName}</span>
      </div>
      <div className="flex w-fit font-semibold px-2 py-1">{`${uploaded + 1} / ${total}`}</div>
    </div>
  );
};
