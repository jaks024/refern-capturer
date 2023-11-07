export const ReadOnlyTags = ({ tags }: { tags: string[] }) => {
  return (
    <>
      {tags.map((t) => {
        return (
          <span
            key={t}
            className="inline-flex leading-none p-1 mr-0.5 mt-0.5 border border-neutral-600 rounded-md animate-fadeIn"
          >
            {t}
          </span>
        );
      })}{' '}
    </>
  );
};
