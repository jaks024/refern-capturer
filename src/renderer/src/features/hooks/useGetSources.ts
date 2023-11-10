import { QueryConfig, ExtractFnReturnType } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';
import { Source } from '../capture/CaptureControl';

export const getSources = (): Promise<Source[]> => {
  console.log('fetched sources');
  return window.api.getSources();
};

type QueryFnType = typeof getSources;

type UseSourcesOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useGetSources = ({ config }: UseSourcesOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['all-sources'],
    queryFn: getSources,
  });
};
