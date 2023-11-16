import { PropsWithChildren } from 'react';
import { FormInput } from '../form/FormInput';
import { FormButton } from '../form/FormButton';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-center w-full h-screen">
      <div className="flex flex-col gap-8 h-fit p-16 justify-center m-auto border border-neutral-700 bg-neutral-800 rounded-md">
        <div>
          <div className="font-black text-xl">Hey! Let's sign in to refern.</div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xs text-neutral-400">Passcode</span>
          <div className="border border-neutral-700 rounded-md">
            <FormInput
              placeholder="my custom passcode"
              value={''}
              onChange={function (val: string): void {
                throw new Error('Function not implemented.');
              }}
            />
          </div>
          <div className="text-xs text-neutral-400">
            find your custom passcode in your{' '}
            <a href="#" className="text-indigo-600 font-black underline">
              settings page
            </a>{' '}
            in refern.
          </div>
        </div>
        <FormButton text="Let me in!" />
      </div>
    </div>
  );
};
