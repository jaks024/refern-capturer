import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { FormInput } from '../form/FormInput';
import { FormButton } from '../form/FormButton';
import { useLogin } from './apis/login';
import { UserContext, UserContextType } from './UserContext';
import { useSetUserToken } from '../hooks/useSetUserToken';
import { useGetUserToken } from '../hooks/useGetUserToken';
import { User } from './types';
import { useGetUserFromId } from './apis/getUser';
import { queryClient } from '@renderer/libs/reactQuery';
import { setAxiosAuthHeader } from '@renderer/libs/axios';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [handle, setHandle] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  const [isSignInFailed, setIsSignInFailed] = useState(false);

  const [user, setUser] = useState<User>();

  const { mutate: setCacheUserToken } = useSetUserToken({});

  const updateUser = (u: User | undefined, id: string) => {
    setAccessCode('');
    setHandle('');
    queryClient.clear();
    setInitialLoad(true);
    console.log('UPDATED USER', u, id);
    setUser(u);
    if (u) {
      const token = btoa(JSON.stringify({ id, code: u?.capturerAccessCode }));
      setCacheUserToken({ userToken: token });
      setAxiosAuthHeader(token);
    } else {
      setCacheUserToken({ userToken: '' });
      setAxiosAuthHeader('');
    }
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

  const { mutate: getCacheUserToken } = useGetUserToken({
    config: {
      onSuccess(data, _, __) {
        if (data && data.length > 0) {
          try {
            const decodedToken = JSON.parse(atob(data));
            console.log(decodedToken);
            if (decodedToken.id && decodedToken.code) {
              setAxiosAuthHeader(data);
              getUserFromId({ userId: decodedToken.id });
            }
          } catch {
            console.log('FAILED TO DECODE');
          }
        }
      },
    },
  });

  // fresh login
  const { mutate: getUser } = useLogin({
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
    getCacheUserToken({});
  }, []);

  useEffect(() => {
    if (initialLoad) {
      setTimeout(() => {
        setInitialLoad(false);
      }, 1000);
    }
  }, [initialLoad]);

  if (initialLoad) {
    return (
      <div className="absolute top-0 left-0 flex justify-center w-full h-screen z-20 bg-neutral-900 ">
        <div className="flex flex-col justify-center animate-pulse font-black text-xs">
          loading...
        </div>
      </div>
    );
  }

  if (!user || user === undefined) {
    return (
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
    );
  }

  return <UserContext.Provider value={contextData}>{children}</UserContext.Provider>;
};
