import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const setCaptureKeybind = ({ keybind }: { keybind: string }): Promise<boolean> => {
  return window.api.setCaptureKeybind(keybind);
};

type UseSetCaptureKeybindOptions = {
  config?: MutationConfig<typeof setCaptureKeybind>;
};

export const useSetCaptureKeybind = ({ config }: UseSetCaptureKeybindOptions) => {
  return useMutation({
    ...config,
    mutationFn: setCaptureKeybind,
  });
};
