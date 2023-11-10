import { QueryConfig, ExtractFnReturnType } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';

export const getCaptureKeybind = (): Promise<string> => {
  console.log('fetched sources');
  return window.api.getCaptureKeybind();
};

type QueryFnType = typeof getCaptureKeybind;

export const useGetCaptureKeybind = (config?: QueryConfig<QueryFnType>) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['keybind-sequence'],
    queryFn: getCaptureKeybind,
  });
};
