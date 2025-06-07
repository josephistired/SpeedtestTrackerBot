const baseURL = `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`;

module.exports = {
  endpoints: {
    getLatest: () => `${baseURL}/api/v1/results/latest`,
    getStats: () => `${baseURL}/api/v1/stats`,
    // getResults: () => `${baseURL}/api/v1/results`,
    getResultById: (id) => `${baseURL}/api/v1/results/${id}`,
    runSpeedTest: () => `${baseURL}/api/v1/speedtests/run`,
    // getServers: () => `${baseURL}/api/v1/`
  },
};
