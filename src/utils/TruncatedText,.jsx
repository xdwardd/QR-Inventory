import React, {useState} from "react";

const TruncatedText = ({ text, limit }) => {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const truncatedText =
    text.length > limit ? text.substring(0, limit) + "..." : text;

  return (
    <div>
        {isTruncated ? truncatedText : text}
        {text.length > limit && (
          <span
            onClick={toggleTruncate}
            className="text-blue-600 italic hover:text-blue-700 cursor-pointer hover:font-bold"
          >
            {isTruncated ? " Read more" : " Show less"}
          </span>
        )}
      
    </div>
  );
};

export default TruncatedText;
