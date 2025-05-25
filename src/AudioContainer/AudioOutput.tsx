import React from "react";
import { Pause, Play } from "lucide-react";

interface AudioOutputProps {
  playingStates: any;
  // handlePlayPause: (entryId: number) => void;
  handlePlayPause: any;
  waveformRefs: any;
  entryId: number;
}

const AudioOutput: React.FC<AudioOutputProps> = ({
  playingStates,
  handlePlayPause,
  waveformRefs,
  entryId,
}) => {
  return (
    <div>
      <div className="audio-player">
        <div onClick={() => handlePlayPause(entryId)} className="play-button">
          {playingStates[entryId] ? <Pause /> : <Play />}
        </div>
        <div
          ref={waveformRefs.current[entryId]?.ref}
          style={{ width: "100%" }}
        ></div>
      </div>
    </div>
  );
};

export default AudioOutput;
