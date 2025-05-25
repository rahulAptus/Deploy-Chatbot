import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faComment,
  faFile,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  toggleSidebar,
  theme,
}) => {
  return (
    <motion.div
      className={`max-sm:w-[18em] max-sm:z-50 xl:w-[calc(25%-90px)] h-min-[100vh] flex flex-col justify-between items-center px-5 py-2.5 fixed inset-y-0 left-0 z-50 shadow-[0px_4px_10px_rgba(0,0,0,0.05)] ${
        theme === "light"
          ? "bg-linear-[25deg,#cae0f2_5%,#e2f4d0_70%]"
          : "bg-[var(--medium-gray)]"
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div>
        <div
          onClick={toggleSidebar}
          style={{ cursor: "pointer" }}
          className={`p-[0.4em] w-[20%] hover:bg-[var(--black-eel)] hover:rounded-2xl ${
            theme === "light" ? "hover:bg-emerald-200" : ""
          }`}
        >
          <img
            src={theme === "light" ? assets.SidebarClose1 : assets.SidebarClose}
          />
        </div>
        <div className="flex items-center justify-between w-full my-[0.8em] mx-0">
          <img
            src={assets.AnnieLogo}
            alt="Logo"
            className="max-sm:w-[15em] w-[72%]"
          />
        </div>
        {isSidebarOpen && (
          <>
            <div className="text-[var(--white)] font-default font-medium leading-[1.6] rounded-[0.5em] w-full">
              <div
                className={`w-full  p-[0.8em] rounded-[0.5em] ${
                  theme === "light" ? "bg-sky-700" : "bg-[var(--black-eel)]"
                }`}
              >
                {[
                  `I'm your AI assistant, ready to help with any questions , analyze
                  documents, and gain insights effortlessly.`,
                ].map((text, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-start g-[0.5em]"
                  >
                    <div className="w-[1em] h-[1em] rounded-full absolute max-sm:left-[16.1em] max-sm:top-[7.5em] left-[16.5em] top-[8.2em] bg-[var(--atlantis-green)] animate-blink"></div>
                    <p className="tracking-[0.03em] font-medium text-[0.9em]">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features Section */}
            <h2
              className={`max-sm:text-center max-sm:text-[1.7em] max-sm:my-[0.5em] text-[1.4em] font-bold font-default my-[0.5em] ${
                theme === "light" ? "text-atlantis-green" : "text-white"
              }`}
            >
              Key Features
            </h2>
            <div className="w-full flex flex-col gap-4">
              {[
                {
                  icon: faComment,
                  title: "Smart Conversations",
                  description: "Natural AI-driven conversations",
                },
                {
                  icon: faFile,
                  title: "Document Analysis",
                  description: "Analyze and Extract insights",
                },
                {
                  icon: faShieldHalved,
                  title: "Secure and Private",
                  description: "Your data is safe & protected.",
                },
                {
                  icon: faBolt,
                  title: "Faster Response Time",
                  description: "Get accurate & instant responses.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`max-sm:h-[5.5em] max-sm:p-2 w-full flex items-center p-4 gap-4 rounded-[0.8em] font-default cursor-pointer h-20 transition all delay-75 ease-in-out ${
                    theme === "light"
                      ? "bg-sky-700 hover:bg-sky-900 hover:scale-105 hover:shadow-[0px_4px_10px_rgba(0,98,165,0.1)]"
                      : "bg-black-eel hover:bg-[var(--heavy-metal)] hover:scale-110 hover:shadow-[0px_4px_10px_rgba(0,98,165,0.1)]"
                  }`}
                >
                  <div
                    className={`flex justify-center items-center w-[3em] h-[2.5em] rounded-[0.5em] ${
                      theme === "light" ? "bg-sky-900" : "bg-[rgb(61,61,61)] "
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={feature.icon}
                      size="lg"
                      color="#8cc63e"
                    />
                  </div>
                  <div className="flex flex-col w-full text-[var(--white)]">
                    <h4 className="text-[0.9em] font-semibold tracking-wide">
                      {feature.title}
                    </h4>
                    <p className="text-[0.9em]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Section */}
            <div
              className={`text-[1.1em] text-center opacity-70 mt-[1em] font-default font-bold ${
                theme === "light" ? "text-medium-persian-blue" : "text-white"
              }`}
            >
              <p>© 2025 AskAptus</p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
