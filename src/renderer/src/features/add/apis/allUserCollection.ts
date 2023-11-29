import { axios } from '@renderer/libs/axios';
import { QueryConfig } from '@renderer/libs/reactQuery';
import { useQuery } from '@tanstack/react-query';

export interface CollectionSimple {
  _id: string;
  name: string;
  folderName: string;
  imageCount: number;
}

export const allUserCollection = ({ userId }: { userId: string }): Promise<CollectionSimple[]> => {
  return axios.get(`/capturer/collection/all/${userId}`);
};

type QueryFnType = typeof allUserCollection;

type UseAllUserCollectionOptions = {
  userId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useAllUserCollection = ({ userId, config }: UseAllUserCollectionOptions) => {
  return useQuery({
    ...config,
    queryKey: [userId, 'all_collection'],
    queryFn: () => allUserCollection({ userId }),
  });
};
