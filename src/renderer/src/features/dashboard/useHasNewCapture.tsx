import { QueryConfig, ExtractFnReturnType } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';

export const hasNewCapture = (): Promise<boolean> => {
  console.log('fetched has new capture');
  return window.api.hasNewCapture();
};

type QueryFnType = typeof hasNewCapture;

type UseHasNewCaptureOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useHasNewCapture = ({ config }: UseHasNewCaptureOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['capture', 'has-new'],
    queryFn: hasNewCapture,
  });
};
