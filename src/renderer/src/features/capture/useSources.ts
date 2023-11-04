import { QueryConfig, ExtractFnReturnType } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';
import { Source } from './CaptureControl';
export interface ImageCache {
  id: string;
  base64: string;
}

export const sources = (): Promise<Source[]> => {
  console.log('fetched sources');
  return window.api.getSources();
};

type QueryFnType = typeof sources;

type UseSourcesOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useSources = ({ config }: UseSourcesOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['all-sources'],
    queryFn: sources,
  });
};
