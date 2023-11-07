import { useState } from 'react';
import { DeletableTags } from './DeletableTags';
import { FormInput } from '../FormInput';
import { FormButton } from '../FormButton';

export interface TagEditorProps {
  tags: string[];
  onTagChange: (tags: string[]) => void;
}

export const TagEditor = (props: TagEditorProps) => {
  const [newTag, setNewTag] = useState('');

  const isTagValid = (tag: string, existingTags: string[]) => {
    return tag.length > 0 && tag.length < 20 && existingTags.find((x) => x === tag) === undefined;
  };

  const onTagDelete = (toDelete: string) => {
    props.onTagChange(props.tags.filter((x) => x !== toDelete));
  };

  const onClickAdd = () => {
    props.onTagChange([...props.tags, newTag.toLocaleLowerCase()]);
    setNewTag('');
  };

  return (
    <div className="flex flex-col">
      <form className="flex flex-row gap-1" onSubmit={onClickAdd}>
        <FormInput value={newTag} onChange={setNewTag} placeholder="new tag" />
        <FormButton
          onClick={onClickAdd}
          submit
          disabled={!isTagValid(newTag, props.tags)}
          notPadded
        >
          <span className="py-1">+</span>
        </FormButton>
      </form>
      <div>
        <DeletableTags tags={props.tags} onTagDelete={onTagDelete} />
      </div>
    </div>
  );
};
