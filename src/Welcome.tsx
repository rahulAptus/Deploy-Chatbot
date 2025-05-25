import React, { useRef } from "react";
import Main from "./Chats/Main.tsx";
import { assets } from "./assets/assets.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { initialState, MainReducer } from "./utils/MainReducer.ts";
import { Menu } from "lucide-react";

interface Props {
  theme: string;
  handleTheme: () => void;
  close: boolean;
  toggleClose: () => void;
}

export default function Welcome() {
  const [close, setClose] = React.useState(false);
  const contentRef = useRef(null);
  const [theme, setTheme] = React.useState("light");

  const toggleClose = React.useCallback(() => {
    setClose((prev) => !prev);
  }, [setClose]);

  const handleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // useEffect(() => {
  //   function handleOutsideClick(e) {
  //     if (contentRef.current && !contentRef.current.contains(e.target)) {
  //       setIsOpen(false);
  //     }
  //   }

  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleOutsideClick);
  //   } else {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, [isOpen]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <button
        className="bg-sky-500 hover:bg-sky-900 text-white font-bold p-4 rounded-full m-5 absolute right-5 bottom-0 cursor-pointer z-20 w-15 h-15"
        onClick={() => setClose((prev) => !prev)}
      >
        <img src={assets.AnnieCircle} />
      </button>

      {close ? (
        <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-end animate-fade">
          <div
            ref={contentRef}
            className={`w-[27%] h-full rounded-tl-2xl rounded-bl-2xl shadow-xl overflow-hidden flex flex-col ${
              theme === "light"
                ? "bg-[url(./assets/bg-grad-1.jpg)]"
                : "bg-[#2c2c2a]"
            }`}
          >
            <SidebarMain
              theme={theme}
              handleTheme={handleTheme}
              close={close}
              toggleClose={toggleClose}
            />
            <Main theme={theme} handleTheme={handleTheme} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const SidebarMain = ({
  theme,
  handleTheme,
  close,
  toggleClose,
}: Props) => {
  const [state, dispatch] = React.useReducer(MainReducer, initialState);

  const toggleSidebar = React.useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR_OPEN", payload: !state.isSidebarOpen });
  }, [state.isSidebarOpen]);

  return (
    <>
      <div
        className={`flex xl:items-center justify-between sticky top-0 max-sm:gap-1 xl:gap-10 w-full xl:p-2 xl:px-4 xl:shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-colors duration-500 ease-in-out ${
          theme === "light" ? "bg-medium-persian-blue" : "xl:bg-iridium"
        }`}
        title="Close Sidebar"
      >
        <div className="max-sm:hidden xl:w-[2em] xl:h-[2em]">
          <img src={assets.AnnieCircle} />
        </div>
        <div onClick={toggleSidebar} className="cursor-pointer">
          <img
            src={assets.SidebarOpen}
            className="w-10 h-10 max-sm:hidden xl:hidden"
          />
        </div>
        <div onClick={toggleSidebar} className="cursor-pointer xl:hidden">
          <Menu className="w-8 h-8 text-white" />
        </div>

        <div className="flex gap-4">
          <div
            className="cursor-pointer"
            onClick={handleTheme}
            title="Change Theme"
          >
            <div className="w-8 h-8 max-sm:hidden">
              {theme === "light" ? (
                <FontAwesomeIcon
                  icon={faMoon}
                  size="xl"
                  color="#fff"
                  className={`transition-all duration-300 ease-in-out`}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faSun}
                  size="xl"
                  color="#fff"
                  className={`transition-all duration-300 ease-in-out`}
                />
              )}
            </div>
          </div>
          <div>
            <FontAwesomeIcon
              onClick={toggleClose}
              icon={faXmark}
              size="xl"
              color="#fff"
              className={`${
                close ? "hidden" : ""
              } transition-all duration-300 ease-in-out cursor-pointer`}
            />
          </div>
        </div>
      </div>
    </>
  );
};
