const API_BASE_URL = "http://localhost:8000";
const WEBSOCKET_URL = "ws://localhost:8000"
const apiRoutes = {
  getPrompt: `${API_BASE_URL}/prompt`,
  getAudio: `${API_BASE_URL}/audio`,
  proxyPass: `${API_BASE_URL}/proxy`,
  linkPreview: `${API_BASE_URL}/get-link-preview`,
  startweb: `${WEBSOCKET_URL}/ws/start?thread_id`,
  connectweb: `${WEBSOCKET_URL}/ws?thread_id`,
};

export default apiRoutes;
