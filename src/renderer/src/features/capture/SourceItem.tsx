import { Source } from './CaptureControl';

export interface SourceItemProps {
  source: Source;
  isSelected?: boolean;
  onSelectSource: (source: Source) => void;
}

export const SourceItem = ({ source, isSelected, onSelectSource }: SourceItemProps) => {
  return (
    <button
      type="button"
      className={`relative animate-fadeIn flex w-full pl-2 py-1 text-sm border hover:border-neutral-600 hover:text-neutral-50 transition-colors hover:bg-neutral-700 rounded-md group ${
        isSelected
          ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
          : 'bg-none text-neutral-400 border-neutral-800'
      }`}
      onClick={() => onSelectSource(source)}
    >
      <div className="text-start font-semibold pr-2">{source.name}</div>
    </button>
  );
};
