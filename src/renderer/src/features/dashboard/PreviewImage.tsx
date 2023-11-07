import SimpleBar from 'simplebar-react';
import { FormInput } from '../form/FormInput';
import { TagEditor } from '../form/tag/TagEditor';

export interface ImageData {
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
  img: ImageData;
  onClickRemove: () => void;
  onChange: (field: string, value: string | string[]) => void;
}
export const PreviewImage = ({ img, onChange, onClickRemove }: PreviewImageProps) => {
  return (
    <div className="w-full h-full relative group animate-fadeIn">
      <div className="h-56 w-auto">
        <img
          className="w-full h-full object-cover"
          src={`data:image/png;base64, ${img.base64}`}
          alt="screenshot"
        />
      </div>

      <div className="absolute overflow-hidden flex flex-row p-2 justify-start text-left text-sm font-semibold bg-neutral-900 top-0 transition-opacity opacity-0 group-hover:opacity-70 w-full h-full">
        <SimpleBar className="flex h-full w-full p-1">
          <div className="flex flex-col z-10 h-fit w-full">
            <div className="flex justify-between pb-2">
              <button
                onClick={onClickRemove}
                className="relative h-fit w-fit rounded-md mb-1 p-0.5 transition-colors text-neutral-400 hover:text-neutral-50 border border-neutral-700 hover:border-neutral-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 m-0.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={onClickRemove}
                className="relative h-fit w-fit font-bold rounded-md mb-1 p-0.5 transition-colors text-neutral-400 hover:text-neutral-50 border border-neutral-700 hover:border-neutral-400"
              >
                <span className="px-10">Crop</span>
              </button>
            </div>

            <FormInput
              value={img.data.name}
              placeholder="image name"
              onChange={(value) => onChange('name', value)}
            />
            <FormInput
              value={img.data.description}
              placeholder="image description"
              onChange={(value) => onChange('description', value)}
            />
            <FormInput
              value={img.data.sourceName}
              placeholder="source name"
              onChange={(value) => onChange('sourceName', value)}
            />
            <FormInput
              value={img.data.sourceUrl}
              placeholder="source url"
              onChange={(value) => onChange('sourceUrl', value)}
            />
            <TagEditor tags={img.data.tags} onTagChange={(value) => onChange('tags', value)} />
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};
