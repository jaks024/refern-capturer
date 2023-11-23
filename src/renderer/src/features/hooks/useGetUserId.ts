import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const getUserId = ({}: {}): Promise<string> => {
  return window.api.getUserId();
};

type UseGetUserIdOptions = {
  config?: MutationConfig<typeof getUserId>;
};

export const useGetUserId = ({ config }: UseGetUserIdOptions) => {
  return useMutation({
    ...config,
    mutationFn: getUserId,
  });
};
