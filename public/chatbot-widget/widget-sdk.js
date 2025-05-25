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
      width: 100%;
      height: 100%;
      display: block;
      z-index: 9999;
    }

    #chatbot-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  `;
  document.head.appendChild(style);

  // Chatbot container
  const container = document.createElement("div");
  container.id = "chatbot-container";

  const iframe = document.createElement("iframe");
  iframe.id = "chatbot-iframe";
  iframe.src = "https://deploy-chatbot-p66m.vercel.app/";
  container.appendChild(iframe);
  document.body.appendChild(container);
})();
