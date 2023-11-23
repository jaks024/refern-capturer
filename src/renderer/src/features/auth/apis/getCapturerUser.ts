import { axios } from '@renderer/libs/axios';
import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';
import { User } from '../types';

export const getCapturerUser = ({
  handle,
  accessCode,
}: {
  handle: string;
  accessCode: string;
}): Promise<User> => {
  return axios.get(`/user/capturer/${handle}/${accessCode}`);
};

type UseGetCapturerUserOptions = {
  config?: MutationConfig<typeof getCapturerUser>;
};

export const useGetCapturerUser = ({ config }: UseGetCapturerUserOptions) => {
  return useMutation({
    ...config,
    mutationFn: getCapturerUser,
  });
};
