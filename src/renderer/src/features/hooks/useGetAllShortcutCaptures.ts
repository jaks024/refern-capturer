import { QueryConfig, ExtractFnReturnType } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';
import { CacheData } from '../types';

export const getAllShortcutCaptures = (): Promise<CacheData[]> => {
  console.log('fetched refresh');
  return window.api.getAllShortcutCaptures();
};

type QueryFnType = typeof getAllShortcutCaptures;

export const useGetAllShortcutCaptures = (config?: QueryConfig<QueryFnType>) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['capture-refresh'],
    queryFn: getAllShortcutCaptures,
  });
};
