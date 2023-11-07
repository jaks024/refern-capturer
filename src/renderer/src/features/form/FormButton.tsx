export interface FormButtonProps {
  text?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  submit?: boolean;
  className?: string;
  notPadded?: boolean;
}

export const FormButton = ({
  text,
  children,
  onClick,
  disabled,
  submit,
  className,
  notPadded,
}: FormButtonProps) => {
  return (
    <button
      type={submit ? 'submit' : 'button'}
      className={`h-fit w-fit flex flex-col border transition-[border,background,color] text-sm px-3 font-semibold rounded-md ${
        disabled
          ? 'bg-neutral-800 border-neutral-700 text-neutral-600'
          : 'bg-neutral-700 border-neutral-600 hover:bg-neutral-500 hover:border-neutral-400 active:bg-neutral-600 active:border-neutral-500'
      } ${className}
      ${notPadded ? 'p-0' : 'p-1.5'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
      {children}
    </button>
  );
};
