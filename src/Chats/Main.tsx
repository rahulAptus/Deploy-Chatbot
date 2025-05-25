/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import ChatLoader from "../Components/Chatloader/Chatloader.tsx";
import FAQ from "../Components/Cards-FAQ/FAQ.tsx";
import WaveSurfer from "wavesurfer.js";
import Sources from "./Sources.tsx";
import Sidebar from "../SideBar/SideBar.tsx";
import MainBottom from "../Components/Main-Bottom/MainBottom.tsx";
import AudioOutput from "../AudioContainer/AudioOutput.tsx";
import { useWebsocket } from "../utils/Websocket.ts";
import { assets } from "../assets/assets.ts";
import "./Main.css";
import apiRoutes from "../utils/urls.ts";
import {
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaFileExcel,
  FaFile,
  FaFolder,
} from "react-icons/fa";
import Caption from "./Caption.tsx";
import { ToastContainer } from "react-toastify";
import { initialState, MainReducer } from "../utils/MainReducer.ts";
import { Images, SelectedImage } from "./Images.tsx";

interface MainProps {
  theme: string;
  handleTheme: () => void;
}

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

interface WebSocketResponse {
  chatbot_response: string;
  display_output_format: "Markdown" | "HTML" | "TEXT";
}

const Main = ({ theme }: MainProps) => {
  const [prompt, setPrompt] = useState("");
  const chatContainerRef = useRef(null);
  const [threadId, setThreadId] = useState(0);
  const dummyRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const audioChunks = useRef<Blob[]>([]);
  const waveformRefs = useRef<{ [key: string]: { ref: any; wavesurfer: any } }>(
    {}
  );
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [promptSend, setPromptSend] = useState("");
  const [state, dispatch] = useReducer(MainReducer, initialState);
  const promptRefSend = useRef<HTMLInputElement>(null);

  const webSocketprops = {
    dispatch,
    prompt,
    scrollToBottom: () => {},
    setPrompt,
    state: {
      audioOpen: state.audioOpen,
      loading: state.loading,
      showResult: state.showResult,
    },
  };

  const { sendRequest } = useWebsocket(webSocketprops);

  useEffect(() => {
    setThreadId(Math.floor(Math.random() * 1000000));
  }, []);

  useEffect(() => {
    const triggerWs = new WebSocket(`${apiRoutes.startweb}=${threadId}`);

    triggerWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.type === "trigger") {
          dispatch({ type: "TRIGGER_RECEIVED" });
          const query = data.query;
          connectWebSocket(query);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    triggerWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [threadId]);

  const connectWebSocket = (query: string) => {
    const currentPrompt = query;
    console.log(`[LOG]:${threadId}`);
    console.log(`[LOG]:${currentPrompt}`);
    const ws = new WebSocket(
      `${apiRoutes.connectweb}=${threadId}&user_query=${currentPrompt}`
    );
    dispatch({ type: "SET_WEBSOCKET", payload: ws });

    ws.onopen = () => console.log("[LOG]:Connected to /ws WebSocket");
    dispatch({ type: "SET_SHOW_RESULT", payload: false });

    ws.onmessage = (event) => {
      console.log("[LOG]:WebSocket Response:", event);
      const response = JSON.parse(event.data);
      console.log("[QUESTION]:", event.data);
      const tempResp: ChatbotData = {
        chatbotResponse: [] as {
          response: string;
          display_output_format: string;
        }[],
        sources: [],
        images: [],
        s3Sources: [],
      };

      response.forEach((res: WebSocketResponse) => {
        tempResp.chatbotResponse.push({
          response: res.chatbot_response,
          display_output_format: res.display_output_format || "Markdown",
        });
      });

      const botMessage: BotMessage = {
        type: "chatbot",
        content: tempResp,
        content_type: "text",
        audioId: "",
      };

      dispatch({ type: "SET_RESULT", payload: botMessage });

      const type = response[0].type;

      switch (true) {
        case type === "initial-query":
          dispatch({ type: "SET_CURRENT_STEP", payload: "date_time" });
          break;

        case type === "invalid-date" || type === "date":
          dispatch({ type: "SET_CURRENT_STEP", payload: "date" });
          break;

        case type === "slots-not-available" || type === "slots-available":
          dispatch({ type: "SET_CURRENT_STEP", payload: "time" });
          break;

        case type === "invalid-time":
          dispatch({ type: "SET_CURRENT_STEP", payload: "start_time" });
          break;

        case type === "email":
          dispatch({ type: "SET_CURRENT_STEP", payload: "email" });
          break;

        case type === "validate-email":
          break;

        case type === "invalid-email":
          dispatch({ type: "SET_CURRENT_STEP", payload: "email" });
          break;

        case type === "valid-email":
          dispatch({ type: "SET_CURRENT_STEP", payload: "name" });
          break;

        case type === "title":
          dispatch({ type: "SET_CURRENT_STEP", payload: "title" });
          break;

        case type === "satisfaction":
          dispatch({ type: "SET_CURRENT_STEP", payload: "satisfied" });
          break;

        case type === "meeting-agent":
          dispatch({ type: "SET_CURRENT_STEP", payload: "meet-agent" });
          break;

        default:
          dispatch({ type: "SET_CURRENT_STEP", payload: "" });
          break;
      }
    };

    ws.onerror = (error) => console.error("[LOG]:WebSocket error:", error);
    ws.onclose = () => {
      dispatch({ type: "RESET_BOOKING" });
      console.log("[LOG]:WebSocket Closed");
    };
  };

  const sendMessage = () => {
    const userMessage: UserMessage = {
      type: "user",
      content: promptSend,
      content_type: "text",
    };

    dispatch({ type: "SET_RESULT", payload: userMessage });

    if (state.websocket && promptSend.trim()) {
      console.log("CurrentStep :", state.currentStep);
      const message = { [state.currentStep]: promptSend };
      state.websocket.send(JSON.stringify(message));
      setPromptSend("");
    }
  };

  useEffect(() => {
    state.result.forEach((entry) => {
      if (
        entry.type === "chatbot" &&
        entry.audioId &&
        entry.content_type === "audio"
      ) {
        if (!waveformRefs.current[entry.audioId]) {
          waveformRefs.current[entry.audioId] = {
            ref: React.createRef(),
            wavesurfer: null,
          };
        }

        const containerRef = waveformRefs.current[entry.audioId].ref;

        if (
          containerRef?.current &&
          !waveformRefs.current[entry.audioId].wavesurfer
        ) {
          const wavesurfer = WaveSurfer.create({
            container: containerRef.current,
            waveColor: "#0062a5",
            progressColor: "#8cc63e",
            cursorColor: "#4353FF",
            barWidth: 3,
            barRadius: 3,
            cursorWidth: 1,
            height: 50,
          });

          wavesurfer.load(entry.content.chatbotResponse[0]?.response);

          wavesurfer.on("ready", () => {
            wavesurfer.play();
            dispatch({
              type: "SET_PLAYING_STATES",
              payload: { [entry.audioId]: true },
            });
          });

          wavesurfer.on("pause", () => {
            dispatch({
              type: "SET_PLAYING_STATES",
              payload: { [entry.audioId]: false },
            });
          });

          wavesurfer.on("finish", () => {
            dispatch({
              type: "SET_PLAYING_STATES",
              payload: { [entry.audioId]: false },
            });
          });

          waveformRefs.current[entry.audioId].wavesurfer = wavesurfer;
        }
      }
    });
  }, [state.result]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      let silenceStart: any = null;
      const silenceThreshold = 3000;
      let audioRecorded = false;

      const uploadAudio = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });

        if (audioBlob.size < 1000) {
          alert("Recorded audio is too short. Please try again.");
          return;
        }

        const audioFile = new File([audioBlob], "recording.webm", {
          type: "audio/webm",
        });
        const formData = new FormData();
        formData.append("file", audioFile);
        formData.append("model", "whisper-1");

        try {
          dispatch({ type: "SET_SHOW_RESULT", payload: false });
          const response = await axios.post(apiRoutes.proxyPass, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.data?.text) {
            const userText = response.data.text;
            console.log(userText);

            const userMessage: UserMessage = {
              type: "user",
              content: userText,
              content_type: "audio",
            };
            dispatch({ type: "SET_RESULT", payload: userMessage });
            sendTextToFastAPI(userText);
          } else {
            alert("[LOG]:Transcription returned empty. Please record again.");
          }
        } catch (error) {
          console.error("[ERROR]:Error during transcription:", error);
          alert("[LOG]:Failed to transcribe audio. Please try again.");
        }
      };

      const stopRecording = async (silenceDetected = false) => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
        clearInterval(silenceInterval);

        dispatch({ type: "TOGGLE_RECORDING", payload: false });

        if (silenceDetected && !audioRecorded) {
          alert("[LOG]:Only silence detected. Please speak and try again.");
          return;
        }

        if (audioRecorded && audioChunks.current.length > 0) {
          await uploadAudio();
        }
      };

      const checkSilence = () => {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const value = (dataArray[i] - 128) / 128;
          sum += value * value;
        }
        const rms = Math.sqrt(sum / bufferLength);

        if (rms < 0.01) {
          if (!silenceStart) silenceStart = Date.now();

          if (Date.now() - silenceStart > silenceThreshold) {
            stopRecording(true);
          }
        } else {
          silenceStart = null;
          audioRecorded = true;
        }
      };

      const silenceInterval = setInterval(checkSilence, 500);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        clearInterval(silenceInterval);
        audioContext.close();

        if (audioRecorded && audioChunks.current.length > 0) {
          await uploadAudio();
        }
      };

      mediaRecorderRef.current.start();
      dispatch({ type: "TOGGLE_RECORDING", payload: true });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    dispatch({ type: "TOGGLE_RECORDING", payload: false });
  };

  const handlePlayPause = (audioId: string) => {
    Object.keys(waveformRefs.current).forEach((id) => {
      if (id !== audioId && waveformRefs.current[id]?.wavesurfer?.isPlaying()) {
        waveformRefs.current[id].wavesurfer.pause();
        dispatch({
          type: "SET_PLAYING_STATES",
          payload: { [id]: false },
        });
      }
    });

    const wavesurfer = waveformRefs.current[audioId]?.wavesurfer;
    if (!wavesurfer) return;
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
      dispatch({
        type: "SET_PLAYING_STATES",
        payload: { [audioId]: false },
      });
    } else {
      wavesurfer.play();
      dispatch({
        type: "SET_PLAYING_STATES",
        payload: { [audioId]: true },
      });
    }
  };

  const sendTextToFastAPI = async (text: string) => {
    if (!text || text.trim() === "") {
      console.error("Error: No text to send!");
      return;
    }
    console.log(text);
    dispatch({ type: "TOGGLE_LOADING", payload: true });
    console.log(
      "[LOG] : Loading",
      dispatch({ type: "TOGGLE_LOADING", payload: true })
    );
    try {
      const tempResp: ChatbotData = {
        chatbotResponse: [] as {
          response: string;
          display_output_format: string;
        }[],
        sources: [],
        images: [],
        s3Sources: [],
      };
      const response = await axios.post(apiRoutes.getPrompt, {
        prompt: text,
        thread_id: 123,
        audio: true,
      });
      dispatch({ type: "TOGGLE_SOURCES", payload: true });
      console.log(response.data);
      const audioId = `waveform-${Date.now()}`;
      waveformRefs.current[audioId] = {
        ref: React.createRef(),
        wavesurfer: null,
      };

      response.data.forEach((res: (typeof response.data)[number]) => {
        tempResp.chatbotResponse.push({
          response: `${apiRoutes.getAudio}/${res.chatbot_response}`,
          display_output_format: res.display_output_format,
        });

        const regularSources = [
          ...(res.sources ?? []),
          ...(res.relevant_sources ?? []),
        ];

        const s3SourceLinks = res.s3_sources
          ? res.s3_sources.map((s: any) => s.s3_bucket_link)
          : [];

        if (!res.s3_sources) {
          const extractedS3Links = regularSources.filter((source) =>
            source.startsWith("https://aptus-agentic-ai-bot.s3.amazonaws.com/")
          );
          s3SourceLinks.push(...extractedS3Links);
        }

        tempResp.sources.push(
          ...regularSources.filter(
            (source) =>
              typeof source === "string" && !s3SourceLinks.includes(source)
          )
        );

        tempResp.images.push(...(res.images ?? []));

        tempResp.s3Sources.push(...s3SourceLinks);
      });

      const botMessage: BotMessage = {
        type: "chatbot",
        content: tempResp,
        content_type: "audio",
        audioId: audioId,
      };
      dispatch({ type: "SET_RESULT", payload: botMessage });
    } catch (error) {
      console.error("[ERROR]:", error);
    } finally {
      dispatch({ type: "TOGGLE_LOADING", payload: false });
    }
  };

  const toggleChat = useCallback(() => {
    dispatch({ type: "TOGGLE_AUDIO_OPEN", payload: !state.audioOpen });
  }, [state.audioOpen, dispatch]);

  const scrollToBottom = () => {
    setTimeout(() => {
      dummyRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.result, state.loading, state.chatHistory]);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR_OPEN", payload: !state.isSidebarOpen });
  }, [state.isSidebarOpen]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendRequest();
    }
  };

  return (
    <>
      <div className="flex flex-col mx-auto w-full h-full">
        <AnimatePresence>
          {state.isSidebarOpen && (
            <motion.div
              className="min-h-[100vh] absolute z-50"
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
            >
              <Sidebar
                isSidebarOpen={state.isSidebarOpen}
                toggleSidebar={toggleSidebar}
                theme={theme}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="max-sm:mt-10 xl:grow-1 xl:mx-auto xl:w-[90%] h-full overflow-y-auto scrollbar-hide"
          ref={chatContainerRef}
        >
          {state.showResult ? (
            <div
              className={`transition-all duration-300 ease-in-out
                ${
                  state.isSidebarOpen
                    ? `${
                        theme === "light"
                          ? `bg-linear-to-br from-[#0581d4] to-[#8ad627]`
                          : `bg-neutral-800`
                      } xl:w-[57%] xl:ml-[26.5em] flex flex-col justify-between h-110 items-center p-4 rounded-2xl`
                    : `${
                        theme === "light" ? `` : `bg-neutral-800`
                      } xl:w-full max-sm:w-[95%] max-sm:mx-auto xl:mx-auto mt-8 flex flex-col gap-5 max-sm:gap-4 max-sm:overflow-y-auto scrollbar-hide items-center p-2 max-sm:p-3 rounded-2xl`
                }`}
            >
              <div className="max-sm:hidden xl:w-[10em] font-default flex flex-col items-center">
                <img src={assets.AnnieLogo} />
                <span className="font-light text-lg">AI-Powered Assistant</span>
              </div>
              <Caption theme={theme} isSidebarOpen={state.isSidebarOpen} />
              <FAQ
                theme={theme}
                setPrompt={setPrompt}
                sendRequest={sendRequest}
                isSidebarOpen={state.isSidebarOpen}
              />
            </div>
          ) : (
            <>
              <div
                className={
                  state.isSidebarOpen
                    ? "xl:w-full xl:pb-14 flex flex-col gap-4 grow overflow-y-auto scroll-smooth xl:pl-[17.5em] transition-all duration-500 ease-in-out font-default scrollbar-hidden"
                    : "xl:w-[100%] max-sm:mx-auto max-sm:w-[90%] xl:pb-[3.125em] flex flex-col gap-2 grow overflow-y-auto scroll-smooth transition-all duration-500 ease-in-out font-default scrollbar-hidden"
                }
              >
                {...state.result.map((entry: any, index: number) => (
                  <div
                    key={index}
                    className={`flex w-full items-start ${
                      entry.type === "user"
                        ? `flex items-center max-w-full p-3 shadow-[0_0.32em_0.32em_rgba(0,0,0,0.15)] text-white rounded-[0.5em] text-[1em] font-normal text-right mt-5 mb-3 ${
                            theme === "light" ? "bg-emerald-700" : "bg-iridium"
                          }`
                        : "flex gap-6 ml-2.5"
                    }`}
                  >
                    <div
                      className={
                        state.isSidebarOpen
                          ? "w-full flex flex-col gap-1"
                          : "w-full flex flex-col gap-1"
                      }
                    >
                      {entry.type === "chatbot" ? (
                        <>
                          {entry.content.sources.length > 0 &&
                            state.showSources && (
                              <>
                                <Sources
                                  sources={entry.content.sources.map(
                                    (src: []) => ({
                                      text: src,
                                    })
                                  )}
                                  showSources={state.showSources}
                                  isSidebarOpen={state.isSidebarOpen}
                                  theme={theme}
                                />
                              </>
                            )}
                          {entry.content_type === "audio" ? (
                            <AudioOutput
                              waveformRefs={waveformRefs}
                              playingStates={state.playingStates}
                              handlePlayPause={handlePlayPause}
                              entryId={entry.audioId}
                            />
                          ) : entry.content.chatbotResponse.length > 0 &&
                            !entry.audio ? (
                            <div
                              className={`transition-colors duration-500 ease-in-out animate-fadeUp flex flex-col gap-4 ${
                                theme === "light"
                                  ? "text-black font-light"
                                  : "text-white font-light"
                              }`}
                            >
                              {entry.content.chatbotResponse.map(
                                (msg: ChatbotResponse, idx: number) =>
                                  msg?.response ? (
                                    msg.display_output_format === "HTML" ? (
                                      <div
                                        key={idx}
                                        className="backdrop-filter-none shadow-none bg-transparent p-0"
                                      >
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: msg.response,
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <ReactMarkdown key={idx}>
                                        {msg.response}
                                      </ReactMarkdown>
                                    )
                                  ) : null
                              )}
                            </div>
                          ) : null}

                          {entry.content.images &&
                            entry.content.images.length > 0 && (
                              <div
                                className={`flex gap-5 pt-4 rounded-[0.75em] animate-fadeIn cursor-pointer`}
                              >
                                {entry.content.images.map(
                                  (img: string, idx: number) => (
                                    <>
                                      <Images
                                        img={img}
                                        idx={idx}
                                        key={idx}
                                        theme={theme}
                                        dispatch={dispatch}
                                      />
                                    </>
                                  )
                                )}
                              </div>
                            )}

                          {state.selectedImage && (
                            <SelectedImage
                              selectedImage={state.selectedImage}
                              dispatch={dispatch}
                            />
                          )}

                          {entry.content.s3Sources?.length > 0 && (
                            <div
                              className={`p-2.5 rounded-[0.5em] w-[99%] mt-5 ${
                                theme === "light"
                                  ? "bg-sky-800"
                                  : "bg-[#41413f]"
                              } `}
                            >
                              <p className="text-[1.2em] text-white m-0">
                                Relevant Documents
                              </p>
                              {entry.content.s3Sources.map(
                                (source: string, idx: number) => {
                                  if (!source || typeof source !== "string") {
                                    return null;
                                  }

                                  const fileName = decodeURIComponent(
                                    source.split("/").pop() || "Unknown File"
                                  );
                                  const fileExtension =
                                    fileName.split(".").pop()?.toLowerCase() ||
                                    "";

                                  let fileIcon = <FaFolder />;
                                  switch (fileExtension) {
                                    case "pdf":
                                      fileIcon = <FaFilePdf />;
                                      break;
                                    case "pptx":
                                      fileIcon = <FaFilePowerpoint />;
                                      break;
                                    case "docx":
                                      fileIcon = <FaFileWord />;
                                      break;
                                    case "xlsx":
                                      fileIcon = <FaFileExcel />;
                                      break;
                                    default:
                                      fileIcon = <FaFile />;
                                  }

                                  return (
                                    <div
                                      key={`s3-source-${idx}`}
                                      className="mt-2"
                                    >
                                      <a
                                        href={source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-atlantis-green font-medium flex items-center gap-2 hover:underline"
                                      >
                                        {fileIcon} {fileName}
                                      </a>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full">{entry.content}</div>
                      )}
                    </div>
                  </div>
                ))}
                {state.loading && (
                  <ChatLoader isSidebarOpen={state.isSidebarOpen} />
                )}
                <div ref={dummyRef} className="mb-[6.5em]" />
              </div>
            </>
          )}
          <MainBottom
            audioOpen={state.audioOpen}
            toggleChat={toggleChat}
            promptRef={promptRef}
            sendRequest={sendRequest}
            setPrompt={setPrompt}
            handleKeyPress={handleKeyPress}
            prompt={prompt}
            isRecording={state.isRecording}
            stopRecording={stopRecording}
            startRecording={startRecording}
            showResult={state.showResult}
            isSidebarOpen={state.isSidebarOpen}
            isBooking={state.isBooking}
            promptRefSend={promptRefSend}
            promptSend={promptSend}
            setPromptSend={setPromptSend}
            sendMessage={sendMessage}
            theme={theme}
          />
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Main;
