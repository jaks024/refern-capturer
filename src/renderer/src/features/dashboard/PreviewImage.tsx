import SimpleBar from 'simplebar-react';
import { FormInput } from '../form/FormInput';
import { TagEditor } from '../form/tag/TagEditor';
import { useState } from 'react';
import { CacheData } from '../types';

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
  onCrop: () => void;
  onSave: (dto: CacheData) => void;
}
export const PreviewImage = ({ img, isSelected, onSelect, onCrop, onSave }: PreviewImageProps) => {
  const [name, setName] = useState(img.data.name);
  const [description, setDescription] = useState(img.data.description);
  const [sourceName, setSourceName] = useState(img.data.sourceName);
  const [sourceUrl, setSourceUrl] = useState(img.data.sourceUrl);
  const [tags, setTags] = useState(img.data.tags);

  const canSave = () => {
    return (
      name !== img.data.name ||
      description !== img.data.description ||
      sourceName !== img.data.sourceName ||
      sourceUrl !== img.data.sourceUrl ||
      tags !== img.data.tags
    );
  };

  const onSaveClick = () => {
    if (canSave()) {
      onSave({ id: img.id, name, description, sourceName, sourceUrl, tags, base64: '' });
    }
  };

  return (
    <div className="w-full h-full relative group animate-fadeIn">
      <div className="h-[17rem] w-auto">
        <img
          className="w-full h-full object-cover"
          src={`data:image/png;base64, ${img.base64}`}
          alt="screenshot"
        />
      </div>

      <div
        className={`absolute overflow-hidden flex flex-col p-2 justify-end text-left text-sm font-semibold top-0 w-full h-full border transition-[opacity,border]  ${
          isSelected
            ? 'opacity-90 border-neutral-300'
            : 'border-neutral-600 opacity-0 group-hover:opacity-90'
        }`}
      >
        <button
          onClick={onCrop}
          className="absolute z-20 top-2 right-2 h-fit w-fit font-bold rounded-md mb-1 p-0.5 transition-colors text-neutral-400 hover:text-neutral-50 border border-neutral-600 hover:border-neutral-400"
        >
          <span className="px-10">Crop</span>
        </button>
        <SimpleBar className="flex h-fit max-h-[13rem] w-full z-20">
          <div className="flex flex-col z-10 h-fit w-full">
            <FormInput value={name} placeholder="image name" onChange={setName} />
            <FormInput
              value={description}
              placeholder="image description"
              onChange={setDescription}
            />
            <FormInput value={sourceName} placeholder="source name" onChange={setSourceName} />
            <FormInput value={sourceUrl} placeholder="source url" onChange={setSourceUrl} />
            <TagEditor tags={tags} onTagChange={setTags} />
            <button
              onClick={onSaveClick}
              disabled={!canSave()}
              className={`h-fit w-full font-bold rounded-md mt-1 p-0.5 transition-colors  border  ${
                canSave()
                  ? 'text-neutral-300 hover:text-neutral-50 border-neutral-500 hover:border-neutral-300 active:bg-neutral-700'
                  : 'border-neutral-800 text-neutral-600'
              }`}
            >
              <span className="px-10">Save</span>
            </button>
          </div>
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
