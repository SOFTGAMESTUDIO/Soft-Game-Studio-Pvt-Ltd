import React from "react";
import YouTube from "react-youtube";

const VideoPlayer = ({ videoId }) => {
  // Options for YouTube player (responsive)
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,  // Cleaner UI
      rel: 0,            // Show only current video at end
    },
  };

  return (
    <div className="flex justify-center items-center w-full p-5 md:p-8 box-border">
      <div className="relative w-full max-w-7xl aspect-video rounded-xl md:rounded-3xl overflow-hidden shadow-xl">
        <YouTube
          videoId={videoId}
          opts={opts}
          className="absolute top-0 left-0 w-full h-full border-0"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;