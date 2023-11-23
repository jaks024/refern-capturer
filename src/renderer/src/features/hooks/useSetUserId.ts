import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const setUserId = ({ userId }: { userId: string }): Promise<void> => {
  return window.api.setUserId(userId);
};

type UseSetUserIdOptions = {
  config?: MutationConfig<typeof setUserId>;
};

export const useSetUserId = ({ config }: UseSetUserIdOptions) => {
  return useMutation({
    ...config,
    mutationFn: setUserId,
  });
};
