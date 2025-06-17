import React from "react";
import ReactPlayer from "react-player";
import { ThumbsUp, MessageCircle, Eye } from "lucide-react";
import parse from "html-react-parser";



const YtVideoPlayer = ({ videoUrl, views, likes, comments, desc, title }) => {
  // Format description: Clickable links, hashtags & paragraph spacing
  const formatDescription = (text) => {
    if (!text) return "No description available.";

    return text
      .replace(
        /(https?:\/\/[^\s]+)/g, // Convert URLs into clickable links
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline break-all">$1</a>'
      )
      .replace(
        /#(\w+)/g, // Convert hashtags into YouTube searches
        '<a href="https://www.youtube.com/hashtag/$1" target="_blank" class="text-blue-400 hover:underline">#$1</a>'
      )
      .replace(/\n/g, "<br/>"); // Preserve new lines (paragraph breaks)
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-4">
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

      {/* Video Actions */}
      <div className="flex justify-between items-center mt-4 text-gray-400 flex-wrap gap-4">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 hover:text-white">
            <Eye size={20} />
            <span>{views} Views</span>
          </div>
          <div className="flex items-center space-x-2 hover:text-white">
            <ThumbsUp size={20} />
            <span>{likes} Likes</span>
          </div>
          <div className="flex items-center space-x-2 hover:text-white">
            <MessageCircle size={20} />
            <span>{comments} Comments</span>
          </div>
        </div>
      </div>

      {/* Video Title */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>

      {/* Styled YouTube-Like Description */}
      <div className="mt-4 p-4 bg-gray-800 rounded-lg text-gray-300 text-sm md:text-base leading-relaxed  overflow-auto  ">
        {parse(formatDescription(desc))}
      </div>
    </div>
  );
};

export default YtVideoPlayer;
