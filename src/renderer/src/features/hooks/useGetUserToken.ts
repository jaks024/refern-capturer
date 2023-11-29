import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const getUserToken = ({}: {}): Promise<string> => {
  return window.api.getUserToken();
};

type UseGetUserTokenOptions = {
  config?: MutationConfig<typeof getUserToken>;
};

export const useGetUserToken = ({ config }: UseGetUserTokenOptions) => {
  return useMutation({
    ...config,
    mutationFn: getUserToken,
  });
};
