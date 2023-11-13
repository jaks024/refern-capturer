import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';
import { CacheData } from '../types';

export const updateCacheMeta = (data: CacheData): Promise<void> => {
  return window.api.updateCacheMeta(data);
};

export const useUpdateCacheMeta = (config?: MutationConfig<typeof updateCacheMeta>) => {
  return useMutation({
    ...config,
    mutationFn: updateCacheMeta,
  });
};
