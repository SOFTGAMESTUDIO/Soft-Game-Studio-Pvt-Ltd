import PropTypes from "prop-types";
import React from "react";

const GoogleDriveDownloader = ({ location }) => {
  // Extract Google Drive File ID from the shared URL
  const extractFileId = (url) => {
    // Improved regex to handle URLs with or without trailing slash and other formats
    const match = url.match(/\/file\/d\/([^/]+)|id=([^&]+)/);
    if (match) {
      return match[1] || match[2];
    }
    return null;
  };

  const fileId = extractFileId(location);
  const downloadLink = fileId
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : "#";

  const handleDownload = () => {
    if (fileId) {
      window.open(downloadLink, "_blank");
    } else {
      alert("Invalid Google Drive link!");
    }
  };

  return (
    <button
      onClick={handleDownload}
      type="button"
      className="flex text-center justify-center focus:outline-none text-white bg-cyan-500 hover:bg-cyan-400 font-medium rounded-lg text-sm w-full py-3"
    >
      Access Now
      <svg
        className="w-4 h-4 ml-2"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14"></path>
        <path d="M12 5l7 7-7 7"></path>
      </svg>
    </button>
  );
};

GoogleDriveDownloader.propTypes = {
  location: PropTypes.string.isRequired,
};

export default GoogleDriveDownloader;
