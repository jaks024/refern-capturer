import { QueryConfig, ExtractFnReturnType } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';
import { ImageData } from '../types';

export const getAllShortcutCaptures = (): Promise<ImageData[]> => {
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
