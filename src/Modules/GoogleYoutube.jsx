import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_API; // Replace with your YouTube API key
const BASE_URL = "https://www.googleapis.com/youtube/v3/videos";

export const getYouTubeVideoData = async (videoId) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        part: "snippet,statistics",
        id: videoId,
        key: API_KEY,
      },
    });

    if (response.data.items.length > 0) {
      return response.data.items[0]; // Return video details
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching YouTube video data:", error);
    return null;
  }
};
