export const DeletableTags = ({
  tags,
  onTagDelete,
}: {
  tags: string[];
  onTagDelete: (t: string) => void;
}) => {
  if (tags?.length === 0) {
    return <div className="text-neutral-700 text-xs pl-1 mt-1">no existing tags</div>;
  }
  return (
    <>
      {tags?.map((t) => (
        <button
          key={t}
          type="button"
          className="relative inline-flex transition-colors hover:bg-neutral-800 mr-1 mt-1 p-1 leading-none border border-neutral-700 hover:border-red-500 rounded-md group/tag hover:text-red-500  animate-fadeIn"
          id={t}
          onClick={() => onTagDelete(t)}
        >
          {t}
          <div className="absolute w-full h-[2px] top-1/2 left-0 group group-hover/tag:opacity-100 opacity-0 transition-opacity">
            <div className="bg-red-500 h-full my-auto mx-1" />
          </div>
        </button>
      ))}
    </>
  );
};
