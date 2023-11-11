import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const updateCacheRaw = ({ id, raw }: { id: string; raw: string }): Promise<void> => {
  return window.api.updateCacheRaw(id, raw);
};

export const useUpdateCacheRaw = (config?: MutationConfig<typeof updateCacheRaw>) => {
  return useMutation({
    ...config,
    mutationFn: updateCacheRaw,
  });
};
