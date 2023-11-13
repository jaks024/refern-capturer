import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';
import { CacheData } from '../types';

export const captureSource = ({}): Promise<CacheData> => {
  return window.api.captureSource();
};

export const useCaptureSource = (config?: MutationConfig<typeof captureSource>) => {
  return useMutation({
    ...config,
    mutationFn: captureSource,
  });
};
