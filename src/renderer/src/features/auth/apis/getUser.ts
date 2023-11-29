import { axios } from '@renderer/libs/axios';
import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';
import { User } from '../types';

export const getUserData = ({ userId }: { userId: string }): Promise<User> => {
  return axios.get(`/capturer/user/${userId}`);
};

type UseGetUserOptions = {
  config?: MutationConfig<typeof getUserData>;
};

export const useGetUserFromId = ({ config }: UseGetUserOptions) => {
  return useMutation({
    ...config,
    mutationFn: getUserData,
  });
};
