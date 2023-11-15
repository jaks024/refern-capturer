import { PropsWithChildren, ReactNode } from 'react';

export interface DropdownItemProps {
  name: string;
  icon?: ReactNode;
  function: () => void;
}

export interface DropdownMenuProps extends PropsWithChildren {
  isOpen: boolean;
  items?: DropdownItemProps[];
  openUp?: boolean;
}

export const DropdownMenu = ({ isOpen, items, openUp, children }: DropdownMenuProps) => {
  if (!isOpen || (items && items.length == 0)) {
    return <></>;
  }

  const DropdownList = () => {
    return (
      <div className="flex flex-col">
        {items ? (
          items.map((item, idx) => (
            <button
              key={`dropdown-item-${idx}`}
              className="flex w-full text-neutral-400 gap-1 hover:text-neutral-50 transition-colors hover:bg-neutral-600 text-left p-1 pr-2.5 rounded-md"
              onClick={item.function}
            >
              {item.icon}
              <span className="text-xs m-auto mx-0 font-semibold">{item.name}</span>
            </button>
          ))
        ) : (
          <></>
        )}
        {children}
      </div>
    );
  };

  return (
    <div
      className={`absolute animate-fadeIn w-fit border border-neutral-600 overflow-hidden bg-neutral-700 left-0 z-10 rounded-md shadow-lg ${
        openUp ? 'bottom-[32px]' : 'top-[32px]'
      }`}
    >
      {DropdownList()}
    </div>
  );
};
