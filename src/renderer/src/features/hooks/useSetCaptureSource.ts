import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const setCaptureSource = ({ newSourceId }: { newSourceId: string }): Promise<void> => {
  return window.api.setCaptureSource(newSourceId);
};

export const useSetCaptureSource = (config?: MutationConfig<typeof setCaptureSource>) => {
  return useMutation({
    ...config,
    mutationFn: setCaptureSource,
  });
};
