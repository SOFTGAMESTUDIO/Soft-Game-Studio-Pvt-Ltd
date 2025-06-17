import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ videoUrl }) => {
  return (
    <div className="bg-gray-900 text-white  rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="rounded-lg overflow-hidden">
        <div className="relative w-full pb-[56.25%]">
          <ReactPlayer
            url={videoUrl}
            controls
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
            playing={false}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
