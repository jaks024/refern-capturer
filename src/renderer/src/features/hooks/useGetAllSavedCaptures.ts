import { QueryConfig, ExtractFnReturnType } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';
import { ImageData } from '../types';

export const getAllSavedCaptures = (): Promise<ImageData[]> => {
  console.log('fetched refresh');
  return window.api.getAllSavedCaptures();
};

type QueryFnType = typeof getAllSavedCaptures;

export const useGetAllSavedCaptures = (config?: QueryConfig<QueryFnType>) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['all-capture'],
    queryFn: getAllSavedCaptures,
  });
};
