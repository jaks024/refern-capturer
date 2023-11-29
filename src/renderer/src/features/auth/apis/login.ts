import { axios } from '@renderer/libs/axios';
import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';
import { User } from '../types';

export const login = ({
  handle,
  accessCode,
}: {
  handle: string;
  accessCode: string;
}): Promise<User> => {
  return axios.get(`/capturer/login`, {
    params: {
      at: handle,
      code: accessCode,
    },
  });
};

type UseLoginOptions = {
  config?: MutationConfig<typeof login>;
};

export const useLogin = ({ config }: UseLoginOptions) => {
  return useMutation({
    ...config,
    mutationFn: login,
  });
};
