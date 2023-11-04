export interface PreviewImageProps {
  imgBase64: string;
}
export const PreviewImage = ({ imgBase64 }: PreviewImageProps) => {
  return (
    <div className="w-full h-full animate-fadeIn">
      <div className="h-52 w-auto">
        <img src={`data:image/png;base64, ${imgBase64}`} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};
