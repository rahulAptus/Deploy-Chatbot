import React from "react";

interface ChatbotResponse {
  response: string;
  display_output_format: string;
}

interface ChatbotData {
  chatbotResponse: ChatbotResponse[];
  sources: string[];
  images: string[];
  s3Sources: string[];
}

interface UserMessage {
  type: "user" | string;
  content: string;
  content_type: "text" | "audio";
}


interface BotMessage {
  type: "chatbot" | string;
  content: ChatbotData | string;
  content_type: "text" | "audio";
  audioId: string;
}
interface WebSocketProps {
  dispatch: React.Dispatch<any>;
  prompt: string;
  scrollToBottom: () => void;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  state: {
    audioOpen: boolean;
    loading: boolean;
    showResult: boolean;
  };
}

/**
 * @description - websocket hook that helps to utilise the websocket connection and helps the user to send the request
 * @param {WebSocketProps} props - props that are passed to the hook
 * @returns {object} - returns the sendRequest function
 * @example
 * const { sendRequest } = useWebsocket({
 *  props@params
 * });
 */

export const useWebsocket = (props: WebSocketProps) => {
  const chatSocketRef = React.useRef<ChatWebSocket | null>(null);

  const { dispatch, prompt, scrollToBottom, setPrompt, state } = props;

  class ChatWebSocket {
    private socket: WebSocket | null = null;
    private threadId: string | null = null;
    private url: string;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private heartbeatTimeout = 30000; // 30s
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private messageQueue: any[] = [];
    private isExplicitClose = false;

    constructor(baseUrl: string) {
      this.url = `${baseUrl}`;
      this.connect();
    }

    private connect() {
      this.socket = new WebSocket(this.url);
      this.isExplicitClose = false;

      this.socket.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.resetHeartbeat();
        if (data.type === "connection_established") {
          const threadId = data.thread_id;
          console.log(`Assigned thread ID: ${threadId}`);
          localStorage.setItem("thread_id", threadId);
          this.threadId = threadId;

          this.flushQueue();
        } else if (data.type === "ping") {
          this.send({ type: "pong" });
        } else {
          this.processResponse(data);
        }
      };

      this.socket.onclose = () => {
        console.log("WebSocket disconnected");
        this.stopHeartbeat();
        if (!this.isExplicitClose) {
          this.scheduleReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }

    private async processResponse(responseData: any) {
      const tempResp: ChatbotData = {
        chatbotResponse: [] as {
          response: string;
          display_output_format: string;
        }[],
        sources: [],
        images: [],
        s3Sources: [],
      };

      // Handle both single response and array of responses
      const responses = Array.isArray(responseData)
        ? responseData
        : [responseData];

      responses.forEach((response: any) => {
        let processedResponse = response.chatbot_response || response.response;
        const extractedSources: string[] = [];
        const extractedImages: string[] = [];

        const regularSources = [
          ...(response.sources ?? []),
          ...(response.relevant_sources ?? []),
        ];

        const s3SourceLinks = response.s3_sources
          ? response.s3_sources.map((s: any) => s.s3_bucket_link)
          : [];

        if (!response.s3_sources) {
          const extractedS3Links = regularSources.filter((source) =>
            source.startsWith("https://aptus-agentic-ai-bot.s3.amazonaws.com/")
          );
          s3SourceLinks.push(...extractedS3Links);
        }
        tempResp.s3Sources.push(...s3SourceLinks);

        tempResp.images.push(...(response.images ?? []));

        tempResp.sources.push(
          ...regularSources.filter(
            (source) =>
              typeof source === "string" && !s3SourceLinks.includes(source)
          )
        );

        if (
          processedResponse &&
          response.display_output_format === "Markdown"
        ) {
          const imageRegex = /!\[.*?\]\((.*?)\)/g;
          let imageMatch;
          while ((imageMatch = imageRegex.exec(processedResponse)) !== null) {
            const imageUrl = imageMatch[1];
            if (
              !tempResp.images.includes(imageUrl) &&
              !extractedImages.includes(imageUrl)
            ) {
              extractedImages.push(imageUrl);
            }
          }
          processedResponse = processedResponse.replace(/!\[.*?\]\(.*?\)/g, "");

          const sourcesRegex = /- Sources: (.*?)(?=\n\n|$)/gs;
          processedResponse = processedResponse.replace(
            sourcesRegex,
            (sourcesText: string) => {
              const urls = sourcesText.match(/https?:\/\/[^\s,)]+/g) || [];
              urls.forEach((url: string) => {
                if (
                  !tempResp.sources.includes(url) &&
                  !s3SourceLinks.includes(url) &&
                  !extractedSources.includes(url)
                ) {
                  extractedSources.push(url);
                }
              });
              return "";
            }
          );

          const urlRegex = /https?:\/\/[^\s)\]]+/g;
          const mediaDomains = ["media.licdn.com"];
          const imageExtensions =
            /\.(jpg|jpeg|png|gif|svg|webp|bmp|tiff)(\?.*)?$/i;

          processedResponse = processedResponse.replace(
            urlRegex,
            (url: string) => {
              if (imageExtensions.test(url)) return "";
              if (mediaDomains.some((domain) => url.includes(domain)))
                return "";
              if (
                !tempResp.sources.includes(url) &&
                !s3SourceLinks.includes(url) &&
                !extractedSources.includes(url)
              ) {
                extractedSources.push(url);
              }
              return "";
            }
          );

          processedResponse = processedResponse.replace(
            /^\s*[-•*]\s*$\n?/gm,
            ""
          );
          processedResponse = processedResponse.replace(/\n{3,}/g, "\n\n");
          processedResponse = processedResponse.trim();
          tempResp.images.push(...extractedImages);
          tempResp.sources.push(...extractedSources);
        }

        tempResp.chatbotResponse.push({
          response: processedResponse,
          display_output_format: response.display_output_format ?? "TEXT",
        });
      });

      console.log("Processed Data:", tempResp);

      const botMessage: BotMessage = {
        type: "chatbot",
        content: tempResp,
        content_type: "text",
        audioId: "",
      };

      dispatch({ type: "SET_RESULT", payload: botMessage });
      dispatch({ type: "TOGGLE_SOURCES", payload: true });
      dispatch({ type: "TOGGLE_LOADING", payload: false });
    }

    private startHeartbeat() {
      this.stopHeartbeat();
      this.heartbeatTimer = setTimeout(() => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          console.warn("Heartbeat timeout - reconnecting");
          this.socket.close();
        }
      }, this.heartbeatTimeout);
    }

    private resetHeartbeat() {
      this.stopHeartbeat();
      this.startHeartbeat();
    }

    private stopHeartbeat() {
      if (this.heartbeatTimer) {
        clearTimeout(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    }

    public send(message: any) {
      if (this.socket?.readyState === WebSocket.OPEN) {
        if (!this.threadId) {
          console.error("Thread ID is not available. Queueing the message.");
          this.messageQueue.push(message); // Queue the message if thread_id is not yet available
          return;
        }

        // Proceed with sending the message when thread_id is available
        const payload = { ...message, thread_id: this.threadId };
        this.socket.send(JSON.stringify(payload));
      } else {
        this.messageQueue.push(message); // Queue the message if WebSocket is not open
      }
    }

    private flushQueue() {
      if (!this.threadId) {
        console.log("Thread ID is not assigned yet. Waiting...");
        return; // Don't flush until threadId is assigned
      }

      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift();
        this.send(msg); // Send the message once thread_id is available
      }
    }

    private scheduleReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(
          this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
          30000
        );
        console.log(`Reconnecting in ${delay}ms...`);

        setTimeout(() => this.connect(), delay);
      } else {
        console.error("Max reconnection attempts reached");
      }
    }

    public close() {
      this.isExplicitClose = true;
      this.stopHeartbeat();
      this.socket?.close();
    }
  }

  React.useEffect(() => {
    chatSocketRef.current = new ChatWebSocket("ws://localhost:8000/ws/prompt");
    return () => {
      chatSocketRef.current?.close();
    };
  }, []);

  const sendRequest = async () => {
    const savedThreadId = localStorage.getItem("thread_id");
    setPrompt("");
    if (state.audioOpen == false && prompt.trim() !== "") {
      const userMessage: UserMessage = {
        type: "user",
        content: prompt,
        content_type: "text",
      };

      dispatch({ type: "SET_RESULT", payload: userMessage });
      dispatch({
        type: "SEND_PROMPT",
        payload: { showResult: false, loading: true },
      });
      setTimeout(scrollToBottom, 50);

      try {
        if (chatSocketRef.current) {
          chatSocketRef.current.send({
            type: "user_message",
            prompt: prompt,
            audio: false,
            thread_id: savedThreadId,
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        dispatch({
          type: "SEND_PROMPT",
          payload: { showResult: true, loading: false },
        });
      }
    }
  };
  return { sendRequest };
};
