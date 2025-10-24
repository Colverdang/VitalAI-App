// frontend/src/utils/config.js
const config = {
  api: {
    url: process.env.REACT_APP_API_URL || 'http://localhost:8000', // FastAPI runs on 8000 by default
  },
  timeouts: {
    api: 30000,
    chat: 60000,
  },
  development: {
    debug: process.env.NODE_ENV === 'development',
  }
};

export default config;