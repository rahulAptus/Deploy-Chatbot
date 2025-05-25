import React from "react";
import "./Chatloader.css";
import { assets } from "../../assets/assets.ts";

interface ChildProps {
  isSidebarOpen: boolean;
}

export const ChatLoader: React.FC<ChildProps> = ({ isSidebarOpen }) => {
  return (
    <div
      className={
        isSidebarOpen
          ? "flex gap-3 p-0 max-w-[32em] ml-[0em] pb-20 "
          : "flex gap-3 p-0 max-w-[32em] ml-[0em] pb-20 "
      }
    >
      <div className="flex-1 flex flex-col gap-2">
        <img
          src={assets.AnnieCircle}
          alt="Chatbot"
          className="w-[2.5em] h-[2.5em] rounded-[50%] mr-2.5 order-0 shadow-[0_0_4px_rgba(0,0,0,0.5)] mt-2"
        />
        <div className="flex flex-col gap-2">
          <div className="w-full h-2.5  rounded-[1em] shimmer-bg" />
          <div className="w-[75%] h-2.5  rounded-[1em] shimmer-bg" />
          <div className="w-[50%] h-2.5  rounded-[1em] shimmer-bg" />
        </div>
      </div>
    </div>
  );
};

export default ChatLoader;
