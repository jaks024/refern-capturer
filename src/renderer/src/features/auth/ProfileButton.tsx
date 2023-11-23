import { useUser } from './hooks/useUser';

export const ProfileButton = () => {
  const { user, signOut } = useUser();
  return (
    <div className="flex flex-col p-2 gap-[1px]">
      <div className="text-xs font-black text-neutral-400">Logged in user</div>
      <button
        type="button"
        className={`relative animate-fadeIn flex justify-between w-full pl-2 py-1 text-sm border hover:border-neutral-600 hover:text-neutral-50 transition-colors hover:bg-neutral-700 rounded-md group bg-none text-neutral-400 border-neutral-800`}
        onClick={signOut}
      >
        <div className="text-start font-semibold pr-2">@{user?.at}</div>
        <div className="font-bold flex gap-1 pr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 my-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Sign out
        </div>
      </button>
    </div>
  );
};
