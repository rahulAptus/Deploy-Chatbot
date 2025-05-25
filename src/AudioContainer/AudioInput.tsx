import React from "react";
import { motion } from "framer-motion";
import { Square, Mic, X } from "lucide-react";

interface AudioProps {
  toggleChat: () => void;
  isRecording: boolean;
  stopRecording: () => void;
  startRecording: () => void;
  theme: string;
}
const AudioInput: React.FC<AudioProps> = ({
  toggleChat,
  isRecording,
  stopRecording,
  startRecording,
  theme,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, translateX: -10 }}
      transition={{ duration: 0.5 }}
      className={`${
        theme === "light"
          ? "bg-white border border-raspberry-rose"
          : "bg-white"
      }    flex justify-between items-center xl:min-h-[5.5em] max-sm:min-h-[0.5em] max-sm:w-full xl:w-[60em] gap-5 xl:px-4 xl:py-[0.8em] max-sm:px-3 max-sm:py-[0.32em] border-[1px_solid_#c63e8c] rounded-[0.625em]`}
    >
      <button
        className={`xl:w-[3.2em] xl:h-[3.2em] max-sm:w-[4em] max-sm:h-[3em] rounded-[50%] border-none bg-[#ff4b4b] cursor-pointer flex items-center justify-center transition-all duration-300 ease shadow-[0_4px_12px_rgba(255,75,75,0.3)] hover:scale-110 hover:shadow-[0_6px_16px_rgba(255,75,75,0.4)] ${
          isRecording ? "animate-pulse" : ""
        }`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? (
          <Square className="w-6 h-6 text-[var(--white)]" />
        ) : (
          <Mic className="w-6 h-6 text-[var(--white)]" />
        )}
      </button>
      <p className="py-2.5 px-1.5 xl:text-[1em] max-sm:text-[1em] font-default text-[#686868]">
        Click the microphone to start recording
      </p>
      <motion.div
        className="text-[var(--medium-persian-blue)] cursor-pointer"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
      >
        <X className="xl:w-8 xl:h-8 max-sm:w-7 max-sm:h-7" />
      </motion.div>
    </motion.div>
  );
};

export default AudioInput;
