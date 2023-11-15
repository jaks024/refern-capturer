import { MutationConfig } from '@renderer/libs/reactQuery';
import { useMutation } from '@tanstack/react-query';

export const setSnipKeybind = ({ keybind }: { keybind: string }): Promise<boolean> => {
  return window.api.setSnipKeybind(keybind);
};

type UseSetSnipKeybindOptions = {
  config?: MutationConfig<typeof setSnipKeybind>;
};

export const useSetSnipKeybind = ({ config }: UseSetSnipKeybindOptions) => {
  return useMutation({
    ...config,
    mutationFn: setSnipKeybind,
  });
};
