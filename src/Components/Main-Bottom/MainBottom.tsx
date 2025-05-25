import React from "react";
import { motion } from "framer-motion";
import AudioInput from "../../AudioContainer/AudioInput.tsx";
import ChatInput from "../ChatInput/ChatInput.tsx";

interface ChatProps {
  audioOpen: boolean;
  toggleChat: () => void;
  promptRef: React.RefObject<HTMLTextAreaElement | null>;
  sendRequest: () => void;
  setPrompt: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  prompt: string;
  isRecording: boolean;
  stopRecording: () => void;
  startRecording: () => void;
  showResult: boolean;
  isSidebarOpen: boolean;
  isBooking: boolean;
  promptRefSend: React.RefObject<HTMLInputElement | null>;
  promptSend: string;
  setPromptSend: (value: string) => void;
  sendMessage: () => void;
  theme: string;
}

const MainBottom: React.FC<ChatProps> = ({
  audioOpen,
  toggleChat,
  promptRef,
  sendRequest,
  setPrompt,
  handleKeyPress,
  prompt,
  isRecording,
  stopRecording,
  startRecording,
  showResult,
  isSidebarOpen,
  isBooking,
  promptRefSend,
  promptSend,
  setPromptSend,
  sendMessage,
  theme,
}) => {
  return (
    <>
      <motion.div
        className={
          isSidebarOpen
            ? "fixed bottom-[1.25em] max-sm:px-4 max-sm:bottom-7 xl:left-0 max-sm:w-full xl:w-[54em] z-10 flex flex-col xl:ml-[30em] h-[5em] max-sm:h-[3em] justify-around items-center rounded-[0.625em] transition-all duration-500 ease-in-out"
            : "fixed bottom-10 w-[23em] max-sm:px-4 max-sm:bottom-7 max-sm:w-full z-10 h-[4em] max-sm:h-[3em] rounded-[0.625em] transition-all duration-500 ease-in-out flex flex-col gap-2"
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          boxShadow: "none",
          zIndex: 10,
        }}
      >
        {!audioOpen && (
          <ChatInput
            toggleChat={toggleChat}
            promptRef={promptRef}
            sendRequest={sendRequest}
            setPrompt={setPrompt}
            handleKeyPress={handleKeyPress}
            prompt={prompt}
            showResult={showResult}
            isBooking={isBooking}
            promptRefSend={promptRefSend}
            promptSend={promptSend}
            setPromptSend={setPromptSend}
            sendMessage={sendMessage}
            theme={theme}
          />
        )}
        {audioOpen && (
          <AudioInput
            toggleChat={toggleChat}
            isRecording={isRecording}
            stopRecording={stopRecording}
            startRecording={startRecording}
            theme={theme}
          />
        )}
        <div className="flex flex-col items-center justify-center gap-2 font-default font-light">
          <p>Annie generated content may be inaccurate.</p>
        </div>
      </motion.div>
    </>
  );
};

export default MainBottom;
