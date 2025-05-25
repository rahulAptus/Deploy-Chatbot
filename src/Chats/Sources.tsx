import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, LayoutDashboardIcon } from "lucide-react";
import { assets } from "../assets/assets.ts";
import apiRoutes from "../utils/urls.ts";

interface Source {
  text: string;
}

interface SourceProps {
  sources: Source[];
  showSources: boolean;
  isSidebarOpen: boolean;
  theme: string;
}

interface Preview {
  title: string;
  description: string;
  image: string;
}

const Sources: React.FC<SourceProps> = ({
  sources,
  showSources,
  isSidebarOpen,
  theme,
}) => {
  const [previews, setPreviews] = useState<Record<string, Preview>>({});
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const [urlNames, setUrlNames] = useState<Record<string, string>>({});
  const [showAllSources, setShowAllSources] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const previewCache = useRef<Record<string, Preview>>({}); // Cache previews to prevent unnecessary API calls

  function getCustomMessage(url: string): string {
    try {
      const domain = new URL(url).hostname.replace(/^www\./, "");
      if (domain.includes("aptusdatalabs.com")) return "Aptus Data Labs";
      if (domain.includes("linkedin.com")) return "LinkedIn";
      if (domain.includes("instagram.com")) return "Instagram";
      return domain;
    } catch (error) {
      console.error("Invalid URL:", error);
      return "Unknown Domain";
    }
  }

  useEffect(() => {
    // Load cached previews from localStorage
    const savedPreviews = localStorage.getItem("linkPreviews");
    if (savedPreviews) {
      try {
        const parsedPreviews = JSON.parse(savedPreviews);
        setPreviews(parsedPreviews);
        previewCache.current = parsedPreviews;
      } catch (error) {
        console.error("Error parsing previews from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPreviews = async () => {
      if (!sources || sources.length === 0) return;

      const newPreviews = { ...previewCache.current };
      let hasUpdates = false;

      await Promise.all(
        sources.map(async (source) => {
          if (typeof source.text !== "string") return;

          const domainName = getCustomMessage(source.text);
          setUrlNames((prev) => ({ ...prev, [source.text]: domainName }));

          // Check cache before making API call
          if (!previewCache.current[source.text]) {
            try {
              const response = await axios.get(apiRoutes.linkPreview, {
                params: { url: source.text },
              });
              newPreviews[source.text] = response.data;
              hasUpdates = true;
            } catch (error) {
              console.error("Error fetching preview:", error);
              newPreviews[source.text] = {
                title: "Preview unavailable",
                description: "No description available",
                image: "",
              };
              hasUpdates = true;
            }
          }

          // Set specific images based on domain
          if (domainName === "LinkedIn") {
            newPreviews[source.text].image = assets.Linkedin;
          }
        })
      );

      if (hasUpdates) {
        setPreviews(newPreviews);
        previewCache.current = newPreviews;
        localStorage.setItem("linkPreviews", JSON.stringify(newPreviews));
      }
    };

    fetchPreviews();
  }, [sources]);

  const handleMouseEnter = (url: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setHoveredUrl(url);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      setHoveredUrl(null);
    }, 100);
  };

  useEffect(() => {
    document.body.style.overflow = showAllSources ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAllSources]);

  if (!showSources || sources.length === 0) return null;

  const initialSources = sources.slice(0, 3);
  const additionalSources = sources.slice(3);
  // const hasMoreSources = sources.length > 3;

  const SourceBox: React.FC<{
    source: Source;
    preview?: Preview;
    isSmall?: boolean;
    theme: string;
  }> = ({ source, preview, theme }) => (
    <div
      className={`${
        isSidebarOpen
          ? `${
              theme === "light"
                ? "bg-sky-800 hover:bg-sky-950 text-white"
                : "bg-iridium border border-[rgba(255,255,255,0.2)] shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:bg-neutral-500 text-white"
            } backdrop-blur-[12px] h-20 w-full px-4 py-2.5 cursor-pointer rounded-[12px] flex flex-col justify-evenly grow text-[1em] my-1.5 transition-transform z-10 hover:-translate-y-1.5`
          : `${
              theme === "light"
                ? "bg-sky-800 hover:bg-sky-950 text-white"
                : "bg-iridium border border-[rgba(255,255,255,0.2)] shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:bg-neutral-500 text-white"
            } backdrop-blur-[12px] h-20 w-[98%] p-2.5 cursor-pointer rounded-[12px] flex flex-col justify-around grow text-[1em] my-1.5 transition-transform z-10 hover:-translate-y-1.5`
      }`}
      onMouseEnter={() => handleMouseEnter(source.text)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full flex items-center gap-1.5">
        {previews[source.text]?.image ? (
          <div className="w-6 h-6 rounded-[50%] overflow-hidden">
            <img
              src={previews[source.text].image}
              alt="Preview"
              className="w-6 h-6 object-contain"
            />
          </div>
        ) : (
          <p className="no-image"></p>
        )}
        <div className="text-[14px] text-white">{urlNames[source.text]}</div>
      </div>
      <a
        href={source.text}
        className="text-white inline-block w-[240px] max-w-full whitespace-nowrap overflow-hidden text-ellipsis text-[14px]"
        target="_blank"
        rel="noopener noreferrer"
      >
        {preview?.title || "Loading..."}
      </a>

      {hoveredUrl === source.text && preview && (
        <div
          className={`absolute top-[90px] -left-[40px] w-[400px] overflow-hidden h-[9em] font-default bg-white rounded-[1em] p-4 z-50 flex flex-col justify-evenly ${
            theme === "light"
              ? "drop-shadow-lg border border-sky-500"
              : "drop-shadow-md  border border-[#e0e0e0]"
          }`}
        >
          {preview.image && (
            <img
              src={preview.image}
              alt={preview.title}
              className="w-8 h-8 rounded-[5px]"
            />
          )}
          <div className="flex flex-col gap-2 ">
            <a
              href={source.text}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-medium-persian-blue font-semibold text-[13px] text-black"
            >
              {preview.title}
            </a>
            <p className="line-clamp-2 text-[12px] text-[#373737]">
              {preview?.description || "Loading..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // const SourceDrawer: React.FC<{
  //   source: Source;
  //   preview: Preview;
  //   isSmall: boolean;
  // }> = ({ source, preview, isSmall = false }) => {
  //   const url = source.text.replace(/^https?:\/\//i, "").replace(/^www\./i, "");

  //   return (
  //     <div
  //       className={`${
  //         theme === "light"
  //           ? "bg-sky-800 hover:bg-sky-700"
  //           : "bg-iridium border border-[rgba(255,255,255,0.2)] shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:bg-neutral-500"
  //       } backdrop-blur-[12px] h-36 w-full px-4 py-2.5 cursor-pointer rounded-[12px] flex flex-col justify-around grow text-[1em] my-1.5 z-10  ${
  //         isSmall ? "source_box_small" : ""
  //       }`}
  //       onMouseEnter={() => handleMouseEnter(source.text)}
  //       onMouseLeave={handleMouseLeave}
  //     >
  //       <div className="w-full flex items-center gap-1.5 text-white">
  //         {previews[source.text]?.image ? (
  //           <div className="w-8 h-8 rounded-[50%] overflow-hidden">
  //             <img
  //               src={previews[source.text].image}
  //               alt="Preview"
  //               className="w-8 h-8 object-contain"
  //             />
  //           </div>
  //         ) : (
  //           <p className="no-image"></p>
  //         )}
  //         <div className="flex flex-col">
  //           <div className="text-[13px]">{urlNames[source.text]}</div>
  //           <div className="w-[260px] max-w-full whitespace-nowrap overflow-hidden text-ellipsis text-[12px]">
  //             {url}
  //           </div>
  //         </div>
  //       </div>
  //       <a
  //         href={source.text}
  //         className="inline-block text-[14px] w-[400px] max-w-full whitespace-nowrap overflow-hidden text-ellipsis font-bold text-white"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         {preview?.title || "Loading..."}
  //       </a>
  //       <div className="text-[12px] text-white line-clamp-2">
  //         {preview?.description || "Loading..."}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <>
      <div
        className={
          isSidebarOpen
            ? "flex flex-col py-3.5 flex-wrap rounded-[1em] max-w-[99%]"
            : "flex flex-col py-3.5 flex-wrap rounded-[1em] max-w-[100%]"
        }
      >
        <div
          className={
            isSidebarOpen
              ? "flex grow gap-2.5 items-center w-full"
              : "flex flex-col grow gap-2.5 items-center w-full"
          }
        >
          {initialSources.map((source, idx) => (
            <SourceBox
              key={idx}
              source={source}
              preview={previews[source.text]}
              theme={theme}
            />
          ))}

          {/* {hasMoreSources && (
            <button
              className={
                isSidebarOpen
                  ? `rounded-[10px] text-[1em] font-medium cursor-pointer whitespace-nowrap w-full h-20 ${
                      theme === "light"
                        ? "bg-sky-800 hover:bg-sky-950 text-white "
                        : "bg-jet-fuel hover:bg-neutral-500 text-white "
                    }`
                  : `rounded-[10px] text-[1em] font-medium cursor-pointer whitespace-nowrap w-full h-20 ${
                      theme === "light"
                        ? "bg-sky-800 hover:bg-sky-950 text-white "
                        : "bg-jet-fuel hover:bg-neutral-500 text-white "
                    }`
              }
              onClick={() => setShowAllSources(true)}
            >
              {`+${additionalSources.length} More`}
            </button>
          )} */}

          <div
            className={`fixed inset-0 opacity-0 invisible transition-all duration-300 ease-in-out z-50 backdrop-blur-[5px] bg-[rgba(0,0,0,0.5)] ${
              showAllSources ? "opacity-100 visible" : ""
            }`}
            onClick={() => setShowAllSources(false)}
          />

          {/* Sources Drawer */}
          <div
            className={`fixed right-0 top-0 h-[100vh] w-[500px] transition-transform duration-500 ease-in z-50 overflow-hidden border-l-[rgba(0,0,0,0.1)] flex flex-col  ${
              theme === "light" ? "bg-[#1B264F]" : "bg-[#2c2c2b]"
            } ${showAllSources ? "translate-x-0" : "translate-x-full"}`}
          >
            <div
              className={`p-6 flex justify-between items-center z-10 shrink-0 h-[80px] ${
                theme === "light" ? "bg-emerald-800" : "bg-[#62625d]"
              }`}
            >
              <h2 className="text-[1.5em] font-bold m-0 flex items-center gap-3 text-white">
                <LayoutDashboardIcon
                  size={24}
                  className="mr-3 align-middle text-white"
                />
                <span className="align-middle">
                  {additionalSources.length} Sources
                </span>
              </h2>
              <button
                className="bg-none cursor-pointer p-2 text-white transition-transform duration-200 ease-in hover:scale-110"
                onClick={() => setShowAllSources(false)}
              >
                <X size={24} />
              </button>
            </div>
            {/* <div className="p-6 flex flex-col animate-fadeIn overflow-y-auto">
              {additionalSources.map((source, idx) => (
                <SourceDrawer
                  key={idx}
                  source={source}
                  preview={previews[source.text]}
                  isSmall={true}
                />
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sources;
