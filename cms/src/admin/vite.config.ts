import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    css: {
      postcss: {
        plugins: [],
      },
    },
  });
};
