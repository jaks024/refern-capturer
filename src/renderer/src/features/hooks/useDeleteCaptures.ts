import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const deleteCaptures = ({ ids }: { ids: string[] }): Promise<void> => {
  return window.api.deleteCaptures(ids);
};

export const useDeleteCaptures = (config?: MutationConfig<typeof deleteCaptures>) => {
  return useMutation({
    ...config,
    mutationFn: deleteCaptures,
  });
};
