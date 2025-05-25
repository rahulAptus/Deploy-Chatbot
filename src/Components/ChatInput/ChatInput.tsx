import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

interface ChatInputProps {
  promptRef: React.RefObject<HTMLTextAreaElement | null>;
  setPrompt: (value: string) => void;
  sendRequest: () => void;
  toggleChat: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  prompt: string;
  isBooking: boolean;
  promptRefSend: React.RefObject<HTMLInputElement | null>;
  promptSend: string;
  setPromptSend: (value: string) => void;
  sendMessage: () => void;
  showResult: boolean;
  theme: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  promptRef,
  setPrompt,
  sendRequest,
  toggleChat,
  handleKeyPress,
  prompt,
  // showResult,
  isBooking,
  promptRefSend,
  promptSend,
  setPromptSend,
  sendMessage,
  theme,
}) => {
  // const [placeholder, setPlaceholder] = React.useState("");
  const [placeAgent, setPlaceAgent] = React.useState("");
  const handleKeySend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  useEffect(() => {
    console.log("📌 isBooking changed:", isBooking);
  }, [isBooking]);

  // useEffect(() => {
  //   const placeholderText = [
  //     "Where Innovation Meets Conversation",
  //     "Where Technology Meets Thinking",
  //     "Where Ideas Meet Execution",
  //   ];
  //   const rotatePlaceholder = () => {
  //     const randomIndex = Math.floor(Math.random() * placeholderText.length);
  //     setPlaceholder(placeholderText[randomIndex]);
  //   };
  //   rotatePlaceholder();
  //   const intervalId = setInterval(rotatePlaceholder, 3000);
  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    const placeholderAgent = [
      "Please provide the required information...",
      `Write "Exit" if you want to exit out of the booking...`,
      "Please provide the required details for the meeting...",
    ];
    const rotatePlaceholder = () => {
      const randomIndex = Math.floor(Math.random() * placeholderAgent.length);
      setPlaceAgent(placeholderAgent[randomIndex]);
    };
    rotatePlaceholder();
    const intervalId = setInterval(rotatePlaceholder, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div
        className={`flex justify-between max-sm:w-full gap-6 px-4 rounded-full z-50 transition-all duration-500 ease-in-out ${
          theme === "light"
            ? "bg-white border border-mulberry"
            : "bg-white border border-neutral-600"
        }`}
      >
        {isBooking ? (
          <motion.input
            ref={promptRefSend}
            onChange={(e) => setPromptSend(e.target.value)}
            value={promptSend}
            type="text"
            placeholder={`${placeAgent}`}
            onKeyDown={handleKeySend}
            className={`max-sm:h-14 flex-1 rounded-none outline-none px-4 text-[0.8em] font-default transition-all duration-500 ease-in-out ${
              theme === "light"
                ? "xl:text-black bg-transparent placeholder:text-neutral-600"
                : "xl:text-[#353535] bg-transparent placeholder:text-neutral-600"
            }`}
          />
        ) : (
          <div className="flex flex-col-reverse w-full relative">
            <motion.textarea
              ref={promptRef}
              onChange={(e) => {
                setPrompt(e.target.value);
                e.target.style.height = "0px";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              value={prompt}
              rows={1}
              maxLength={100}
              placeholder={`Type your message here...`}
              onKeyDown={handleKeyPress}
              className={`flex-1 box-content resize-none rounded-none overflow-hidden outline-none px-1 py-4 text-[1em] max-sm:text-[0.9em] font-default transition-all duration-500 ease-in-out  ${
                theme === "light"
                  ? "xl:text-black bg-transparent placeholder:text-zinc-500"
                  : "xl:text-[#353535] bg-transparent placeholder:text-neutral-500"
              }`}
            ></motion.textarea>
          </div>
        )}
        <div className="flex items-center gap-3">
          {promptSend && (
            <motion.img
              onClick={sendMessage}
              src={theme === "light" ? assets.send_icon2 : assets.send_icon1}
              alt="Send-Button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer w-[1.2em]"
            />
          )}
          {prompt && (
            <motion.img
              onClick={sendRequest}
              src={theme === "light" ? assets.send_icon2 : assets.send_icon1}
              alt="Send-Button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer w-[1.2em]"
            />
          )}
          <motion.img
            onClick={toggleChat}
            src={theme === "light" ? assets.mic_icon2 : assets.mic_icon1}
            alt="Send-Button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer w-[1.2em]"
          />
        </div>
      </div>
    </>
  );
};

export default ChatInput;
