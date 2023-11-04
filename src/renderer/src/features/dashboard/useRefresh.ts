import { QueryConfig, ExtractFnReturnType } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';

export interface ImageCache {
  id: string;
  base64: string;
}

export const refresh = (): Promise<ImageCache[]> => {
  console.log('fetched refresh');
  return window.api.getAllCaptureBuffer();
};

type QueryFnType = typeof refresh;

type UseRefreshOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useRefresh = ({ config }: UseRefreshOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['capture'],
    queryFn: refresh,
  });
};
