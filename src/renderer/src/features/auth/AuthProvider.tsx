import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { FormInput } from '../form/FormInput';
import { FormButton } from '../form/FormButton';
import { useGetCapturerUser } from './apis/getCapturerUser';
import { UserContext, UserContextType } from './UserContext';
import { useSetUserId } from '../hooks/useSetUserId';
import { useGetUserId } from '../hooks/useGetUserId';
import { User } from './types';
import { useGetUserFromId } from './apis/getUser';
import { queryClient } from '@renderer/libs/reactQuery';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [handle, setHandle] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  const [isSignInFailed, setIsSignInFailed] = useState(false);

  const [user, setUser] = useState<User>();

  const { mutate: setCacheUserId } = useSetUserId({});

  const updateUser = (u: User | undefined, id: string) => {
    console.log('UPDATED USER', u, id);
    setCacheUserId({ userId: id });
    setUser(u);
    setAccessCode('');
    setHandle('');
    queryClient.clear();
  };

  // login from cache
  const { mutate: getUserFromId } = useGetUserFromId({
    config: {
      onSuccess(data, _, __) {
        if (data) {
          console.log('RETRIEVED USER FROM ID CACHE');
          updateUser(data, data._id);
        } else {
          updateUser(undefined, '');
        }
      },
    },
  });

  const { mutate: getCacheUserId } = useGetUserId({
    config: {
      onSuccess(data, _, __) {
        if (data && data.length > 0) {
          getUserFromId({ userId: data });
        }
      },
    },
  });

  // fresh login
  const { mutate: getUser } = useGetCapturerUser({
    config: {
      onSuccess(data, _, __) {
        if (data) {
          updateUser(data, data._id);
          setIsSignInFailed(false);
          setInitialLoad(true);
        } else {
          setIsSignInFailed(true);
        }
      },
    },
  });

  const contextData: UserContextType = useMemo(() => {
    return {
      user,
      signOut: () => updateUser(undefined, ''),
    };
  }, [user]);

  useEffect(() => {
    getCacheUserId({});
  }, []);

  useEffect(() => {
    if (initialLoad) {
      setTimeout(() => {
        setInitialLoad(false);
      }, 1000);
    }
  }, [initialLoad]);

  return (
    <>
      {initialLoad ? (
        <div className="absolute top-0 left-0 flex justify-center w-full h-screen z-20 bg-neutral-900 ">
          <div className="flex flex-col justify-center animate-pulse font-black text-xs">
            loading...
          </div>
        </div>
      ) : (
        <></>
      )}
      {!user || user === undefined ? (
        <div className="flex justify-center w-full h-screen animate-fadeIn">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-8 h-fit p-16 justify-center m-auto border border-neutral-700 bg-neutral-800 rounded-md"
          >
            <div>
              <div className="font-black text-xl">Hey! Let's sign in to refern.</div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-neutral-400">@</span>
              <div className="border border-neutral-700 rounded-md">
                <FormInput placeholder="@myhandle" value={handle} onChange={setHandle} />
              </div>
              <span className="font-bold text-xs text-neutral-400">Access Code</span>
              <div className="border border-neutral-700 rounded-md">
                <FormInput
                  type="password"
                  placeholder="my custom access code"
                  value={accessCode}
                  onChange={setAccessCode}
                />
              </div>
              <div className="text-xs text-neutral-400">
                find your custom access code in your{' '}
                <a href="refern.app/settings" className="text-indigo-400 font-black underline">
                  settings page
                </a>{' '}
                in refern.
              </div>
            </div>
            <div>
              <FormButton
                disabled={handle.length <= 0 || accessCode.length < 6}
                text="Sign in!"
                onClick={() => {
                  getUser({ handle, accessCode });
                }}
                submit
              />
              {isSignInFailed ? (
                <div className=" font-bold text-xs text-red-400">
                  Failed to sign in. Maybe access code or @ is wrong?
                </div>
              ) : (
                <></>
              )}
            </div>
          </form>
        </div>
      ) : (
        <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
      )}
    </>
  );
};
