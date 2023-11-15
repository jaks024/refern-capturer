import { QueryConfig, ExtractFnReturnType } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';

export const getSnipKeybind = (): Promise<string> => {
  return window.api.getSnipKeybind();
};

type QueryFnType = typeof getSnipKeybind;

export const useGetSnipKeybind = (config?: QueryConfig<QueryFnType>) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['snip-keybind'],
    queryFn: getSnipKeybind,
  });
};
