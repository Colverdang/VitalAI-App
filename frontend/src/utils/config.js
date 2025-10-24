const config = {
  api: {
    url: process.env.REACT_APP_API_URL || 'http://localhost:8000',
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