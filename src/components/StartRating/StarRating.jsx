// StarRatingSelector.jsx
import React from "react";
import { FaStar } from "react-icons/fa";

export default function StarRatingSelector({ rating, setRating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => {
        const current = i + 1;
        return (
          <FaStar
            key={i}
            className={`cursor-pointer text-xl ${
              current <= rating ? "text-yellow-400" : "text-gray-400"
            }`}
            onClick={() => setRating(current)}
          />
        );
      })}
    </div>
  );
}
