import { FINAL_REQUEST_ADDRESS } from './env';

export default {
  dev: {
    '/api': {
      target: FINAL_REQUEST_ADDRESS,
      changeOrigin: true,
      // pathRewrite: { "^/api": "" },
    },
  },
};
