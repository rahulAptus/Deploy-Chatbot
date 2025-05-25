import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AccountTree,
  ContactSupport,
  Description,
  Event,
  Groups,
  Inventory2,
} from "@mui/icons-material";

interface FAQProps {
  setPrompt: (value: string) => void;
  sendRequest: (prompt: string) => void;
  isSidebarOpen: boolean;
  theme: string;
}

const FAQ: React.FC<FAQProps> = ({
  setPrompt,
  isSidebarOpen,
  theme,
}) => {
  const allFAQs = [
    {
      text: "Give a brief introduction about Aptus Data Labs",
      icon: <Description className="!h-5 !w-5 text-white" />,
    },
    {
      text: "What are the Projects covered by the Aptus Data Labs",
      icon: <AccountTree className="!h-5 !w-5 text-white" />,
    },
    {
      text: "What are the Products developed by the Aptus Data Labs",
      icon: <Inventory2 className="!h-5 !w-5 text-white" />,
    },
    {
      text: "Book a meeting with Aptus Data Labs for further queries",
      icon: <Event className="!h-5 !w-5 text-white" />,
    },
    {
      text: "How to contact with the team at Aptus Data Labs for further queries",
      icon: <ContactSupport className="!h-5 !w-5 text-white" />,
    },
    {
      text: "AI Conferences attended by Aptus Data Labs",
      icon: <Groups className="!h-5 !w-5 text-white" />,
    },
  ];

  const [currentFAQs, setCurrentFAQs] = useState<typeof allFAQs>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    updateDisplayedFAQs(0);
    const interval = setInterval(() => {
      rotateFAQs();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateDisplayedFAQs = (startIndex: number) => {
    const nextIndex = startIndex % allFAQs.length;
    const nextFAQs = [];
    for (let i = 0; i < 3; i++) {
      const index = (nextIndex + i) % allFAQs.length;
      nextFAQs.push(allFAQs[index]);
    }
    setCurrentFAQs(nextFAQs);
    setCurrentIndex(nextIndex);
  };

  const rotateFAQs = () => {
    const nextIndex = (currentIndex + 1) % allFAQs.length;
    updateDisplayedFAQs(nextIndex);
  };

  return (
    <div
      className={
        isSidebarOpen
          ? "flex max-sm:ml-[0em] w-full transition-all duration-500 ease-in-out font-default"
          : "flex max-sm:ml-[0em] w-full transition-all duration-500 ease-in-out font-default"
      }
    >
      <motion.div
        className="flex flex-col w-full gap-2 flex-wrap max-sm:mx-auto max-sm:gap-4 max-sm:p-0 max-sm:flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {currentFAQs.map((item, index) => (
          <motion.div
            onClick={() => {
              setPrompt(item.text);
            }}
            key={`${currentIndex}-${index}`}
            className={
              isSidebarOpen
                ? `xl:w-[32%] xl:h-44 max-sm:w-[11em] mx-auto max-sm:h-40 p-[0.8em] bg-[#3d3d3b] rounded-[1.2em] flex flex-col justify-between select-none hover:bg-[#557826] transition-colors duration-200 ease-in-out ${
                    theme === "light"
                      ? "bg-raspberry-rose hover:bg-sky-800"
                      : ""
                  }`
                : `max-sm:w-full xl:w-full mx-auto max-sm:h-28 py-2 px-4 rounded-lg max-sm:rounded-lg flex items-center gap-4 select-none hover:bg-[#557826] transition-colors duration-200 ease-in-out ${
                    theme === "light" ? "bg-mulberry hover:bg-sky-800" : ""
                  }`
            }
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="xl:hidden flex items-center gap-2 w-full">
              <div className="w-4 bg-white flex items-center justify-center rounded-full">
                {item.icon}
              </div>
              <p className="text-[var(--white)] text-[0.9em] max-sm:text-[0.8em]">
                {item.text}
              </p>
            </div>

            <div className="max-sm:hidden flex items-center justify-center max-sm:w-[1.8em] rounded-[1.2em] bottom-2.5 right-2.5">
              {item.icon}
            </div>
            <p className="max-sm:hidden text-[var(--white)] text-[0.9em] max-sm:text-[0.7em]">
              {item.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FAQ;
