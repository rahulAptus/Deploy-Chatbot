(function () {
  const clientOrigin = window.location.origin;

  window.addEventListener("message", (event) => {
    if (event.data === "request-client-origin") {
      const iframe = document.getElementById("chatbot-iframe");
      iframe?.contentWindow?.postMessage({ origin: clientOrigin }, "*");
    }
  });
  const style = document.createElement("style");
  style.textContent = `
    #chatbot-container {
      position:absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 9999;
    }

    #chatbot-iframe {
      width: 100%;
      height: 100%;
      border: none;
      position:absolute;
      bottom: 0;
      right: 0;
      z-index: 9999;
    }
  `;
  document.head.appendChild(style);

  // Chatbot container
  const container = document.createElement("div");
  container.id = "chatbot-container";

  const iframe = document.createElement("iframe");
  iframe.id = "chatbot-iframe";
  iframe.src = "https://annie-chatbot.vercel.app/";
  container.appendChild(iframe);
  document.body.appendChild(container);
})();
