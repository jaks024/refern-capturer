import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const setUserToken = ({ userToken }: { userToken: string }): Promise<void> => {
  return window.api.setUserToken(userToken);
};

type UseSetUserTokenOptions = {
  config?: MutationConfig<typeof setUserToken>;
};

export const useSetUserToken = ({ config }: UseSetUserTokenOptions) => {
  return useMutation({
    ...config,
    mutationFn: setUserToken,
  });
};
