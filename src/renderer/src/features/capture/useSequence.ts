import { QueryConfig, ExtractFnReturnType } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';

export const sequence = (): Promise<string> => {
  console.log('fetched sources');
  return window.api.getCaptureKeybind();
};

type QueryFnType = typeof sequence;

type UseSequenceOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useSequence = ({ config }: UseSequenceOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['keybind-sequence'],
    queryFn: sequence,
  });
};
