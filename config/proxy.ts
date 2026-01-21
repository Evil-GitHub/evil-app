import { FINAL_REQUEST_ADDRESS } from './config';

export default {
  dev: {
    '/api': {
      target: FINAL_REQUEST_ADDRESS,
      changeOrigin: true,
      // pathRewrite: { "^/api": "" },
    },
  },
};
