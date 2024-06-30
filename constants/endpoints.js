const baseURL = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`;

module.exports = {
  endpoints: {
    getLatest: () => `${baseURL}/api/speedtest/latest`,
    getHealthCheck: () => `${baseURL}/api/healthcheck`,
  },
};
