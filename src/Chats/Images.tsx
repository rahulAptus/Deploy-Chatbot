import React from "react";
import { Eye } from "lucide-react";

interface ImageProps {
  img: string;
  idx: number;
  dispatch: React.Dispatch<any>;
  theme: string;
}

interface SelectedImageProps {
  selectedImage: string;
  dispatch: React.Dispatch<any>;
}

export const Images: React.FC<ImageProps> = ({ img, idx, dispatch, theme }) => {
  return (
    <>
      <div
        className={`xl:w-[45%] aspect-[16/9] rounded-[0.62em] overflow-hidden relative transition-transform duration-300 ease-in shadow-[0_0.375em_0.75em_rgba(0, 0, 0, 0.1)] hover:scale-105 hover:shadow-[0_0.375em_0.75em_rgba(0, 0, 0, 0.2)] group ${
          theme === "light" ? "shadow-[0_0.4em_0.6em_rgba(0,0,0,0.2)]" : ""
        }`}
        onClick={() =>
          dispatch({
            type: "SET_SELECTED_IMAGE",
            payload: img,
          })
        }
      >
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye className="w-8 h-8 text-atlantis-green" />
        </div>
        <img
          src={img}
          alt={`Image ${idx}`}
          className="w-full h-full object-cover block rounded-[0.62em]"
          loading="lazy"
        />
      </div>
    </>
  );
};

export const SelectedImage: React.FC<SelectedImageProps> = ({
  selectedImage,
  dispatch,
}) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50"
      onClick={() =>
        dispatch({
          type: "SET_SELECTED_IMAGE",
          payload: null,
        })
      }
    >
      <img
        src={selectedImage}
        alt="Enlarged"
        className="max-w-full max-h-full rounded-[0.5em]"
      />
    </div>
  );
};
