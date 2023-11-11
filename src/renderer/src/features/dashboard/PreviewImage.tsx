import SimpleBar from 'simplebar-react';

export interface PreviewImage {
  id: string;
  base64: string;
  data: {
    name: string;
    description: string;
    sourceName: string;
    sourceUrl: string;
    tags: string[];
  };
}

export interface PreviewImageProps {
  img: PreviewImage;
  isSelected: boolean;
  onSelect: () => void;
  onClickRemove: () => void;
}
export const PreviewImage = ({ img, isSelected, onSelect, onClickRemove }: PreviewImageProps) => {
  return (
    <div className="w-full h-full relative group animate-fadeIn">
      <div className="h-56 w-auto">
        <img
          className="w-full h-full object-cover"
          src={`data:image/png;base64, ${img.base64}`}
          alt="screenshot"
        />
      </div>

      <div
        className={`absolute overflow-hidden flex flex-col p-2 justify-end text-left text-sm font-semibold top-0 w-full h-full border transition-[opacity,border]  ${
          isSelected
            ? 'opacity-70 border-neutral-300'
            : 'border-neutral-600 opacity-0 group-hover:opacity-70'
        }`}
      >
        <button
          onClick={onSelect}
          className="absolute z-20 top-2 right-2 h-fit w-fit font-bold rounded-md mb-1 p-0.5 transition-colors text-neutral-400 hover:text-neutral-50 border border-neutral-600 hover:border-neutral-400"
        >
          <span className="px-10">Crop</span>
        </button>
        <SimpleBar className="flex h-fit max-h-[5rem] w-full z-20">
          <div className=" h-1/2 w-full z-20">{img.data.sourceName}</div>
        </SimpleBar>
        <button
          type="button"
          onClick={onSelect}
          className="bg-neutral-900 absolute top-0 left-0 w-full h-full"
        />
        <button type="button" onClick={onSelect} className="absolute top-2 left-2 z-10">
          <div className="w-6 h-6 border-neutral-300 border rounded-md flex flex-col justify-center">
            <div
              className={`w-[18px] h-[18px] m-auto rounded-[3px] transition-colors ${
                isSelected ? 'bg-neutral-300' : 'bg-transparent'
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
};
