import { useClickOutside } from '@renderer/hooks/useClickOutside';
import { useEffect, useRef, useState } from 'react';
import { useSetCaptureKeybind } from './useSetCaptureKeybind';
import { useSequence } from './useSequence';

export interface CaptureKeybinderProp {
  onBind: (keybind: string) => void;
}

export const CaptureKeybinder = ({ onBind }: CaptureKeybinderProp) => {
  const [isListening, setIsListening] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [sequence, setSequence] = useState('');
  const ref = useRef(null);
  const isListeningRef = useRef(isListening);

  const { data: fetchedSequence, refetch } = useSequence({});
  const { mutate } = useSetCaptureKeybind({
    config: {
      onSuccess() {
        refetch();
      },
    },
  });

  useEffect(() => {
    if (fetchedSequence) {
      onBind(fetchedSequence);
      setSequence(fetchedSequence);
    }
  }, [fetchedSequence]);

  useClickOutside(ref, () => {
    setIsListening(false);
    isListeningRef.current = false;
    setKeys(new Set());
  });

  const getSequence = () => {
    return [...keys].reduce((acc, current) => {
      if (acc === '') {
        return current;
      }
      return `${acc}+${current}`;
    }, '');
  };

  const onBindClick = () => {
    if (isListeningRef.current) {
      const seq = getSequence();
      if (seq.length > 0) {
        mutate({ keybind: seq });
      }
    }
    setKeys(new Set());
    setIsListening(!isListening);
    isListeningRef.current = !isListeningRef.current;
  };

  const getKeybindText = () => {
    if (!isListeningRef.current) {
      return `Shortcut: ${sequence}`;
    }
    console.log(keys);
    return `New Keybind: ${getSequence().toLocaleUpperCase()}`;
  };

  useEffect(() => {
    const addKeys = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!isListeningRef.current) {
        return;
      }
      console.log('pressed', e.key);
      setKeys((prev) => new Set([...prev, e.key.length == 1 ? e.key.toUpperCase() : e.key]));
    };
    window.addEventListener('keyup', addKeys);
    return () => {
      window.removeEventListener('keyup', addKeys);
    };
  }, []);

  return (
    <div>
      <button
        ref={ref}
        type="button"
        className={`relative animate-fadeIn flex w-full pl-2 py-1 text-sm border hover:border-neutral-600 hover:text-neutral-50 transition-colors hover:bg-neutral-700 rounded-md group ${
          isListening
            ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
            : 'bg-none text-neutral-400 border-neutral-800'
        }`}
        onClick={onBindClick}
      >
        {isListeningRef.current ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 my-auto mr-1"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 my-auto mr-1"
          >
            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
          </svg>
        )}

        <div className="text-start font-semibold break-words w-full pr-2">{getKeybindText()}</div>
      </button>
      {isListeningRef.current ? (
        <div className="text-xs text-neutral-500">
          start pressing keys one by one
          <br />
          click again to save
          <br />
          click anywhere else to cancel
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
